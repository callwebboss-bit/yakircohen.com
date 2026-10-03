/**
 * רק סימון "חלון היציאה כבר הוצג" לאשפים. מחזיק המחיר ל-48 שעות, השריון
 * הרך בשלב 3 והטיימר הוסרו (שלב 5, FIT-05, OE-29): מחירי הקטלוג לא פגים,
 * ושום דבר לא נשמר בפועל עבור הלקוח.
 */
export const BOOK_EXIT_INTENT_SHOWN_KEY = "yc_book_exit_intent_shown";

export function markBookExitIntentShown(): void {
  if (typeof sessionStorage === "undefined") return;
  try {
    sessionStorage.setItem(BOOK_EXIT_INTENT_SHOWN_KEY, "1");
  } catch {
    /* ignore */
  }
}

export function wasBookExitIntentShown(): boolean {
  if (typeof sessionStorage === "undefined") return false;
  try {
    return sessionStorage.getItem(BOOK_EXIT_INTENT_SHOWN_KEY) === "1";
  } catch {
    return false;
  }
}
