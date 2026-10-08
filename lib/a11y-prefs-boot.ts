/**
 * F-68 (נגישות, 7.10.2026): העדפות הנגישות השמורות (ניגודיות גבוהה, הגדלת טקסט,
 * הדגשת קישורים) הוחלו רק אחרי הציור, 0.4-1.8 שניות אחרי הטעינה, כי הווידג'ט
 * עולה דרך requestIdleCallback (DeferredFloatingFabs). גולש שביקש ניגודיות גבוהה
 * ראה בינתיים את העמוד הרגיל מהבהב.
 *
 * הסקריפט הזה רץ בתוך ה-<head>, לפני הציור הראשון, וקורא את אותו מפתח ואותם
 * שלושה שדות שכותב AccessibilityToggle. ה-effect שם נשאר כמו שהוא: הוא מחיל
 * שוב את אותן מחלקות (idempotent) וכותב חזרה כשהגולש משנה אפשרות.
 *
 * ב-try/catch כי localStorage יכול לזרוק (חלון פרטי, אחסון חסום) והעמוד חייב
 * להמשיך להיטען. CSP הוא Report-Only עם unsafe-inline (next.config.ts), כך
 * שסקריפט inline לא נחסם.
 */
export const A11Y_PREFS_STORAGE_KEY = "yc_a11y_prefs";

export const A11Y_PREFS_BOOT_SCRIPT =
  `try{var p=JSON.parse(localStorage.getItem(${JSON.stringify(A11Y_PREFS_STORAGE_KEY)}));` +
  `if(p&&typeof p==="object"){var c=document.documentElement.classList;` +
  `c.toggle("a11y-large-text",!!p.largeText);` +
  `c.toggle("a11y-high-contrast",!!p.highContrast);` +
  `c.toggle("a11y-highlight-links",!!p.highlightLinks)}}catch(e){}`;
