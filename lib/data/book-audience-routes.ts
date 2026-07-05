import type { BookCategoryId } from "@/lib/book-url";
import type { FilterAnswers } from "@/lib/data/filter-questions";
import {
  EVENT_ATTRACTION_FROM_NIS,
  STUDIO_HALF_HOUR_NIS,
} from "@/lib/data/pricing";
import { formatFromPriceDual, getExVat, getScopeById, type PriceScope } from "@/lib/data/pricing-catalog";
import { YOUTUBE_SERVICE_EMBED_IDS } from "@/lib/data/youtube-embeds";
import { appendYcLeadTag, emotionalLabelToId } from "@/lib/yc-lead-tag";
import { TIME_CLAIMS } from "@/lib/data/conversion-copy";
import {
  QUALIFICATION_FIELDS_BY_ROUTE_ID,
  type QualificationField,
} from "@/lib/data/book-qualification-fields";

export type { QualificationField } from "@/lib/data/book-qualification-fields";

export type BookSuperCategory = "events" | "studio" | "learn" | "pro";

export const BOOK_SUPER_CATEGORIES: {
  id: BookSuperCategory;
  label: string;
  icon: string;
  routeIds: readonly string[];
}[] = [
  {
    id: "events",
    label: "אירועים והפקות",
    icon: "🎤",
    routeIds: ["events-attractions", "dj-vip", "singer-amplification", "photo-clips"],
  },
  {
    id: "studio",
    label: "הקלטות ואולפן",
    icon: "🎧",
    routeIds: ["family-gifts", "podcast-content"],
  },
  {
    id: "learn",
    label: "לימוד והתפתחות",
    icon: "📚",
    routeIds: ["academy-learn"],
  },
  {
    id: "pro",
    label: "שירותים מקצועיים",
    icon: "⚙️",
    routeIds: ["online-restore", "pro-b2b"],
  },
] as const;

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
  scope?: PriceScope;
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
  /** משפט ROI קצר מתחת למחיר */
  valueFrame: string;
  /** מזהה שירות ב-yakir-closer */
  closerServiceId: string;
  /** bullets לכרטיס תמחור בדף הבית */
  homeFeatures?: readonly string[];
  /** כרטיס מודגש בגריד התמחור בדף הבית */
  isFeatured?: boolean;
  /** כותרת קצרה לכרטיס בדף הבית */
  homeCardTitle?: string;
  /** תיאור קצר לכרטיס בדף הבית */
  homeCardDescription?: string;
  /** עמוד שירות לקישור פנימי */
  servicePageHref?: string;
  /** תג פופולריות בכרטיס */
  popularBadge?: string;
};

export function getQualificationFields(route: BookAudienceRoute): readonly QualificationField[] {
  return QUALIFICATION_FIELDS_BY_ROUTE_ID[route.id] ?? [];
}

