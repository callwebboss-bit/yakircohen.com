import type { BookCategoryId } from "@/lib/book-url";
import type { FilterAnswers } from "@/lib/data/filter-questions";
import {
  EVENT_ATTRACTION_FROM_NIS,
  STUDIO_HALF_HOUR_NIS,
} from "@/lib/data/pricing";
import { formatFromPriceDual, getExVat } from "@/lib/data/pricing-catalog";
import { YOUTUBE_SERVICE_EMBED_IDS } from "@/lib/data/youtube-embeds";

export type AudienceCardVariant = "gold" | "neutral" | "luxury" | "academy" | "online";

export type EmotionalOption = {
  id: string;
  label: string;
};

export type BookAudienceRoute = {
  id: string;
  variant: AudienceCardVariant;
  icon: string;
  tag: string;
  title: string;
  description: string;
  essenceMicroCopy: string;
  priceExVat: number;
  priceNote?: string;
  startingPriceDual: string;
  upsellHint: string;
  emotionalQuestion: string;
  emotionalOptions: readonly EmotionalOption[];
  demoVideoKey: keyof typeof YOUTUBE_SERVICE_EMBED_IDS;
  utmBoostKeywords: readonly string[];
  utm_campaign: string;
  categoryId: BookCategoryId;
  filterPreset?: Partial<FilterAnswers>;
  whatsappFastMessageBase: string;
  feasibilityCheckMessage?: string;
  feasibilityUtmCampaign?: string;
};

const STUDIO_FROM = 590;
const SINGER_FROM = 2800;
const ACADEMY_FROM = 990;
const ONLINE_FROM = getExVat("damaged_recording_rescue");
const PHOTO_FROM = getExVat("studio_hour");

function dual(exVat: number): string {
  return formatFromPriceDual(exVat);
}

