import type { ProcessStep } from "@/components/marketing/ProcessSteps";

export const MIXING_PROCESS_STEPS: ProcessStep[] = [
  {
    number: 1,
    title: "שולחים את הקטעים",
    description: "כל ערוץ בקובץ נפרד (WAV/MP3) - דרך Google Drive, WeTransfer או כל שירות העברה.",
  },
  {
    number: 2,
    title: "מיקס ראשוני",
    description: "מאזינים, מאזנים, מעצבים - יוצרים שלד ראשוני ושולחים לאישורכם.",
  },
  {
    number: 3,
    title: "תיקונים ולטוש",
    description: "מתקנים לפי הערות עד שמרוצים (סבב אחד כלול), ואז מבצעים מאסטרינג סופי.",
  },
  {
    number: 4,
    title: "מסירה",
    description: "MP3 לשימוש רגיל + WAV באיכות מקסימלית, מוכן לספוטיפיי, יוטיוב וכל פלטפורמה.",
  },
];

export const MIXING_PROBLEMS: readonly string[] = [
  'סאונד "שטוח": אין עומק, אין מרחב, הכל דחוס',
  "חוסר איזון: השירה נבלעת או בולטת מדי",
  'מלחמות תדרים: הבאס משתלט או שהגבוהים "שורפים"',
  "חוסר עוצמה: השיר חלש לעומת יוטיוב/ספוטיפיי",
] as const;

export const MIXING_INCLUDES: readonly {
  icon: string;
  title: string;
  items: readonly string[];
}[] = [
  {
    icon: "🎚️",
    title: "מיקס מקצועי",
    items: [
      "איזון עוצמות בין כל הכלים",
      "EQ (איזון תדרים) לכל ערוץ",
      "קומפרסור (שליטה בדינמיקה)",
      "ריוורב ודיליי (אפקטים)",
      "אוטומציה (שינויי עוצמה לאורך השיר)",
    ],
  },
  {
    icon: "🎯",
    title: "תיקון פגמים",
    items: [
      "תיקון זיופים קלים (אם יש)",
      "ניקוי רעשים (אם יש)",
      "סנכרון בין הערוצים",
    ],
  },
  {
    icon: "🎨",
    title: "עיצוב סאונד",
    items: [
      'יצירת "צבע" מוזיקלי מותאם לסגנון',
      "הבלטת השירה",
      "עומק וממד לסאונד",
    ],
  },
  {
    icon: "🔊",
    title: "מאסטרינג",
    items: [
      "עוצמה סופית (Loudness)",
      "אקולזציה כללית",
      "הגבלת פסגות (Limiting)",
      "הכנה לספוטיפיי/יוטיוב/CD",
    ],
  },
] as const;

export const MIXING_AUDIENCE: readonly { icon: string; title: string; body: string }[] = [
  {
    icon: "🎁",
    title: "מתנות",
    body: "שיר במתנה - חייב להישמע מושלם.",
  },
  {
    icon: "💿",
    title: "להקות",
    body: "הקלטה במחסן/חדר חזרות - צריך מיקס מקצועי.",
  },
  {
    icon: "🎸",
    title: "מוזיקאים",
    body: "שיר שהקלטתם בעצמכם - צריכים מיקס ומאסטר.",
  },
  {
    icon: "🎤",
    title: "זמרים חובבנים",
    body: "הקלטה בבית - רוצים סאונד אולפני.",
  },
  {
    icon: "📹",
    title: "יוצרי תוכן",
    body: "מוזיקת רקע או שיר משלכם לסרטונים.",
  },
] as const;

export const MIXING_STEPS: readonly { step: string; body: string }[] = [
  {
    step: "שלב 1: שולחים את הקטעים",
    body: "כל ערוץ בקובץ נפרד (WAV/MP3). Google Drive, WeTransfer או קישור.",
  },
  {
    step: "שלב 2: עובדים על המיקס",
    body: "מאזינים, מאזנים, מעצבים - יוצרים שלד ראשוני.",
  },
  {
    step: "שלב 3: דוגמה לאישור",
    body: "גרסה ראשונית - אתם שומעים ומגידים מה לשנות.",
  },
  {
    step: "שלב 4: תיקונים",
    body: "מתקנים לפי הערות עד שמרוצים (סבב אחד כלול).",
  },
  {
    step: "שלב 5: מאסטרינג סופי",
    body: "ליטוש הגרסה והכנה לפרסום.",
  },
  {
    step: "שלב 6: מסירה",
    body: "MP3 לשימוש רגיל + WAV באיכות מקסימלית.",
  },
] as const;

export const MIXING_PRICE_INCLUDED: readonly string[] = [
  "מיקס מלא (עד 16 ערוצים)",
  "מאסטרינג",
  "עד 5 דקות (שיר סטנדרטי)",
  "סבב תיקונים אחד (כלול)",
  "אספקה תוך 5-7 ימי עסקים",
  "קובץ MP3 + WAV",
] as const;

export const MIXING_EXTRAS: readonly string[] = [
  "מעל 16 ערוצים - 100 ₪ נוספים",
  "מעל 5 דקות - 150 ₪ נוספים",
  "תיקון זיופים מלא - 300 ₪",
  "ניקוי רעשים - 200 ₪",
  "סבב תיקונים נוסף - 100 ₪",
] as const;

export const MIXING_WHY_US: readonly string[] = [
  "ניסיון של 20 שנה - מאות שירים בכל הסגנונות",
  "Pro Tools, Waves, UAD - ציוד וכלים מקצועיים",
  "אוזן מוזיקלית - לא רק לחיצה על כפתורים",
  "כל שיר מאושר אישית על ידי יקיר כהן",
  "סבב תיקונים אחד כלול במחיר",
] as const;
