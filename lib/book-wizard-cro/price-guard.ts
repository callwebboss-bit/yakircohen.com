/**
 * חישוב מחיר דטרמיניסטי ממזהי חבילה/תוספות - לא מערך price גולמי ב-state.
 * מונע price tampering בצד לקוח.
 */
export function sumLineItems(
  items: readonly { price: number }[],
): number {
  return items.reduce((sum, item) => sum + (Number.isFinite(item.price) ? item.price : 0), 0);
}

export function assertPriceMatches(
  computed: number,
  reported: number,
  tolerance = 0,
): number {
  if (!Number.isFinite(reported) || Math.abs(computed - reported) > tolerance) {
    return computed;
  }
  return reported;
}
