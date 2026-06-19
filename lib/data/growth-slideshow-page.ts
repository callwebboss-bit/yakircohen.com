import { getExVat } from "@/lib/data/pricing-catalog";

export type GrowthSlideshowExampleVideo = {
  videoId: string;
  title: string;
  description?: string;
};

export const GROWTH_EXAMPLE_VIDEOS: readonly GrowthSlideshowExampleVideo[] = [
  {
    videoId: "UbcUXpnAbdk",
    title: "מצגת גדילה - דוגמה מלאה",
    description: "ציר זמן תמונות מילדות עם אפקט גדילה ב-AI",
  },
  {
    videoId: "qtCRD0K60ww",
    title: "קליפ עם תמונות - דוגמה",
    description: "שילוב תמונות וסרטון לאירוע",
  },
] as const;

export const GROWTH_SLIDESHOW_TIERS = [
  {
    id: "growth_slideshow_30" as const,
    photos: 30,
    exVat: getExVat("growth_slideshow_30"),
    note: "מתאים לאירועים אינטימיים",
  },
  {
    id: "growth_slideshow_50" as const,
    photos: 50,
    exVat: getExVat("growth_slideshow_50"),
    note: "הבחירה הפופולרית לבר/בת מצווה",
  },
  {
    id: "growth_slideshow_70" as const,
    photos: 70,
    exVat: getExVat("growth_slideshow_70"),
    note: "סיפור חיים מורחב",
  },
  {
    id: "growth_slideshow_100" as const,
    photos: 100,
    exVat: getExVat("growth_slideshow_100"),
    note: "החבילה המלאה - מילדות ועד היום",
  },
] as const;

export const GROWTH_SLIDESHOW_INCLUDED: readonly string[] = [
  "פתיחה וסגירה מונפשות מקצועיות",
  "אפקט גדילה ב-AI לאורך ציר הזמן",
  "שיפור איכות לתמונות ישנות וסרוקות",
  "מוזיקה, מעברים וטקסטים מותאמים",
  "קובץ Full HD מוכן להקרנה",
] as const;

export const GROWTH_SLIDESHOW_FAQS: readonly {
  id: string;
  question: string;
  answer: string;
}[] = [
  {
    id: "growth-what",
    question: "מה זה מצגת גדילה?",
    answer:
      "מצגת גדילה היא סרטון שמציג ציר זמן של תמונות מילדות ועד היום, עם אפקט AI שמראה את הילד גדל לאט לאט. מתאים לבר/בת מצווה, ימי הולדת, חתונות וכל אירוע משפחתי.",
  },
  {
    id: "growth-photos",
    question: "כמה תמונות צריך?",
    answer:
      "אנחנו מציעים חבילות של 30, 50, 70 או 100 תמונות. ככל שיש יותר תמונות - הסיפור עשיר יותר. נעזור לבחור את החבילה המתאימה לפי החומר שיש לכם.",
  },
  {
    id: "growth-ai",
    question: "איך עובד אפקט הגדילה ב-AI?",
    answer:
      "אנחנו בונים רצף כרונולוגי של תמונות ומשלבים מעברי גדילה חלקים בין שלבי הגיל. התוצאה נראית טבעית וחלקה - לא סתם החלפת תמונות.",
  },
  {
    id: "growth-events",
    question: "לאילו אירועים זה מתאים?",
    answer:
      "לכל גיל ולכל אירוע: בר/בת מצווה, יום הולדת 40/50/60, חתונה, ימי נישואין ופרישה. כל מי שרוצה להראות את הסיפור שלו מהילדות ועד היום.",
  },
  {
    id: "growth-delivery",
    question: "תוך כמה זמן מקבלים את המצגת?",
    answer:
      "בדרך כלל 3-5 ימי עסקים מרגע קבלת כל החומרים. לאירועים דחופים - צרו קשר לבדיקת זמינות אקספרס.",
  },
  {
    id: "growth-included",
    question: "מה כלול בכל החבילות?",
    answer:
      "פתיחה מונפשת, סגירה, שיפור תמונות (כולל AI), מוזיקה, מעברים מקצועיים וקובץ Full HD מוכן להקרנה. סבב תיקונים אחד כלול.",
  },
] as const;
