import { getExVat } from "@/lib/data/pricing-catalog";
import type { BookingUpsellItem } from "@/lib/data/booking-shared";

/** תוספות כלליות — מוצגות לכל מי שבוחר אטרקציות */
export const EVENT_GENERAL_UPSELLS: readonly BookingUpsellItem[] = [
  {
    id: "photo_slideshow",
    name: "מצגת תמונות מקצועית",
    description: "סרטון סיכום מהיר — מושלם לפתיחת אירוע",
    price: getExVat("quick_summary_clip"),
  },
];

/** תוספות הקשריות — מוצגות רק כשהאטרקציה המתאימה נבחרת ובהפעלת בסיס */
export const EVENT_CONTEXTUAL_UPSELLS: readonly BookingUpsellItem[] = [
  {
    id: "confetti_act2_promo",
    name: "הפעלה שנייה של הקונפטי",
    description: "שני רגעי שיא: כניסה + סלואו. כל הפעלה = מלאי גלם מלא וחדש",
    price: 1400,
    originalPrice: 1750,
    badge: "חסכו 350 ₪",
    triggerAttractionIds: ["event_confetti"],
  },
  {
    id: "sparklers_act2_promo",
    name: "הפעלה שנייה של הזיקוקים",
    description: "שני רגעי שיא: כניסה + סלואו. 2 מכשירים בכל הפעלה",
    price: 1400,
    originalPrice: 1750,
    badge: "חסכו 350 ₪",
    triggerAttractionIds: ["event_sparklers"],
  },
];

/** כל התוספות — לתאימות אחורה עם קוד קיים */
export const EVENT_BOOKING_UPSELLS: readonly BookingUpsellItem[] = [
  ...EVENT_GENERAL_UPSELLS,
  ...EVENT_CONTEXTUAL_UPSELLS,
];

export function sumEventUpsells(selected: ReadonlySet<string>): number {
  return EVENT_BOOKING_UPSELLS.filter((u) => selected.has(u.id)).reduce(
    (sum, u) => sum + u.price,
    0,
  );
}
