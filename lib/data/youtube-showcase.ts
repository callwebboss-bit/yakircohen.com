import {
  FEATURED_YOUTUBE_TITLE,
  FEATURED_YOUTUBE_VIDEO_ID,
} from "@/lib/constants";
import { YOUTUBE_SHOWCASE_IDS } from "@/lib/data/youtube-embeds";

export type YouTubeShowcaseCategory =
  | "songs-events"
  | "bat-mitzvah-clips"
  | "podcast-business"
  | "field-effects";

export type YouTubeShowcaseFilter = {
  id: YouTubeShowcaseCategory;
  label: string;
};

export type YouTubeShowcaseVideo = {
  videoId: string;
  title: string;
};

export const YOUTUBE_SHOWCASE_FILTERS: YouTubeShowcaseFilter[] = [
  { id: "songs-events", label: "הקלטות שירים ואירועים" },
  { id: "bat-mitzvah-clips", label: "מתנות מהאולפן" },
  { id: "podcast-business", label: "פודקאסטים ותוכן עסקי" },
  { id: "field-effects", label: "אפקטים ואירועים בשטח" },
];

export const YOUTUBE_SHOWCASE_VIDEOS: Record<
  YouTubeShowcaseCategory,
  YouTubeShowcaseVideo
> = {
  "songs-events": {
    videoId: YOUTUBE_SHOWCASE_IDS.songsEvents,
    title: "השיר הכי מזוהה עם האולפן - הומור",
  },
  "bat-mitzvah-clips": {
    videoId: YOUTUBE_SHOWCASE_IDS.batMitzvahClips,
    title: "קליפ בת מצווה - דוגמה מהאולפן",
  },
  "podcast-business": {
    videoId: FEATURED_YOUTUBE_VIDEO_ID,
    title: FEATURED_YOUTUBE_TITLE,
  },
  "field-effects": {
    videoId: YOUTUBE_SHOWCASE_IDS.fieldEffects,
    title: "דיג'יי לאירועים קטנים",
  },
};

export const DEFAULT_YOUTUBE_SHOWCASE_CATEGORY: YouTubeShowcaseCategory =
  "songs-events";
