import { STUDIO_PARKING_NOTE } from "@/lib/constants";
import { TIME_CLAIMS } from "@/lib/data/conversion-copy";
import { PODCAST_PACKAGES, type PodcastPackageId } from "@/lib/data/podcast-calculator";
import { getExVat, STUDIO_TURNS_NOTE, type PriceItemId } from "@/lib/data/pricing-catalog";
import { formatPrice, type FormattedPrice } from "@/lib/data/pricing-display";
import {
  PODCAST_STUDIO_MODIIN_EXISTS_FAQ,
  PODCAST_STUDIO_MODIIN_PRICE_FAQ,
} from "./faq-aeo";

/* המילה "להשכרה" לא הופיעה בעמוד, והמשנה והקריאה לפעולה דיברו על קריינות
   אנושית ו-AI במקום על האולפן. העובדות כאן רק מתשובות הבעלים 8.10.2026
   (תשובה 7 לציוד, תשובה 8 למה שמייחד את האולפן). "יותר מ-20 שנות ניסיון"
   ולא "אולפן שקיים 20 שנה": הקריירה מ-2001 והעסק נפתח ב-2010
   (FOUNDER_CAREER_START_YEAR ו-BUSINESS_FOUNDING_YEAR ב-lib/constants.ts),
   ו-"20+" מאושר ב-TRUST_CLAIM_SOURCES שם. */
export const STUDIO_MODIIN_RENTAL = {
  heading: "אולפן פודקאסט להשכרה במודיעין",
  /* הפארקים: תשובת הבעלים 8.10.2026 ("בחוץ" = פארקים ענקיים ליד האולפן, לצילומים או לשבת בימים יפים) */
  body: "אולפן נקי ומסודר, שקט ונוח, עם אווירה טובה ועיצוב חדיש וחלומי. אנחנו תמיד שואפים לקדמת הטכנולוגיה, ויש לנו יותר מ-20 שנות ניסיון. האזור נגיש, ויש חניה בשפע. האולפן ממוקם ליד פארקים גדולים במודיעין, שמתאימים לצילומים בחוץ או לשבת בהם בימים יפים.",
  equipmentLabel: "הציוד",
  /* תשובת הבעלים 8.10.2026, השנייה: עד ארבעה SM7B, ו-RE20 ו-MV7 כבחירה לפי הסאונד
     והמראה, מיקרופון חדר לקבוצה או קהל. שתי מצלמות מרכזיות ועוד אחת רחבה (3, כמו
     PODCAST_VIDEO_CAMERAS_NOTE ו"3 מצלמות קבועות" בתשובת ה-AEO), ועוד לפי דרישה.
     "עד 4 מיקרופונים בו זמנית" (D64) לא משתנה: RE20 ו-MV7 הם חלופות, לא ערוצים נוספים. */
  equipment:
    "עד ארבעה מיקרופונים Shure SM7B. מי שמחפש סאונד עמוק של שדרני רדיו מקליט ב-Electro-Voice RE20, ומי שמחפש מיקרופון שנראה חדשני, עם סאונד רך ומלטף, ב-Shure MV7. כשיש כמה אנשים או קהל, יש גם מיקרופון חדר. מצלמות Sony ZV-E10 II: שתיים מרכזיות ועוד אחת רחבה, ואם צריך עוד, יש מצלמות נוספות לפי דרישה. עד שישה אנשים נכנסים בנוח לצילום.",
} as const;

export type StudioModiinPriceCard = {
  id: PriceItemId;
  name: string;
  badge?: string;
  price: FormattedPrice;
  lines: readonly string[];
  /** החבילה שמוצגת ראשונה ומודגשת */
  primary?: boolean;
};

function podcastPackage(id: PodcastPackageId) {
  const pkg = PODCAST_PACKAGES.find((p) => p.id === id);
  if (!pkg) throw new Error(`podcast package ${id} missing from PODCAST_PACKAGES`);
  return pkg;
}

/* "מ-" כי כל משתתף מעבר לשניים מוסיף למחיר בכל חבילה באולפן
   (podcastParticipantExtras ב-lib/data/podcast-calculator.ts) */
