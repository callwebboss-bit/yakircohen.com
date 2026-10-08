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
  /** טקסט תומך מתחת לכותרת (אופציונלי) */
  description?: string;
};

export const RECORDING_SONG_PROCESS_STEPS: readonly RecordingSongProcessStep[] = [
  {
    step: "01",
    title: "שיחת אפיון",
    paragraphs: [
      "שיחה קצרה: איזה שיר, איזה סגנון, מה המטרה.",
    ],
  },
  {
    step: "02",
    title: "הכנת הפלייבק",
    paragraphs: [
      "פלייבק מוכן או עיבוד מוזיקלי מלא לפני ההגעה לאולפן.",
    ],
  },
  {
    step: "03",
    title: "הקלטה באולפן",
    paragraphs: [
      "הקלטה עם Shure SM7B / SphereL22 בסשן של שעה.",
    ],
  },
  {
    step: "04",
    title: "מיקס ומאסטר",
    paragraphs: [
      "ניקוי רקע, מיקס ומאסטר. תיקון זיופים רק אם הוספתם אותו.",
    ],
  },
  {
    step: "05",
    title: "השיר אצלכם",
    paragraphs: [
      "בסוף הסשן השיר המוכן כבר אצלכם.",
    ],
  },
] as const;

export const RECORDING_SONG_EQUIPMENT: readonly RecordingSongEquipmentItem[] = [
  {
    emoji: "🎚️",
    title: "מיקס ומאסטרינג ברמה בינלאומית",
    description:
      "התוצאה הסופית נשמעת מדויקת בכל מערכת שמע, רכב, סמארטפון או אולם אירועים.",
  },
  {
    emoji: "💻",
    title: "עיבוד דיגיטלי מתקדם",
    description:
      "ניקוי רעשים ושיפור הסאונד. תיקון זיופים זמין כתוספת.",
  },
  {
    emoji: "🔊",
    title: "אקוסטיקה מדויקת",
    description:
      "חדר צף מבודד עם טיפול אקוסטי מלא, אפס רעשי רקע.",
  },
  {
    emoji: "🎤",
    title: "מיקרופונים מקצועיים",
    description:
      "Shure SM7B / EV RE20 / SphereL22, אותם מיקרופונים שמשתמשים בהם בתחנות הרדיו המובילות.",
  },
] as const;

/** Featured + gallery examples for /studio/recording-song-modiin */
export const RECORDING_SONG_EXAMPLE_VIDEOS: readonly RecordingSongExampleVideo[] = [
  { videoId: "QRMxKVUOOl0", title: "הקלטה אמיתית באולפן - דוגמת קליפ מהסשן" },
  { videoId: "8i4K2f5gQfM", title: "הקלטת שיר לחתונה" },
  {
    videoId: "LKg3pwdon_M",
    title: "קליפ מתננה - שיר מתנה לחברה עם הקדשה אישית",
  },
  { videoId: "qdCbNrDF15k", title: "שיר מתנה לאמא" },
  { videoId: "WMvdVNw3tIU", title: "הקלטת שיר יומולדת באולפן" },
  { videoId: "c55HTqTArFo", title: "יום חוויה באולפן, מתנה ליום הולדת" },
  { videoId: "2apMsrmEsDs", title: "שיר כניסה לחופה" },
  { videoId: "wfTY8Bz2uE4", title: "הקלטת ברכות באולפן" },
  { videoId: "r8Xk2_m9FJ8", title: "הקלטת שיר לאירוע" },
  {
    videoId: "VntWmw5Su6c",
    title: "הפקת רוק כבד, שיר מקורי ליום הולדת",
  },
  { videoId: "1ilgnokOS7Q", title: "קליפ לחתונה - חברים" },
  { videoId: "Fsy4Eg00dCA", title: "שיר לבר מצווה + תיקון זיופים" },
] as const;

export const RECORDING_SONG_FEATURED_VIDEO_ID = "8i4K2f5gQfM";

export type RecordingSongEventPillar = {
  id: string;
  emoji: string;
  title: string;
  description: string;
  tag: string;
};

/*
 * החלטת הבעלים 8.10.2026, בדיקת ההמלצות: RECORDING_SONG_TESTIMONIALS הוסר.
 * לשלוש ההמלצות (רונית א., דנה ל., ערן ונעמה ש.) לא נמצא מקור ציבורי, ואף
 * אחת לא תואמת לביקורות Google. בעמוד מוצג במקומן דירוג Google עם קישור.
 */

export const RECORDING_SONG_EVENT_PILLARS: readonly RecordingSongEventPillar[] =
  [
    {
      id: "bar-mitzvah",
      emoji: "🎤",
      title: "בר ובת מצווה",
      description:
        "שיר מותאם אישית לאירוע, עם מילות שיר ממשפחה ומחברים. רגע שנשמר כקובץ לאורך זמן.",
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
        "קטע עצמאי לכניסה לחופה - בקולכם, עם עיבוד שיתאים לאווירה. רגע שנשמר בתיעוד האירוע.",
      tag: "",
    },
  ] as const;
