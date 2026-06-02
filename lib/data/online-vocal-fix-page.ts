import type { ProcessStep } from "@/components/marketing/ProcessSteps";

export const VOCAL_FIX_PROCESS_STEPS: ProcessStep[] = [
  {
    number: 1,
    title: "שולחים את הקובץ",
    description: "דרך וואטסאפ, מייל או קישור — בכל פורמט, כולל הקלטות ביתיות.",
  },
  {
    number: 2,
    title: "סקיצה חינם (אופציונלי)",
    description: "שולחים קטע 30 שניות ומקבלים לפני/אחרי ללא עלות — כדי לראות את הפוטנציאל.",
  },
  {
    number: 3,
    title: "אנחנו עושים את הקסם",
    description: "הצוות המקצועי מעבד את הסאונד — ניקוי, חידוד, איזון והעשרה.",
  },
  {
    number: 4,
    title: "מקבלים קובץ משופר",
    description: "קובץ חדש באיכות גבוהה, מוכן לשימוש, תוך 1–3 ימי עסקים.",
  },
];

export const VOCAL_FIX_PROCESSING: readonly {
  icon: string;
  title: string;
  body: string;
}[] = [
  {
    icon: "📊",
    title: "בקרת עוצמה",
    body: "איזון עוצמת הדיבור לרמה אחידה, סטנדרטי לשידור והפצה.",
  },
  {
    icon: "❤️",
    title: "העשרת הקול",
    body: "שימוש ב-EQ ואפקטים כדי להוסיף נפח, חום ועומק - הקול נשמע מלא יותר.",
  },
  {
    icon: "🎯",
    title: "חידוד והבלטת הקול",
    body: "הדיבור שלכם הופך להיות ברור, חד ומובן.",
  },
  {
    icon: "🧹",
    title: "הסרת רעשים מתוחכמת",
    body: "ניקוי רעשי רקע (מזגן, מחשב, רחוב, הד בחדר) באמצעות כלים מקצועיים.",
  },
] as const;

export const VOCAL_FIX_AUDIENCE: readonly string[] = [
  "יוצרי וידאו (YouTube, Instagram, TikTok)",
  "יוצרי פודקאסטים",
  "מפתחי קורסים דיגיטליים",
  "מרצים ומורים",
  "יזמים ובעלי עסקים",
  "כל מי שמעלה תוכן מבוסס דיבור לרשת",
] as const;

export const VOCAL_FIX_STEPS: readonly { step: string; body: string }[] = [
  {
    step: "שלב 1: שולחים את הקובץ",
    body: "דרך וואטסאפ, מייל או קישור.",
  },
  {
    step: "שלב 2: (אופציונלי) סקיצה חינם",
    body: 'שולחים קטע קצר (30 שניות) ומקבלים "לפני ואחרי" ללא עלות - כדי לראות אם זה שווה לכם.',
  },
  {
    step: "שלב 3: אנחנו עושים את הקסם",
    body: "הצוות המקצועי מעבד את הסאונד.",
  },
  {
    step: "שלב 4: מקבלים קובץ משופר",
    body: "קובץ חדש באיכות גבוהה, מוכן לשימוש.",
  },
] as const;

export const VOCAL_FIX_PRICE_INCLUDED: readonly string[] = [
  "עיבוד מקצועי לקובץ אחד",
  "עד 5 דקות של חומר",
  "הסרת רעשים + חידוד + העשרה",
  "אספקה תוך 1-3 ימי עסקים",
  "קובץ MP3/WAV איכותי",
] as const;
