import type { RecordingSongExampleVideo } from "@/lib/data/recording-song-modiin-page";

export type ShowcaseVideo = RecordingSongExampleVideo;

export type StudioValueVideo = ShowcaseVideo & {
  /** טקסט SEO/UX מתחת לסרטון */
  description: string;
};

/** /studio - וידאו ראשי + תיק עבודות */
export const STUDIO_HUB_FEATURED: ShowcaseVideo = {
  videoId: "XUr2e5S4JSA",
  title: "תיק עבודות - רון נשר וז'קו אייזנברג",
};

export const STUDIO_HUB_PORTFOLIO_NOTE =
  "תיק עבודות - רון נשר וז'קו אייזנברג (הוקלט ביקיר כהן הפקות)";

/** סדר התצוגה בעמוד /studio: תיק ראשי ואז סרטוני ערך */
export const STUDIO_HUB_SHOWCASE_VIDEOS: readonly StudioValueVideo[] = [
  {
    videoId: STUDIO_HUB_FEATURED.videoId,
    title: STUDIO_HUB_FEATURED.title,
    description: STUDIO_HUB_PORTFOLIO_NOTE,
  },
  {
    videoId: "q18Lu0MvXHo",
    title: "אירוח זמרים - פיצ'ר ושיתוף פעולה",
    description:
      "אפשרות לאירוח זמרים באולפן לפיצ'ר, שיתוף פעולה או הקלטה משותפת - חיבור בין אמנים, חשיפה הדדית ותוכן איכותי שמגיע לקהלים חדשים.",
  },
  {
    videoId: "D3JV9SDY6GY",
    title: "קידום פודקאסט + קליפ AI ושיר מקורי",
    description:
      "אפשרות לקידום פודקאסט, שיתוף והפצת השיר שלכם - כולל קליפ ושירה עם תיקוני AI ושיר מקורי בשעה. (הקלטה באולפן יובל המבולבל - לצחצוח שיניים)",
  },
] as const;

/** סרטוני ערך בלבד (ללא תיק ראשי) */
export const STUDIO_HUB_VALUE_VIDEOS = STUDIO_HUB_SHOWCASE_VIDEOS.slice(1);

export const BAR_MITZVAH_BLESSING_VIDEOS: readonly ShowcaseVideo[] = [
  { videoId: "wfTY8Bz2uE4", title: "ברכות והקלטות לבר/בת מצווה באולפן" },
  { videoId: "sqtbkFSjskk", title: "דרשה וברכה - דוגמה מהאולפן" },
  {
    videoId: "Fsy4Eg00dCA",
    title: "הקלטת שיר לבר מצווה + תיקון זיופים (AI)",
  },
];

export const BRIDE_GROOM_BLESSING_VIDEOS: readonly ShowcaseVideo[] = [
  { videoId: "kLA-XVH3m4E", title: "ברכת חתן וכלה מוקלטת באולפן" },
];

/** /studio/blessings/video-clip */
export const BLESSINGS_VIDEO_CLIP_VIDEOS: readonly ShowcaseVideo[] = [
  { videoId: "1ilgnokOS7Q", title: "קליפ לחתונה - חברים" },
  { videoId: "Fsy4Eg00dCA", title: "שיר לבר מצווה + תיקון זיופים" },
  { videoId: "8i4K2f5gQfM", title: "שיר מתנה מהאולפן" },
  { videoId: "c55HTqTArFo", title: "יום חוויה באולפן - מתנה" },
] as const;

export const VOICEOVER_HUB_VIDEOS: readonly ShowcaseVideo[] = [
  { videoId: "O2RHNRZCmZM", title: "דוגמת קריינות מסחרית" },
  { videoId: "PojVz9erPKY", title: "קריינות לסרטון תדמית" },
];

export const VOICEOVER_SERVICES_VIDEOS: readonly ShowcaseVideo[] = [
  { videoId: "7DEp-gnDTs4", title: "קריינות לפרסומת ומותג" },
  { videoId: "zHkq_5bXptg", title: "הקלטת קריינות באולפן" },
];

