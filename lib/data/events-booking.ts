import { EVENT_ATTRACTION_FROM_NIS } from "@/lib/data/pricing";
import { getExVat } from "@/lib/data/pricing-catalog";

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

/** סוג תמחור האטרקציה: rigid = חומרי גלם מתכלים, liquid = מוצר נוזלי/גז */
export type AttractionPricingType = "rigid" | "liquid";

/** מפתחות הפעלה לאטרקציות rigid (זיקוקים/קונפטי) */
export type RigidActivationKey = "act_1" | "act_2" | "act_3";

/** מפתחות תדירות לאטרקציות liquid (עשן/בועות) */
export type LiquidFrequencyKey = "freq_single" | "freq_graduated" | "freq_full" | "freq_extreme";

export type EventBookingItemQuantity =
  | "standard"
  | "double"
  | RigidActivationKey
  | LiquidFrequencyKey;

/** תוספת מחיר לכמות כפולה (1,750 × 2 × 0.25) – legacy */
export const DOUBLE_QUANTITY_SURCHARGE = 875;

const ATTRACTION_BASE_PRICE = 1750;

export type ActivationOption = { key: RigidActivationKey; label: string; shortLabel: string; addOnPrice: number };
export type FrequencyOption = { key: LiquidFrequencyKey; label: string; shortLabel: string; addOnPrice: number; addOnPercent?: string };

/** אפשרויות הפעלה לאטרקציות rigid – כל הפעלה = מלאי גלם חדש ויקר */
export const RIGID_ACTIVATION_OPTIONS: readonly ActivationOption[] = [
  { key: "act_1", label: "הפעלה אחת (בסלואו או בכניסה)", shortLabel: "הפעלה אחת", addOnPrice: 0 },
  { key: "act_2", label: "2 הפעלות (כניסה + סלואו)", shortLabel: "2 הפעלות", addOnPrice: 1750 },
  { key: "act_3", label: "3 הפעלות (כניסה, סלואו ופתיחת רחבה)", shortLabel: "3 הפעלות", addOnPrice: 3500 },
];

/** אפשרויות תדירות לאטרקציות liquid – עלות שולית נמוכה, תמחור אחוזני */
export const LIQUID_FREQUENCY_OPTIONS: readonly FrequencyOption[] = [
  { key: "freq_single", label: "הפעלה אחת לרגע השיא המרכזי", shortLabel: "הפעלה אחת", addOnPrice: 0 },
  { key: "freq_graduated", label: "שתי הפעלות מדורגות (חזקה + מתונה לאווירה)", shortLabel: "2 מדורגות", addOnPrice: Math.round(ATTRACTION_BASE_PRICE * 0.35), addOnPercent: "35%" },
  { key: "freq_full", label: "שתי הפעלות מלאות ועוצמתיות בשני רגעי שיא", shortLabel: "2 עוצמתיות", addOnPrice: Math.round(ATTRACTION_BASE_PRICE * 0.5), addOnPercent: "50%" },
  { key: "freq_extreme", label: "חבילת אקסטרים: הפעלה חופשית בסבבי הריקודים", shortLabel: "אקסטרים", addOnPrice: ATTRACTION_BASE_PRICE, addOnPercent: "100%" },
];

export type EventBookingItem = {
  id: EventBookingItemId;
  name: string;
  svgPath: string;
  svgViewBox: string;
  desc: string;
  badge?: "popular" | "new" | "kids";
  /** rigid = זיקוקים/קונפטי (מלאי מתכלה, ליניארי); liquid = עשן/בועות (אחוזני) */
  pricingType?: AttractionPricingType;
  /** legacy – שמור לאחור-תאימות, לא משומש עבור pricingType items */
  quantityLabel?: { standard: string; double: string };
  /** קישור לדף מידע על האטרקציה */
  href?: string;
};

