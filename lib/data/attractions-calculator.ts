import { getExVat } from "@/lib/data/pricing-catalog";
import { appendYcLeadTag } from "@/lib/yc-lead-tag";

export type GeoKey = "center" | "north_south" | "eilat";

export type AttractionItem = {
  id: string;
  name: string;
  shortDesc: string;
  seoDesc: string;
  metaKeywords: string[];
  icon: string;
  category: AttractionCategoryId;
  href: string;
  badge?: string;
  recommended?: boolean;
};

export type AttractionCategoryId =
  | "effects"
  | "atmosphere"
  | "premium"
  | "tech"
  | "production";

export const ATTRACTION_CATEGORIES: { id: AttractionCategoryId; label: string }[] = [
  { id: "effects", label: "אפקטים וזיקוקים" },
  { id: "atmosphere", label: "אווירה ועשן" },
  { id: "tech", label: "טכנולוגיה ותוכן" },
  { id: "premium", label: "פרימיום ותאורה" },
  { id: "production", label: "הפקה משלימה" },
];

export const GEO_FEES: Record<GeoKey, { label: string; fee: number }> = {
  center: { label: "מרכז (ללא תוספת)", fee: 0 },
  north_south: { label: "צפון / דרום (+800 ₪)", fee: 800 },
  eilat: { label: "אילת / גולן (+1,800 ₪)", fee: 1800 },
};

const BUNDLE_PRICES: Record<number, number> = {
  0: 0,
  1: getExVat("event_attraction_1"),
  2: getExVat("event_attraction_2"),
  3: getExVat("event_attraction_3"),
  4: getExVat("event_attraction_4"),
};

export const PRICING_TIERS = [
  { count: 1, price: getExVat("event_attraction_1"), saving: "" },
  { count: 2, price: getExVat("event_attraction_2"), saving: "חיסכון 300 ₪" },
  { count: 3, price: getExVat("event_attraction_3"), saving: "חיסכון 800 ₪" },
  { count: 4, price: getExVat("event_attraction_4"), saving: "+ קליפ מתנה", highlight: true },
] as const;

