/**
 * תוספת ההגעה לאירועי DJ, מוצגת ליד המחיר (החלטות 5.10.2026 (DJ), סעיף 5).
 *
 * הערכים בקטלוג (travel_north_south, travel_eilat_golan) לא שונו. הם מכסים
 * דלק לרכב עמוס ציוד וזמן נסיעה של הצוות: צפון או דרום הלוך ושוב 230-400
 * ק"מ, אילת כ-660 ק"מ ויום נסיעה שלם. אזור המרכז בלי תוספת.
 * המחיר לצרכן מוצג כולל מע״מ קודם (formatPrice).
 */
import {
  DJ_TRAVEL_CENTER_NOTE,
  DJ_TRAVEL_FEE_IDS,
  getPriceById,
} from "@/lib/data/pricing-catalog";
import { formatPrice } from "@/lib/data/pricing-display";

export type DjTravelFeeRow = {
  id: (typeof DJ_TRAVEL_FEE_IDS)[number];
  /** "צפון או דרום" */
  area: string;
  /** "944 ₪ כולל מע״מ" */
  headline: string;
  /** "800 ₪ + מע״מ" */
  vatNote: string;
  /** "944 ₪ כולל מע״מ (800 ₪ + מע״מ)" */
  inline: string;
};

const AREA_BY_ID: Record<DjTravelFeeRow["id"], string> = {
  travel_north_south: "צפון או דרום",
  travel_eilat_golan: "אילת או גולן",
};

export function getDjTravelFeeRows(): DjTravelFeeRow[] {
  return DJ_TRAVEL_FEE_IDS.map((id) => {
    const price = formatPrice(getPriceById(id).exVat);
    return {
      id,
      area: AREA_BY_ID[id],
      headline: price.headline,
      vatNote: price.vatNote,
      inline: price.inline,
    };
  });
}

export const DJ_TRAVEL_HEADING = "תוספת הגעה";

/** שורה אחת: "תוספת הגעה: צפון או דרום 944 ₪ כולל מע״מ (800 ₪ + מע״מ) · ... · אזור המרכז: בלי תוספת הגעה" */
export function djTravelFeesLine(): string {
  const rows = getDjTravelFeeRows().map((r) => `${r.area} ${r.inline}`);
  return `${DJ_TRAVEL_HEADING}: ${rows.join(" · ")} · ${DJ_TRAVEL_CENTER_NOTE}`;
}
