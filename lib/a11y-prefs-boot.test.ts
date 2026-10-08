import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import vm from "node:vm";
import {
  A11Y_PREFS_BOOT_SCRIPT,
  A11Y_PREFS_STORAGE_KEY,
} from "@/lib/a11y-prefs-boot";

const CLASSES = ["a11y-large-text", "a11y-high-contrast", "a11y-highlight-links"];

/** מריץ את הסקריפט מול document ו-localStorage מדומים ומחזיר את מחלקות ה-html. */
function run(
  stored: string | null,
  opts: { initial?: string[]; storageThrows?: boolean } = {},
): string[] {
  const classes = new Set(opts.initial ?? []);
  const sandbox = {
    document: {
      documentElement: {
        classList: {
          toggle(name: string, force?: boolean) {
            const on = force === undefined ? !classes.has(name) : force;
            if (on) classes.add(name);
            else classes.delete(name);
            return on;
          },
        },
      },
    },
    localStorage: {
      getItem(key: string) {
        if (opts.storageThrows) throw new Error("SecurityError");
        return key === A11Y_PREFS_STORAGE_KEY ? stored : null;
      },
    },
  };
  vm.runInNewContext(A11Y_PREFS_BOOT_SCRIPT, sandbox);
  return [...classes].sort();
}

describe("סקריפט העדפות נגישות לפני ציור (F-68)", () => {
  it("בלי העדפות שמורות לא נוגע ב-html", () => {
    assert.deepEqual(run(null), []);
  });

  it("מחיל את שלוש האפשרויות השמורות", () => {
    const all = JSON.stringify({ largeText: true, highContrast: true, highlightLinks: true });
    assert.deepEqual(run(all), [...CLASSES].sort());
  });

  it("מחיל רק את האפשרות שנבחרה", () => {
    assert.deepEqual(run(JSON.stringify({ highContrast: true })), ["a11y-high-contrast"]);
    assert.deepEqual(run(JSON.stringify({ largeText: true, highContrast: false })), [
      "a11y-large-text",
    ]);
  });

  it("אפשרות שכובתה נשללת, כמו ה-toggle בווידג'ט", () => {
    const stored = JSON.stringify({ largeText: false, highContrast: true, highlightLinks: false });
    assert.deepEqual(run(stored, { initial: ["a11y-large-text"] }), ["a11y-high-contrast"]);
  });

  it("JSON שבור, ערך שאינו אובייקט ו-localStorage שזורק לא מפילים את העמוד", () => {
    assert.deepEqual(run("{not json"), []);
    assert.deepEqual(run("true"), []);
    assert.deepEqual(run('"x"'), []);
    assert.deepEqual(run(null, { storageThrows: true }), []);
  });
});

describe("סנכרון עם AccessibilityToggle", () => {
  /* הסקריפט כותב כפילות של המפתח ושל שמות המחלקות, כי הווידג'ט הוא רכיב לקוח
     שלא מייצא אותם. אם אחד מהם ישתנה שם, הטסט הזה נופל במקום שההעדפה השמורה
     תפסיק להיטען לפני הציור בלי שאיש ישים לב. */
  const widget = readFileSync("components/ui/AccessibilityToggle.tsx", "utf8");

  it("אותו מפתח אחסון", () => {
    assert.ok(widget.includes(`"${A11Y_PREFS_STORAGE_KEY}"`));
  });

  it("אותן מחלקות ואותם שדות", () => {
    for (const cls of CLASSES) assert.ok(widget.includes(`"${cls}"`), cls);
    for (const field of ["largeText", "highContrast", "highlightLinks"]) {
      assert.ok(widget.includes(field), field);
      assert.ok(A11Y_PREFS_BOOT_SCRIPT.includes(field), field);
    }
  });
});
