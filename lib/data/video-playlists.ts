import type { PortfolioTag } from "@/lib/data/video-catalog";

export type PlaylistId =
  | "studio-hub"
  | "studio-hub-entertainment"
  | "recording-song-modiin"
  | "recording-studio"
  | "podcast-hub"
  | "blessings-hub"
  | "blessings-bar-mitzvah"
  | "blessings-bride-groom"
  | "blessings-video-clip"
  | "events-dj"
  | "events-hub"
  | "voiceover-hub"
  | "voiceover-services"
  | "voiceover-course"
  | "dj-voice-tags"
  | "dry-hire"
  | "bulk-production"
  | "mashup-fixer"
  | "studio-gifts"
  | "education-tips";

export type PlaylistConfig = {
  id: PlaylistId;
  heading: string;
  subheading?: string;
  kicker?: string;
  /** Videos shown before "load more" on service pages */
  initialVisible: number;
  /** How many more load per click on hub */
  expandBatch: number;
  /** Only include videos with these tags (entertainment hub section) */
  requireAnyTag?: readonly PortfolioTag[];
  /** Never show videos with these tags */
  excludeTags?: readonly PortfolioTag[];
  /** Service-page paths that use this playlist */
  pagePaths?: readonly string[];
  serviceLink?: { href: string; label: string };
};