export const ATTRACTIONS: AttractionItem[] = [
  // ── אפקטים וזיקוקים ─────────────────────────────────────────────────────
  {
    id: "cold-fireworks",
    name: "זיקוקים קרים",
    shortDesc: "2 מכשירים · ל-4 מטרים גובה · ללא אש אמיתית",
    seoDesc:
      "זיקוקים קרים מייצרים מפל ניצוצות לבן ומבריק ל-4 מטרים גובה – ללא אש אמיתית, בטוחים לחלוטין בסביבה סגורה ועל שמלות. 2 מכשירים בחבילה הבסיסית, אפשרות לשדרג ל-4 מכשירים בהנחה 25%. מתאימים לכניסת הזוג לחופה, לרחבת הריקודים ולכל רגע שיא שאתם רוצים לצלם.",
    metaKeywords: ["זיקוקים קרים", "ניצוצות לחתונה", "אפקט זיקוקים", "Cold Spark", "ללא אש"],
    icon: "✨",
    category: "effects",
    href: "/events/attractions/cold-fireworks",
    recommended: true,
  },
  {
    id: "co2",
    name: "תותחי CO₂",
    shortDesc: "עשן לחץ חזק, הרגע שכולם מצלמים",
    seoDesc:
      "תותחי CO₂ יורים עשן לחץ חזק לגובה מטרים ויוצרים את הרגע הכי מצולם באירוע. מתאים לשבירת כוס, לכניסת זוג ולרגעי שיא שאתם רוצים שיישמרו לנצח.",
    metaKeywords: ["תותח CO2", "תותח עשן", "אפקט עשן לחץ", "שבירת כוס"],
    icon: "💨",
    category: "effects",
    href: "/events/attractions/smoke-cannons-for-events",
  },
  {
    id: "confetti",
    name: "גשם קונפטי",
    shortDesc: "1 או 2 תותחים – הרגע הכי מצולם",
    seoDesc:
      "תותח קונפטי מפצץ אלפי פיסות נייר צבעוניות לאוויר ויוצר גשם של אושר. הרגע הזה הוא אחד הצילומים הכי ויראליים מאירועים. זמין בנייר לבן, צבעוני. תותח אחד ב-1,750 ₪ לפני מע״מ, 2 תותחים בהנחה 25%.",
    metaKeywords: ["תותח קונפטי", "גשם קונפטי", "קונפטי לחתונה", "אפקט קונפטי"],
    icon: "🎊",
    category: "effects",
    href: "/events/attractions/confetti-cannon",
  },
  {
    id: "smoke-cannons",
    name: "תותחי עשן",
    shortDesc: "2 תותחים בבסיס · 4 תותחים בהנחה 25%",
    seoDesc:
      "תותחי עשן מייצרים ענני עשן ממוקדים לרגעי שיא באירוע. החבילה הבסיסית כוללת 2 תותחים, ואפשר לשדרג ל-4 תותחים בהנחה 25%. מתאים לכניסות, לריקוד סלואו ולכל רגע שאתם רוצים להפוך לבלתי נשכח.",
    metaKeywords: ["תותח עשן", "עשן לאירועים", "אפקט עשן", "smoke machine"],
    icon: "💨",
    category: "effects",
    href: "/events/attractions/smoke-cannons-for-events",
  },

  // ── אווירה ועשן ──────────────────────────────────────────────────────────
  {
    id: "wedding-smoke",
    name: "עשן כבד",
    shortDesc: "ערפל מרהיב שיוצר תמונות שיישארו לכל החיים",
    seoDesc:
      "עשן כבד לרחבה הוא אחד האפקטים האהובים ביותר בחתונות ובר מצווה. הערפל הלבן הסמיך יוצר אווירה קסומה ורגע של שתיקה לפני כניסת הזוג. מומלץ לאירועים גדולים, לסלו-מוציה ולאפקט חופה.",
    metaKeywords: ["עשן כבד", "ערפל לחתונה", "אפקט חופה", "עשן לרחבה"],
    icon: "🌫️",
    category: "atmosphere",
    href: "/events/attractions/wedding-smoking-machine",
    badge: "מומלץ",
    recommended: true,
  },
  {
    id: "bubbles",
    name: "בועות סבון עשן",
    shortDesc: "היט 2026, בועות עם ענן עשן בתוכן",
    seoDesc:
      "מכונת בועות עשן: בועות אטומות עם ענן לבן בתוכן. מצטלם מדהים, בטוח לשמלות ולא מחליק. לחתונה, סלואו ובר מצווה.",
    metaKeywords: ["בועות עשן", "מכונת בועות עשן", "בועות לחתונה", "אטרקציה לרחבה"],
    icon: "🫧",
    category: "atmosphere",
    href: "/events/attractions/bubble-machine/smoke-bubble-machine-events",
    badge: "היט",
    recommended: true,
  },
  {
    id: "balloons",
    name: "בלוני ענק",
    shortDesc: "אווירה צבעונית ברחבה",
    seoDesc:
      "בלוני ענק צבעוניים מוסיפים אווירה ושמחה לכל רחבה. מרשימים לצילום ומעצימים את חוויית הריקוד.",
    metaKeywords: ["בלוני ענק", "בלונים לאירוע", "עיצוב רחבה", "בלונים לחתונה"],
    icon: "🎈",
    category: "atmosphere",
    href: "/events/attractions/giant-balloons",
  },

  // ── טכנולוגיה ותוכן ─────────────────────────────────────────────────────
  {
    id: "led-booth",
    name: "עמדת LED",
    shortDesc: "הלוגו שלכם מוקרן על מסך LED לאורך כל הערב",
    seoDesc:
      "מסך LED גדול מציג את הלוגו, שמות הזוג, ספירה לאחור ואנימציות מותאמות אישית. יוצר תפאורה מרהיבה ומוסיף ממד ויזואלי לאירוע שלכם.",
    metaKeywords: ["מסך LED לאירוע", "לוגו על מסך", "אנימציה לאירוע", "LED אירועים"],
    icon: "📺",
    category: "tech",
    href: "/events/stage-led-dj",
  },
  {
    id: "backstage",
    name: "תא הקלטה Backstage",
    shortDesc: "האורחים מברכים, החוגג מקבל סרטון ערוך",
    seoDesc:
      "תא הקלטה Backstage הוא המתנה שאורחים זוכרים שנים. האורחים נכנסים, מברכים על המצלמה, ובסוף האירוע החוגג מקבל סרטון ערוך עם מוזיקה וסאונד מקצועי. הלהיט של העונה.",
    metaKeywords: ["תא הקלטה", "אטרקציה הקלטה", "ברכות וידאו", "Backstage Booth"],
    icon: "🎙️",
    category: "tech",
    href: "/studio",
    badge: "הלהיט",
  },
  {
    id: "podcast",
    name: "פודקאסט לייב מהרחבה",
    shortDesc: "שיחות ורגעים מוקלטים בזמן אמת, תוכן לשיתוף",
    seoDesc:
      "הפודקאסט הלייב מביא אולפן הקלטות ישירות לאירוע. ראיונות עם האורחים, שיחות ורגעים מתועדים בסאונד מקצועי. תוכן שאפשר לשתף ולשמור לנצח.",
    metaKeywords: ["פודקאסט לאירועים", "הקלטה לייב", "אטרקציה דיגיטלית"],
    icon: "🎧",
    category: "tech",
    href: "/podcast",
  },

  // ── פרימיום ותאורה ───────────────────────────────────────────────────────
  {
    id: "premium-wash-rgb",
    name: "תאורת שטיפה בצבעים",
    shortDesc:
      "תאורת שטיפה בצבעים לאירועים קטנים (בצבעים RGB - לפי דרישה) 1750",
    seoDesc:
      "תאורת שטיפה בצבעים לאירועים קטנים (בצבעים RGB - לפי דרישה) 1750. זה כולל התקנה ופירוק.",
    metaKeywords: ["תאורת שטיפה", "RGB", "תאורה לאירועים", "Wash lighting"],
    icon: "🎨",
    category: "premium",
    href: "/events/equipment",
  },
  {
    id: "premium-flood",
    name: "תאורה להצפה",
    shortDesc:
      "תאורה להצפה באירועים - גופי תאורה עוצמתיים לצילום או לאירועים בלבן, צהוב, שמש (אור יום) 1750",
    seoDesc:
      "תאורה להצפה באירועים - גופי תאורה עוצמתיים לצילום או לאירועים בלבן, צהוב, שמש (אור יום) 1750. זה כולל התקנה ופירוק.",
    metaKeywords: ["תאורת הצפה", "Flood light", "תאורה לצילום", "אור יום"],
    icon: "💡",
    category: "premium",
    href: "/events/equipment",
  },
  {
    id: "premium-perfect",
    name: "עוד תאורה מושלמת",
    shortDesc:
      "ועוד תאורה מושלמת לאירועים 5000 ש\"ח כולל הזזה, רובוטים, וצורות ליצירת מסיבה אמיתית",
    seoDesc:
      "ועוד תאורה מושלמת לאירועים 5000 ש\"ח כולל הזזה, רובוטים, וצורות ליצירת מסיבה אמיתית.",
    metaKeywords: ["רובוטים תאורה", "תאורה מתקדמת", "מסיבה אמיתית"],
    icon: "🪩",
    category: "premium",
    href: "/events/equipment",
  },

  // ── הפקה משלימה ─────────────────────────────────────────────────────────
  {
    id: "sound",
    name: "הגברה מקצועית מלאה",
    shortDesc: "2 RCF + סאב - עד 250 איש - התקנה כלולה",
    seoDesc:
      "מערכת הגברה מקצועית עם 2 רמקולי RCF וסאב-וופר מבטיחה סאונד מושלם עד 250 אורחים. ההתקנה, הכיוון והרס כלולים. מתאים לכניסות, לברכות ולפלייליסטים.",
    metaKeywords: ["הגברה לאירוע", "מערכת סאונד", "RCF לאירועים", "הגברה מקצועית"],
    icon: "🔊",
    category: "production",
    href: "/events/equipment",
  },
  {
    id: "studio",
    name: "הקלטת שיר / קליפ",
    shortDesc: "תוצר מקצועי שיישמע ברדיו, מתנה שלא נשכחת",
    seoDesc:
      "הקלטת שיר מקצועית באולפן יקיר כהן, מתנה שהחוגג ישמור לכל החיים. כולל הקלטה, עריכה, מיקס ומסירת קובץ דיגיטלי. ניתן להוסיף קליפ וידאו.",
    metaKeywords: ["הקלטת שיר לאירוע", "מתנת אולפן", "הקלטה מקצועית", "קליפ מתנה"],
    icon: "🎵",
    category: "production",
    href: "/studio/recording-song-modiin",
  },
];