export const EVENT_BOOKING_ITEMS: readonly EventBookingItem[] = [
  {
    id: "event_smoke",
    name: "עשן כבד",
    svgPath: "M4 12c0-2.5 2-4.5 4.5-4.5.8 0 1.6.2 2.3.6C11.7 6.5 13.2 5.5 15 5.5c2.5 0 4.5 2 4.5 4.5 0 .3 0 .6-.1.9 1.2.4 2.1 1.6 2.1 3 0 1.9-1.6 3.5-3.5 3.5H6c-2.2 0-4-1.8-4-4 0-.4.1-.9.3-1.3.7-.4 1.2-1.2 1.2-2.1z",
    svgViewBox: "0 0 24 24",
    badge: "popular",
    pricingType: "liquid",
    desc: "ערפל לבן סמיך ברחבה – אפקט חופה וסלו מוציה",
    href: "/events/attractions/wedding-smoking-machine",
  },
  {
    id: "event_bubbles",
    name: "בועות סבון עשן",
    svgPath: "M7 10a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm10 4a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm-5 6a4 4 0 1 0 0-8 4 4 0 0 0 0 8z",
    svgViewBox: "0 0 24 24",
    badge: "kids",
    pricingType: "liquid",
    desc: "בועות אטומות עם ענן בתוכן – היט 2026, בטוח לשמלות",
    href: "/events/attractions/bubble-machine",
  },
  {
    id: "event_balloons",
    name: "בלונים ענקיים",
    svgPath: "M12 2a6 6 0 0 1 6 6c0 3.52-3.1 7-6 10-2.9-3-6-6.48-6-10a6 6 0 0 1 6-6zm0 16v4",
    svgViewBox: "0 0 24 24",
    desc: "בלוני ענק צבעוניים לרחבה – מרשים לצילום",
    href: "/events/attractions/giant-balloons",
  },
  {
    id: "event_sparklers",
    name: "זיקוקים קרים",
    svgPath: "M12 2v4M12 18v4M4 12h4M16 12h4M6.34 6.34l2.83 2.83M14.83 14.83l2.83 2.83M6.34 17.66l2.83-2.83M14.83 9.17l2.83-2.83",
    svgViewBox: "0 0 24 24",
    badge: "popular",
    pricingType: "rigid",
    desc: "זיקוקי ניצוצות ל-4 מטרים · ללא אש אמיתית · מרהיב לצילום",
    href: "/events/attractions/cold-fireworks",
  },
  {
    id: "event_confetti",
    name: "תותח קונפטי",
    svgPath: "M17 3l4 4-4 4M3 12h14M7 21l-4-4 4-4M21 12H7",
    svgViewBox: "0 0 24 24",
    pricingType: "rigid",
    desc: "אלפי פיסות קונפטי באוויר – הרגע הכי מצולם",
    href: "/events/attractions/confetti-cannon",
  },
  {
    id: "event_drummer",
    name: "מתופף",
    svgPath: "M3 17c0-2.2 4.03-4 9-4s9 1.8 9 4v1H3v-1zm2-7h14M5 6h14M8 3v3m8-3v3",
    svgViewBox: "0 0 24 24",
    desc: "מתופף מקצועי שמוסיף קצב וחיות לאירוע",
  },
  {
    id: "event_smoke_cannon",
    name: "תותחי עשן צבעוני",
    svgPath: "M4 15h11l3-5H7L4 15zm13-5l3-5M2 19h5m10 0h5M7 19a2 2 0 1 0 4 0 2 2 0 0 0-4 0z",
    svgViewBox: "0 0 24 24",
    badge: "new",
    pricingType: "liquid",
    desc: "תותחי עשן בצבעים מרהיבים – אפקט ויזואלי חזק לצילום",
    href: "/events/attractions/smoke-cannons-for-events",
  },
  {
    id: "event_smoke_gun",
    name: "תותחי עשן",
    svgPath: "M2 12h10v2H2v-2zm10 0l4-4h4l2 4-2 4h-4l-4-4zm10 0h2",
    svgViewBox: "0 0 24 24",
    badge: "new",
    pricingType: "liquid",
    desc: "ענני עשן ממוקדים לרגעי שיא – כניסות וסלואו",
    href: "/events/attractions/smoke-cannons-for-events",
  },
  {
    id: "event_slideshow",
    name: "מצגת תמונות",
    svgPath: "M3 5h18v12H3V5zm4 14h10M12 3v2M7 11l3-3 4 4 2-2 2 2H7z",
    svgViewBox: "0 0 24 24",
    desc: "מצגת תמונות מרגשת ליום האירוע · אפשרות להוסיף סרטון",
  },
  {
    id: "event_foam",
    name: "תותח קצף לילדים",
    svgPath: "M12 3a3 3 0 0 1 3 3c0 1.3-.8 2.4-2 2.8V11h2a2 2 0 0 1 2 2v2H7v-2a2 2 0 0 1 2-2h2V8.8C9.8 8.4 9 7.3 9 6a3 3 0 0 1 3-3zm-3 9h6M6 19a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v2H6v-2z",
    svgViewBox: "0 0 24 24",
    badge: "kids",
    desc: "פעילות קצף לילדים – ציוד בטיחותי, מתאים לגיל 10-",
  },
  {
    id: "podcast_grandpa",
    name: "פודקאסט עם סבא",
    svgPath: "M12 2a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3zm7 9c0 3.52-2.61 6.44-6 6.93V22h-2v-4.07C7.61 17.44 5 14.52 5 11h2a5 5 0 0 0 10 0h2z",
    svgViewBox: "0 0 24 24",
    desc: "מתנה דיגיטלית שנשמרת לאורך זמן, כולל הקלטת שיר",
    href: "/podcast",
  },
  {
    id: "sound_rental",
    name: "השכרת ציוד הגברה",
    svgPath: "M11 5L6 9H2v6h4l5 4V5zm4 7c0-1.77-1.02-3.29-2.5-4.03v8.05C13.98 15.29 15 13.77 15 12zm3.5 0c0 3.01-1.73 5.61-4.25 6.89v2.06c3.64-1.37 6.25-4.88 6.25-8.95s-2.61-7.58-6.25-8.95v2.06C16.77 6.39 18.5 8.99 18.5 12z",
    svgViewBox: "0 0 24 24",
    desc: "2 רמקולי RCF + סאב-וופר · עד 250 אורחים · התקנה, כיוון ופירוק כלולים",
    href: "/events/equipment",
  },
] as const;