export const VIDEO_PLAYLISTS: Record<PlaylistId, PlaylistConfig> = {
  "studio-hub": {
    id: "studio-hub",
    heading: "תיק עבודות ודוגמאות מהאולפן",
    subheading:
      "צפו בדוגמאות מהשטח - תיק עבודות, שיתופי פעולה ופרויקטים שמראים איך האולפן מלווה אמנים ויוצרים.",
    kicker: "תיק עבודות",
    initialVisible: 3,
    expandBatch: 6,
    excludeTags: ["entertainment"],
    pagePaths: ["/studio"],
  },
  "studio-hub-entertainment": {
    id: "studio-hub-entertainment",
    heading: "פארודיות, חיקויים ובידור מהאולפן",
    subheading: "תוכן מצחיק וויראלי - לא קשור ישירות לחבילות אירוע.",
    kicker: "בידור",
    initialVisible: 6,
    expandBatch: 6,
    requireAnyTag: ["entertainment", "brand-tv"],
    pagePaths: ["/portfolio"],
  },
  "recording-song-modiin": {
    id: "recording-song-modiin",
    heading: "דוגמאות - הקלטת שיר במודיעין",
    subheading: "שירי חתונה, בר מצווה, מתנות וקליפים מהאולפן.",
    kicker: "הקלטת שיר",
    initialVisible: 3,
    expandBatch: 6,
    excludeTags: ["entertainment", "brand-tv"],
    pagePaths: ["/studio/recording-song-modiin"],
    serviceLink: {
      href: "/studio/recording-song-modiin",
      label: "לעמוד הקלטת שיר",
    },
  },
  "recording-studio": {
    id: "recording-studio",
    heading: "בואו לסיור באולפן",
    subheading: "צפו בסרטונים כדי להבין איך נראה סשן הקלטה באולפן שלנו במודיעין.",
    kicker: "סיור באולפן",
    initialVisible: 3,
    expandBatch: 6,
    excludeTags: ["entertainment", "brand-tv"],
    pagePaths: ["/studio/recording-studio"],
    serviceLink: {
      href: "/studio/recording-studio",
      label: "לאולפן ההקלטות",
    },
  },
  "podcast-hub": {
    id: "podcast-hub",
    heading: "דוגמאות פודקאסט מהאולפן",
    subheading: "ראיונות, פודקאסטים עסקיים ותוכן מרפסת.",
    kicker: "פודקאסט",
    initialVisible: 3,
    expandBatch: 6,
    excludeTags: ["entertainment"],
    pagePaths: ["/podcast"],
    serviceLink: { href: "/podcast", label: "למרכז הפודקאסט" },
  },
  "blessings-hub": {
    id: "blessings-hub",
    heading: "דוגמאות ברכות מוקלטות",
    subheading: "ברכות חתן כלה, דרשות ורגעים מרגשים מהאולפן.",
    kicker: "ברכות",
    initialVisible: 3,
    expandBatch: 6,
    excludeTags: ["entertainment", "brand-tv"],
    pagePaths: ["/studio/blessings"],
    serviceLink: { href: "/studio/blessings", label: "לעמוד הברכות" },
  },
  "blessings-bar-mitzvah": {
    id: "blessings-bar-mitzvah",
    heading: "בר מצווה ודרשות - דוגמאות",
    initialVisible: 3,
    expandBatch: 6,
    excludeTags: ["entertainment", "brand-tv"],
    pagePaths: ["/studio/blessings/bar-mitzvah"],
    serviceLink: {
      href: "/studio/blessings/bar-mitzvah",
      label: "לברכות בר/בת מצווה",
    },
  },
  "blessings-bride-groom": {
    id: "blessings-bride-groom",
    heading: "ברכת חתן וכלה - דוגמאות",
    initialVisible: 3,
    expandBatch: 6,
    excludeTags: ["entertainment", "brand-tv"],
    pagePaths: ["/studio/blessings/bride-groom-blessing"],
    serviceLink: {
      href: "/studio/blessings/bride-groom-blessing",
      label: "לברכת חתן וכלה",
    },
  },
  "blessings-video-clip": {
    id: "blessings-video-clip",
    heading: "שיר וקליפ - דוגמאות",
    initialVisible: 3,
    expandBatch: 6,
    excludeTags: ["entertainment", "brand-tv"],
    pagePaths: ["/studio/blessings/video-clip"],
    serviceLink: {
      href: "/studio/blessings/video-clip",
      label: "לשיר וקליפ",
    },
  },
  "events-dj": {
    id: "events-dj",
    heading: "DJ לאירועים - דוגמאות מהשטח",
    subheading: "חתונות, בר מצווה ואירועים - מאחורי העמדה.",
    kicker: "תקליטן",
    initialVisible: 3,
    expandBatch: 6,
    excludeTags: ["entertainment", "brand-tv"],
    pagePaths: ["/events/dj-events"],
    serviceLink: { href: "/events/dj-events", label: "לעמוד DJ לאירועים" },
  },
  "events-hub": {
    id: "events-hub",
    heading: "הפקות אירועים - וידאו",
    initialVisible: 4,
    expandBatch: 6,
    excludeTags: ["entertainment"],
    pagePaths: ["/events"],
  },
  "voiceover-hub": {
    id: "voiceover-hub",
    heading: "דוגמאות קריינות",
    initialVisible: 3,
    expandBatch: 6,
    pagePaths: ["/voiceover"],
    serviceLink: { href: "/voiceover", label: "למרכז הקריינות" },
  },
  "voiceover-services": {
    id: "voiceover-services",
    heading: "קריינות מקצועית - דוגמאות",
    initialVisible: 3,
    expandBatch: 6,
    pagePaths: ["/voiceover/services"],
  },
  "voiceover-course": {
    id: "voiceover-course",
    heading: "קורס קריינות - מהאולפן",
    initialVisible: 3,
    expandBatch: 6,
    pagePaths: ["/voiceover/course"],
  },
  "dj-voice-tags": {
    id: "dj-voice-tags",
    heading: "דוגמאות מהאולפן",
    subheading: "כמה הקלטות אמיתיות, כדי שתדעו למה לצפות לפני שמזמינים.",
    kicker: "שמעו לפני שמזמינים",
    initialVisible: 3,
    expandBatch: 3,
    pagePaths: ["/events/dj/voice-tags"],
    serviceLink: {
      href: "/events/dj/voice-tags",
      label: "להזמנת תג קולי",
    },
  },
  "dry-hire": {
    id: "dry-hire",
    heading: "ציוד בשטח",
    subheading: "כמה סרטונים מהאירועים — איך נראית ההגברה בפועל.",
    kicker: "מה יש במלאי",
    initialVisible: 3,
    expandBatch: 2,
    pagePaths: ["/events/equipment/dry-hire"],
    serviceLink: {
      href: "/events/equipment/dry-hire",
      label: "לבדיקת זמינות",
    },
  },
  "bulk-production": {
    id: "bulk-production",
    heading: "איך זה נשמע ונראה",
    subheading: "דוגמאות מהאולפן ומעבד העריכה — כדי שתדעו מה מקבלים בפס ייצור.",
    kicker: "מהיוצא ללקוחות",
    initialVisible: 3,
    expandBatch: 2,
    pagePaths: ["/podcast/bulk-production"],
    serviceLink: {
      href: "/podcast/bulk-production",
      label: "למחשבון פס ייצור",
    },
  },
  "mashup-fixer": {
    id: "mashup-fixer",
    heading: "איך נשמע מאשאפ באירוע",
    subheading: "כמה דוגמאות מהאולפן — שילובים, רמיקסים ומה שיוצא לדיג'ייז בשטח.",
    kicker: "מהתיק",
    initialVisible: 3,
    expandBatch: 2,
    pagePaths: ["/online/mashup-fixer"],
    serviceLink: {
      href: "/online/mashup-fixer",
      label: "למחשבון מאשאפ",
    },
  },
  "studio-gifts": {
    id: "studio-gifts",
    heading: "מתנות מהאולפן - דוגמאות",
    initialVisible: 3,
    expandBatch: 6,
    excludeTags: ["entertainment"],
    pagePaths: ["/studio/recording-song-modiin/gifts"],
  },
  "education-tips": {
    id: "education-tips",
    heading: "טיפים מקצועיים - אודיו ואולפן",
    subheading: "מיקס, ציוד, מחירים ותהליך - ידע שימושי ליוצרים.",
    kicker: "טיפים",
    initialVisible: 6,
    expandBatch: 6,
    requireAnyTag: ["education"],
    pagePaths: ["/portfolio"],
  },
};

/** Hub page section order */
export const PORTFOLIO_HUB_PLAYLIST_ORDER: readonly PlaylistId[] = [
  "studio-hub",
  "recording-song-modiin",
  "blessings-hub",
  "podcast-hub",
  "events-dj",
  "voiceover-hub",
  "education-tips",
  "studio-hub-entertainment",
];

export function getPlaylistConfig(id: PlaylistId): PlaylistConfig {
  return VIDEO_PLAYLISTS[id];
}

export function getPlaylistsForPath(pathname: string): PlaylistId[] {
  const normalized = pathname.replace(/\/$/, "") || "/";
  const matches: PlaylistId[] = [];
  for (const config of Object.values(VIDEO_PLAYLISTS)) {
    if (config.pagePaths?.some((p) => normalized === p || normalized.startsWith(`${p}/`))) {
      matches.push(config.id);
    }
  }
  return matches;
}
