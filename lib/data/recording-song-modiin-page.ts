import type { TestimonialItem } from "@/components/marketing/Testimonials";

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
      "הקלטה עם Shure SM7B / SphereL22 + הנחיה בזמן אמת.",
    ],
  },
  {
    step: "04",
    title: "עריכה ומיקס",
    paragraphs: [
      "תיקון זיופים, ניקוי רקע, מיקס - תוצאה ברמת רדיו.",
    ],
  },
  {
    step: "05",
    title: "אספקה מהירה",
    paragraphs: [
      "תוך 24-48 שעות: WAV + MP3 לוואטסאפ או מייל.",
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
      "שימוש ב-AI לתיקון זיופים, ניקוי רעשים ושיפור הסאונד.",
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

export const RECORDING_SONG_TESTIMONIALS: readonly TestimonialItem[] = [
  {
    id: "recording-song-1",
    quote:
      "הקלטת בר מצווה ללא ניסיון קודם - 3 שעות אולפן, עריכה ומיקס כלולים. קובץ מוכן יומיים לפני האירוע.",
    name: "רונית א.",
    role: "אמא לבר מצווה, מודיעין עילית",
    initials: "רא",
    datePublished: "2025-09-10",
    serviceCategory: "studio",
    serviceHref: "/studio/blessings/bar-mitzvah",
    serviceLabel: "הקלטה לבר מצווה",
    projectImageSrc:
      "/images/services/studio/blessings/bride-groom-blessing/הקלטה באולפן.webp",
    projectImageAlt: "הקלטת שיר לבר מצווה",
  },
  {
    id: "recording-song-2",
    quote:
      "שיר הפתעה לחתונה - כתיבת מילים, הקלטה, מיקס ו-mastering. 4 גרסאות אורך, מסירה 5 ימים לפני המועד.",
    name: "דנה ל.",
    role: "מכבים",
    initials: "דל",
    datePublished: "2025-12-08",
    serviceCategory: "studio",
    serviceHref: "/studio/recording-song-modiin",
    serviceLabel: "הקלטת שיר לחתונה",
    projectImageSrc:
      "/images/services/studio/recording-song-modiin/אוהד בוזגלו מקליט.webp",
    projectImageAlt: "הקלטת שיר לחתונה",
  },
  {
    id: "recording-song-3",
    quote:
      "שיר כניסה לחופה - הקלטה, עריכה וקובץ מוכן לנגינה. כניסה מוצלחת ללא תקלות טכניות.",
    name: "ערן ונעמה ש.",
    role: "חתן וכלה, רעות",
    initials: "ענ",
    datePublished: "2026-02-01",
    serviceCategory: "studio",
    serviceHref: "/studio/recording-song-modiin",
    serviceLabel: "שיר כניסה לחופה",
    projectImageSrc:
      "/images/services/events/wedding-packages/שירים-לאירועים.webp",
    projectImageAlt: "שיר לכניסה לחופה",
  },
] as const;

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
