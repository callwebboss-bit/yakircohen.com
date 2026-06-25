import { getExVat } from "@/lib/data/pricing-catalog";
import type { BookingUpsellItem } from "@/lib/data/booking-shared";

/** תוספות כלליות - מוצגות לכל מי שבוחר אטרקציות */
export const EVENT_GENERAL_UPSELLS: readonly BookingUpsellItem[] = [
  {
    id: "photo_slideshow",
    name: "מצגת תמונות מקצועית",
    description: "סרטון סיכום מהיר - מושלם לפתיחת אירוע",
    price: getExVat("quick_summary_clip"),
  },
];

/** תוספות הקשריות - מוצגות רק כשהאטרקציה המתאימה נבחרת */
export const EVENT_CONTEXTUAL_UPSELLS: readonly BookingUpsellItem[] = [
  // ── שדרוגי הפעלה (נסתרים כשכבר שדרגו ידנית) ─────────────────────────────
  {
    id: "confetti_act2_promo",
    name: "הפעלה שנייה של הקונפטי",
    whatYouGet: "גשם קונפטי ב-2 רגעי שיא: כניסה + סלואו",
    description: "כל הפעלה = מיכל קונפטי מלא וחדש",
    price: 1400,
    originalPrice: 1750,
    badge: "חסכו 350 ₪",
    triggerAttractionIds: ["event_confetti"],
    isActivationUpgrade: true,
  },
  {
    id: "sparklers_act2_promo",
    name: "הפעלה שנייה של הזיקוקים",
    whatYouGet: "ניצוצות ב-2 רגעי שיא: כניסה + סלואו",
    description: "2 מכשירים יורים בכל הפעלה, מלאי מנועים חדש",
    price: 1400,
    originalPrice: 1750,
    badge: "חסכו 350 ₪",
    triggerAttractionIds: ["event_sparklers"],
    isActivationUpgrade: true,
  },
  // ── תוספת ציוד עצמאית (מוצגת בכל מצב הפעלה) ─────────────────────────────
  {
    id: "confetti_second_cannon",
    name: "תותח קונפטי שני",
    whatYouGet: "2 תותחים יורים בו-זמנית - אפקט כפול ומרהיב",
    description: "כל הפעלה: גשם קונפטי מכיווני הרחבה משני צדדים בו-זמנית",
    price: 875,
    originalPrice: 1750,
    badge: "25% הנחה",
    triggerAttractionIds: ["event_confetti"],
    isActivationUpgrade: false,
  },
];

/** כל התוספות - לתאימות אחורה עם קוד קיים */
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
