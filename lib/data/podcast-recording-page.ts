import {
  PODCAST_HOW_TO_RECORD_FAQ,
  PODCAST_RECORDING_PRICE_FAQ,
  PODCAST_STUDIO_MODIIN_PRICE_FAQ,
} from "./faq-aeo";
import { TIME_CLAIMS } from "@/lib/data/conversion-copy";
import { formatPagePrice } from "@/lib/data/pricing-display";
import { podcastParticipantPriceLine } from "@/lib/data/podcast-calculator";
import {
  getExVat,
  getPriceById,
  PODCAST_EXTRA_EDIT_NOTE,
  PODCAST_FULL_PRODUCTION_REELS_NOTE,
  PODCAST_EXTRA_EDIT_TIME,
  PODCAST_VIDEO_CAMERAS_NOTE,
  PODCAST_VIDEO_INCLUDES_NOTE,
  STUDIO_TURNS_NOTE,
} from "@/lib/data/pricing-catalog";

export const PODCAST_RECORDING_PRICE = getExVat("full_podcast_production");
export const PODCAST_RECORDING_PRICE_NOTE = "לפרק מלא - כולל צילום, הקלטה ועריכה";

/*
 * שלוש החבילות בעמוד (החלטת הבעלים 7.10.2026: טבלה קצרה של שלוש החבילות).
 * אודיו: מהמילים של הבעלים, מהודק. וידאו והפקה מלאה: הנוסח מ-D63 בקטלוג (מקור אחד),
 * עם "3 מצלמות, ולפעמים 2" לפי הכרעת הבעלים. המחירים נמשכים מהקטלוג ולא נכתבים כסכום.
 */
export const PODCAST_RECORDING_PACKAGES: readonly {
  id: "audio" | "video" | "full";
  title: string;
  exVat: number;
  suitedFor?: string;
  summary: string;
  points: readonly string[];
}[] = [
  {
    id: "audio",
    title: "אודיו",
    exVat: getExVat("podcast_audio"),
    suitedFor: getPriceById("podcast_audio")?.suitedFor,
    summary:
      "בלי צילום. הקלטת אודיו ברמה גבוהה, ועריכה שמובילה את הקטע לסאונד החם והמדויק שחיפשתם.",
    points: [
      "מקליטים גם מחוץ לאולפן, בטקסים והרצאות (ההגעה בתוספת)",
      "בדרך כלל כדאי להקליט גם וידאו, אבל זה לבחירתכם",
    ],
  },
  {
    id: "video",
    title: "וידאו",
    exVat: getExVat("podcast_video"),
    suitedFor: getPriceById("podcast_video")?.suitedFor,
    summary: `${PODCAST_VIDEO_INCLUDES_NOTE}.`,
    points: [
      "מפיק מלווה בזמן אמת",
      `עריכה נוספת (ניקוי גמגומים, שיעולים ושתיקות): בתוספת, ${formatPagePrice(getExVat("podcast_editing_hour"), { from: true }).inline}, או כלולה בהפקה המלאה`,
      `קטעי ריל: בתוספת, או ${PODCAST_FULL_PRODUCTION_REELS_NOTE} כלולים בהפקה המלאה`,
    ],
  },
  {
    id: "full",
    title: "הפקה מלאה",
    exVat: getExVat("full_podcast_production"),
    suitedFor: getPriceById("full_podcast_production")?.suitedFor,
    /* 11.10.2026: בעמוד הזה כשורות נפרדות ולא כמשפט אחד של 30 מילים. התוכן הוא
       PODCAST_FULL_PRODUCTION_NOTE (וידאו + עריכה נוספת + רילס), שנשאר בקטלוג כמו שהוא */
    summary: "כל מה שבחבילת הווידאו, ובנוסף עריכה נוספת, ייעוץ ורילס.",
    /* הבעלים, 8.10.2026: הפקה מלאה כוללת ייעוץ ועריכה מהודקת וקפדנית יותר, כלולים ב-2,500 */
    points: [
      PODCAST_EXTRA_EDIT_NOTE,
      "ייעוץ ועריכה מהודקת וקפדנית יותר",
      "מעברי תמונה, וכל מה שמעלה את הפרק לרמה פרימיום",
      /* החלטת הבעלים 11.10.2026: היה "קטעי ריל: בתוספת" */
      PODCAST_FULL_PRODUCTION_REELS_NOTE,
    ],
  },
] as const;

/*
 * "המספרים המלאים" מתחת לחבילות (11.10.2026, תשובות הבעלים לשאלות העובדה).
 * כל שורה מהקטלוג או מקבוע קיים, בלי סכום שנכתב ביד.
 */
export const PODCAST_RECORDING_FACTS: readonly { label: string; value: string }[] = [
  { label: "משתתפים", value: `${podcastParticipantPriceLine("page")}. ${STUDIO_TURNS_NOTE}` },
  { label: "זמן באולפן", value: "עד שעה, וגמישות של כמה דקות" },
  {
    label: "תיקונים",
    value: `סבב אחד כלול. כל סבב נוסף ${formatPagePrice(getExVat("podcast_extra_revision")).inline}`,
  },
  { label: "עריכה נוספת", value: `${PODCAST_EXTRA_EDIT_TIME}. בתוספת בווידאו, כלולה בהפקה המלאה` },
  { label: "ביקור לפני", value: "בלי עלות, למי שכבר סגר הקלטה" },
] as const;

