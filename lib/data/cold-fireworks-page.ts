export type ColdFireworksUseCase = {
  emoji: string;
  title: string;
  description: string;
};

export type ColdFireworksBenefit = {
  title: string;
  description: string;
};

export type ColdFireworksExampleVideo = {
  videoId: string;
  title: string;
};

export const COLD_FIREWORKS_FEATURED_VIDEO_ID = "FMZY-Ck0clo";

export const COLD_FIREWORKS_EXAMPLE_VIDEOS: readonly ColdFireworksExampleVideo[] = [
  { videoId: "PRHjvcsZqLU", title: "זיקוקים קרים בכניסה לאירוע" },
] as const;

export const COLD_FIREWORKS_HIGHLIGHTS: readonly { emoji: string; title: string; text: string }[] = [
  {
    emoji: "📸",
    title: "תיעוד מקצועי",
    text: "אידיאלי לצילום סטילס ווידאו  -  רגע שכולם יצלמו.",
  },
  {
    emoji: "⏱️",
    title: "תזמון מושלם",
    text: "שליטה אלחוטית שמתמזגת עם מוזיקה ותאורה.",
  },
  {
    emoji: "🛡️",
    title: "בטיחות ללא פשרות",
    text: "ללא אש, ללא עשן וללא גלאי עשן  -  מאושרים באולמות.",
  },
] as const;

export const COLD_FIREWORKS_USE_CASES: readonly ColdFireworksUseCase[] = [
  {
    emoji: "💍",
    title: "חתונות  -  כניסה וחופה",
    description:
      "כניסה דרמטית עם זיקוקים משני הצדדים, או אפקט חתימה עם ניצוצות זהובות  -  מצטלם מושלם.",
  },
  {
    emoji: "🎂",
    title: "בר / בת מצווה",
    description:
      "ריקוד השולחן עם זיקוקים משני הצדדים  -  הילדים מרגישים כמו כוכבים.",
  },
  {
    emoji: "🏢",
    title: "אירועים דתיים",
    description:
      "אש קרה מותרת  -  אין להבות, אין עשן, רק אווירה חגיגית ובטוחה.",
  },
  {
    emoji: "🎭",
    title: "אירועים פרטיים",
    description:
      "בית, גינה או במה  -  הפקה בינלאומית לשיא מסיבה או פינאלה.",
  },
] as const;

export const COLD_FIREWORKS_BENEFITS: readonly ColdFireworksBenefit[] = [
  {
    title: "בטוחים לשימוש",
    description: "ילדים ומבוגרים  -  ללא חשש, טמפרטורה נמוכה (~40°).",
  },
  {
    title: "ידידותיים לסביבה",
    description: "לא פולטים חומרים רעילים או מזהמים.",
  },
  {
    title: "איכותיים ועמידים",
    description: "חומרים איכותיים  -  עומדים בתנאי מזג אוויר שונים.",
  },
  {
    title: "אלחוטיים ומותאמים",
    description: "גובה עד 4-5 מטרים, משך הפעלה לפי דרישה, 4 מכונות בחבילה.",
  },
] as const;

export const COLD_FIREWORKS_WHY_US: readonly string[] = [
  "גמישות ושירות אישי  -  גובה ותזמון מותאמים",
  "תמיכה טכנית  -  הגעה מוקדמת, בדיקות וטכנאי אופציונלי",
  "שקיפות  -  מחיר ברור, הכל כלול, בלי הפתעות",
  "20 שנות ניסיון · 1,800+ אירועים · 280+ המלצות",
] as const;