export const BOOK_AUDIENCE_ROUTES: readonly BookAudienceRoute[] = [
  {
    id: "family-gifts",
    variant: "gold",
    icon: "🎙️",
    tag: "הקלטות ואירועים משפחתיים",
    title: "שיר הפתעה, ברכת כלה או הקלטה לבר/בת מצווה",
    description:
      "מגיעים מפוחדים, יוצאים עם תוצאה שמדליקה את הסלון. האולפן מותאם להורים וילדים — ואנחנו מטפלים בהכל.",
    essenceMicroCopy:
      "אנחנו כאן כדי שהקול שלך יישמע הכי מחמיא ונקי שיש — בלי לחץ זמן.",
    priceExVat: STUDIO_FROM,
    priceNote: "חבילת ברכה / הקלטה קצרה",
    startingPriceDual: dual(STUDIO_FROM),
    upsellHint: "אפשר להוסיף: קליפ BTS לרשתות · דואט משפחתי · פלייבק AI",
    emotionalQuestion: "מה הכי חשוב לך שיקרה באירוע?",
    emotionalOptions: [
      { id: "surprise", label: "להפתיע ולרגש" },
      { id: "memory", label: "לשמור רגע לנצח" },
      { id: "fun", label: "כיף משפחתי ביחד" },
      { id: "unsure", label: "עדיין לא בטוח/ה" },
    ],
    demoVideoKey: "blessings-bar-mitzvah",
    utmBoostKeywords: ["bar_mitzvah", "bat_mitzvah", "gift", "family", "blessing", "bride", "wedding"],
    utm_campaign: "book_router_family",
    categoryId: "studio",
    filterPreset: { purpose: "gift", timeline: "this_month" },
    whatsappFastMessageBase:
      "שלום, אנחנו מחפשים הקלטה לאירוע משפחתי.\nמה שחסר לנו: ברכה / שיר לאירוע משפחתי",
  },
  {
    id: "podcast-content",
    variant: "neutral",
    icon: "🎧",
    tag: "פודקאסט ותוכן קולי",
    title: "הקלטת פודקאסט מקצועי או קריינות לתוכן עסקי",
    description:
      "חדר מבודד רעשים, ציוד שידורי ועריכה מלאה. תגיעו, תדברו, תקבלו MP3 גמור.",
    essenceMicroCopy: "התוכן שלכם יישמע מקצועי, ברור ומוכן לפרסום.",
    priceExVat: STUDIO_HALF_HOUR_NIS,
    priceNote: "חצי שעה באולפן",
    startingPriceDual: dual(STUDIO_HALF_HOUR_NIS),
    upsellHint: "אפשר להוסיף: עריכת פרקים · חבילה חודשית · תמלול",
    emotionalQuestion: "מה התוכן שאתם רוצים שהעולם ישמע?",
    emotionalOptions: [
      { id: "podcast", label: "פודקאסט / סדרה" },
      { id: "business", label: "תוכן עסקי" },
      { id: "course", label: "קורס / הרצאה" },
      { id: "unsure", label: "עדיין בוחנים" },
    ],
    demoVideoKey: "podcast-studio",
    utmBoostKeywords: ["podcast", "content", "business", "voiceover"],
    utm_campaign: "book_router_podcast",
    categoryId: "podcast",
    filterPreset: { purpose: "professional", timeline: "this_month" },
    whatsappFastMessageBase:
      "שלום, אשמח לפרטים על הקלטת פודקאסט באולפן.\nמה שחסר לי: פרק ראשון / תוכן עסקי",
  },
  {
    id: "events-attractions",
    variant: "gold",
    icon: "🎉",
    tag: "אטרקציות לאירועים",
    title: "עשן כבד, בועות, זיקוקים קרים ועוד",
    description:
      "אטרקציות שמרימות את האווירה — עם חבילות משולבות וחיסכון אוטומטי.",
    essenceMicroCopy: "רגעים בלתי נשכחים שהאורחים יזכרו שנים.",
    priceExVat: EVENT_ATTRACTION_FROM_NIS,
    priceNote: "אטרקציה בודדת",
    startingPriceDual: dual(EVENT_ATTRACTION_FROM_NIS),
    upsellHint: "אפשר לשלב: 2–4 אטרקציות במחיר חבילה + קליפ מתנה",
    emotionalQuestion: "איזה רגע באירוע חייב להיות בלתי נשכח?",
    emotionalOptions: [
      { id: "entrance", label: "כניסה מרשימה" },
      { id: "dance", label: "רחבת ריקודים" },
      { id: "kids", label: "כיף לילדים" },
      { id: "unsure", label: "תעזרו לי לבחור" },
    ],
    demoVideoKey: "events-attractions-hub",
    utmBoostKeywords: ["events", "attraction", "smoke", "bubble", "confetti"],
    utm_campaign: "book_router_events",
    categoryId: "events",
    whatsappFastMessageBase:
      "שלום, מעוניינים באטרקציות לאירוע (עשן, בועות, זיקוקים וכו').\nמה שחסר לנו: אפקטים לאירוע",
  },
  {
    id: "dj-vip",
    variant: "luxury",
    icon: "💎",
    tag: "DJ ואפקטים לאירועים",
    title: "דיג׳יי בוטיק, עשן כבד, זיקוקים קרים ו-LED",
    description:
      "חווית VIP לאירועים. מוזיקה שמדברת לקהל מעורב, בשילוב אפקטים שמרימים את האווירה.",
    essenceMicroCopy: "אווירה שמרגישים בבטן — מוזיקה ואפקטים בידיים מקצועיות.",
    priceExVat: EVENT_ATTRACTION_FROM_NIS,
    priceNote: "מחיר התחלתי לאפקט / DJ",
    startingPriceDual: dual(EVENT_ATTRACTION_FROM_NIS),
    upsellHint: "אפשר לשלב: עשן + זיקוקים + LED במחיר חבילה",
    emotionalQuestion: "איזו אווירה אתם רוצים שהאורחים יזכרו?",
    emotionalOptions: [
      { id: "elegant", label: "אלגנטי ומרגש" },
      { id: "party", label: "מסיבה עד הבוקר" },
      { id: "mixed", label: "קהל מעורב גילאים" },
      { id: "unsure", label: "לא בטוחים עדיין" },
    ],
    demoVideoKey: "events-dj",
    utmBoostKeywords: ["dj", "premium", "vip", "wedding", "led"],
    utm_campaign: "book_router_dj",
    categoryId: "dj",
    whatsappFastMessageBase:
      "שלום, ראינו את שירותי ה-DJ והאפקטים לאירועים.\nמה שחסר לנו: DJ / אפקטים לאירוע",
  },
  {
    id: "singer-amplification",
    variant: "neutral",
    icon: "🎤",
    tag: "הגברה לזמרים",
    title: "צ'ק סאונד וטכנאי בשטח — הקול שלך בכל אולם",
    description:
      "מערכת הגברה מלאה עם טכנאי מקצועי. מתאים לזמרים שרוצים להישמע מעולה על הבמה.",
    essenceMicroCopy: "שתרגישו בטוחים על הבמה — אנחנו דואגים לסאונד.",
    priceExVat: SINGER_FROM,
    priceNote: "חבילת בסיס",
    startingPriceDual: dual(SINGER_FROM),
    upsellHint: "אפשר להוסיף: צ'ק סאונד מוקדם · הקלטת ההופעה",
    emotionalQuestion: "מה הכי חשוב לך בביצוע?",
    emotionalOptions: [
      { id: "confidence", label: "להרגיש בטוח/ה" },
      { id: "quality", label: "סאונד מקצועי" },
      { id: "stage", label: "להתמודד עם אולם גדול" },
      { id: "unsure", label: "צריך ייעוץ" },
    ],
    demoVideoKey: "events-singer-amplification",
    utmBoostKeywords: ["singer", "amplification", "sound", "stage"],
    utm_campaign: "book_router_singer",
    categoryId: "singer",
    whatsappFastMessageBase:
      "שלום, מעוניין/ת בהגברה לזמרים לאירוע.\nמה שחסר לי: מערכת הגברה + טכנאי בשטח",
  },
  {
    id: "photo-clips",
    variant: "neutral",
    icon: "📷",
    tag: "צילום וקליפים",
    title: "צילום אירועים, קליפים ושירותי AI",
    description:
      "שעות צילום גמישות, עריכה מקצועית ושירותי AI — מחיר שקוף לפי בחירה.",
    essenceMicroCopy: "לשמר את הרגעים שחשובים לכם — בצילום ובוידאו.",
    priceExVat: PHOTO_FROM,
    priceNote: "שעת צילום באולפן / אירוע",
    startingPriceDual: dual(PHOTO_FROM),
    upsellHint: "אפשר לשלב: חבילת AI · קליפ מקצועי · סרטון סיכום",
    emotionalQuestion: "איזה רגע אתם רוצים לשמר לנצח?",
    emotionalOptions: [
      { id: "wedding", label: "חתונה / אירוע" },
      { id: "clip", label: "קליפ לשיר" },
      { id: "content", label: "תוכן לרשתות" },
      { id: "unsure", label: "לא בטוחים" },
    ],
    demoVideoKey: "photography-wedding",
    utmBoostKeywords: ["photo", "photography", "clip", "video"],
    utm_campaign: "book_router_photo",
    categoryId: "photography",
    whatsappFastMessageBase:
      "שלום, מעוניינים בצילום / קליפים לאירוע.\nמה שחסר לנו: צילום או וידאו",
  },
  {
    id: "academy-learn",
    variant: "academy",
    icon: "🎓",
    tag: "לימוד והתפתחות",
    title: "שיעורים פרטיים עם יקיר — פיתוח קול, DJ, הפקה ועוד",
    description:
      "מפגש אישי 1:1 באולפן במודיעין. 60 או 90 דקות של תשומת לב מלאה — פסנתר, גיטרה, הפקה, תקליטנות.",
    essenceMicroCopy: "ללמוד בקצב שלך, עם מישהו שעושה את זה בשטח כל יום.",
    priceExVat: ACADEMY_FROM,
    priceNote: "שיעור 60 דק׳ · Pro Session 90 דק׳ מ-1,280 ₪",
    startingPriceDual: dual(ACADEMY_FROM),
    upsellHint: "תחומים: פיתוח קול · DJ · הפקה · פסנתר · גיטרה",
    emotionalQuestion: "מה הכי חשוב לך להשתפר בו?",
    emotionalOptions: [
      { id: "voice", label: "פיתוח קול" },
      { id: "dj", label: "תקליטנות" },
      { id: "production", label: "הפקה מוזיקלית" },
      { id: "other", label: "משהו אחר" },
    ],
    demoVideoKey: "studio-recording-studio",
    utmBoostKeywords: ["academy", "lesson", "course", "learn", "dj-course"],
    utm_campaign: "book_router_academy",
    categoryId: "academy",
    whatsappFastMessageBase:
      "שלום, מעוניין/ת בשיעור פרטי עם יקיר באולפן.\nמה שחסר לי: ללמוד ולהשתפר ב",
  },
  {
    id: "online-restore",
    variant: "online",
    icon: "🔧",
    tag: "הצלת הקלטות / AI",
    title: "שחזור סאונד, ניקוי רעשים והצלת קבצים פגומים",
    description:
      "הרצאות מזום, קלטות ישנות, רעשי רקע — שולחים קובץ ומקבלים סאונד נקי ומקצועי.",
    essenceMicroCopy: "נגיד לכם בכנות מה אפשר להציל — בלי התחייבות.",
    priceExVat: ONLINE_FROM,
    priceNote: "לכל 5 דקות · שחזור מלא לפי הערכה",
    startingPriceDual: dual(ONLINE_FROM),
    upsellHint: "בדיקת היתכנות חינם — שלחו קטע של 30 שניות",
    emotionalQuestion: "מה הכי מפריע לכם בסאונד?",
    emotionalOptions: [
      { id: "noise", label: "רעשי רקע" },
      { id: "old", label: "הקלטה ישנה / פגומה" },
      { id: "zoom", label: "הקלטת זום / וידאו" },
      { id: "unsure", label: "לא יודעים — תבדקו לנו" },
    ],
    demoVideoKey: "podcast-zoom-before-after",
    utmBoostKeywords: ["online", "restore", "vocal-fix", "ai", "noise"],
    utm_campaign: "book_router_online",
    categoryId: "online",
    whatsappFastMessageBase:
      "שלום, יש לי הקלטה שצריכה שחזור / ניקוי סאונד.\nמה שחסר לי: לשפר איכות קול בקובץ קיים",
    feasibilityCheckMessage:
      "שלום, אשמח לבדיקת היתכנות חינם לשחזור סאונד.\nאצרף קטע של כ-30 שניות מהקובץ.\nמה שחסר לי: לדעת אם אפשר להציל את ההקלטה",
    feasibilityUtmCampaign: "book_online_feasibility",
  },
] as const;