export function getSuperCategoryForRoute(routeId: string): BookSuperCategory | null {
  for (const cat of BOOK_SUPER_CATEGORIES) {
    if (cat.routeIds.includes(routeId)) return cat.id;
  }
  return null;
}

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
      "הקלטות שירים וברכות למשפחות וילדים. ליווי טכני מלא לאורך ההקלטה, כולל הנחיה ווקאלית ועריכה.",
    essenceMicroCopy:
      "ליווי טכני מלא מהגעה לאולפן ועד לקובץ הסופי.",
    priceExVat: STUDIO_FROM,
    priceNote: "חבילת ברכה / הקלטה קצרה",
    scope: getScopeById("blessing_recording"),
    startingPriceDual: dual(STUDIO_FROM),
    upsellHint: "אפשר להוסיף: קליפ BTS לרשתות - דואט משפחתי - פלייבק AI",
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
      "שלום, אנחנו מחפשים הקלטה לאירוע משפחתי.\nמה שחסר לנו: ברכה / שיר לאירוע משפחתי\nשם החוגג/ת (מי יקליט): _____",
    valueFrame: "590₪ שחוסכים הקלטה לא מקצועית ועריכה יקרה אחר כך",
    closerServiceId: "recording",
    homeCardTitle: "שיר בהפתעה וברכות",
    homeCardDescription:
      "הקלטת שיר או ברכה באולפן. ליווי טכני מהכניסה ועד קובץ מוכן.",
    homeFeatures: [
      "הקלטת שיר או ברכה באולפן",
      "טיונינג ווקאלי ועריכה",
      "מתאים לבר/בת מצווה, חתונה ומתנות",
    ],
    servicePageHref: "/studio",
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
    scope: getScopeById("studio_half_hour"),
    startingPriceDual: dual(STUDIO_HALF_HOUR_NIS),
    upsellHint: "אפשר להוסיף: עריכת פרקים - חבילה חודשית - תמלול",
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
    valueFrame: TIME_CLAIMS.podcastValueFrame,
    closerServiceId: "podcast",
    isFeatured: true,
    popularBadge: "⭐ הבחירה הראשונה",
    homeCardTitle: "הקלטת פודקאסט וקריינות",
    homeCardDescription:
      "סאונד צלול לתוכן עסקי ואישי. אולפן מאובזר, טכנאי צמוד ועריכה מלאה.",
    homeFeatures: [
      "שעת אולפן עם טכנאי צמוד",
      "ניקוי רעשים ועריכה דיגיטלית",
      "ייצוא ל-Spotify ו-Apple Podcasts",
    ],
    servicePageHref: "/podcast",
  },
  {
    id: "events-attractions",
    variant: "gold",
    icon: "🎉",
    tag: "אטרקציות לאירועים",
    title: "עשן כבד, בועות, זיקוקים קרים ועוד",
    description:
      "עשן, בועות, זיקוקים וקונפטי לאירועים. חבילות משולבות עם הנחה, הפעלה מקצועית בשטח.",
    essenceMicroCopy: "ציוד אפקטים מקצועי עם הפעלה בשטח. זמין לאירועי חוץ וחלל.",
    priceExVat: EVENT_ATTRACTION_FROM_NIS,
    priceNote: "אטרקציה בודדת",
    scope: { includes: "הפעלה מקצועית בשטח" },
    startingPriceDual: dual(EVENT_ATTRACTION_FROM_NIS),
    upsellHint: "אפשר לשלב: 2-4 אטרקציות במחיר חבילה + קליפ מתנה",
    emotionalQuestion: "באיזה שלב של האירוע רוצים להוסיף אפקט?",
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
    valueFrame: "אפקטים שמרימים את האירוע - בלי הפתעות ביום",
    closerServiceId: "effects_only",
    servicePageHref: "/events/attractions",
  },
  {
    id: "dj-vip",
    variant: "luxury",
    icon: "💎",
    tag: "DJ ואפקטים לאירועים",
    title: "דיג׳יי בוטיק, עשן כבד, זיקוקים קרים ו-LED",
    description:
      "DJ בוטיק עם ציוד מלא לאירועים. מוזיקה, עשן כבד, זיקוקים קרים ו-LED - לקהל מעורב וחד-גוני.",
    essenceMicroCopy: "DJ ואפקטים לאירועים. ניסיון בקהלים מעורבי-גיל ובסוגי אירועים שונים.",
    priceExVat: EVENT_ATTRACTION_FROM_NIS,
    priceNote: "מחיר התחלתי לאפקט / DJ",
    scope: { includes: "DJ או אפקט בודד" },
    startingPriceDual: dual(EVENT_ATTRACTION_FROM_NIS),
    upsellHint: "אפשר לשלב: עשן + זיקוקים + LED במחיר חבילה",
    emotionalQuestion: "מהו הסגנון המוזיקלי לאירוע?",
    emotionalOptions: [
      { id: "elegant", label: "אלגנטי ומסורתי" },
      { id: "party", label: "מסיבה - מוזיקה חזקה" },
      { id: "mixed", label: "קהל מעורב גילאים" },
      { id: "unsure", label: "לא בטוחים עדיין" },
    ],
    demoVideoKey: "events-dj",
    utmBoostKeywords: ["dj", "premium", "vip", "wedding", "led"],
    utm_campaign: "book_router_dj",
    categoryId: "dj",
    whatsappFastMessageBase:
      "שלום, ראינו את שירותי ה-DJ והאפקטים לאירועים.\nמה שחסר לנו: DJ / אפקטים לאירוע",
    valueFrame: "DJ ואפקטים מקצועיים - מתוכנן ומתואם מראש",
    closerServiceId: "dj",
    popularBadge: "🔥 המוביל",
    homeCardTitle: "דיג׳יי בוטיק ופירוטכניקה",
    homeCardDescription:
      "DJ, הגברה ואפקטים לאירועים פרטיים ועסקיים. ציוד מלא והפעלה בשטח.",
    homeFeatures: [
      "DJ בוטיק עם התאמה מוזיקלית מלאה",
      "מערכת הגברה ותאורה בשטח",
      "עשן כבד, זיקוקים קרים ואפקטים",
    ],
    servicePageHref: "/events/dj-events",
  },
  {
    id: "singer-amplification",
    variant: "neutral",
    icon: "🎤",
    tag: "הגברה לזמרים",
    title: "צ'ק סאונד וטכנאי בשטח - הקול שלך בכל אולם",
    description:
      "מערכת הגברה מלאה עם טכנאי מקצועי. מתאים לזמרים שרוצים להישמע מעולה על הבמה.",
    essenceMicroCopy: "מערכת הגברה מלאה עם טכנאי סאונד נוכח לאורך האירוע.",
    priceExVat: SINGER_FROM,
    priceNote: "חבילת בסיס",
    scope: { includes: "מערכת הגברה וטכנאי בשטח" },
    startingPriceDual: dual(SINGER_FROM),
    upsellHint: "אפשר להוסיף: צ'ק סאונד מוקדם - הקלטת ההופעה",
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
    valueFrame: "סאונד מקצועי על הבמה - אתם מתמקדים בשירה",
    closerServiceId: "live_sound",
    servicePageHref: "/events/singer-amplification",
  },
  {
    id: "photo-clips",
    variant: "neutral",
    icon: "📷",
    tag: "צילום וקליפים",
    title: "צילום אירועים, קליפים ושירותי AI",
    description:
      "שעות צילום גמישות, עריכה מקצועית ושירותי AI - מחיר שקוף לפי בחירה.",
    essenceMicroCopy: "לשמר את הרגעים שחשובים לכם - בצילום ובוידאו.",
    priceExVat: PHOTO_FROM,
    priceNote: "שעת צילום באולפן / אירוע",
    scope: getScopeById("studio_hour"),
    startingPriceDual: dual(PHOTO_FROM),
    upsellHint: "אפשר לשלב: חבילת AI - קליפ מקצועי - סרטון סיכום",
    emotionalQuestion: "מה אתם רוצים לתעד?",
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
    valueFrame: "רגעים חשובים שמורים - בצילום ובוידאו",
    closerServiceId: "recording",
    servicePageHref: "/photography",
  },
  {
    id: "academy-learn",
    variant: "academy",
    icon: "🎓",
    tag: "לימוד והתפתחות",
    title: "שיעורים פרטיים עם יקיר - פיתוח קול, DJ, הפקה ועוד",
    description:
      "מפגש אישי 1:1 באולפן במודיעין. 60 או 90 דקות של תשומת לב מלאה - פסנתר, גיטרה, הפקה, תקליטנות.",
    essenceMicroCopy: "שיעורים פרטיים אחד-על-אחד באולפן, עם מי שעוסק בתחום על בסיס יומי.",
    priceExVat: ACADEMY_FROM,
    priceNote: "שיעור 60 דק׳ - Pro Session 90 דק׳ מ-1,280 ₪",
    scope: { duration: "60 דקות", includes: "שיעור פרטי 1:1 באולפן" },
    startingPriceDual: dual(ACADEMY_FROM),
    upsellHint: "תחומים: פיתוח קול - DJ - הפקה - פסנתר - גיטרה",
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
    valueFrame: "פחות מיום עבודה, יותר משנה טעויות יקרות",
    closerServiceId: "academy",
    servicePageHref: "/academy",
  },
  {
    id: "online-restore",
    variant: "online",
    icon: "🔧",
    tag: "הצלת הקלטות / AI",
    title: "שחזור סאונד, ניקוי רעשים והצלת קבצים פגומים",
    description:
      "הרצאות מזום, קלטות ישנות, רעשי רקע - שולחים קובץ ומקבלים סאונד נקי ומקצועי.",
    essenceMicroCopy: "נגיד לכם בכנות מה אפשר להציל - בלי התחייבות.",
    priceExVat: ONLINE_FROM,
    priceNote: "לכל 5 דקות - שחזור מלא לפי הערכה",
    scope: { duration: "לכל 5 דקות", includes: "שחזור סאונד לפי הערכה" },
    startingPriceDual: dual(ONLINE_FROM),
    upsellHint: "בדיקת היתכנות חינם - שלחו קטע של 30 שניות",
    emotionalQuestion: "מה הכי מפריע לכם בסאונד?",
    emotionalOptions: [
      { id: "noise", label: "רעשי רקע" },
      { id: "old", label: "הקלטה ישנה / פגומה" },
      { id: "zoom", label: "הקלטת זום / וידאו" },
      { id: "unsure", label: "לא יודעים - תבדקו לנו" },
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
    valueFrame: "מחזירים הקלטה שלא הייתם זורקים",
    closerServiceId: "online_ai",
    servicePageHref: "/online",
  },
  {
    id: "pro-b2b",
    variant: "luxury",
    icon: "💼",
    tag: "שירותים מקצועיים לעסקים",
    title: "תגים קוליים, מאשאפים, פס ייצור והשכרת ציוד",
    description:
      "שירותים לדיג'ייז, יוצרי תוכן וחברות הגברה - עם מחשבון הצעה ומחירון שקוף.",
    essenceMicroCopy: "בית הייצור שלכם - מהרעיון לתוצר מוכן.",
    priceExVat: getExVat("dj_voice_tag_single"),
    priceNote: "תג קולי בודד",
    scope: { includes: "תג קולי מוכן לשידור" },
    startingPriceDual: dual(getExVat("dj_voice_tag_single")),
    upsellHint: "אפשר לשלב: חבילת 5 תגים - מאשאפ חירום - פס ייצור חודשי",
    emotionalQuestion: "איזה שירות הכי דחוף לכם?",
    emotionalOptions: [
      { id: "voice_tags", label: "תג קולי לדיג'יי" },
      { id: "mashup", label: "מאשאפ / עריכה דחופה" },
      { id: "podcast_b2b", label: "פודקאסט / אולפן בקופסה" },
      { id: "dry_hire", label: "השכרת ציוד / הגברה" },
    ],
    demoVideoKey: "events-dj",
    utmBoostKeywords: ["pro", "b2b", "voice_tags", "mashup", "dry_hire", "podcast"],
    utm_campaign: "book_router_pro",
    categoryId: "pro",
    filterPreset: { purpose: "professional", timeline: "this_month" },
    whatsappFastMessageBase:
      "שלום, מעוניין/ת בשירותים מקצועיים מהאתר.\nמה שחסר לי: _____",
    valueFrame: "שירות מקצועי - בלי לנחש מחירים",
    closerServiceId: "dj_voice_tags",
    servicePageHref: "/pro",
  },
] as const;

