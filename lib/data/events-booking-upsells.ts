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
  /* WP4 (OE-03, PI-06): "הפעלה שנייה ב-1,400 במקום 1,750" נמחקה לקונפטי
     ולזיקוקים. 1,750 לא היה מחיר של שום דבר, וההפעלה השנייה האמיתית היא
     event_extra_activation (1,200) שנבחרת בכרטיס האטרקציה עצמו (act_2). */
  // ── תוספת ציוד עצמאית (מוצגת בכל מצב הפעלה) ─────────────────────────────
  {
    id: "confetti_second_cannon",
    name: "תותח קונפטי שני",
    whatYouGet: "2 תותחים יורים בו-זמנית - אפקט כפול ומרהיב",
    description: "כל הפעלה: גשם קונפטי מכיווני הרחבה משני צדדים בו-זמנית",
    /* עלות שולית של אטרקציה שנייה בסולם: event_attraction_2 פחות
       event_attraction_1, ומחיר הייחוס הוא אטרקציה בודדת. שניהם מהקטלוג. */
    price: getExVat("event_attraction_2") - getExVat("event_attraction_1"),
    originalPrice: getExVat("event_attraction_1"),
    badge: "מחיר זוג",
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