/*
 * שיפורי הסאונד שעוברים על כל הפקה שיוצאת מהאולפן, בכל חבילה (הבעלים, 8.10.2026).
 * השמות של הבעלים. שורת ההסבר קצרה וטכנית בלבד ועדיין לאישורו.
 * "ריכוך צלילים צורמים" הוא אפשרות ולא ברירת מחדל, כפי שהבעלים כתב.
 */
export type PodcastQualityIconId = "deesser" | "eq" | "diction" | "balance" | "soften";

export const PODCAST_PRODUCTION_QUALITY: readonly {
  id: PodcastQualityIconId;
  title: string;
  note: string;
}[] = [
  { id: "deesser", title: "די-אסר", note: "מרככים צלילי S חדים בדיבור" },
  { id: "eq", title: "שיפור EQ", note: "מאזנים את תדרי הקול" },
  { id: "diction", title: "שיפור דיקציה", note: "הדיבור נשמע ברור יותר" },
  { id: "balance", title: "איזון מושלם", note: "איזון עוצמות בין כל הדוברים, ובינם לבין המוזיקה אם יש" },
  { id: "soften", title: "ריכוך צלילים צורמים", note: "אפשרות, לפי הצורך בפרק" },
] as const;

/* שורה על האולפן מעל גלריית התמונות, מהמילים של הבעלים (7.10.2026). */
export const PODCAST_RECORDING_STUDIO_FEEL =
  "מי שנכנס מרגיש את זה מיד: האווירה, התאורה, הריח, איך שהמקום נראה ואיך הוא נשמע, וכל מה שקורה בו. חלומי.";

/* החלטת הבעלים D63, 7.10.2026 (D43, D44): 3 מצלמות כמו בפודקאסט וידאו (היה
   "2-3"), הפרק המלא בסוף ההקלטה, ועוד עריכה נוספת תוך 24 עד 48 שעות */
export const PODCAST_RECORDING_HERO_FEATURES: readonly string[] = [
  `צילום 4K ב-${PODCAST_VIDEO_CAMERAS_NOTE}`,
  "סאונד אולפני נקי, Shure, Rode",
  "רקע ועיצוב שמשתנים לפי מה שתרצו",
  `עריכה מקצועית נוספת ${PODCAST_EXTRA_EDIT_TIME}`,
  TIME_CLAIMS.podcastSameSecond,
  "מוכן להעלאה לספוטיפיי ויוטיוב",
] as const;

export const PODCAST_RECORDING_AUDIENCES: readonly {
  emoji: string;
  title: string;
  description: string;
}[] = [
  {
    emoji: "💼",
    title: "בעלי עסקים",
    description: "פודקאסט מקצועי בלי להתעסק בטכניקה.",
  },
  {
    emoji: "💡",
    title: "מומחים ויועצים",
    description: "לחלוק ידע בלי להיות טכנאים.",
  },
  {
    emoji: "🎥",
    title: "יוצרי תוכן",
    description: "מתמקדים בתוכן, לא בעריכה ובציוד.",
  },
  {
    emoji: "🏢",
    title: "חברות",
    description: "פודקאסט תדמית או שיווק, ברמה גבוהה.",
  },
] as const;

export const PODCAST_RECORDING_STUDIO_SPACES: readonly {
  title: string;
  description: string;
}[] = [
  { title: "החלל האורבני", description: "מודרני ונעים, קירות חשופים, אווירה אורבנית." },
  { title: "החלל הירוק", description: "רענן ומרגיע, צמחייה טבעית. זה החלל הסטנדרטי." },
  { title: "החלל הרשמי", description: "מקצועי ויוקרתי, עיצוב אלגנטי, תחושת פרימיום." },
] as const;

export const PODCAST_RECORDING_INCLUDED: readonly {
  emoji: string;
  title: string;
  items: readonly string[];
}[] = [
  {
    emoji: "🗓️",
    title: "סשן צילום והקלטה (עד שעה)",
    items: [
      "בחירת חלל מתוך 3 אפשרויות",
      "זמן להתארגן לפני הצילום, בלי לחץ",
    ],
  },
  {
    emoji: "🎥",
    /* הבעלים 11.10.2026: עובדה במקום "ברמה הגבוהה ביותר" ו-"Framing מושלם".
       החיתוך החי: החלטת הבעלים 3.10.2026 (lib/data/conversion-copy.ts) */
    title: "צילום וידאו ב-4K",
    items: [
      `צילום 4K ב-${PODCAST_VIDEO_CAMERAS_NOTE}, זוויות מגוונות, מראה דינמי`,
      "תאורת סטודיו מקצועית",
      "חיתוך חי בין המצלמות לפי מי שמדבר",
    ],
  },
  {
    emoji: "🎙️",
    title: "הקלטת סאונד אולפנית",
    items: [
      "מיקרופונים דינמיים Shure, Rode, Audio-Technica",
      "הקלטה ישירה למערכת אולפן, סאונד נקי",
      "אוזניות לכל משתתף",
      "טלפרומפטר (אם צריך)",
    ],
  },
  {
    emoji: "✂️",
    title: "עריכה מקצועית מלאה",
    items: [
      "חיתוך וסידור, הסרת טעויות והפסקות",
      "סנכרון אודיו ווידאו",
      "מעברים דינמיים בין מצלמות",
      "תיקוני צבע בסיסיים",
      "פתיח וסגיר, שלכם או מהמאגר",
      "עריכת סאונד ונורמליזציה",
    ],
  },
  {
    emoji: "📤",
    title: "קבצים סופיים מוכנים להפצה",
    items: [
      "וידאו MP4, 1080p או 4K (לפי בקשה) ליוטיוב",
      "אודיו MP3 מנורמל, ספוטיפיי, Apple Podcasts ועוד",
      `העריכה הנוספת אצלכם ${PODCAST_EXTRA_EDIT_TIME}`,
    ],
  },
] as const;

