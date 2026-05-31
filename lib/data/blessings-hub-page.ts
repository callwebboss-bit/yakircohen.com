export type BlessingTypeCard = {
  emoji: string;
  title: string;
  description: string;
  href?: string;
};

export type BlessingBenefit = {
  emoji: string;
  title: string;
  description: string;
};

export type BlessingWorkflowOption = {
  id: string;
  title: string;
  paragraphs: readonly string[];
  bullets?: readonly string[];
  note?: string;
};

export const BLESSINGS_HUB_FEATURED_VIDEO_ID = "wfTY8Bz2uE4";

export const BLESSING_TYPE_CARDS: readonly BlessingTypeCard[] = [
  {
    emoji: "📜",
    title: "הקלטת דרשה",
    description: "דרשה מרגשת שמוקלטת בשקט, בלי לחץ של קהל.",
    href: "/studio/blessings/bar-mitzvah",
  },
  {
    emoji: "🕎",
    title: "ברכה לבר/בת מצווה",
    description: "ברכת הכהנים, דרשה או ברכה אישית לבר/בת המצווה.",
    href: "/studio/blessings/bar-mitzvah",
  },
  {
    emoji: "💍",
    title: "ברכת כלה וחתן",
    description: "ברכה מרגשת לזוג  -  מההורים, מהחברים או מהמשפחה.",
    href: "/studio/blessings/bride-groom-blessing",
  },
  {
    emoji: "🏠",
    title: "הקלטה מהבית (סמארטפון)",
    description:
      "לא יכולים להגיע לאולפן? שולחים אפליקציה והנחיות  -  ואתם מקליטים בנוחות.",
    href: "#home-recording",
  },
  {
    emoji: "🎬",
    title: "קליפ בת מצווה",
    description: "תמונות ילדות, סרטונים מהבית וקליפ מוקלט באולפן - מתנה מרגשת.",
    href: "/studio/blessings/bat-mitzvah-clip",
  },
  {
    emoji: "🎁",
    title: "שיר / קליפ במתנה",
    description: "מתנה מקורית ומרגשת שתישאר לכל החיים.",
    href: "/studio/blessings/video-clip",
  },
  {
    emoji: "💐",
    title: "ברכות לאירועים מיוחדים",
    description: "חינה, ברית, שבע ברכות  -  כל אירוע שחשוב לכם.",
  },
  {
    emoji: "🎂",
    title: "ברכות לימי הולדת",
    description: "יום הולדת עגול, פרישה או אירוע משמעותי.",
    href: "/studio/recording-song-modiin",
  },
] as const;

export const BLESSING_BENEFITS: readonly BlessingBenefit[] = [
  {
    emoji: "👨‍🏫",
    title: "ליווי וסבלנות",
    description:
      "מפיק מקצועי מלווה אתכם לאורך ההקלטה  -  עזרה בהגייה, בקצב ובאינטונציה, כדי שתרגישו בטוחים.",
  },
  {
    emoji: "✏️",
    title: "עריכה מקצועית",
    description:
      "תיקון זיופים, ניקוי רעשי רקע וחיבור משפטים  -  כך שהברכה תישמע רציפה ומדויקת.",
  },
  {
    emoji: "🎵",
    title: "מוזיקת רקע מרגשת",
    description:
      "נעימה עדינה שמתאימה לאווירה ומחברת בצורה חלקה לשיר הבא באירוע.",
  },
  {
    emoji: "🎤",
    title: "איכות סאונד מושלמת",
    description:
      "מיקרופונים מקצועיים ומערכות עריכה מתקדמות  -  הקול נשמע מלא, חם וברור, לא כמו הקלטה מהטלפון.",
  },
] as const;

export const BLESSING_WORKFLOW_OPTIONS: readonly BlessingWorkflowOption[] = [
  {
    id: "studio",
    title: "אופציה 1  -  הקלטה באולפן במודיעין",
    paragraphs: [
      "אתם מגיעים לאולפן בזמן שנוח לכם ומקליטים את הברכה עם ליווי מקצועי מלא.",
    ],
    bullets: [
      "ליווי והדרכה בזמן ההקלטה",
      "תיקון טקסט (אם צריך)",
      "שילוב מוזיקת רקע מרגשת",
      "עריכה מקצועית",
      "מיקס סופי מוכן להשמעה באירוע",
    ],
    note: "זמן הגעה: 30-60 דקות (תלוי באורך הברכה). מסירה: עד 24 שעות.",
  },
  {
    id: "home",
    title: "אופציה 2  -  הקלטה מהבית (סמארטפון)",
    paragraphs: [
      "לא יכולים להגיע לאולפן? אין בעיה  -  שולחים אפליקציית הקלטה והנחיות פשוטות.",
      "אתם מקליטים בזמן שלכם, בסביבה הכי נוחה. אנחנו עורכים, מוסיפים מוזיקה ומכינים קובץ מוכן לאירוע.",
    ],
    note: "זמן אספקה: 24-48 שעות אחרי ששלחתם את ההקלטה.",
  },
] as const;

export const BLESSING_POST_PRODUCTION_STEPS: readonly string[] = [
  "ליטוש טקסט  -  מקצרים, מחדדים ומשפרים ניסוח (בהסכמתכם)",
  "הכוונה לשונית  -  הגייה, דקדוק וקצב טבעי",
  "תיקון זיופים  -  AI שמתקן טעויות קטנות ושומר על הטבעיות",
  "ניקוי רעשים  -  נשימות חזקות ורעשי רקע",
  "מוזיקת רקע  -  נעימה שמתאימה לאופי הברכה ולאירוע",
  "מיקס סופי  -  קול מאוזן, ווליום מדויק, מוכן למערכת הגברה",
] as const;
