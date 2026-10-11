export type GalleryCategory =
  | "all"
  | "studio"
  | "events"
  | "podcast"
  | "voiceover"
  | "academy";

export type GalleryItem = {
  id: string;
  src: string;
  alt: string;
  category: Exclude<GalleryCategory, "all">;
  href?: string;
  caption?: string;
};

export const GALLERY_CATEGORY_LABELS: Record<GalleryCategory, string> = {
  all: "הכול",
  studio: "אולפן",
  events: "אירועים",
  podcast: "פודקאסט",
  voiceover: "קריינות",
  academy: "אקדמיה",
};

/**
 * תמונות שמופיעות גם בבלוג ובדפי שירות - נתיבים קיימים בפרודקשן.
 *
 * F-52 (7.10.2026): קישור שכל תוכנו תמונה נקרא בתיאור של התמונה ולא ביעד שלו, ושלושה
 * יעדים (/studio/recording-studio, /events/dj-events, /studio/recording-song-modiin)
 * נקשרו פעמיים בשמות שונים. לכל פריט יש עכשיו כיתוב שמציין את היעד, ושני
 * הקישורים לאותו יעד נבדלים בכיתוב. נוסף טקסט בלבד: ה-alt לא הוסר מאף תמונה,
 * כדי ש-imagesWithAlt לא ירד.
 */