/** מחיר בודד לפני מע״מ */
export const EVENT_SINGLE_PRICE_NIS = EVENT_ATTRACTION_FROM_NIS;

const EVENT_BUNDLE_TIERS: Record<number, number> = {
  1: getExVat("event_attraction_1"),
  2: getExVat("event_attraction_2"),
  3: getExVat("event_attraction_3"),
};
const EVENT_BUNDLE_4PLUS = getExVat("event_attraction_4");
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

/**
 * מחשב תוספת מחיר לפריט אטרקציה לפי הבחירה שנשמרה בטופס.
 * rigid: ליניארי לפי מס׳ הפעלות | liquid: אחוזני | legacy double: 875 ₪
 */
export function getAttractionAddOnPrice(
  itemId: EventBookingItemId,
  qty: EventBookingItemQuantity | undefined,
): number {
  const item = EVENT_BOOKING_ITEMS.find((i) => i.id === itemId);
  if (!item || !qty) return 0;

  if (item.pricingType === "rigid") {
    return RIGID_ACTIVATION_OPTIONS.find((o) => o.key === qty)?.addOnPrice ?? 0;
  }
  if (item.pricingType === "liquid") {
    return LIQUID_FREQUENCY_OPTIONS.find((o) => o.key === qty)?.addOnPrice ?? 0;
  }
  if (qty === "double") return DOUBLE_QUANTITY_SURCHARGE;
  return 0;
}

/** ברירת מחדל לבחירה ראשונית לפי סוג האטרקציה */
export function defaultQuantity(item: EventBookingItem): EventBookingItemQuantity {
  if (item.pricingType === "rigid") return "act_1";
  if (item.pricingType === "liquid") return "freq_single";
  return "standard";
}