export const HOME_AUDIENCE_ROUTE_IDS = [
  "family-gifts",
  "podcast-content",
  "dj-vip",
] as const;

export function getAudienceRouteById(id: string): BookAudienceRoute | undefined {
  return BOOK_AUDIENCE_ROUTES.find((r) => r.id === id);
}

export function buildFastWhatsAppMessage(
  route: BookAudienceRoute,
  emotionalAnswer?: string | null,
): string {
  const priceLine = route.startingPriceDual.replace("כרגע: ", "ראינו ");
  const emotionLine = emotionalAnswer?.trim()
    ? `\nמה שחשוב לי: ${emotionalAnswer}`
    : "";
  return `${route.whatsappFastMessageBase}${emotionLine}\n${priceLine}\nאשמח לשמוע על האפשרויות ושדרוגים.`;
}

export const BOOK_ESCAPE_HATCH = {
  label: "לא בטוחים מה בדיוק מתאים? בואו נדבר אישית בוואטסאפ ונרכיב לכם חבילה מיוחדת",
  message:
    "שלום, לא בטוח/ה מה בדיוק מתאים לי.\nאשמח לשיחה קצרה ולעזרה בבחירת חבילה מותאמת.",
  utm_campaign: "book_escape_hatch",
} as const;

export const BOOK_ROUTER_REASSURANCE =
  "בלי לחץ — אנחנו מדריכים אתכם צעד-צעד באווירה משוחררת וכיפית. רוב הלקוחות שלנו לא זמרים, וזה בסדר גמור.";