export const VOICEOVER_COURSE_VIDEOS: readonly ShowcaseVideo[] = [
  { videoId: "wN4N0QsfDJo", title: "תרגול קריינות מול מיקרופון" },
  { videoId: "oVeIMBTmS_8", title: "קורס קריינות - מהלך באולפן" },
];

export type EquipmentVideoGroup = {
  id: string;
  heading: string;
  videos: readonly ShowcaseVideo[];
};

export const EQUIPMENT_VIDEO_GROUPS: readonly EquipmentVideoGroup[] = [
  {
    id: "dj",
    heading: "ציוד DJ לאירועים",
    videos: [
      { videoId: "nBtKa0JZfL0", title: "מערכת DJ ואירוע חי" },
      { videoId: "9O0d3v1SqMc", title: "הגברה ו-DJ בשטח" },
    ],
  },
  {
    id: "sound",
    heading: "ציוד הגברה מקצועי",
    videos: [
      { videoId: "K1oAL8qg1W0", title: "הגברה לאירוע - דוגמה מהשטח" },
      { videoId: "9O0d3v1SqMc", title: "RCF והקמה באירוע" },
    ],
  },
  {
    id: "studio-podcast",
    heading: "אולפן, פודקאסט ועריכה",
    videos: [
      {
        videoId: "3bpNDppVFzA",
        title: "אולפן והפקה - דוגמה ויזואלית",
      },
    ],
  },
];

export const SINGER_AMPLIFICATION_VIDEOS: readonly ShowcaseVideo[] = [
  { videoId: "9O0d3v1SqMc", title: "הגברה לזמרים - אירוע חי" },
];

export const PHOTOGRAPHY_EVENTS_VIDEOS: readonly ShowcaseVideo[] = [
  { videoId: "kc8Qjo4B-PY", title: "צילום וידאו לאירוע" },
  { videoId: "ZDrWMYzUQHk", title: "רגעים מחתונה ואירוע" },
  { videoId: "cBga7VLWNN0", title: "אווירת אירוע - דוגמה קצרה" },
  { videoId: "xH1Ypsj6J0g", title: "כיסוי וידאו לאירוע עסקי" },
];

export const RECORDING_STUDIO_EXTRA_VIDEOS: readonly ShowcaseVideo[] = [
  {
    videoId: "ne023hwMqH0",
    title: "איך נראה באולפן - הקלטת קבוצה",
  },
];

export const RECORDING_SONG_EXTRA_VIDEOS: readonly ShowcaseVideo[] = [
  { videoId: "1ilgnokOS7Q", title: "קליפ לחתונה - חברים" },
  { videoId: "Fsy4Eg00dCA", title: "שיר לבר מצווה + תיקון זיופים" },
];

/** /studio/recording-song-modiin - דוגמאות מסודרות (עדכון ידני) */
export const RECORDING_SONG_MODIIN_VIDEOS: readonly ShowcaseVideo[] = [
  { videoId: "8i4K2f5gQfM", title: "הקלטת שיר לחתונה" },
  { videoId: "1ilgnokOS7Q", title: "קליפ לחתונה - חברים" },
  { videoId: "Fsy4Eg00dCA", title: "שיר לבר מצווה + תיקון זיופים (AI)" },
  { videoId: "ne023hwMqH0", title: "איך נראה באולפן - הקלטת קבוצה" },
  { videoId: "qdCbNrDF15k", title: "שיר מתנה לאמא" },
  { videoId: "2apMsrmEsDs", title: "שיר כניסה לחופה" },
  { videoId: "wfTY8Bz2uE4", title: "הקלטת ברכות באולפן" },
  { videoId: "WMvdVNw3tIU", title: "הקלטת שיר יומולדת באולפן" },
] as const;

