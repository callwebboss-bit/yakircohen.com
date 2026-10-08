import {
  PODCAST_HOW_TO_RECORD_FAQ,
  PODCAST_RECORDING_PRICE_FAQ,
  PODCAST_STUDIO_MODIIN_PRICE_FAQ,
} from "./faq-aeo";
import { TIME_CLAIMS } from "@/lib/data/conversion-copy";
import {
  getExVat,
  PODCAST_EXTRA_EDIT_NOTE,
  PODCAST_EXTRA_EDIT_TIME,
  PODCAST_FULL_PRODUCTION_NOTE,
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
  summary: string;
  points: readonly string[];
}[] = [
  {
    id: "audio",
    title: "אודיו",
    exVat: getExVat("podcast_audio"),
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
    summary: `${PODCAST_VIDEO_INCLUDES_NOTE}.`,
    points: ["קטעי ריל: בתוספת", "עריכה נוספת: בהפקה המלאה"],
  },
  {
    id: "full",
    title: "הפקה מלאה",
    exVat: getExVat("full_podcast_production"),
    summary: `${PODCAST_FULL_PRODUCTION_NOTE}.`,
    points: ["קטעי ריל: בתוספת"],
  },
] as const;

/* שורה על האולפן מעל גלריית התמונות, מהמילים של הבעלים (7.10.2026). */
export const PODCAST_RECORDING_STUDIO_FEEL =
  "מי שנכנס מרגיש את זה מיד: האווירה, התאורה, הריח, איך שהמקום נראה ואיך הוא נשמע, וכל מה שקורה בו. חלומי.";

/* החלטת הבעלים D63, 7.10.2026 (D43, D44): 3 מצלמות כמו בפודקאסט וידאו (היה
   "2-3"), הפרק המלא בסוף ההקלטה, ועוד עריכה נוספת תוך 24 עד 48 שעות */
export const PODCAST_RECORDING_HERO_FEATURES: readonly string[] = [
  `צילום 4K ב-${PODCAST_VIDEO_CAMERAS_NOTE}`,
  "סאונד אולפני נקי, Shure, Rode",
  "3 חללי הקלטה מעוצבים",
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
    description: "פודקאסט תדמיתי/שיווקי ברמה גבוהה.",
  },
] as const;

export const PODCAST_RECORDING_STUDIO_SPACES: readonly {
  title: string;
  description: string;
}[] = [
  { title: "החלל האורבני", description: "מודרני ונעים, קירות חשופים, אווירה אורבנית." },
  { title: "החלל הירוק / סטנדרטי", description: "רענן ומרגיע, צמחייה טבעית." },
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
    title: "צילום וידאו ברמה הגבוהה ביותר",
    items: [
      `צילום 4K ב-${PODCAST_VIDEO_CAMERAS_NOTE}, זוויות מגוונות, מראה דינמי`,
      "תאורת סטודיו מקצועית",
      "Framing מושלם, כל פריים נראה מקצועי",
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
      "פתיח/סגיר, שלכם או מהמאגר",
      "עריכת סאונד ונורמליזציה",
    ],
  },
  {
    emoji: "📤",
    title: "קבצים סופיים מוכנים להפצה",
    items: [
      "וידאו MP4, 1080p או 4K (לפי בקשה) ליוטיוב",
      "אודיו MP3 מנורמל, ספוטיפיי, Apple Podcasts ועוד",
      "הפרק המלא אצלכם באותה שנייה שמסיימים להקליט",
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
    body: `${TIME_CLAIMS.podcastSameSecond}, מוכן להעלאה. ${PODCAST_EXTRA_EDIT_NOTE}.`,
  },
] as const;

export const PODCAST_RECORDING_WHY_US: readonly string[] = [
  "חוסכים זמן ואנרגיה, בלי ללמוד, לקנות ציוד או לערוך",
  "תוצאה מקצועית, נראה ונשמע כמו הפודקאסטים הגדולים",
  "מהיר, הפרק אצלכם באותה שנייה שמסיימים להקליט",
  "נוח, מגיעים, מדברים, יוצאים",
  "משתלם, פחות מקניית ציוד ועשייה עצמית",
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
    answer:
      "בדרך כלל שעה מייצרת 30-60 דקות תוכן ערוך, תלוי בקצב הדיבור.",
  },
  {
    id: "guests",
    question: "אפשר להביא אורחים?",
    /* קיבולת האולפן, החלטת הבעלים D64, 7.10.2026 */
    answer: `בהחלט. יש מיקרופון ייעודי ואוזניות לכל משתתף. ${STUDIO_TURNS_NOTE}.`,
  },
  {
    id: "revisions",
    question: "מה אם צריכים תיקונים?",
    answer: "סבב תיקונים אחד כלול. תיקונים נוספים בתוספת סמלית.",
  },
  {
    id: "visit",
    question: "אפשר לראות את הסטודיו לפני?",
    answer: "כן, ביקור מקדים ללא עלות.",
  },
  {
    id: "camera-shy",
    question: "מה אם לא מרגישים בנוח מול מצלמה?",
    answer: "זה נורמלי. כיוון, תמיכה וטלפרומפטר, עוזרים להרגיש בנוח.",
  },
] as const;
