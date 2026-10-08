import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  SERVICE_ACCENT_COLORS,
  SERVICE_ACCENT_INK_COLORS,
  type ServiceAccentCategory,
} from "@/lib/theme/service-accent";

/*
 * F-04 + F-05 (7.10.2026): טקסט הניווט (פעיל והובר) והסרגל התחתון משתמשים ב-
 * --service-accent-ink, והכפתורים הצפים וה-CTA במגירה ב-bg-brand-red עם טקסט לבן.
 * הבדיקה נועלת את המספרים שהתיקון נשען עליהם, כדי שעריכה עתידית של אחד מגווני
 * ה-ink לא תחזיר את הכשל בשקט. הרקעים: #fafaf8 (רקע האתר והתפריט) ו-#ffffff (כרטיסים).
 */

const PAGE_BG = "#fafaf8";
const WHITE = "#ffffff";
const BRAND_RED = "#d42b2b";

function channel(c: number): number {
  const s = c / 255;
  return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
}

function luminance(hex: string): number {
  const n = Number.parseInt(hex.slice(1), 16);
  return (
    0.2126 * channel((n >> 16) & 255) +
    0.7152 * channel((n >> 8) & 255) +
    0.0722 * channel(n & 255)
  );
}

function contrast(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

const CATEGORIES = Object.keys(SERVICE_ACCENT_INK_COLORS) as ServiceAccentCategory[];

describe("service accent ink colours", () => {
  for (const category of CATEGORIES) {
    it(`${category}: ink text is at least 4.5:1 on the page background and white`, () => {
      const ink = SERVICE_ACCENT_INK_COLORS[category];
      assert.ok(contrast(ink, PAGE_BG) >= 4.5, `${category} ink on ${PAGE_BG}`);
      assert.ok(contrast(ink, WHITE) >= 4.5, `${category} ink on ${WHITE}`);
    });
  }

  it("the brand-red fallback used by the nav passes on the page background", () => {
    assert.ok(contrast(BRAND_RED, PAGE_BG) >= 4.5);
  });

  it("white text on brand red passes (FAB glyphs, drawer CTA, selected chat tab)", () => {
    assert.ok(contrast(WHITE, BRAND_RED) >= 4.5);
  });

  it("documents why the raw accent cannot carry nav text or white labels", () => {
    // הגוונים הגולמיים שנכשלו בביקורת: ציאן וכתום מתחת ל-4.5 גם כטקסט על רקע בהיר.
    assert.ok(contrast(SERVICE_ACCENT_COLORS.online, PAGE_BG) < 4.5);
    assert.ok(contrast(SERVICE_ACCENT_COLORS.studio, PAGE_BG) < 4.5);
    assert.ok(contrast(WHITE, SERVICE_ACCENT_COLORS.online) < 4.5);
  });
});
