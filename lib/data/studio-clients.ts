export type StudioClientHighlight = {
  id: string;
  imageSrc: string;
  imageAlt: string;
  caption: string;
};

/** Gallery for homepage "recorded with us" - general captions, no unapproved celebrity names */
export const STUDIO_CLIENT_HIGHLIGHTS: readonly StudioClientHighlight[] = [
  {
    id: "artist-studio",
    imageSrc: "/images/services/studio/hub/ישראל אהרוני באולפן.webp",
    imageAlt: "אמן באולפן הקלטות במודיעין",
    caption: "אמנים ויוצרים",
  },
  {
    id: "podcast-session",
    imageSrc: "/images/services/podcast/אולפן פודקאסט - יקיר כהן הפקות.webp",
    imageAlt: "הקלטת פודקאסט באולפן",
    caption: "פודקאסטים ותוכן",
  },
  {
    id: "family-recording",
    imageSrc:
      "/images/services/studio/hub/משפחה מקליטה באולפן הקלטות יקיר כהן הפקות.webp",
    imageAlt: "משפחה מקליטה באולפן",
    caption: "משפחות ואירועים",
  },
  {
    id: "bar-mitzvah-song",
    imageSrc:
      "/images/services/studio/recording-song-modiin/הקלטת-שיר-בר-מצווה.webp",
    imageAlt: "הקלטת שיר לבר מצווה באולפן",
    caption: "שירים וברכות",
  },
] as const;