function studioPrice(id: PriceItemId): FormattedPrice {
  return formatPrice(getExVat(id), { from: true });
}

const VIDEO_PACKAGE = podcastPackage("video");
const AUDIO_PACKAGE = podcastPackage("audio");

export const STUDIO_MODIIN_PRICES_HEADING = "מחירי השכרת האולפן";

/* ארבע החבילות היו מוסתרות מאחורי המחשבון. תשובות הבעלים 8.10.2026: חבילת
   הווידאו היא המרכזית ומוצגת ראשונה (תשובה 6), האודיו מוצג כאפשרות נוספת כדי
   שיבינו שזה עוד ערוץ (תשובה 6), ובחצי השעה כתוב מה מקבלים בפועל: קובץ גולמי,
   ובצילום עם חיתוך בין המצלמות גם הפרק (תשובה 5). המחירים רק מהקטלוג, כולל
   מע״מ קודם כי זה עמוד צרכן. השמות והמשנה של החבילות מהמחשבון, כדי ששני
   המקומות יגידו אותו דבר. */
export const STUDIO_MODIIN_PRICE_CARDS: readonly StudioModiinPriceCard[] = [
  {
    id: "podcast_video",
    name: VIDEO_PACKAGE.name,
    badge: VIDEO_PACKAGE.badge,
    price: studioPrice("podcast_video"),
    lines: [VIDEO_PACKAGE.subtitle, TIME_CLAIMS.podcastSameSecond],
    primary: true,
  },
  {
    id: "podcast_audio",
    name: AUDIO_PACKAGE.name,
    price: studioPrice("podcast_audio"),
    lines: ["אפשרות נוספת, בלי וידאו", AUDIO_PACKAGE.subtitle],
  },
  {
    id: "studio_half_hour",
    name: "חצי שעה באולפן",
    price: studioPrice("studio_half_hour"),
    /* תשובת הבעלים 8.10.2026: בחצי שעה עם מצלמות מקבלים את מתקני האולפן והדרכה, לא פרק ערוך */
    lines: [
      "קובץ גולמי, בלי עריכה",
      "עם מצלמות: שימוש במתקני האולפן, כולל טלוויזיות ומוניטורים",
      "הדרכה מקצועית וליווי של איש טכני",
    ],
  },
];

/* מחיר השירות העצמי היה כתוב ביד ובלי מע״מ, בזמן ש-/pricing מציג אותו כולל
   מע״מ. עכשיו מהקטלוג, כולל מע״מ קודם, כמו בבלוק המחירים של העמוד (בדיקת
   העמוד מול תשובות הבעלים 8.10.2026). */
const SELF_SERVICE_HOUR = formatPrice(getExVat("studio_self_service_hour"));

export const STUDIO_MODIIN_HERO_IMAGE = {
  src: "/images/services/studio/hub/ישראל אהרוני באולפן.webp",
  alt: "ישראל אהרוני בסטודיו לפודקאסט במודיעין",
} as const;

export const STUDIO_MODIIN_HERO_FEATURES: readonly string[] = [
  "השכרת סטודיו לפודקאסט במודיעין והסביבה",
  "ציוד הקלטה מתקדם + חדר מבודד אקוסטית",
  "ליווי טכני מלא, מתמקדים בתוכן, לא בטכניקה",
  "מיקום מרכזי, כביש 6 ו-1, חניה בשפע",
  "אופציות עריכה, וידאו והפקה מלאה",
] as const;

export const STUDIO_MODIIN_WHY_US: readonly string[] = [
  "ציוד מקצועי: Shure SM7B, Electro-Voice RE20, מיקסרים דיגיטליים ומעבדי קול",
  "חדר מבודד אקוסטית, ללא הדים, רעשי רקע או הסחות",
  "מיקום מרכזי במודיעין, נגיש מירושלים, תל אביב והמרכז",
  "ליווי טכני בהקלטה, אנחנו מנהלים את הטכני, אתם מדברים",
  "אופציות עריכה והפקה, מעטפת מלאה מאותו מקום",
  "מתאים לכל סוג: ראיונות, סיפורים, פודקאסט עם סבא ועוד",
] as const;

