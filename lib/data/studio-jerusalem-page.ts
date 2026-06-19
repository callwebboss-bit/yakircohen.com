export type JerusalemServiceLink = {
  emoji: string;
  title: string;
  description: string;
  href: string;
};

export type JerusalemProcessStep = {
  step: string;
  title: string;
};

export const JERUSALEM_WHY_US: readonly string[] = [
  "ליווי אישי גם בלי ניסיון  -  מוציאים את הטוב ביותר מכל אחד",
  "סאונד מקצועי  -  ציוד מהשורה הראשונה ותוצאה רדיופונית",
  "נגישות מירושלים  -  כ-30 דק׳ ממרכז ירושלים, חניה בשפע",
  "תוצר גמיש  -  מייל, וואטסאפ או USB אישי",
  "אופציה לקליפ משפחתי או מצגת תמונות",
  "מתאים לקהל הדתי  -  יחס מכבד ותוכן כשר",
] as const;

export const JERUSALEM_PROCESS: readonly JerusalemProcessStep[] = [
  { step: "1", title: "קובעים תאריך" },
  { step: "2", title: "מגיעים לאולפן  -  תדריך והכנה" },
  { step: "3", title: "הקלטה מודרכת באווירה נוחה" },
  { step: "4", title: "עריכה, מיקס ושליחה ישירות אליכם" },
] as const;

export const JERUSALEM_POPULAR_SERVICES: readonly JerusalemServiceLink[] = [
  {
    emoji: "🎵",
    title: "הקלטת שירים וברכות",
    description: "מתנה מוקלטת להורים, לסבים או לחברים.",
    href: "/studio/blessings",
  },
  {
    emoji: "💍",
    title: "שיר כניסה לחופה",
    description: "להיכנס לחופה עם שיר שכתבתם או הקלטתם במיוחד.",
    href: "/studio/recording-song-modiin",
  },
  {
    emoji: "📜",
    title: "דרשה לבר/בת מצווה",
    description: "הכנה, הקלטה נקייה ורקע מוזיקלי עדין.",
    href: "/studio/blessings/bar-mitzvah",
  },
  {
    emoji: "🎁",
    title: "שיר במתנה",
    description: "מתנה מקורית  -  שיר או קליפ מוקלט.",
    href: "/studio/blessings/video-clip",
  },
] as const;
