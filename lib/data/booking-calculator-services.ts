import { EVENT_ATTRACTION_FROM_NIS, STUDIO_HALF_HOUR_NIS } from "./pricing";

export type ServiceCategory = "recordings" | "podcasts" | "clips" | "events" | "ai";

export type Service = {
  name: string;
  category: ServiceCategory;
  price: number;
  icon: string;
  desc: string;
  badge?: "popular" | "new" | "kids";
  upsells: string[];
};

export type Upsell = {
  name: string;
  price: number;
  desc: string;
};

export const SERVICES: Record<string, Service> = {
  recording_basic: {
    name: "הקלטת שיר בסיסית",
    category: "recordings",
    price: 590,
    icon: "🎤",
    desc: "הקלטה מקצועית עם מיקס ומאסטרינג",
    upsells: ["warmup", "melodyne", "production_full", "stems", "video_pro", "video_studio", "raw_only"],
  },
  recording_premium: {
    name: "הקלטת שיר פרמיום",
    category: "recordings",
    price: 1190,
    icon: "🌟",
    desc: "חבילה עם עיבוד, תמונות ויועץ אמנותי",
    upsells: ["warmup", "melodyne", "production_full", "stems", "video_pro"],
  },
  podcast_basic: {
    name: "הקלטת פודקאסט",
    category: "podcasts",
    price: STUDIO_HALF_HOUR_NIS,
    icon: "🎙️",
    desc: "הקלטה מקצועית באולפן, מוכנה לשחרור",
    upsells: ["editing_advanced", "full_edit", "custom_graphics", "highlights", "premium_package"],
  },
  podcast_advanced: {
    name: "פודקאסט מתקדם",
    category: "podcasts",
    price: 1500,
    icon: "🎙️",
    desc: "כולל עריכה מלאה, גרפיקה ותוצרים לכל פלטפורמה",
    upsells: ["custom_graphics", "highlights"],
  },
  clip_basic: {
    name: "קליפ בסיסי",
    category: "clips",
    price: 2500,
    icon: "🎬",
    desc: "צילום ועריכה מקצועית לשיר או לתוכן",
    upsells: [],
  },
  clip_pro: {
    name: "קליפ מקצועי",
    category: "clips",
    price: 5000,
    icon: "🎬",
    desc: "הפקה מלאה עם צוות מקצועי ואיכות פרסומית",
    upsells: [],
  },
  vlog_day: {
    name: "וולוג יום בחיי — צלם צמוד",
    category: "clips",
    price: 2200,
    icon: "🎥",
    badge: "new",
    desc: "תיעוד מהכניסה לאולפן ועד שעתיים עם צלם צמוד, כולל עריכה מלאה של פרק (עד 4 גרסאות עריכה)",
    upsells: [],
  },
  event_smoke: {
    name: "עשן כבד",
    category: "events",
    price: EVENT_ATTRACTION_FROM_NIS,
    icon: "💨",
    badge: "popular",
    desc: "אטרקציה מרהיבה לכניסה מרשימה",
    upsells: [],
  },
  event_bubbles: {
    name: "בועות סבון",
    category: "events",
    price: EVENT_ATTRACTION_FROM_NIS,
    icon: "🫧",
    badge: "kids",
    desc: "מושלם לאירועי ילדים ובני מצווה",
    upsells: [],
  },
  event_balloons: {
    name: "בלונים ענקיים",
    category: "events",
    price: EVENT_ATTRACTION_FROM_NIS,
    icon: "🎈",
    desc: "בלונים ענקיים מרשימים לצילום וכניסה",
    upsells: [],
  },
  event_sparklers: {
    name: "זיקוקים קרים",
    category: "events",
    price: EVENT_ATTRACTION_FROM_NIS,
    icon: "❄️",
    badge: "popular",
    desc: "זיקוקים בטוחים ומרהיבים לרגע הגדול",
    upsells: [],
  },
  event_confetti: {
    name: "קונפטי",
    category: "events",
    price: EVENT_ATTRACTION_FROM_NIS,
    icon: "🎊",
    desc: "פיצוץ קונפטי צבעוני ומרגש",
    upsells: [],
  },
  event_drummer: {
    name: "מתופף",
    category: "events",
    price: EVENT_ATTRACTION_FROM_NIS,
    icon: "🥁",
    desc: "מתופף מקצועי שמכניס אנרגיה לאירוע",
    upsells: [],
  },
  event_smoke_cannon: {
    name: "תותחי עשן צבעוני",
    category: "events",
    price: EVENT_ATTRACTION_FROM_NIS,
    icon: "🌈",
    badge: "new",
    desc: "תותחי עשן בצבעים מרהיבים לצילום",
    upsells: [],
  },
  event_smoke_gun: {
    name: "רובה עשן",
    category: "events",
    price: EVENT_ATTRACTION_FROM_NIS,
    icon: "💨",
    badge: "new",
    desc: "רובה עשן מקצועי לאפקטים ממוקדים",
    upsells: [],
  },
  event_slideshow: {
    name: "מצגת תמונות",
    category: "events",
    price: EVENT_ATTRACTION_FROM_NIS,
    icon: "📸",
    desc: "מצגת תמונות מרגשת ליום הולדת ואירועים משפחתיים",
    upsells: [],
  },
  event_foam: {
    name: "תותח קצף לילדים",
    category: "events",
    price: EVENT_ATTRACTION_FROM_NIS,
    icon: "🎉",
    badge: "kids",
    desc: "כיף מטורף לילדים שיזכרו לכל החיים",
    upsells: [],
  },
  podcast_grandpa: {
    name: "פודקאסט עם סבא",
    category: "events",
    price: EVENT_ATTRACTION_FROM_NIS,
    icon: "🎙️",
    desc: "הקלטת סיפור חיים - מתנה שנשארת לדורות",
    upsells: [],
  },
  sound_rental: {
    name: "השכרת ציוד הגברה",
    category: "events",
    price: EVENT_ATTRACTION_FROM_NIS,
    icon: "🔊",
    desc: "מערכת הגברה מקצועית לאירוע",
    upsells: [],
  },
  ai_voice: {
    name: "שיפור קול מהנייד",
    category: "ai",
    price: 250,
    icon: "🎤",
    desc: "הפיכת הקלטת וואטסאפ לאולפנית, כולל MP3",
    upsells: [],
  },
  ai_mixing: {
    name: "מיקס ומאסטרינג",
    category: "ai",
    price: 1750,
    icon: "🎚️",
    desc: "עיבוד מקצועי מלא בכל הפורמטים",
    upsells: [],
  },
  ai_podcast_edit: {
    name: "עריכת פודקאסט",
    category: "ai",
    price: 750,
    icon: "🎬",
    desc: "ניקוי רעשים, שיפור סאונד, הוצאת MP3/MP4",
    upsells: [],
  },
  ai_video_edit: {
    name: "עריכת סרטונים קצרים",
    category: "ai",
    price: 750,
    icon: "📱",
    desc: "רילס / שורטס / טיקטוק עם כתוביות ואפקטים",
    upsells: [],
  },
  ai_volume: {
    name: "שינוי והתאמת ווליום",
    category: "ai",
    price: 250,
    icon: "🔊",
    desc: "עד שעת הקלטה, איזון דינמי",
    upsells: [],
  },
  ai_rescue: {
    name: "הצלת הקלטות פגומות",
    category: "ai",
    price: 250,
    icon: "🆘",
    desc: "לכל 5 דקות: ניקוי רעשים ושחזור איכות",
    upsells: [],
  },
  ai_photos: {
    name: "שדרוג תמונות (AI)",
    category: "ai",
    price: 250,
    icon: "📸",
    desc: "לכל 10 תמונות: רזולוציה, צבעים, חדות",
    upsells: [],
  },
};