export const PODCAST_RECORDING_WORKFLOW: readonly {
  step: string;
  title: string;
  body: string;
}[] = [
  {
    step: "1",
    title: "תיאום ותכנון",
    body: "יוצרים קשר, מתאמים תאריך, בוחרים חלל ומדברים על התוכן.",
  },
  {
    step: "2",
    title: "הגעה לאולפן במודיעין",
    body: "מגיעים במועד, חניה בשפע, ומתארגנים בנוחות.",
  },
  {
    step: "3",
    title: "הקלטה וצילום",
    body: "עד שעה, אתם מדברים, אנחנו דואגים לכל השאר.",
  },
  {
    step: "4",
    title: "אנחנו עורכים",
    body: "הפרק המלא כבר אצלכם, ואנחנו עוברים על כל החומר בעריכה נוספת.",
  },
  {
    step: "5",
    title: "פרק מוכן",
    /* הבעלים 11.10.2026: ההבטחה "באותה שנייה" נשארת ב-3 מקומות בעמוד (שורת הפתיחה, כרטיסי החבילות, FAQ) */
    body: `MP4 ליוטיוב ו-MP3 לספוטיפיי. ${PODCAST_EXTRA_EDIT_NOTE}.`,
  },
] as const;

/* הבעלים 11.10.2026: 4 שורות עם עובדה במקום "כמו הפודקאסטים הגדולים" ו"משתלם",
   בלי החזרות "באותה שנייה" ו"מגיעים, מדברים". המיקרופונים: PODCAST_RECORDING_INCLUDED,
   המפיק: כרטיס הווידאו */
export const PODCAST_RECORDING_WHY_US: readonly string[] = [
  "חוסכים זמן ואנרגיה, בלי ללמוד, לקנות ציוד או לערוך",
  "נשמע כמו אולפן, כי זה אולפן: Shure, Rode ו-Audio-Technica",
  "מפיק לידכם בזמן ההקלטה, לא רק עורך אחריה",
  "בלי לקנות מיקרופונים, מצלמות ותאורה",
] as const;

export const PODCAST_RECORDING_FAQS: readonly {
  id: string;
  question: string;
  answer: string;
}[] = [
  PODCAST_HOW_TO_RECORD_FAQ,
  PODCAST_RECORDING_PRICE_FAQ,
  {
    id: "duration",
    question: "שעה מספיקה?",
    /* הבעלים 11.10.2026: "יותר קרוב ל-45-60" (היה 30-60), וגמישות של כמה דקות בלי מספר */
    answer:
      "בדרך כלל שעה מייצרת 45-60 דקות תוכן ערוך, תלוי בקצב הדיבור. אם עוברים בכמה דקות, זה בסדר.",
  },
  {
    id: "guests",
    question: "אפשר להביא אורחים?",
    /* קיבולת האולפן, החלטת הבעלים D64, 7.10.2026. מחיר משתתף נוסף מהקטלוג (הבעלים 11.10.2026) */
    answer: `בהחלט. יש מיקרופון ייעודי ואוזניות לכל משתתף. ${podcastParticipantPriceLine("page")}. ${STUDIO_TURNS_NOTE}.`,
  },
  {
    id: "revisions",
    question: "מה אם צריכים תיקונים?",
    /* הבעלים 11.10.2026: סבב נוסף 100 + מע״מ (podcast_extra_revision), היה "בתוספת סמלית" */
    answer: `סבב תיקונים אחד כלול. כל סבב נוסף ${formatPagePrice(getExVat("podcast_extra_revision")).inline}.`,
  },
  {
    id: "visit",
    question: "אפשר לראות את הסטודיו לפני?",
    /* הבעלים 11.10.2026: הביקור בלי עלות, רק למי שכבר סגר */
    answer: "כן, למי שכבר סגר הקלטה, ובלי עלות.",
  },
  {
    id: "camera-shy",
    question: "מה אם לא מרגישים בנוח מול מצלמה?",
    answer: "זה נורמלי. כיוון, תמיכה וטלפרומפטר, עוזרים להרגיש בנוח.",
  },
] as const;
