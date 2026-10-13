import assert from "node:assert/strict";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, it } from "node:test";

/**
 * 13.10.2026: FadeIn הסתיר 7 מקטעים בעמודי ה-DJ בערים. הוא התחיל ב-opacity-0 ב-HTML
 * שמגיע מהשרת, ורק IntersectionObserver בדפדפן חשף אותם. בלי JS, או עד שה-JS נטען,
 * התוכן היה שקוף. אנימציית כניסה עושים ב-CSS (site-reveal או .reveal ב-app/globals.css),
 * שם התוכן גלוי כברירת מחדל.
 *
 * הטסט נופל על רכיב לקוח שמשלב IntersectionObserver עם opacity-0, אלא אם הוא ברשימה
 * למטה עם סיבה. הוא לא תופס כל דרך להסתיר תוכן, רק את הדפוס שכבר קרה.
 */
const ALLOWED: Record<string, string> = {
  "components/marketing/SocialProofWidgets.tsx":
    "ה-opacity-0 על מיכל ווידג'ט צד שלישי (Elfsight) שריק ב-HTML מהשרת, ועל שלד הטעינה",
};

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return walk(path);
    return path.endsWith(".tsx") ? [path] : [];
  });
}

const OPACITY_0 = /(^|[\s"'`])opacity-0([\s"'`]|$)/m;

describe("תוכן לא מוסתר ב-HTML מהשרת", () => {
  it("אין רכיב לקוח שחושף תוכן מ-opacity-0 דרך IntersectionObserver", () => {
    const offenders = ["components", "app"]
      .flatMap(walk)
      .filter((path) => !(path in ALLOWED))
      .filter((path) => {
        const src = readFileSync(path, "utf8");
        return (
          src.includes('"use client"') &&
          src.includes("IntersectionObserver") &&
          OPACITY_0.test(src)
        );
      });
    assert.deepEqual(offenders, []);
  });

  it("כל קובץ ברשימת ההיתרים עדיין קיים", () => {
    for (const path of Object.keys(ALLOWED)) {
      assert.ok(statSync(path).isFile(), path);
    }
  });
});
