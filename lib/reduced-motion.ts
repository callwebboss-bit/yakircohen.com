/**
 * F-67 (WCAG 2.2.2, 13.10.2026): לגולש יש שתי דרכים לבקש פחות תנועה. הגדרת
 * המערכת (prefers-reduced-motion), או "עצירת אנימציות" בתפריט הנגישות, שמוסיף
 * ל-html את המחלקה a11y-reduce-motion (AccessibilityToggle ו-lib/a11y-prefs-boot.ts).
 * ה-CSS מכסה את שתיהן ב-app/globals.css. הקוד כאן הוא לאנימציות שרצות ב-JS.
 *
 * שם המחלקה כתוב כמחרוזת גם בווידג'ט ובסקריפט ה-boot, כדי לא להוסיף מודול לקוד
 * שנטען בכל עמוד. lib/a11y-prefs-boot.test.ts בודק ששלושתם תואמים.
 */
export const REDUCE_MOTION_CLASS = "a11y-reduce-motion";

const QUERY = "(prefers-reduced-motion: reduce)";

/** הגולש ביקש פחות תנועה, בהגדרות המערכת או בתפריט הנגישות. */
export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia(QUERY).matches ||
    document.documentElement.classList.contains(REDUCE_MOTION_CLASS)
  );
}

/** subscribe ל-useSyncExternalStore: שינוי בהגדרת המערכת או במחלקות של html. */
export function subscribeReducedMotion(onChange: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  const mq = window.matchMedia(QUERY);
  mq.addEventListener("change", onChange);
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
  });
  return () => {
    mq.removeEventListener("change", onChange);
    observer.disconnect();
  };
}
