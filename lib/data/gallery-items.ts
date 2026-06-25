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

/** תמונות שמופיעות גם בבלוג ובדפי שירות - נתיבים קיימים בפרודקשן */
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
    alt: "מיקרופון Shure באולפן",
    category: "podcast",
    href: "/podcast/podcast-studio-modiin",
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
  },
] as const;