export const UPSELLS: Record<string, Upsell> = {
  warmup: { name: "חימום קולי מודרך", price: 0, desc: "20 דקות לפני ההקלטה, כלול במחיר" },
  melodyne: { name: "Melodyne - תיקון זיופים", price: 200, desc: "שיפור דיוק קולי מקצועי" },
  production_full: { name: "הפקה מלאה מקצועית", price: 1200, desc: "עד 5 כלים, עיבוד מקצועי" },
  stems: { name: "Stems - רצועות נפרדות", price: 300, desc: "קבצים נפרדים לכל כלי" },
  video_pro: { name: "צילום וידאו מקצועי", price: 850, desc: "צלם מקצועי לקליפ או מזכרת" },
  video_studio: { name: "צילום במצלמות אולפן", price: 400, desc: "צילום באיכות HD" },
  raw_only: { name: "הקלטה גולמית בלבד", price: 0, desc: "ללא עיבוד, קובץ גולמי" },
  editing_advanced: { name: "עריכה מתקדמת", price: 590, desc: "לכל שעה שצולמה, פתיח וסגיר" },
  full_edit: { name: "עריכה מלאה של וידאו", price: 750, desc: "עריכה + מיקס + גרפיקה" },
  custom_graphics: { name: "התאמה אישית מתקדמת", price: 450, desc: "גרפיקה וטקסטים מותאמים" },
  highlights: { name: "רגעי שיא (עד 3 דקות)", price: 300, desc: "Highlights לרילס / טיקטוק" },
  premium_package: { name: "חבילת ראש שקט - הכל", price: 3540, desc: "הפקה מלאה ומושלמת" },
};

export const CATEGORIES = [
  { id: "recordings", label: "הקלטות", icon: "🎤" },
  { id: "podcasts", label: "פודקאסטים", icon: "🎙️" },
  { id: "clips", label: "קליפים", icon: "🎬" },
  { id: "events", label: "אטרקציות", icon: "🎉" },
  { id: "ai", label: "שירותים דיגיטליים", icon: "💻" },
] as const;

export const BADGE_LABELS: Record<string, string> = {
  popular: "פופולרי",
  new: "חדש",
  kids: "לילדים",
};

/** Tiered bundle pricing - must match AttractionsCalculator */
export const EVENT_BUNDLE_TIERS: Record<number, number> = { 1: 1750, 2: 3200, 3: 4450 };
export const EVENT_BUNDLE_4PLUS = 5500;
export const EVENT_GIFT_THRESHOLD = 4;

export function getEventBundlePrice(count: number): number {
  if (count <= 0) return 0;
  if (count >= EVENT_GIFT_THRESHOLD) return EVENT_BUNDLE_4PLUS;
  return EVENT_BUNDLE_TIERS[count] ?? count * 1750;
}
