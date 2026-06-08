import { getExVat } from "@/lib/data/pricing-catalog";
import type { BookingUpsellItem } from "@/lib/data/booking-shared";

/** תוספות אופציונליות לאירועים (מעבר לחבילת אטרקציות) */
export const EVENT_BOOKING_UPSELLS: readonly BookingUpsellItem[] = [
  {
    id: "photo_slideshow",
    name: "מצגת תמונות מקצועית",
    description: "סרטון סיכום מהיר - מושלם לפתיחת אירוע",
    price: getExVat("quick_summary_clip"),
  },
  {
    id: "cold_fireworks",
    name: "זיקוקים קרים נוספים",
    description: "רגע שיא נוסף ברחבת הריקודים",
    price: getExVat("event_attraction_1"),
  },
];

export function sumEventUpsells(selected: ReadonlySet<string>): number {
  return EVENT_BOOKING_UPSELLS.filter((u) => selected.has(u.id)).reduce(
    (sum, u) => sum + u.price,
    0,
  );
}
