import {
  PODCAST_EDITING_PER_HOUR_NIS,
  STUDIO_HALF_HOUR_NIS,
  STUDIO_ONE_HOUR_NIS,
} from "@/lib/data/pricing";

export type PricingFaqItem = {
  id: string;
  question: string;
  /** טקסט לסכימת FAQ (ללא HTML) */
  answerPlain: string;
};

export const PRICING_FAQ_ITEMS: readonly PricingFaqItem[] = [
  {
    id: "studio-hour-price",
    question: "כמה עולה שעת הקלטה באולפן?",
    answerPlain: `חצי שעה באולפן עולה ${STUDIO_HALF_HOUR_NIS.toLocaleString("he-IL")} ₪ לפני מע״מ, ושעה מלאה עולה ${STUDIO_ONE_HOUR_NIS.toLocaleString("he-IL")} ₪ לפני מע״מ. כל המחירים כוללים ליווי טכני מלא. פרטים: /studio/pricing`,
  },
  {
    id: "podcast-recording-price",
    question: "כמה עולה הקלטת פודקאסט?",
    answerPlain:
      "פודקאסט אודיו מ-950 ₪ לפרק (הקלטה + עריכה + מסירה לספוטיפיי). פודקאסט וידאו מ-1,650 ₪. חבילות תוכן מלאות עם רילז מ-2,800 ₪. פרטים: /podcast",
  },
  {
    id: "podcast-editing-price",
    question: "כמה עולה עריכת פודקאסט?",
    answerPlain: `עריכת פודקאסט עולה ${PODCAST_EDITING_PER_HOUR_NIS.toLocaleString("he-IL")} ₪ לשעת חומר גולמי, לפני מע״מ. כולל ניקוי רעשים, סנכרון וכתוביות. פרטים: /podcast/podcast-editing`,
  },
  {
    id: "vat-included",
    question: "האם המחירים כוללים מע״מ?",
    answerPlain:
      'לא – כל המחירים המוצגים הם לפני מע״מ (+18%). ליד כל שורה מוצג גם המחיר כולל מע״מ, ובטופס ההזמנה המקוונת נראה המחיר הסופי עם מע״מ.',
  },
  {
    id: "how-to-book",
    question: "איך מזמינים שירות?",
    answerPlain:
      "דרך טופס ההזמנה המקוונת בכתובת /book – בוחרים שירות, רואים מחיר סופי, מאשרים תאריך. ניתן גם לפנות בוואטסאפ.",
  },
  {
    id: "packages",
    question: "האם יש חבילות מוכנות?",
    answerPlain:
      "כן – חבילות מוכנות לאולפן, פודקאסט וחתונות בעמוד /packages. כולל מחיר שקוף לפני ואחרי מע״מ.",
  },
] as const;
