import type { CroLastMinuteUpsell } from "@/lib/book-wizard-cro/types";

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

/** הנחת last-minute upsell — רק אם הדגל פעיל והתוספת נבחרה */
export function lastMinuteUpsellDiscount(
  cfg: CroLastMinuteUpsell | undefined,
  selectedIds: readonly string[],
  lastMinuteFlag: boolean,
): number {
  if (!cfg || !lastMinuteFlag || !selectedIds.includes(cfg.upgradeId)) return 0;
  return Math.max(0, cfg.listPrice - cfg.promoPrice);
}

/** מחיר סופי לפני מע״מ — תמיד מהחישוב, לא מטיוטה */
export function guardSubmitTotalExVat(computed: number, reported?: number | null): number {
  if (reported == null || !Number.isFinite(reported)) return computed;
  return assertPriceMatches(computed, reported);
}