export const GALLERY_ITEMS: readonly GalleryItem[] = [
  {
    id: "studio-hub",
    src: "/images/services/studio/hub/אולפן פודקאסט - יקיר כהן 1.webp",
    alt: "אולפן פודקאסט במודיעין",
    category: "studio",
    href: "/studio",
    caption: "מתחם אולפן במודיעין",
  },
  {
    id: "recording-song",
    src: "/images/services/studio/recording-song-modiin/אוהד בוזגלו מקליט.webp",
    alt: "הקלטת שיר באולפן",
    category: "studio",
    href: "/studio/recording-song-modiin",
    caption: "הקלטת שיר במתנה",
  },
  {
    id: "studio-campus",
    src: "/images/services/studio/recording-song-modiin/מתחם יקיר כהן הפקות.webp",
    alt: "מתחם יקיר כהן הפקות",
    category: "studio",
    href: "/studio/recording-studio",
    caption: "אולפן הקלטות במודיעין",
  },
  {
    id: "blessing",
    src: "/images/services/studio/blessings/bride-groom-blessing/הקלטה באולפן.webp",
    alt: "הקלטת ברכה לחתונה",
    category: "studio",
    href: "/studio/blessings/bride-groom-blessing",
    caption: "ברכות מוקלטות",
  },
  {
    id: "dj-stand",
    src: "/images/services/events/dj-events/עמדת די גיי ותאורה.webp",
    alt: "עמדת DJ ותאורה באירוע",
    category: "events",
    href: "/events/dj-events",
    caption: "DJ ותאורה",
  },
  {
    id: "dj-event",
    src: "/images/services/events/dj-events/עמדה ותאורה יקירכהן באירוע.webp",
    alt: "עמדת DJ באירוע חי",
    category: "events",
    href: "/events/dj-events",
    caption: "תקליטן לאירועים",
  },
  {
    id: "corporate-event",
    src: "/images/services/events/dj-events/אירוע חברה עם מיתוג.webp",
    alt: "אירוע חברה עם מיתוג",
    category: "events",
    href: "/events",
    caption: "אירועי חברה",
  },
  {
    id: "wedding-package",
    src: "/images/services/events/wedding-packages/חבילת סלואו יקיר כהן הפקות.webp",
    alt: "חבילת אירועים לחתונה",
    category: "events",
    href: "/events/wedding-attractions-packages",
    caption: "חבילות לחתונה",
  },
  {
    id: "wedding-songs",
    src: "/images/services/events/wedding-packages/שירים-לאירועים.webp",
    alt: "שירים לאירועים",
    category: "events",
    href: "/studio/recording-song-modiin",
    caption: "הקלטת שיר לאירוע",
  },
  {
    id: "smoke",
    src: "/images/services/events/attractions/wedding-smoking-machine/עשן כבד לחתונה.webp",
    alt: "עשן כבד לחתונה",
    category: "events",
    href: "/events/attractions/wedding-smoking-machine",
    caption: "עשן כבד לחופה",
  },
  {
    id: "fireworks",
    src: "/images/services/events/attractions/cold-fireworks/זיקוקים קרים לחופה.webp",
    alt: "זיקוקים קרים לחופה",
    category: "events",
    href: "/events/attractions/cold-fireworks",
    caption: "זיקוקים קרים לאירועים",
  },
  {
    id: "podcast-room",
    src: "/images/services/academy/music-production/אולפני יקיר כהן הפקות פודקאסט.webp",
    alt: "חדר פודקאסט באולפן",
    category: "podcast",
    href: "/podcast",
    caption: "אולפן פודקאסט",
  },
  {
    id: "podcast-mic",
    src: "/images/services/events/equipment/singer-amplification/מיקרופון שור לזמרים.webp",
    /* F-35 (7.10.2026): הקובץ הוא מיקרופון ידני בתקריב על רקע אורות, לא מיקרופון באולפן.
       השם שמוביל ליעד (אולפן הפודקאסט במודיעין) עבר לכיתוב. */
    alt: "מיקרופון ידני מקרוב על רקע מטושטש של אורות במה",
    category: "podcast",
    href: "/podcast/podcast-studio-modiin",
    caption: "אולפן פודקאסט במודיעין",
  },
  {
    id: "voiceover-mic",
    src: "/images/services/voiceover/מיקרופון קריינות.webp",
    alt: "מיקרופון קריינות באולפן",
    category: "voiceover",
    href: "/voiceover",
    caption: "קריינות מקצועית",
  },
  {
    id: "voiceover-booth",
    src: "/images/services/voiceover/קרינות באולפן.webp",
    alt: "הקלטת קריינות באולפן",
    category: "voiceover",
    href: "/voiceover/services",
    caption: "שירותי קריינות",
  },
  {
    id: "academy-studio",
    src: "/images/services/academy/music-production/אולפן-הקלטה-במודיעין-יקיר-כהן-הפקות.webp",
    alt: "אולפן הקלטה במודיעין",
    category: "academy",
    href: "/academy/music-production",
    caption: "הפקה מוזיקלית",
  },
  {
    id: "dj-course",
    src: "/images/services/dj-course/ידידיה קורס דיגיי גיל 50.webp",
    alt: "קורס DJ באולפן",
    category: "academy",
    href: "/academy/dj-course",
    caption: "קורס DJ",
  },
  {
    id: "recording-session",
    src: "/images/services/academy/music-production/הקלטה באולפן.webp",
    alt: "הקלטה באולפן",
    category: "academy",
    href: "/studio/recording-studio",
    caption: "אולפן הקלטות מקצועי",
  },
  {
    id: "studio-hub-lounge",
    src: "/images/services/studio/hub/פינת ישיבה בעיצוב ציורי קיר באולפן.webp",
    alt: "פינת ישיבה בעיצוב ציורי קיר באולפן",
    category: "studio",
    href: "/studio",
    caption: "מתחם האולפן והאירוח",
  },
  {
    id: "studio-father-son",
    src: "/images/services/studio/recording-song-modiin/archive/הקלטת אב ובן באולפן.webp",
    alt: "הקלטת אב ובן באולפן",
    category: "studio",
    href: "/studio/recording-song-modiin",
    caption: "הקלטת שיר במתנה",
  },
  {
    id: "studio-kids-song",
    src: "/images/services/studio/recording-song-modiin/archive/הקלטת שיר לילדים בתא ההקלטה.webp",
    alt: "הקלטת שיר לילדים בתא ההקלטה",
    category: "studio",
    href: "/studio/recording-song-modiin",
    caption: "שיר לילדים",
  },
  {
    id: "studio-groom-blessing",
    src: "/images/services/studio/blessings/bride-groom-blessing/חתן מקליט ברכה בתא ההקלטה.webp",
    alt: "חתן מקליט ברכה בתא ההקלטה",
    category: "studio",
    href: "/studio/blessings/bride-groom-blessing",
    caption: "ברכת חתן וכלה",
  },
  {
    id: "studio-family-clip",
    src: "/images/services/studio/blessings/video-clip/קליפ משפחתי באולפן.webp",
    alt: "קליפ משפחתי באולפן",
    category: "studio",
    href: "/studio/blessings/video-clip",
    caption: "קליפ ברכה משפחתי",
  },
  {
    id: "podcast-lounge",
    src: "/images/services/podcast/archive/אולפן פודקאסט עם ספות וקיר מיקרופון.webp",
    alt: "אולפן פודקאסט עם ספות וקיר מיקרופון",
    category: "podcast",
    href: "/podcast",
    caption: "אולפן פודקאסט במודיעין",
  },
  {
    id: "podcast-sport-interview",
    src: "/images/services/podcast/archive/ראיון פודקאסט עם ספורטאי באולפן.webp",
    alt: "ראיון פודקאסט עם ספורטאי באולפן",
    category: "podcast",
    href: "/podcast",
    caption: "הפקת פודקאסט",
  },
  {
    id: "podcast-backdrop",
    src: "/images/services/podcast/archive/ראיון פודקאסט מול רקע ציורי.webp",
    alt: "ראיון פודקאסט מול רקע ציורי",
    category: "podcast",
    href: "/podcast",
    caption: "צילום פודקאסט",
  },
  {
    id: "events-confetti",
    src: "/images/services/events/attractions/confetti-cannon/קונפטי צבעוני בפסים לתותח קונפטי.webp",
    alt: "קונפטי צבעוני בפסים לתותח קונפטי",
    category: "events",
    href: "/events/attractions/confetti-cannon",
    caption: "תותח קונפטי לאירועים",
  },
  {
    id: "events-heavy-smoke",
    src: "/images/services/events/attractions/wedding-smoking-machine/עשן כבד מתפשט על הדשא באירוע בחוץ.webp",
    alt: "עשן כבד מתפשט על הדשא באירוע בחוץ",
    category: "events",
    href: "/events/attractions/wedding-smoking-machine",
    caption: "עשן כבד לאירועים",
  },
  {
    id: "events-cold-fireworks",
    src: "/images/services/events/attractions/cold-fireworks/archive/זיקוקים קרים בכניסת חתן וכלה לחתונה.webp",
    alt: "זיקוקים קרים בכניסת חתן וכלה לחתונה",
    category: "events",
    href: "/events/attractions/cold-fireworks",
    caption: "זיקוקים קרים",
  },
  {
    id: "events-pa",
    src: "/images/services/events/equipment/ארונות הגברה לאירועים.webp",
    alt: "ארונות הגברה לאירועים",
    category: "events",
    href: "/events/equipment",
    caption: "הגברה לאירועים",
  },
  {
    id: "academy-production-class",
    src: "/images/services/academy/music-production/הדרכה והפקה מוזיקלית בחדר הבקרה.webp",
    alt: "הדרכה והפקה מוזיקלית בחדר הבקרה",
    category: "academy",
    href: "/academy/music-production",
    caption: "הדרכת הפקה מוזיקלית",
  },
] as const;
