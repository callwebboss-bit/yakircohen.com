export type BlessingsProcessStep = {
  step: string;
  title: string;
  description: string;
};

export type BlessingsWhyCard = {
  emoji: string;
  title: string;
  description: string;
};

export const BAR_MITZVAH_WHY: readonly BlessingsWhyCard[] = [
  {
    emoji: "🎤",
    title: "בלי לחץ של קהל",
    description:
      "מקליטים בשקט, חוזרים על משפטים, מתרגלים עד שהביצוע מדויק - בלי מבטים מהאולם.",
  },
  {
    emoji: "✏️",
    title: "עזרה בניסוח",
    description:
      "מלווים בכתיבה ובעריכת הטקס - ברכה אישית, מכובדת ומתאימה לגיל ולסגנון המשפחה.",
  },
  {
    emoji: "🎵",
    title: "עריכה + מוזיקה",
    description:
      "תיקון זיופים, ניקוי רעשים ומוזיקת רקע - הברכה נשמעת רציפה ומקצועית.",
  },
  {
    emoji: "🎬",
    title: "אפשרות לקליפ",
    description:
      "רוצים גם וידאו? אפשר לשלב הקלטת שיר וקליפ - מתנה דיגיטלית שנשמרת.",
  },
] as const;

export const BAR_MITZVAH_PROCESS: readonly BlessingsProcessStep[] = [
  {
    step: "01",
    title: "שיחת תיאום",
    description: "סוג ברכה, אורך, סגנון ותאריך יעד - בוואטסאפ או בטלפון.",
  },
  {
    step: "02",
    title: "הקלטה באולפן",
    description: "חדר שקת, מיקרופון מקצועי וליווי - עד שמרגישים בנוח.",
  },
  {
    step: "03",
    title: "עריכה ומיקס",
    description: "תיקון, מוזיקת רקע ואיזון - הברכה מוכנה להשמעה.",
  },
  {
    step: "04",
    title: "מסירה",
    description: "קובץ מוכן לטקס, למסיבה או לשיתוף עם המשפחה.",
  },
] as const;

export const BRIDE_GROOM_WHY: readonly BlessingsWhyCard[] = [
  {
    emoji: "💍",
    title: "רגע אינטימי",
    description:
      "הקלטה פרטית באולפן - בלי מבטים, בלי לחץ. ניתן לחזור ולתרגל.",
  },
  {
    emoji: "👨‍👩‍👧",
    title: "מחבר בין דורות",
    description:
      "ברכה מההורים, מהסבים או מהחברים - שמכבדת את הזוג ונשמרת.",
  },
  {
    emoji: "🎧",
    title: "הבדל ששומעים",
    description:
      "עריכה מקצועית, מוזיקת רקע ומיקס - לא הקלטה ביתית, אלא מוצר מלוטש.",
  },
  {
    emoji: "⏱️",
    title: "מסירה לפני החתונה",
    description:
      "מתאמים לוח זמנים שמבטיח שהברכה מוכנה לפני יום האירוע.",
  },
] as const;

export const BRIDE_GROOM_PROCESS: readonly BlessingsProcessStep[] = [
  {
    step: "01",
    title: "כתיבה ותיאום",
    description: "עוזרים לנסח, מגדירים טון ואורך - לפני שמגיעים לאולפן.",
  },
  {
    step: "02",
    title: "הקלטה שקטה",
    description: "סביבה אינטימית, takes מרובים, ליווי עד שהתוצאה מדויקת.",
  },
  {
    step: "03",
    title: "עריכה ומוזיקה",
    description: "מיקס, מוזיקת רקע ותיקונים - הברכה נשמעת ברמה מקצועית.",
  },
  {
    step: "04",
    title: "מסירה לחתונה",
    description: "קובץ מוכן להשמעה בחופה, באירוע או לשליחה לזוג.",
  },
] as const;

export const VIDEO_CLIP_WHY: readonly BlessingsWhyCard[] = [
  {
    emoji: "🎬",
    title: "הכל במקום אחד",
    description:
      "הקלטה, צילום ועריכה באותו אולפן - בלי לרוץ בין ספקים שונים.",
  },
  {
    emoji: "🎤",
    title: "סאונד אולפן",
    description:
      "ווקאל מקצועי, תיקון זיופים ומיקס - הקליפ נשמע כמו שצריך.",
  },
  {
    emoji: "📱",
    title: "מוכן לרשתות",
    description:
      "פורמטים מותאמים לוואטסאפ, אינסטagram ולהצגה באירוע.",
  },
  {
    emoji: "🎁",
    title: "מתנה ייחודית",
    description:
      "שיר + קליפ - מתנה שמשפחות וחברים שומרים לאורך זמן.",
  },
] as const;

export const VIDEO_CLIP_PROCESS: readonly BlessingsProcessStep[] = [
  {
    step: "01",
    title: "תכנון",
    description: "בוחרים שיר, סגנון ויזואלי ותאריך - יום אחד מרוכז.",
  },
  {
    step: "02",
    title: "הקלטה + צילום",
    description: "ווקאל באולפן, צילום מול רקע נקי ותאורה מקצועית.",
  },
  {
    step: "03",
    title: "עריכה",
    description: "סאונד + וידאו - קליפ אחד מלוטש.",
  },
  {
    step: "04",
    title: "מסירה",
    description: "קובץ מוכן לשיתוף, לאירוע או כשובר מתנה.",
  },
] as const;
