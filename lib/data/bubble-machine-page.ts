export type BubbleProductType = {
  emoji: string;
  title: string;
  description: string;
};

export type BubbleProcessStep = {
  step: string;
  title: string;
  description: string;
};

export type BubbleConcern = {
  concern: string;
  solution: string;
};

export type BubblePackageItem = {
  label: string;
};

export const BUBBLE_HIGHLIGHTS: readonly { emoji: string; title: string; text: string }[] = [
  {
    emoji: "🛡️",
    title: "חומר נגד החלקה",
    text: "פתרון מושלם לסלואו, ריקוד ראשון או רחבה חלקה  -  בטיחות כחובה.",
  },
  {
    emoji: "✨",
    title: "בועות לאירועים",
    text: "האטרקציה שהופכת כל תמונה לחלום  -  קסם, אווירה וזוהר.",
  },
  {
    emoji: "💕",
    title: "תזמון מושלם",
    text: "שליטה אלחוטית שמתמזגת עם מוזיקה ותאורה  -  שירות לכל הארץ.",
  },
] as const;

export const BUBBLE_PRODUCT_TYPES: readonly BubbleProductType[] = [
  {
    emoji: "🌫️",
    title: "בועות סבון עשן",
    description: "בועות זוהרות מלאות עשן מסתורי  -  מושלם לסלואו וכניסות.",
  },
  {
    emoji: "🌈",
    title: "בועות LED",
    description: "עמוד/אפקט מבועות סבון מואר  -  Premium LED Event Solutions.",
  },
  {
    emoji: "🎈",
    title: "השכרה או רכישה",
    description: "מכונות מקצועיות להפעלה באירוע או לספקים שרוצים ציוד קבוע.",
  },
] as const;

export const BUBBLE_PROCESS_STEPS: readonly BubbleProcessStep[] = [
  {
    step: "01",
    title: "תכנון מוקדם",
    description: "מגדירים יחד את רגעי השיא, גובה זריקות ומספר הפעלות.",
  },
  {
    step: "02",
    title: "הגעה והתקנה",
    description: "הצוות מגיע עם כל הציוד  -  פחות מ-30 דקות להקמה.",
  },
  {
    step: "03",
    title: "הפעלה מקצועית",
    description: "מפעיל מיומן, סנכרון מלא עם DJ וצלמים.",
  },
  {
    step: "04",
    title: "פירוק וניקיון",
    description: "סיום נקי ומהיר  -  בלי לכלוך או סימנים.",
  },
] as const;

export const BUBBLE_ORDER_STEPS: readonly BubbleProcessStep[] = [
  {
    step: "01",
    title: "זמינות והצעת מחיר",
    description: "בודקים תאריך  -  חוזרים עם הצעה מפורטת.",
  },
  {
    step: "02",
    title: "תיאום תוכן",
    description: "לוגו, שמות החוגגים, תזמון ושילוב בתוכנית.",
  },
  {
    step: "03",
    title: "יום האירוע",
    description:
      "הגעה 2–3 שעות לפני, התקנה, מפעיל צמוד ופירוק בסוף.",
  },
] as const;

export const BUBBLE_PACKAGE_INCLUDES: readonly BubblePackageItem[] = [
  { label: "מכונת ותותח בועות סבון מקצועיים" },
  { label: "מפעיל צמוד לאורך זמן האפקט" },
  { label: "נוזלים איכותיים, היפואלרגניים ובטוחים" },
  { label: "שליטה בעוצמה, כיוון וזמן הפעלה" },
  { label: "הובלה, התקנה ופירוק" },
  { label: "אחריות מלאה על הציוד והתפעול" },
] as const;

export const BUBBLE_CONCERNS: readonly BubbleConcern[] = [
  { concern: "כאוס ולכלוך", solution: "פליטה מבוקרת  -  בועות נעלמות ללא שאריות" },
  { concern: "בטיחות ילדים", solution: "תמיסה לא רעילה, בטוחה למגע" },
  { concern: "חשמל", solution: "12V  -  גמישות במיקום ההפעלה" },
  { concern: "התקנה", solution: "פשוטה עם הדרכה וטכנאי בשטח" },
  { concern: "עלות", solution: "מחירון שקוף  -  הכל כלול, בלי הפתעות" },
  { concern: "רעש", solution: "פעולה שקטה שלא מפריעה לאירוע" },
  { concern: "ציוד אחר", solution: "לא משאיר סימנים על ריהוט או אלקטרוניקה" },
  { concern: "זמינות", solution: "הזמנה מראש  -  מומלץ 2 חודשים לפני בעונת שיא" },
  { concern: "ניידות", solution: "עיצוב קומפקטי לכל סצנה" },
  { concern: "שביעות רצון", solution: "1,800+ אירועים · 280+ המלצות" },
] as const;

export const BUBBLE_WHY_US: readonly string[] = [
  "גמישות ושירות אישי  -  גובה זריקות ותזמון מותאמים",
  "תמיכה טכנית  -  הגעה מוקדמת, בדיקות וטכנאי אופציונלי",
  "שקיפות  -  מחיר ברור, הכל כלול, בלי עלויות נסתרות",
  "20 שנות ניסיון  -  פתרון תקלות בזמן אמת",
] as const;