export function getBundlePrice(count: number): number {
  if (count <= 0) return 0;
  if (count >= 4) return BUNDLE_PRICES[4];
  return BUNDLE_PRICES[count] ?? BUNDLE_PRICES[4];
}

export function qualifiesForGift(count: number): boolean {
  return count >= 4;
}

export function giftProgressHint(count: number): string {
  if (count >= 4) return "";
  if (count === 3) return "עוד אטרקציה אחת ותקבלו קליפ היילייטס מתנה";
  if (count >= 1) return `${3 - count} אטרקציות נוספות לחיסכון מקסימלי`;
  return "בחרו אטרקציות לחישוב מחיר";
}

export const EVENT_TYPES = [
  { value: "wedding", label: "חתונה" },
  { value: "bar_mitzvah", label: "בר/בת מצווה" },
  { value: "birthday", label: "יום הולדת" },
  { value: "corporate", label: "אירוע עסקי" },
  { value: "other", label: "אחר" },
] as const;

export type AttractionsOrderForm = {
  name: string;
  phone: string;
  eventType: string;
  eventDate: string;
  eventTime: string;
  venue: string;
  guestCount: string;
  notes: string;
};

export function buildAttractionsOrderWhatsApp(params: {
  selectedIds: readonly string[];
  geo: GeoKey;
  form: AttractionsOrderForm;
  bundlePrice: number;
  geoFee: number;
  total: number;
  hasGift: boolean;
}): string {
  const attractions = ATTRACTIONS.filter((a) =>
    params.selectedIds.includes(a.id),
  );
  const eventLabel =
    EVENT_TYPES.find((t) => t.value === params.form.eventType)?.label ??
    params.form.eventType;

  const lines = [
    "הזמנת חבילת אטרקציות - יקיר כהן הפקות",
    "========================================",
    "",
    "פרטי הלקוח:",
    `שם: ${params.form.name.trim()}`,
    `טלפון: ${params.form.phone.trim()}`,
    "",
    "פרטי האירוע:",
    `סוג אירוע: ${eventLabel}`,
    `תאריך: ${params.form.eventDate}`,
    `שעת התחלה/הפעלה: ${params.form.eventTime}`,
    `מיקום (אולם/כתובת): ${params.form.venue.trim()}`,
    `אזור נסיעה: ${GEO_FEES[params.geo].label}`,
    params.form.guestCount.trim()
      ? `מספר אורחים משוער: ${params.form.guestCount.trim()}`
      : null,
    "",
    "אטרקציות שנבחרו (חוזה):",
    ...attractions.map((a, i) => `${i + 1}. ${a.name}`),
    "",
    "פירוט מחיר:",
    `חבילת ${attractions.length} אטרקציות: ${bundlePriceLabel(params.bundlePrice, attractions.length)}`,
    params.geoFee > 0 ? `תוספת אזור: ${params.geoFee.toLocaleString("he-IL")} ₪` : "תוספת אזור: ללא",
    hasGiftLine(params.hasGift),
    "",
    `סה״כ משוער לפני מע״מ: ${params.total.toLocaleString("he-IL")} ₪`,
    "",
    params.form.notes.trim()
      ? `הערות והעדפות:\n${params.form.notes.trim()}`
      : null,
    "",
    "אישור: ההזמנה נשלחה מהאתר. מחיר סופי לאחר אישור זמינות.",
  ];

  const body = lines.filter((line) => line !== null).join("\n");
  return appendYcLeadTag(body, {
    service: "effects_only",
    price: params.total,
    source: "/events/attractions",
    step: 3,
    intent: "start_now",
    form: "attractions_calculator",
  });
}

function bundlePriceLabel(price: number, count: number): string {
  return `${price.toLocaleString("he-IL")} ₪ (${count} אטרקציות בחבילה)`;
}

function hasGiftLine(hasGift: boolean): string | null {
  if (!hasGift) return null;
  return "מתנה כלולה: קליפ היילייטס 60 שניות (מ-4 אטרקציות)";
}
