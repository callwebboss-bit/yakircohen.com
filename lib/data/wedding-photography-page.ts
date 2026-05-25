export type WeddingPhotoExampleVideo = {
  videoId: string;
  title: string;
};

export const WEDDING_PHOTO_EXAMPLE_VIDEOS: readonly WeddingPhotoExampleVideo[] = [
  { videoId: "xH1Ypsj6J0g", title: "צילום חתונה  -  רגעים מהשטח" },
  { videoId: "cBga7VLWNN0", title: "תיק עבודות  -  אירוע אינטימי" },
] as const;

export const WEDDING_PHOTO_WHY_US: readonly string[] = [
  "צלם חתונות דתי עם ניסיון באירועים אינטימיים",
  "נוכחות דיסקרטית  -  בלי לביים ובלי לאלץ",
  "כל רגע בצבעים הנכונים  -  הסיפור האמיתי שלכם",
  "שקיפות מלאה  -  מה שרואים זה מה שמשלמים",
] as const;

export const WEDDING_PHOTO_RELATED: readonly {
  href: string;
  title: string;
  description: string;
}[] = [
  {
    href: "/events/dj-events",
    title: "DJ לאירועים קטנים",
    description: "מוזיקה שמתאימה לאירוע אינטימי  -  פתרון מושלם יחד עם הצילום.",
  },
  {
    href: "/video",
    title: "הפקת קליפים",
    description: "קליפ מקצועי לאירוע  -  וידאו וסטילס מאותו בית.",
  },
  {
    href: "/studio/blessings/bar-mitzvah",
    title: "קליפ בר/בת מצווה",
    description: "קליפים מיוחדים לבנות ולבני מצווה  -  גם לאירועים דתיים.",
  },
  {
    href: "/studio/blessings/video-clip",
    title: "קליפ חתונה",
    description: "קליפ שירגש את כולם  -  לפני או אחרי יום החתונה.",
  },
  {
    href: "/studio/mobile-studio",
    title: "אולפן הקלטות נייד",
    description: "ברכה מיוחדת מהבית  -  לפני האירוע.",
  },
] as const;