export const HOME_AUDIENCE_ROUTE_IDS = [
  "family-gifts",
  "podcast-content",
  "dj-vip",
] as const;

/** סדר תצוגה בדף הבית - פודקאסט במרכז כ-Featured */
export const HOME_AUDIENCE_DISPLAY_ORDER = [
  "dj-vip",
  "podcast-content",
  "family-gifts",
] as const;

export function getAudienceRouteById(id: string): BookAudienceRoute | undefined {
  return BOOK_AUDIENCE_ROUTES.find((r) => r.id === id);
}

export function buildFastWhatsAppMessage(
  route: BookAudienceRoute,
  emotionalAnswer?: string | null,
  qualificationAnswers?: Record<string, string>,
): string {
  const priceLine = route.startingPriceDual.replace("כרגע: ", "ראינו ");
  const emotionLine = emotionalAnswer?.trim()
    ? `\nמה שחשוב לי: ${emotionalAnswer}`
    : "";

  const fields = getQualificationFields(route);
  let qualLines = "";
  if (qualificationAnswers && fields.length) {
    const filled = fields
      .filter((f) => qualificationAnswers[f.id]?.trim())
      .map((f) => `${f.waLabel}: ${qualificationAnswers[f.id].trim()}`);
    if (filled.length) {
      qualLines = `\n${filled.join("\n")}`;
    }
  }

  const base = `${route.whatsappFastMessageBase}${emotionLine}${qualLines}\n${priceLine}`;
  const emotionalId = emotionalLabelToId(emotionalAnswer);
  return appendYcLeadTag(base, {
    service: route.closerServiceId,
    price: route.priceExVat,
    source: route.utm_campaign,
    step: 1,
    route: route.id,
    emotional: emotionalId,
  });
}

export const BOOK_ESCAPE_HATCH = {
  label: "לא בטוחים מה מתאים? פנו בוואטסאפ לייעוץ ראשוני ללא עלות.",
  message:
    "שלום, לא בטוח/ה מה בדיוק מתאים לי.\nאשמח לשיחה קצרה ולעזרה בבחירת חבילה מותאמת.",
  utm_campaign: "book_escape_hatch",
} as const;

export const BOOK_ROUTER_REASSURANCE =
  "רוב הלקוחות אינם מוזיקאים מקצועיים. כל פרויקט מלווה מתחילתו ועד סיומו.";
