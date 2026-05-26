export type WeddingPhotoExampleVideo = {
  videoId: string;
  title: string;
};

/** Hero — H1 קצר + תת-כותרת (מוצג בעמוד, לא ב-meta) */
export const WEDDING_PHOTO_HERO = {
  title: "צילום חתונות ואירועים אינטימיים",
  subtitle:
    "סגנון טבעי ומכובד, מחירון שקוף, תמונות ראשונות תוך 48 שעות. מודיעין, השפלה והמרכז.",
  ctaLabel: "קבלו הצעת מחיר בוואטסאפ",
} as const;

/** 3 נקודות חזקות מתחת ל-Hero (לא 5) */
export const WEDDING_PHOTO_HERO_HIGHLIGHTS: readonly string[] = [
  "התמחות בחתונות דתיות ואירועים קטנים",
  "נוכחות דיסקרטית — אתם טבעיים, התמונות מספרות את הסיפור",
  "מחירון שקוף כולל מע״מ ועריכה בסיסית",
] as const;

export const WEDDING_GALLERY_BEST_MAX = 12;
export const WEDDING_GALLERY_EVENTS_MAX = 12;

export const WEDDING_PHOTO_EXAMPLE_VIDEOS: readonly WeddingPhotoExampleVideo[] = [
  { videoId: "ZDrWMYzUQHk", title: "רגעים מחתונה" },
  { videoId: "cBga7VLWNN0", title: "אירוע אינטימי מהשטח" },
] as const;

export const WEDDING_PHOTO_WHY_US: readonly string[] = [
  "צלם חתונות דתי עם ניסיון באירועים אינטימיים",
  "נוכחות דיסקרטית — בלי לביים ובלי לאלץ",
  "כל רגע בצבעים הנכונים — הסיפור האמיתי שלכם",
] as const;

export type WeddingPhotoTestimonial = {
  quote: string;
  name: string;
  role: string;
  initials: string;
};

export const WEDDING_PHOTO_TESTIMONIALS: readonly WeddingPhotoTestimonial[] = [
  {
    quote:
      "קיבלנו שירות מקצועי, רגוע וחם. התמונות יצאו מדהימות — טבעיות, לא מבוימות, בדיוק מה שרצינו.",
    name: "משפחת כהן",
    role: "חתונה אינטימית, מודיעין",
    initials: "מכ",
  },
  {
    quote:
      "שקיפות מלאה במחיר, הגעה בזמן, ותמונות ראשונות תוך יומיים. ממליצים בחום.",
    name: "יעל ואור",
    role: "אירוע משפחתי",
    initials: "יע",
  },
  {
    quote:
      "צילום מכובד לאירוע דתי — ידע מתי להיות שם ומתי לתת לרגע להיות פרטי.",
    name: "רחל גולן",
    role: "לקוחה פרטית",
    initials: "רג",
  },
] as const;

export const WEDDING_PHOTO_RELATED: readonly {
  href: string;
  title: string;
  description: string;
}[] = [
  {
    href: "/photography/events",
    title: "צילום כנסים ואירועים",
    description: "כיסוי דינמי לכנסים, השקות ואירועי חברה.",
  },
  {
    href: "/events/dj-events",
    title: "DJ לאירועים קטנים",
    description: "מוזיקה שמתאימה לאירוע אינטימי — פתרון מושלם יחד עם הצילום.",
  },
  {
    href: "/video/event-filming",
    title: "צילום וידאו לאירוע",
    description: "סטילס ווידאו מאותו בית — סיפור שלם מהאירוע.",
  },
] as const;
