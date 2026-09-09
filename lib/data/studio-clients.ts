export type StudioClientHighlight = {
  id: string;
  imageSrc: string;
  imageAlt: string;
  caption: string;
  /** Canonical service page for this client type */
  href: string;
  linkLabel: string;
};

/** Gallery for homepage "recorded with us" - general captions, no unapproved celebrity names */
export const STUDIO_CLIENT_HIGHLIGHTS: readonly StudioClientHighlight[] = [
  {
    id: "artist-studio",
    imageSrc: "/images/services/studio/hub/ישראל אהרוני באולפן.webp",
    imageAlt: "אמן באולפן הקלטות במודיעין",
    caption: "אמנים ויוצרים",
    href: "/studio",
    linkLabel: "אולפן הקלטות",
  },
  {
    id: "podcast-session",
    imageSrc: "/images/services/podcast/אולפן פודקאסט - יקיר כהן הפקות.webp",
    imageAlt: "הקלטת פודקאסט באולפן",
    caption: "פודקאסטים ותוכן",
    href: "/podcast",
    linkLabel: "הקלטת פודקאסט",
  },
  {
    id: "family-recording",
    imageSrc:
      "/images/services/studio/hub/משפחה מקליטה באולפן הקלטות יקיר כהן הפקות.webp",
    imageAlt: "משפחה מקליטה באולפן",
    caption: "משפחות ואירועים",
    href: "/studio/recording-song-modiin/gifts",
    linkLabel: "מתנות ואירועים",
  },
  {
    id: "bar-mitzvah-song",
    imageSrc:
      "/images/services/studio/recording-song-modiin/הקלטת-שיר-בר-מצווה.webp",
    imageAlt: "הקלטת שיר לבר מצווה באולפן",
    caption: "שירים וברכות",
    href: "/studio/blessings",
    linkLabel: "ברכות והקלטות",
  },
] as const;
