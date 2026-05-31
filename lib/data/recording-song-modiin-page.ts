export type RecordingSongProcessStep = {
  step: string;
  title: string;
  paragraphs: readonly string[];
};

export type RecordingSongEquipmentItem = {
  emoji: string;
  title: string;
  description: string;
};

export type RecordingSongExampleVideo = {
  videoId: string;
  title: string;
};

export const RECORDING_SONG_PROCESS_STEPS: readonly RecordingSongProcessStep[] = [
  {
    step: "01",
    title: "שיחת אפיון",
    paragraphs: [
      "פגישה קצרה (או שיחת וידאו) כדי להבין את הכיוון שאתם רוצים  -  איזה שיר, איזה סגנון ומה המטרה.",
      "אנחנו עוזרים לכם לגבש את הרעיון ולבנות תוכנית ברורה.",
    ],
  },
  {
    step: "02",
    title: "הכנת הפלייבק",
    paragraphs: [
      "אם יש לכם מוזיקת רקע מוכנה  -  מעולה. אם לא  -  אנחנו יוצרים עבורכם פלייבק מקצועי (עיבוד מוזיקלי מלא), לפני שאתם מגיעים לאולפן.",
    ],
  },
  {
    step: "03",
    title: "הקלטה באולפן",
    paragraphs: [
      "אתם נכנסים לתא ההקלטה עם מיקרופון Shure SM7B, SphereL22 (אותם מיקרופונים שמשתמשים בהם אמנים מובילים).",
      "אנחנו מדריכים אתכם בזמן אמת  -  הגייה, אינטונציה, קצב  -  כך שכל שורה תישמע בדיוק כמו שחלמתם.",
    ],
  },
  {
    step: "04",
    title: "עריכה ומיקס",
    paragraphs: [
      "אחרי ההקלטה אנחנו מתקנים זיופים (בטכנולוגיית AI שתומכת בקול הטבעי שלכם), מנקים רעשי רקע, מאזנים את הווליום ומוסיפים עומק לסאונד.",
      "התוצאה? שיר שנשמע כמו ברדיו.",
    ],
  },
  {
    step: "05",
    title: "אספקה מהירה",
    paragraphs: [
      "תוך 24-48 שעות תקבלו את השיר המוגמר ישירות לוואטסאפ או למייל  -  בפורמט WAV (איכות מקסימלית) ו-MP3 (להשמעה במכשירים).",
    ],
  },
] as const;

export const RECORDING_SONG_EQUIPMENT: readonly RecordingSongEquipmentItem[] = [
  {
    emoji: "🎚️",
    title: "מיקס ומאסטרינג ברמה בינלאומית",
    description:
      "התוצאה הסופית נשמעת מושלמת בכל מערכת שמע  -  רכב, סמארטפון או אולם אירועים.",
  },
  {
    emoji: "💻",
    title: "עיבוד דיגיטלי מתקדם",
    description:
      "שימוש ב-AI לתיקון זיופים, ניקוי רעשים ושיפור הסאונד.",
  },
  {
    emoji: "🔊",
    title: "אקוסטיקה מושלמת",
    description:
      "חדר צף מבודד עם טיפול אקוסטי מלא  -  אפס רעשי רקע.",
  },
  {
    emoji: "🎤",
    title: "מיקרופונים מקצועיים",
    description:
      "Shure SM7B / EV RE20 / SphereL22  -  אותם מיקרופונים שמשתמשים בהם בתחנות הרדיו המובילות.",
  },
] as const;

/** Featured + gallery examples for /studio/recording-song-modiin */
export const RECORDING_SONG_EXAMPLE_VIDEOS: readonly RecordingSongExampleVideo[] = [
  { videoId: "8i4K2f5gQfM", title: "הקלטת שיר לחתונה" },
  { videoId: "qdCbNrDF15k", title: "שיר מתנה לאמא" },
  { videoId: "WMvdVNw3tIU", title: "הקלטת שיר יומולדת באולפן" },
  { videoId: "c55HTqTArFo", title: "יום חוויה באולפן  -  מתנה ליום הולדת" },
  { videoId: "2apMsrmEsDs", title: "שיר כניסה לחופה" },
  { videoId: "wfTY8Bz2uE4", title: "הקלטת ברכות באולפן" },
  { videoId: "r8Xk2_m9FJ8", title: "הקלטת שיר לאירוע" },
  {
    videoId: "VntWmw5Su6c",
    title: "הפקת רוק כבד  -  שיר מקורי ליום הולדת",
  },
  { videoId: "1ilgnokOS7Q", title: "קליפ לחתונה - חברים" },
  { videoId: "Fsy4Eg00dCA", title: "שיר לבר מצווה + תיקון זיופים" },
] as const;

export const RECORDING_SONG_FEATURED_VIDEO_ID = "8i4K2f5gQfM";

export type RecordingSongTestimonial = {
  quote: string;
  author: string;
  role: string;
};

export type RecordingSongEventPillar = {
  id: string;
  emoji: string;
  title: string;
  description: string;
  tag: string;
};

export const RECORDING_SONG_TESTIMONIALS: readonly RecordingSongTestimonial[] =
  [
    {
      quote:
        "באנו עם הבן לבר מצווה שלו בלי שום ניסיון. יקיר הוציא ממנו קול שלא ידענו שיש לו. השיר הגיע למסיבת הבר מצווה ובכינו מאושר.",
      author: "רונית א.",
      role: "אמא לבר מצווה, מודיעין עילית",
    },
    {
      quote:
        "הזמנתי שיר לחתונה של אחי כהפתעה. עבדו איתי בסבלנות אינסופית, והשיר הביא את כל האורחים לבכות מרגש.",
      author: "דנה ל.",
      role: "מכבים",
    },
    {
      quote:
        "עשינו כניסה לחופה עם שיר שהקלטנו יחד. יקיר לא נתן לנו לוותר עד שזה נשמע מדהים. חוויה שנזכור כל החיים.",
      author: "ערן ונעמה ש.",
      role: "חתן וכלה, רעות",
    },
  ] as const;

export const RECORDING_SONG_EVENT_PILLARS: readonly RecordingSongEventPillar[] =
  [
    {
      id: "bar-mitzvah",
      emoji: "🎤",
      title: "בר ובת מצווה",
      description:
        "שיר מותאם אישית לאירוע, עם מילות שיר ממשפחה ומחברים. רגע שישאר בזיכרון לכל החיים.",
      tag: "",
    },
    {
      id: "wedding",
      emoji: "💍",
      title: "חתונה",
      description:
        "שיר הפתעה לכלה מהחתן, שיר קבוצתי מחברים, או שיר שיישמע בנאום. גם בלי ניסיון שירה.",
      tag: "",
    },
    {
      id: "chupa",
      emoji: "🕊️",
      title: "כניסה לחופה",
      description:
        "קטע עצמאי לכניסה לחופה — בקולכם, עם עיבוד שיתאים לאווירה. רגע שהאורחים לא ישכחו.",
      tag: "",
    },
  ] as const;
