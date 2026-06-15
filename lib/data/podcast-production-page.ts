import { formatNis, STUDIO_HALF_HOUR_NIS } from "@/lib/data/pricing";

export const PODCAST_PRODUCTION_HERO_FEATURES: readonly string[] = [
  "ליווי מא׳ עד ת׳  -  מהרעיון ועד פרסום",
  "אפיון פורמט, תסריט ומיתוג שמע",
  "הפצה ל-Spotify, Apple Podcasts ועוד",
  "אסטרטגיית צמיחה וקידום",
  "שילוב עם הקלטה באולפן או נייד",
  "ליווי אישי לאורך כל המחזור",
] as const;

export const PODCAST_PRODUCTION_PHASES: readonly {
  step: string;
  title: string;
  body: string;
}[] = [
  {
    step: "1",
    title: "אפיון ותכנון",
    body: "מגדירים קהל, פורמט, אורך פרק וזהות תוכן. בונים מבנה פרק ושאלות מנחות.",
  },
  {
    step: "2",
    title: "מיתוג שמע",
    body: "פתיח, סגיר, ג'ינגלים וטון עקבי  -  הפודקאסט נשמע כמו מותג אמיתי.",
  },
  {
    step: "3",
    title: "הקלטה והפקה",
    body: "באולפן במודיעין, הפקה מלאה עם וידאו, או נייד עד הבית  -  לפי מה שנכון לכם.",
  },
  {
    step: "4",
    title: "עריכה והפצה",
    body: "עריכת סאונד, ניקוי רעשים, מיקס  -  והעלאה לספוטיפיי, אפל פודקאסט וקובץ RSS.",
  },
  {
    step: "5",
    title: "צמיחה",
    body: "לוח שידורים, קידום, מדידת ביצועים ושיפור פרק אחר פרק.",
  },
] as const;

export const PODCAST_PRODUCTION_INCLUDES: readonly string[] = [
  "אפיון קונספט וזהות תוכן לקהל היעד",
  "עריכת תסריט ומבנה פרק",
  "בניית מיתוג שמע (פתיח, סגיר, ג'ינגלים)",
  "ליווי בהקלטה  -  באולפן או בשטח",
  "עריכה, מיקס והפצה מקצועית",
  "ייעוץ קידום וצמיחה לטווח ארוך",
] as const;

export const PODCAST_PRODUCTION_COMPARE: readonly {
  title: string;
  description: string;
  href: string;
  cta: string;
}[] = [
  {
    title: "הפקה מלאה  -  פרק אחד",
    description: "צילום + הקלטה + עריכה  -  פרק מוכן תוך 24 שעות. החל מ-2,500 ₪.",
    href: "/podcast/podcast-recording",
    cta: "לעמוד הפקה מלאה",
  },
  {
    title: "פס ייצור לעסקים",
    description: "כבר יש פורמט? מקליטים, שולחים גולמי, מקבלים פרק מוכן וקליפים כל שבוע. החל מ-950 ₪ לפרק.",
    href: "/podcast/bulk-production",
    cta: "לפס ייצור",
  },
  {
    title: "השכרת סטודיו",
    description: "מגיעים להקליט  -  ליווי טכני, בלי התחייבות לליווי ארוך.",
    href: "/podcast/podcast-studio-modiin",
    cta: "להשכרת סטודיו",
  },
  {
    title: "פרק קצר  -  חצי שעה",
    description: `התחלה משתלמת  -  ${formatNis(STUDIO_HALF_HOUR_NIS)} לפרק של עד 30 דקות באולפן.`,
    href: "/podcast",
    cta: "למחירון וחבילות",
  },
] as const;

export const PODCAST_PRODUCTION_FAQS: readonly {
  id: string;
  question: string;
  answer: string;
}[] = [
  {
    id: "vs-recording",
    question: "מה ההבדל בין ליווי מא׳ עד ת׳ להפקת פרק בודד?",
    answer:
      "הפקת פרק בודדת מתמקדת בפרק אחד מוכן. ליווי מא׳ עד ת׳ כולל אסטרטגיה, מיתוג, לוח שידורים והפצה לאורך זמן  -  לעונות שלמות.",
  },
  {
    id: "new",
    question: "מתאים למי שמתחיל עכשיו?",
    answer:
      `בהחלט. מתחילים באפיון, מקליטים פרק ראשון (אפשר בחבילת חצי שעה ב-${formatNis(STUDIO_HALF_HOUR_NIS)}), וממשיכים לפי קצב שנוח.`,
  },
  {
    id: "remote",
    question: "אפשר לעבוד מרחוק?",
    answer:
      "כן. חלק מהליווי בזום/טלפון. ההקלטות  -  באולפן, בהפקה מלאה, או בפודקאסט נייד עד הבית.",
  },
] as const;
