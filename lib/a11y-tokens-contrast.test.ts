import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";

/*
 * F-06, F-09, F-43, F-65 (7.10.2026): נועל את הטוקנים ש-app/globals.css נשען עליהם,
 * כדי שעריכה עתידית של אחד מהם לא תחזיר את הכשל בשקט. הערכים נקראים מהקובץ עצמו,
 * לא מועתקים לכאן. רקעים: #fafaf8 (רקע האתר) ו-#ffffff (כרטיסים ושדות).
 */

const css = readFileSync("app/globals.css", "utf8");
const layout = readFileSync("app/layout.tsx", "utf8");

const PAGE_BG = "#fafaf8";
const WHITE = "#ffffff";

function channel(c: number): number {
  const s = c / 255;
  return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
}

function rgb(hex: string): [number, number, number] {
  const n = Number.parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function luminance(hex: string): number {
  const [r, g, b] = rgb(hex);
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

function contrast(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

/** צבע על רקע בהיר אחרי מיזוג שקיפות, כמו bg-brand-red/10 מעל הרקע */
function blend(fg: string, bg: string, alpha: number): string {
  const f = rgb(fg);
  const b = rgb(bg);
  const mixed = f.map((c, i) => Math.round(c * alpha + b[i] * (1 - alpha)));
  return `#${mixed.map((c) => c.toString(16).padStart(2, "0")).join("")}`;
}

function declared(block: string, name: string): string | undefined {
  return new RegExp(`${name}:\\s*([^;]+);`).exec(block)?.[1].trim();
}

const hcBlock = /html\.a11y-high-contrast\s*\{([^}]*)\}/.exec(css)?.[1] ?? "";
const rootBlock =
  [...css.matchAll(/:root\s*\{([^}]*)\}/g)]
    .map((m) => m[1])
    .find((b) => b.includes("--background: #fafaf8")) ?? "";

describe("טוקן גבול השדות (F-09)", () => {
  it("--input ברירת מחדל נותן לפחות 3:1 על הרקע ועל לבן", () => {
    const input = declared(rootBlock, "--input");
    assert.match(input ?? "", /^#[0-9a-f]{6}$/i);
    assert.ok(contrast(input!, PAGE_BG) >= 3, `--input ${input} על ${PAGE_BG}`);
    assert.ok(contrast(input!, WHITE) >= 3, `--input ${input} על ${WHITE}`);
  });

  it("--input בניגודיות גבוהה כהה יותר מברירת המחדל ונותן לפחות 4.5:1", () => {
    const base = declared(rootBlock, "--input")!;
    const hc = declared(hcBlock, "--input");
    assert.match(hc ?? "", /^#[0-9a-f]{6}$/i);
    assert.ok(contrast(hc!, WHITE) > contrast(base, WHITE));
    assert.ok(contrast(hc!, WHITE) >= 4.5);
  });

  it("utility ה-border-input מופנה לטוקן", () => {
    assert.match(css, /--color-input:\s*var\(--input\)/);
  });
});

describe("אדום מותג על הגוון שלו (F-06, F-37)", () => {
  const redText = declared(css, "--color-brand-red-text")!;
  const red = declared(css, "--color-brand-red")!;

  it("brand-red-text עובר 4.5:1 על כל הגוונים שבהם משתמשים באתר", () => {
    for (const alpha of [0.05, 0.08, 0.1, 0.15]) {
      const tint = blend(red, PAGE_BG, alpha);
      assert.ok(contrast(redText, tint) >= 4.5, `/${alpha * 100} => ${tint}`);
    }
  });

  it("הסיבה לתיקון: brand-red עצמו נכשל על הגוונים החזקים", () => {
    assert.ok(contrast(red, blend(red, PAGE_BG, 0.1)) < 4.5);
    assert.ok(contrast(red, blend(red, PAGE_BG, 0.15)) < 4.5);
  });
});

describe("מצב ניגודיות גבוהה (F-43)", () => {
  it("מכהה את אדום המותג ואת צבע ההדגשה של ה-hub", () => {
    assert.equal(declared(hcBlock, "--color-brand-red"), declared(css, "--color-brand-red-text"));
    assert.match(declared(hcBlock, "--service-accent") ?? "", /var\(--service-accent-ink/);
  });

  it("הדריסה מגיעה גם ל-div העוטף של HubAccentScope, שכותב את הצבע inline", () => {
    assert.match(
      css,
      /html\.a11y-high-contrast\s*\[style\*="--service-accent-ink"\]\s*\{[^}]*--service-accent:\s*var\(--service-accent-ink\)\s*!important/,
    );
  });
});

describe("קישור 'לפרטים' בתבנית 404 (F-65)", () => {
  it("#ff6b6b על #1a1a1a עובר 4.5:1", () => {
    assert.ok(contrast("#ff6b6b", "#1a1a1a") >= 4.5);
  });
});

describe("מרווחי גלילה מול header ופסי תחתית (F-28)", () => {
  it("ה-offset נמצא ב-scroll-padding של html ולא נספר פעמיים", () => {
    assert.match(css, /html\s*\{\s*scroll-padding-top:\s*5rem;/);
    assert.match(css, /@media \(min-width: 1024px\)\s*\{\s*html\s*\{\s*scroll-padding-top:\s*9rem;/);
    assert.match(css, /@media \(max-width: 767px\)\s*\{\s*html\s*\{\s*scroll-padding-bottom:\s*7\.5rem;/);
    assert.doesNotMatch(css, /\[id\]\s*\{[^}]*scroll-margin-top/);
    const mainTag = /<main[\s\S]*?>/.exec(layout)?.[0] ?? "";
    assert.ok(mainTag.length > 0);
    assert.doesNotMatch(mainTag, /scroll-mt-/);
  });
});

describe("main ממוקד מה-skip link (F-69)", () => {
  it("ל-main יש tabIndex=-1 וטבעת מוסתרת", () => {
    const main = /<main[\s\S]*?>/.exec(layout)?.[0] ?? "";
    assert.match(main, /id="main-content"/);
    assert.match(main, /tabIndex=\{-1\}/);
    assert.match(main, /focus:outline-none/);
  });
});