/** /studio/recording-studio */
export const RECORDING_STUDIO_VIDEOS: readonly ShowcaseVideo[] = [
  { videoId: "ne023hwMqH0", title: "הקלטת קבוצה באולפן" },
  { videoId: "UnBc2a3ve9w", title: "סיור באולפן הקלטות" },
  { videoId: "PCmsH0BLcXg", title: "תיקון זיופים - עם ובלי עריכה" },
  { videoId: "KeOlkJ7S_Yw", title: "הפקת קליפ בחוץ" },
  { videoId: "XEiWTmLXK50", title: "קליפ לילדים + הפקה מלאה" },
] as const;

/** /podcast hub + מסלולי פודקאסט - עדכון ידני */
export const PODCAST_SHOWCASE_VIDEOS: readonly ShowcaseVideo[] = [
  {
    videoId: "q1Omi-3L3QM",
    title: "פודקאסט מהאולפן - דוגמה מלאה",
  },
  {
    videoId: "eKGkeVYzUl4",
    title: "יום הולדת לחבר - חברים יושבים ומדברים",
  },
  {
    videoId: "GFYoIU-UseE",
    title: "פודקאסט עם סבא או סבתא",
  },
] as const;

/** דוגמה לפודקאסט חברים (יומולדת / אירוע) */
export const PODCAST_FRIENDS_BIRTHDAY_VIDEO: ShowcaseVideo = {
  videoId: "eKGkeVYzUl4",
  title: "פודקאסט חברים לדוגמה - יושבים ומדברים",
};

/** דוגמה לפודקאסט עם סבא/סבתא */
export const PODCAST_GRANDPA_SHOWCASE_VIDEO: ShowcaseVideo = {
  videoId: "GFYoIU-UseE",
  title: "פודקאסט עם סבא או סבתא - מהאולפן",
};

/** /studio/recording-song-modiin/gifts */
export const STUDIO_GIFTS_VIDEOS: readonly ShowcaseVideo[] = [
  { videoId: "8i4K2f5gQfM", title: "שיר מתנה מהאולפן" },
  { videoId: "c55HTqTArFo", title: "יום חוויה באולפן - מתנה" },
  { videoId: "1ilgnokOS7Q", title: "קליפ לחתונה - חברים" },
  { videoId: "Fsy4Eg00dCA", title: "שיר לבר מצווה + תיקון זיופים" },
] as const;

export const BULK_PRODUCTION_VIDEOS: readonly ShowcaseVideo[] = [
  { videoId: "q1Omi-3L3QM", title: "פודקאסט מהאולפן" },
  { videoId: "wa_mOrjJvK8", title: "לפני ואחרי עריכת זום" },
  { videoId: "XiiOcx8doz0", title: "הקלטה באולפן" },
  { videoId: "cengTHzov5I", title: "איך מזמינים אורחים" },
] as const;

export const DRY_HIRE_VIDEOS: readonly ShowcaseVideo[] = [
  { videoId: "K1oAL8qg1W0", title: "הגברה באירוע חי" },
  { videoId: "9O0d3v1SqMc", title: "RCF והקמה בשטח" },
  { videoId: "nBtKa0JZfL0", title: "עמדת DJ ומערכת" },
  { videoId: "B5wvK5x1i38", title: "מיקסרים לאמנים" },
] as const;

export const DJ_VOICE_TAGS_VIDEOS: readonly ShowcaseVideo[] = [
  { videoId: "7DEp-gnDTs4", title: "מיתוג סט DJ" },
  { videoId: "Vuz4m8OaDcA", title: "פתיחה לסט, שלושה תקליטנים" },
  { videoId: "Mh3RosX3a8g", title: "איך עושים קריינות לסט" },
  { videoId: "hSGhpN_CR7s", title: "למה קריינות חשובה לסט" },
  { videoId: "zHkq_5bXptg", title: "הקלטה באולפן" },
  { videoId: "57FuI0EC_I4", title: "מאחורי הקלעים" },
] as const;

export const ACADEMY_VOICEOVER_DEMO: ShowcaseVideo = {
  videoId: "zHkq_5bXptg",
  title: "דוגמת קריינות מהאולפן",
};
