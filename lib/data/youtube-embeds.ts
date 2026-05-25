/**
 * YouTube video IDs  -  sourced from https://www.youtube.com/@Yakircohen (channel RSS).
 * Replace IDs here when you add new showcase reels.
 */

export const YOUTUBE_CHANNEL_URL = "https://www.youtube.com/@Yakircohen";

/** Homepage hero + podcast-business showcase */
export const YOUTUBE_FEATURED_VIDEO_ID = "XUr2e5S4JSA";

export const YOUTUBE_SHOWCASE_IDS = {
  songsEvents: "1llizRSIx5s",
  podcastBusiness: "1O0isV7Zljg",
  fieldEffects: "hg5qW6nk0iU",
  batMitzvahClips: "Ybph-qy883U",
} as const;

/** קליפים לבת מצווה - גלריה לעמוד gifts ולמאגר */
export const YOUTUBE_BAT_MITZVAH_CLIP_IDS = [
  "Ybph-qy883U",
  "M6r7NzBiEpc",
  "_zyZk6DtL2c",
  "q8Lrs93jQHQ",
] as const;

/** Per-service embeds (registry keys match ServiceEntity.id where applicable) */
export const YOUTUBE_SERVICE_EMBED_IDS = {
  "blessings-hub": "wfTY8Bz2uE4",
  "blessings-video-clip": "D3JV9SDY6GY",
  "recording-song-modiin": "8i4K2f5gQfM",
  "recording-song-wedding": "8i4K2f5gQfM",
  "studio-recording-studio": "UnBc2a3ve9w",
  "studio-jerusalem": "jBa06DNRXw0",
  "podcast-mobile-at-home": "UECS5GpAck4",
  "podcast-studio": "XiiOcx8doz0",
  "podcast-example-1": "q1Omi-3L3QM",
  "podcast-example-2": "eKGkeVYzUl4",
  "podcast-with-grandpa": "0XXeBgOm4XA",
  "events-dj": "5pBisBkfTEg",
  "events-hub": "hg5qW6nk0iU",
  "events-attractions-hub": "hg5qW6nk0iU",
  "attractions-bubble-machine": "hg5qW6nk0iU",
  "attractions-wedding-smoke": "Hggvb8jmNU8",
  "attractions-wedding-smoke-large": "ZDsMSF8sbNs",
  "attractions-confetti-cannon": "kk1YU0-A8Fg",
  "photography-wedding": "ZDrWMYzUQHk",
  "attractions-cold-fireworks": "FMZY-Ck0clo",
  "attractions-giant-balloons": "hg5qW6nk0iU",
  "attractions-led-booth": "p6r16cNtXhI",
  "attractions-smoke-cannons": "hg5qW6nk0iU",
  "video-hub": "XUr2e5S4JSA",
  "video-event-filming": "EhWehkdTdc0",
  "video-corporate-video": "3bpNDppVFzA",
  "video-presentation": "6JN2blsL5W0",
  "video-photo-slideshow": "4uvElfJO8CQ",
} as const;

export function youtubeEmbedUrl(videoId: string | null | undefined): string | null {
  if (!videoId?.trim()) return null;
  if (videoId.includes("PLACEHOLDER") || videoId.includes("VIDEO_ID")) return null;
  return `https://www.youtube.com/embed/${videoId.trim()}`;
}

export function isValidYouTubeEmbedUrl(url: string | null | undefined): boolean {
  if (!url?.trim()) return false;
  if (url.includes("PLACEHOLDER") || url.includes("VIDEO_ID")) return false;
  return url.includes("youtube.com/embed/");
}