export const STUDIO_MODIIN_RELATED_SERVICES: readonly {
  emoji: string;
  title: string;
  description: string;
  href: string;
}[] = [
  {
    emoji: "🎧",
    title: "עריכת פודקאסט מקצועית",
    description:
      "ניקוי רעשים, מוזיקת רקע, מיקס ומאסטרינג, כשאין זמן לערוך בעצמכם.",
    href: "/podcast/podcast-editing",
  },
  {
    emoji: "🎬",
    title: "הפקת וידאו לפודקאסט (Vodcast)",
    description:
      "צילום באיכות גבוהה וקבצים מוכנים ליוטיוב ורשתות חברתיות.",
    href: "/podcast/podcast-recording",
  },
  {
    emoji: "📱",
    title: "סושיאל דאמפ, רילז לעסקים",
    description:
      "2 שעות באולפן, 10-15 רילז ערוכים. צילום מרוכז לטיקטוק ורילז.",
    href: "/business/content-studio",
  },
  {
    emoji: "🔌",
    title: `אולפן שירות עצמי (${SELF_SERVICE_HOUR.headline} לשעה)`,
    description: `${SELF_SERVICE_HOUR.headline} לשעה (${SELF_SERVICE_HOUR.vatNote}). מגיעים עם לפטופ, מקליטים, לוקחים קבצים גולמיים. בלי עריכה.`,
    href: "/podcast/self-service-studio",
  },
  {
    emoji: "📱",
    title: "עריכת סרטונים קצרים",
    description: "ניהול סושיאל. צילום בעסק + ריטיינר חודשי.",
    href: "/business/social-media",
  },
  {
    emoji: "🏠",
    title: "ייעוץ אקוסטיקה ובניית אולפן",
    description: "אולפן ביתי, פודקאסט או משדר - תכנון אקוסטי וליווי.",
    href: "/academy/home-studio",
  },
] as const;

export const STUDIO_MODIIN_FAQS: readonly {
  id: string;
  question: string;
  answer: string;
}[] = [
  PODCAST_STUDIO_MODIIN_EXISTS_FAQ,
  PODCAST_STUDIO_MODIIN_PRICE_FAQ,
  {
    id: "multi-guest",
    question: "האם ניתן להקליט פודקאסט עם מספר משתתפים?",
    answer:
      /* קיבולת האולפן, החלטת הבעלים D64, 7.10.2026 */
      `בהחלט. הסטודיו מאובזר להקלטת מספר משתתפים בו-זמנית, בנפרד או יחד, בהתאם לצורך. ${STUDIO_TURNS_NOTE}.`,
  },
  {
    id: "equipment",
    question: "האם צריך להביא ציוד משלנו?",
    answer:
      "לא. הסטודיו כולל מיקרופונים, אוזניות, מעבדים ומחשבים. מגיעים עם הרעיון.",
  },
  /* אושר על ידי הבעלים 6.10.2026 (נוסח א', בלי המספר של Apple): עוצמה לפי האוזן וגלי
     הקול באדובי אודישן, לא לפי מספר יעד. "אנחנו" למקצוע, "בעיניי" לדעה. */
  {
    id: "loudness",
    question: "איך מכוונים את עוצמת הסאונד של הפרק?",
    answer:
      "בסוף ההפקה אנחנו מעבדים את הפרק באדובי אודישן, עם קומפרסיה ומאסטרינג, ומכוונים את העוצמה לפי האוזן ולפי גלי הקול. בעיניי, מי שמייצר תוכן שנשמע טוב לא צריך שמישהו יגיד לו מה העוצמה הנכונה: שומעים עד איפה אפשר להגביר בלי לאבד מהסאונד, ושם עוצרים.",
  },
  {
    id: "parking",
    question: "האם יש חניה במקום?",
    answer: `כן. ${STUDIO_PARKING_NOTE}.`,
  },
] as const;
