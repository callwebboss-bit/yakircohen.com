export const MOBILE_PODCAST_HERO_FEATURES: readonly string[] = [
  "האולפן מגיע אליכם  -  בית, משרד או אירוע",
  "ציוד הקלטה מקצועי + ליווי של מהנדס סאונד מקצועי - יקיר כהן",
  "תוצאה ברמת ספוטיפיי  -  בלי לצאת מהבית",
  "עריכה אופציונלית במקום או אחרי ההקלטה",
  "הגעה לכל הארץ  -  מודיעין, מרכז, ירושלים ועוד",
  "אפשרות לשלב צילום וידאו",
] as const;

export const MOBILE_PODCAST_WORKFLOW: readonly {
  emoji: string;
  title: string;
  body: string;
}[] = [
  {
    emoji: "📞",
    title: "יצירת קשר",
    body: "מתקשרים או משאירים פרטים  -  נחזור עם כל הפרטים.",
  },
  {
    emoji: "📅",
    title: "תיאום מועד",
    body: "קובעים תאריך ושעה נוחים לכם.",
  },
  {
    emoji: "🚐",
    title: "הגעת הצוות",
    body: "מגיעים עם כל הציוד הנדרש  -  אתם רק מכינים את התוכן.",
  },
  {
    emoji: "🎙️",
    title: "הקלטה",
    body: "מבצעים את ההקלטה בליווי מהנדס סאונד מקצועי - יקיר כהן.",
  },
  {
    emoji: "🎧",
    title: "עריכה (אופציונלי)",
    body: "שולחים קבצים לעריכה או מעבדים במקום  -  לפי מה שנוח.",
  },
  {
    emoji: "📦",
    title: "קבלת תוצר סופי",
    body: "פודקאסט מוכן במייל, וואטסאפ או USB.",
  },
] as const;

export const MOBILE_PODCAST_AUDIENCES: readonly {
  emoji: string;
  title: string;
  description: string;
  link?: { href: string; label: string };
}[] = [
  {
    emoji: "🏢",
    title: "עסקים וחברות",
    description:
      "פודקאסט ארגוני, הכשרות, תוכן שיווקי או ראיונות עם מנהלים  -  ישירות במשרד.",
  },
  {
    emoji: "🎓",
    title: "מוסדות חינוך",
    description:
      "פודקאסטים חינוכיים עם תלמידים, מורים או הורים  -  בלי הסעות למקום אחר.",
    link: {
      href: "/podcast/podcast-with-grandpa",
      label: "למידע על פודקאסט עם סבא",
    },
  },
  {
    emoji: "👨‍👩‍👧‍👦",
    title: "משפחות ואירועים",
    description:
      "ברכה מיוחדת או פודקאסט משפחתי  -  מגיעים לאולם או לבית עם הציוד.",
  },
  {
    emoji: "🎙️",
    title: "יוצרי תוכן עצמאיים",
    description:
      "מגישים, עיתונאים ובלוגרים  -  הקלטה בבית עם ליווי מקצועי.",
    link: {
      href: "/podcast/podcast-editing",
      label: "לשירותי עריכת פודקאסט",
    },
  },
  {
    emoji: "🏠",
    title: "אנשים פרטיים",
    description: "שיר, ברכה או פודקאסט אישי  -  בלי לצאת מהבית.",
    link: {
      href: "/studio/recording-song-modiin",
      label: "להקלטת שירים וברכות",
    },
  },
] as const;

export const MOBILE_PODCAST_FAQS: readonly {
  id: string;
  question: string;
  answer: string;
}[] = [
  {
    id: "range",
    question: "מה טווח ההגעה של השירות הנייד?",
    answer:
      "מגיעים לכל הארץ  -  מודיעין, ירושלים, תל אביב, השרון, השפלה ועוד. מחיר ההגעה משתנה לפי מרחק.",
  },
  {
    id: "quality",
    question: "האם איכות ההקלטה הניידת זהה לאולפן?",
    answer:
      "ציוד נייד מקצועי ברמה גבוהה. אולפן קבוע מבודד אקוסטית בצורה מושלמת  -  אבל יודעים לנטרל רעשים ולהפיק תוצאה מקצועית גם בנייד.",
  },
  {
    id: "prep",
    question: "האם צריך להכין משהו מראש?",
    answer:
      "מומלץ תסריט או נקודות לשיחה. מבחינת ציוד  -  אנחנו מביאים הכל. רק תבואו מוכנים לתוכן.",
  },
  {
    id: "video",
    question: "האם ניתן לשלב צילום וידאו?",
    answer:
      "בהחלט. צילום והפקת קליפים בהקלטה ניידת, כולל עריכת סרטונים קצרים לרשתות.",
  },
  {
    id: "noise",
    question: "מה קורה אם יש רעשי רקע בבית?",
    answer:
      "ציוד לנטרול רעשים + מציאת הנקודה השקטה ביותר. במידת הצורך  -  ניקוי בעריכה.",
  },
] as const;

export const MOBILE_PODCAST_RELATED_LINKS: readonly {
  emoji: string;
  label: string;
  href: string;
}[] = [
  { emoji: "🎧", label: "עריכת פודקאסט מלאה", href: "/podcast/podcast-editing" },
  { emoji: "🎬", label: "הפקת קליפים", href: "/studio/blessings/video-clip" },
  { emoji: "📱", label: "עריכת סרטונים קצרים", href: "/business/social-media" },
  { emoji: "🏠", label: "ייעוץ בניית אולפן ביתי", href: "/academy/home-studio" },
  {
    emoji: "🎙️",
    label: "השכרת סטודיו במודיעין",
    href: "/podcast/podcast-studio-modiin",
  },
  { emoji: "🎤", label: "הקלטת שירים וברכות", href: "/studio/recording-song-modiin" },
  { emoji: "📦", label: "הזמנה ומחירון", href: "/book" },
] as const;
