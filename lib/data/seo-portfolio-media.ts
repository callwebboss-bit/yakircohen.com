export const SEO_PORTFOLIO_SERVICES = [
  "confetti",
  "bubbles",
  "heavy-smoke",
  "song",
  "podcast",
  "mobile-studio",
] as const;

export type SeoPortfolioServiceId = (typeof SEO_PORTFOLIO_SERVICES)[number];

export const SEO_PORTFOLIO_LOCATIONS = [
  "modiin-area",
  "jerusalem",
  "rehovot",
  "ashdod",
  "petah-tikva",
] as const;

export type SeoPortfolioLocationId = (typeof SEO_PORTFOLIO_LOCATIONS)[number];

export const SEO_PORTFOLIO_SERVICE_LABELS: Record<SeoPortfolioServiceId, string> = {
  confetti: "קונפטי",
  bubbles: "בועות סבון",
  "heavy-smoke": "עשן כבד",
  song: "הקלטת שיר",
  podcast: "פודקאסט",
  "mobile-studio": "אולפן נייד",
};

export const SEO_PORTFOLIO_LOCATION_LABELS: Record<SeoPortfolioLocationId, string> = {
  "modiin-area": "מודיעין והסביבה",
  jerusalem: "ירושלים",
  rehovot: "רחובות",
  ashdod: "אשדוד",
  "petah-tikva": "פתח תקווה",
};

export type SeoPortfolioMediaItem = {
  id: string;
  service: SeoPortfolioServiceId;
  /** null = כללי לשירות (לא משויך לעיר) */
  location: SeoPortfolioLocationId | null;
  /** פורמט: [שירות] - [אירוע/אזור] */
  title: string;
  mediaType: "video" | "audio" | "image";
  youtubeId?: string;
  src?: string;
  href?: string;
};

/**
 * מדיה לסינון SEO - וידאו קיים מהאתר.
 * פריטים עם location=null מוצגים כשאין מדיה לעיר שנבחרה (fallback).
 */
export const SEO_PORTFOLIO_MEDIA: readonly SeoPortfolioMediaItem[] = [
  {
    id: "confetti-1",
    service: "confetti",
    location: "modiin-area",
    title: "קונפטי - אירוע במודיעין והסביבה",
    mediaType: "video",
    youtubeId: "yjxF9pKzbr0",
    href: "/events/attractions/confetti-cannon",
  },
  {
    id: "confetti-2",
    service: "confetti",
    location: null,
    title: "קונפטי - הסבר לאירועים",
    mediaType: "video",
    youtubeId: "SkBHvqC-S2Q",
    href: "/events/attractions/confetti-cannon",
  },
  {
    id: "bubbles-1",
    service: "bubbles",
    location: null,
    title: "בועות סבון - אווירת אירוע",
    mediaType: "video",
    youtubeId: "cBga7VLWNN0",
    href: "/events/attractions/bubble-machine",
  },
  {
    id: "smoke-1",
    service: "heavy-smoke",
    location: "jerusalem",
    title: "עשן כבד - אירוע בירושלים",
    mediaType: "video",
    youtubeId: "ZDrWMYzUQHk",
    href: "/events/attractions/wedding-smoking-machine/heavy-smoke-large-events",
  },
  {
    id: "smoke-2",
    service: "heavy-smoke",
    location: null,
    title: "עשן כבד - ריקודים / כניסה",
    mediaType: "video",
    youtubeId: "kc8Qjo4B-PY",
    href: "/events/attractions/wedding-smoking-machine/heavy-smoke-large-events",
  },
  {
    id: "song-1",
    service: "song",
    location: "modiin-area",
    title: "הקלטת שיר - אולפן במודיעין",
    mediaType: "video",
    youtubeId: "8i4K2f5gQfM",
    href: "/studio/recording-song-modiin",
  },
  {
    id: "song-2",
    service: "song",
    location: null,
    title: "הקלטת שיר - שיר מתנה",
    mediaType: "video",
    youtubeId: "qdCbNrDF15k",
    href: "/studio/recording-song-modiin",
  },
  {
    id: "podcast-1",
    service: "podcast",
    location: "modiin-area",
    title: "פודקאסט - הקלטה במודיעין",
    mediaType: "video",
    youtubeId: "q1Omi-3L3QM",
    href: "/podcast",
  },
  {
    id: "podcast-2",
    service: "podcast",
    location: null,
    title: "פודקאסט - לפני ואחרי עריכה",
    mediaType: "video",
    youtubeId: "wa_mOrjJvK8",
    href: "/podcast",
  },
  {
    id: "mobile-1",
    service: "mobile-studio",
    location: null,
    title: "אולפן נייד - הקלטה בשטח",
    mediaType: "video",
    youtubeId: "ne023hwMqH0",
    href: "/studio/mobile-studio",
  },
  {
    id: "mobile-2",
    service: "mobile-studio",
    location: "modiin-area",
    title: "אולפן נייד - מודיעין והסביבה",
    mediaType: "video",
    youtubeId: "UnBc2a3ve9w",
    href: "/studio/mobile-studio",
  },
];

export function getLocationsWithMedia(
  service: SeoPortfolioServiceId | "all",
): SeoPortfolioLocationId[] {
  const items =
    service === "all"
      ? SEO_PORTFOLIO_MEDIA
      : SEO_PORTFOLIO_MEDIA.filter((m) => m.service === service);
  const set = new Set<SeoPortfolioLocationId>();
  for (const item of items) {
    if (item.location) set.add(item.location);
  }
  return SEO_PORTFOLIO_LOCATIONS.filter((loc) => set.has(loc));
}

export function filterSeoPortfolioMedia(
  service: SeoPortfolioServiceId | "all",
  location: SeoPortfolioLocationId | "all",
): SeoPortfolioMediaItem[] {
  let items =
    service === "all"
      ? [...SEO_PORTFOLIO_MEDIA]
      : SEO_PORTFOLIO_MEDIA.filter((m) => m.service === service);

  if (location === "all") return items;

  const withLocation = items.filter((m) => m.location === location);
  if (withLocation.length > 0) return withLocation;

  // Dynamic fallback: general items for the service (no empty grid)
  return items.filter((m) => m.location === null);
}
