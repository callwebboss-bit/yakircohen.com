import type { ProcessStep } from "@/components/marketing/ProcessSteps";

export const PHOTO_ENHANCE_PROCESS_STEPS: ProcessStep[] = [
  {
    number: 1,
    title: "שולחים את התמונות",
    description: "דרך וואטסאפ, מייל או Google Drive — סרוקות, מהטלפון או קבצים ישנים.",
  },
  {
    number: 2,
    title: "עיבוד AI",
    description: "הגדלת רזולוציה, חדות, שיפור צבעים וניקוי רעשים — הכל אוטומטי ומהיר.",
  },
  {
    number: 3,
    title: "בדיקה ותיקון ידני",
    description: "בודקים כל תמונה — לא רק מעלים ושוכחים. מתקנים ידנית בפוטושופ אם צריך.",
  },
  {
    number: 4,
    title: "מקבלים תמונות משודרגות",
    description: "קובץ JPG/PNG באיכות גבוהה, מוכן להדפסה או שימוש דיגיטלי. אם לא מרוצים — נתקן.",
  },
];

export const PHOTO_ENHANCE_AI_FEATURES: readonly string[] = [
  "הגדלת רזולוציה (upscaling) - מגדיל את התמונה פי 2-4 מבלי לאבד איכות",
  "תיקון חדות - הופך תמונה מטושטשת לחדה",
  "שיפור צבעים - מחזיר חיים לתמונות דהויות",
  'הסרת רעשים (grain/noise) - מנקה את ה"גרעיניות" של תמונות ישנות',
  "שיחזור פרטים - ה-AI ממציא פרטים שחסרו",
  "תיקון תאורה - מאזן חשיפה ובהירות",
] as const;

export const PHOTO_ENHANCE_STEPS: readonly { step: string; body: string }[] = [
  {
    step: "שלב 1: שולחים את התמונות",
    body: "דרך וואטסאפ, מייל או Google Drive - סרוקות, מהטלפון או קבצים ישנים.",
  },
  {
    step: "שלב 2: מעלים למערכת ה-AI",
    body: "התמונות נכנסות לעיבוד מקצועי.",
  },
  {
    step: "שלב 3: ה-AI מעבד ומשדרג",
    body: "הגדלה, חדות, צבעים וניקוי.",
  },
  {
    step: "שלב 4: בדיקה (ותיקון ידני אם צריך)",
    body: "אנחנו בודקים כל תוצאה - לא רק מעלים ושוכחים.",
  },
  {
    step: "שלב 5: מקבלים תמונות משודרגות",
    body: "איכות גבוהה. אם משהו לא מתאים - נתקן.",
  },
] as const;

export const PHOTO_ENHANCE_PACKAGES: readonly {
  count: string;
  price: string;
  perImage: string;
  premium?: boolean;
}[] = [
  { count: "תמונה בודדת", price: "50", perImage: "50 ₪ לתמונה" },
  { count: "5 תמונות", price: "200", perImage: "40 ₪ לתמונה" },
  { count: "10 תמונות", price: "350", perImage: "35 ₪ לתמונה", premium: true },
  { count: "20 תמונות", price: "600", perImage: "30 ₪ לתמונה" },
] as const;

export const PHOTO_ENHANCE_ADDONS: readonly string[] = [
  "תיקון צבע ידני (אם ה-AI לא מספיק) - 50 ₪ נוספים",
  "הסרת שריטות או כתמים - 50 ₪ נוספים",
  "שיחזור חלקים חסרים - לפי בקשה",
  "צביעת שחור-לבן (colorization) - שירות נפרד, 100 ₪ לתמונה",
] as const;

export const PHOTO_ENHANCE_COMPARE: readonly {
  title: string;
  regular: string;
  ai: string;
}[] = [
  {
    title: "הגדלת תמונה",
    regular: "נהיית מטושטשת",
    ai: "נשארת חדה",
  },
  {
    title: "פרטים",
    regular: "חדות מלאכותית",
    ai: 'ה-AI "ממציא" פרטים בצורה טבעית',
  },
  {
    title: "צבעים",
    regular: "ידני, לוקח זמן",
    ai: "אוטומטי, מדויק, מהיר",
  },
] as const;

export const PHOTO_ENHANCE_WHY_US: readonly string[] = [
  'לא סתם "מעלים לאתר AI" - בודקים כל תמונה ומתקנים ידנית בפוטושופ אם צריך',
  "20 שנות ניסיון בעבודה על תמונות ווידאו",
  "מחירים הוגנים - 50 ₪ לתמונה, הרבה פחות מעיצוב גרפי מלא",
  "מהירים - בדרך כלל יום עבודה אחד",
  "לא מרוצים? נתקן עד שתהיו מרוצים",
] as const;
