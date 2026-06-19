import { EVENT_ATTRACTION_FROM_NIS } from "@/lib/data/pricing";

export type EventBookingItemId =
  | "event_smoke"
  | "event_bubbles"
  | "event_balloons"
  | "event_sparklers"
  | "event_confetti"
  | "event_drummer"
  | "event_smoke_cannon"
  | "event_smoke_gun"
  | "event_slideshow"
  | "event_foam"
  | "podcast_grandpa"
  | "sound_rental";

export type EventBookingItem = {
  id: EventBookingItemId;
  name: string;
  icon: string;
  desc: string;
  badge?: "popular" | "new" | "kids";
};

export const EVENT_BOOKING_ITEMS: readonly EventBookingItem[] = [
  {
    id: "event_smoke",
    name: "עשן כבד",
    icon: "💨",
    badge: "popular",
    desc: "אטרקציה חזותית לכניסה",
  },
  {
    id: "event_bubbles",
    name: "בועות סבון",
    icon: "🫧",
    badge: "kids",
    desc: "מתאים לאירועי ילדים ובני מצווה",
  },
  {
    id: "event_balloons",
    name: "בלונים ענקיים",
    icon: "🎈",
    desc: "בלונים ענקיים לאפקט חזותי בצילום וכניסה",
  },
  {
    id: "event_sparklers",
    name: "זיקוקים קרים",
    icon: "❄️",
    badge: "popular",
    desc: "זיקוקים קרים בטוחים לרגע הגדול",
  },
  {
    id: "event_confetti",
    name: "קונפטי",
    icon: "🎊",
    desc: "פיצוץ קונפטי צבעוני",
  },
  {
    id: "event_drummer",
    name: "מתופף",
    icon: "🥁",
    desc: "מתופף מקצועי שמוסיף קצב לאירוע",
  },
  {
    id: "event_smoke_cannon",
    name: "תותחי עשן צבעוני",
    icon: "🌈",
    badge: "new",
    desc: "תותחי עשן בצבעים לאפקט חזותי בצילום",
  },
  {
    id: "event_smoke_gun",
    name: "רובה עשן",
    icon: "💨",
    badge: "new",
    desc: "רובה עשן מקצועי לאפקטים ממוקדים",
  },
  {
    id: "event_slideshow",
    name: "מצגת תמונות",
    icon: "📸",
    desc: "מצגת תמונות ליום הולדת ואירועים משפחתיים",
  },
  {
    id: "event_foam",
    name: "תותח קצף לילדים",
    icon: "🎉",
    badge: "kids",
    desc: "פעילות קצף לילדים - ציוד בטיחותי לפני גיל 10",
  },
  {
    id: "podcast_grandpa",
    name: "פודקאסט עם סבא",
    icon: "🎙️",
    desc: "מתנה דיגיטלית שנשמרת לאורך זמן, כולל הקלטת שיר",
  },
  {
    id: "sound_rental",
    name: "השכרת ציוד הגברה",
    icon: "🔊",
    desc: "מערכת הגברה מקצועית לאירוע שלכם",
  },
] as const;

/** מחיר בודד לפני מע״מ */
export const EVENT_SINGLE_PRICE_NIS = EVENT_ATTRACTION_FROM_NIS;

const EVENT_BUNDLE_TIERS: Record<number, number> = { 1: 1750, 2: 3200, 3: 4450 };
const EVENT_BUNDLE_4PLUS = 5500;
export const EVENT_GIFT_THRESHOLD = 4;

export function getEventBundlePrice(count: number): number {
  if (count <= 0) return 0;
  if (count >= EVENT_GIFT_THRESHOLD) return EVENT_BUNDLE_4PLUS;
  return EVENT_BUNDLE_TIERS[count] ?? count * EVENT_SINGLE_PRICE_NIS;
}

export const EVENT_BUNDLE_BADGE_LABELS: Record<string, string> = {
  popular: "פופולרי",
  new: "חדש",
  kids: "לילדים",
};
