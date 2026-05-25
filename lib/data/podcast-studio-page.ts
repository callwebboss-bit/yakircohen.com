import { STUDIO_MODIIN_WHY_US } from "./podcast-studio-modiin-page";

export const PODCAST_STUDIO_HERO_FEATURES: readonly string[] = [
  "חדר הקלטה שקט עם בידוד אקוסטי",
  "מיקרופונים מקצועיים  -  Shure, Rode",
  "הקלטות סולו, זוגות ופאנלים",
  "ניטור והנחיה בזמן ההקלטה",
  "מודיעין  -  חניה נוחה, נגיש מכל הארץ",
  "אופציה לעריכה והפקה מלאה",
] as const;

export const PODCAST_STUDIO_WHY_US = STUDIO_MODIIN_WHY_US;

export const PODCAST_STUDIO_FAQS: readonly {
  id: string;
  question: string;
  answer: string;
}[] = [
  {
    id: "vs-modiin",
    question: "מה ההבדל בין עמוד זה לעמוד השכרת סטודיו במודיעין?",
    answer:
      "שני העמודים מתארים את אותו אולפן. עמוד השכרת הסטודיו מפורט יותר ל-SEO ולהשכרה  -  כולל חבילות, מחירון ושאלות נפוצות מלאות.",
  },
  {
    id: "duration",
    question: "כמה זמן מקליטים?",
    answer:
      "סשן סטנדרטי עד שעה. אפשר גם פרק קצר (30 דקות) או הארכה בתיאום.",
  },
  {
    id: "guests",
    question: "אפשר עם אורחים?",
    answer: "כן  -  מיקרופונים ואוזניות לכמה משתתפים.",
  },
  {
    id: "edit",
    question: "האם כולל עריכה?",
    answer:
      "השכרת סטודיו היא הקלטה. עריכה מלאה  -  בחבילה נפרדת או בפרק קצר/מלא שכולל עריכה.",
  },
] as const;
