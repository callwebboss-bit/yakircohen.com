import type { BlessingsProcessStep } from "@/lib/data/blessings-subpages";
import { BLESSING_REMOTE_TRADEOFF_NOTE, BLESSING_TEXT_POLISH_NOTE } from "@/lib/data/pricing-catalog";

export type BlessingTypeCard = {
  emoji: string;
  title: string;
  description: string;
  href?: string;
};

export type BlessingBenefit = {
  emoji: string;
  title: string;
  description: string;
};

export type BlessingWorkflowOption = {
  id: string;
  title: string;
  paragraphs: readonly string[];
  bullets?: readonly string[];
  note?: string;
};

export const BLESSINGS_HUB_FEATURED_VIDEO_ID = "wfTY8Bz2uE4";

export const BLESSING_TYPE_CARDS: readonly BlessingTypeCard[] = [
  {
    emoji: "📜",
    title: "הקלטת דרשה",
    description: "דרשה מוקלטת בשקט, בלי לחץ של קהל.",
    href: "/studio/blessings/bar-mitzvah",
  },
  {
    emoji: "🕎",
    title: "ברכה לבר/בת מצווה",
    description: "ברכת הכהנים, דרשה או ברכה אישית לבר/בת המצווה.",
    href: "/studio/blessings/bar-mitzvah",
  },
  {
    emoji: "💍",
    title: "ברכת כלה וחתן",
    description: "ברכה מוקלטת לזוג, מההורים, מהחברים או מהמשפחה.",
    href: "/studio/blessings/bride-groom-blessing",
  },
  {
    emoji: "🏠",
    title: "הקלטה מהבית (סמארטפון)",
    description:
      "לא יכולים להגיע לאולפן? שולחים אפליקציה והנחיות, ואתם מקליטים בנוחות.",
    href: "#home-recording",
  },
  {
    emoji: "🎬",
    title: "קליפ בת מצווה",
    description: "תמונות ילדות, סרטונים מהבית וקליפ מוקלט באולפן - מתנה דיגיטלית לאירוע.",
    href: "/studio/blessings/bat-mitzvah-clip",
  },
  {
    emoji: "🎁",
    title: "שיר / קליפ במתנה",
    description: "מתנה מקורית שנשמרת כקובץ דיגיטלי.",
    href: "/studio/blessings/video-clip",
  },
  {
    emoji: "💐",
    title: "ברכות לאירועים מיוחדים",
    description: "חינה, ברית, שבע ברכות, כל אירוע שחשוב לכם.",
  },
  {
    emoji: "🎂",
    title: "ברכות לימי הולדת",
    description: "יום הולדת עגול, פרישה או אירוע משמעותי.",
    href: "/studio/recording-song-modiin",
  },
] as const;

export const BLESSING_BENEFITS: readonly BlessingBenefit[] = [
  {
    emoji: "👨‍🏫",
    title: "ליווי וסבלנות",
    description:
      "מפיק מקצועי מלווה אתכם לאורך ההקלטה, עזרה בהגייה, בקצב ובאינטונציה.",
  },
  {
    emoji: "✏️",
    title: "עריכה מקצועית",
    description:
      "ניקוי רעשי רקע, חיבור משפטים, איזון ווליום ותיקונים. תיקון זיופים בתוספת, לא במחיר הבסיס.",
  },
  {
    emoji: "🎵",
    title: "מוזיקת רקע",
    description:
      /* החלטות 5.10.2026 (ברכות): מוזיקת הרקע כלולה */
      "נעימה שמתאימה לסוג הברכה. כלולה במחיר.",
  },
  {
    emoji: "🎤",
    title: "איכות סאונד מקצועית",
    description:
      "מיקרופונים מקצועיים ומערכות עריכה מתקדמות, הקול נשמע ברור ומאוזן, לא כמו הקלטה מהטלפון.",
  },
] as const;

export const BLESSING_WORKFLOW_OPTIONS: readonly BlessingWorkflowOption[] = [
  {
    id: "studio",
    title: "אופציה 1, הקלטה באולפן במודיעין",
    paragraphs: [
      "אתם מגיעים לאולפן בזמן שנוח לכם ומקליטים את הברכה עם ליווי מקצועי מלא.",
    ],
    bullets: [
      "ליווי והדרכה בזמן ההקלטה, בלי הגבלת זמן",
      "הפסקות וטייקים כמה שצריך",
      "עריכה, ניקוי ותיקונים",
      "מוזיקת רקע",
      BLESSING_TEXT_POLISH_NOTE,
      "קובץ מוכן להשמעה באירוע",
    ],
    note: "בלי הגבלת זמן באולפן. מסירה: 24-48 שעות.",
  },
  {
    id: "home",
    title: "אופציה 2, הקלטה מהבית (סמארטפון)",
    paragraphs: [
      "לא יכולים להגיע לאולפן? אין בעיה, שולחים אפליקציית הקלטה והנחיות פשוטות.",
      "אתם מקליטים בזמן שלכם ושולחים בוואטסאפ, ויקיר מתקן ומסדר: עריכה, ניקוי ומוזיקת רקע. אותו מחיר כמו באולפן.",
      `${BLESSING_REMOTE_TRADEOFF_NOTE}.`,
    ],
    note: "זמן אספקה: 24-48 שעות אחרי ששלחתם את ההקלטה.",
  },
] as const;

export const BLESSING_POST_PRODUCTION_STEPS: readonly BlessingsProcessStep[] = [
  { step: "01", title: "ליטוש דיבור", description: "ליטוש טעויות דיבור קלות, בהסכמתכם." },
  { step: "02", title: "הכוונה לשונית", description: "הגייה, דקדוק וקצב טבעי לאורך הברכה." },
  { step: "03", title: "ניקוי רעשים", description: "הסרת רעשי רקע, נשימות חזקות ורחשים מהחדר." },
  { step: "04", title: "איזון ווליום", description: "קובץ מאוזן ומוכן להשמעה במערכת ההגברה באירוע." },
  { step: "05", title: "מוזיקת רקע", description: "מוזיקת רקע שמתאימה לברכה, כלולה במחיר." },
  { step: "06", title: "תיקון זיופים", description: "אפשר להוסיף תיקון זיופים - בתוספת, לא במחיר הבסיס." },
];
