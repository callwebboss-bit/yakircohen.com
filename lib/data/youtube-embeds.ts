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

  fieldEffects: "yjxF9pKzbr0",

  batMitzvahClips: "Ybph-qy883U",

} as const;



/** קליפים לבת מצווה - גלריה לעמוד gifts ולמאגר */

export const YOUTUBE_BAT_MITZVAH_CLIP_IDS = [

  "qtCRD0K60ww",

  "Ybph-qy883U",

  "M6r7NzBiEpc",

  "_zyZk6DtL2c",

  "q8Lrs93jQHQ",

] as const;



/** Per-service embeds (registry keys match ServiceEntity.id where applicable) */

export const YOUTUBE_SERVICE_EMBED_IDS = {

  "studio-hub": "XUr2e5S4JSA",

  "blessings-hub": "wfTY8Bz2uE4",

  "blessings-video-clip": "D3JV9SDY6GY",

  "blessings-bar-mitzvah": "wfTY8Bz2uE4",

  "blessings-bar-mitzvah-alt": "sqtbkFSjskk",

  "blessings-bride-groom": "kLA-XVH3m4E",

  "recording-song-modiin": "8i4K2f5gQfM",

  "recording-song-wedding": "8i4K2f5gQfM",

  "recording-song-friends-clip": "1ilgnokOS7Q",

  "recording-song-bar-mitzvah-pitch": "Fsy4Eg00dCA",

  "studio-recording-studio": "UnBc2a3ve9w",

  "studio-mobile-studio": "UECS5GpAck4",

  "studio-recording-group": "ne023hwMqH0",

  "studio-jerusalem": "jBa06DNRXw0",

  "podcast-mobile-at-home": "UECS5GpAck4",

  "podcast-studio": "XiiOcx8doz0",

  "podcast-example-1": "q1Omi-3L3QM",

  "podcast-example-2": "eKGkeVYzUl4",

  "podcast-zoom-before-after": "wa_mOrjJvK8",

  "podcast-with-grandpa": "GFYoIU-UseE",

  "voiceover-hub": "O2RHNRZCmZM",

  "voiceover-hub-alt": "PojVz9erPKY",

  "voiceover-demo": "zHkq_5bXptg",

  "voiceover-services": "7DEp-gnDTs4",

  "voiceover-course": "wN4N0QsfDJo",

  "voiceover-course-alt": "oVeIMBTmS_8",

  "dj-voice-tags": "7DEp-gnDTs4",

  "dry-hire": "K1oAL8qg1W0",

  "bulk-production": "q1Omi-3L3QM",

  "mashup-fixer": "U6LJERy6Wdk",

  "events-dj": "5pBisBkfTEg",

  "events-hub": "hg5qW6nk0iU",

  "events-attractions-hub": "hg5qW6nk0iU",

  "events-equipment": "9O0d3v1SqMc",

  "events-equipment-dj": "nBtKa0JZfL0",

  "events-equipment-sound": "K1oAL8qg1W0",

  "events-singer-amplification": "9O0d3v1SqMc",

  "events-host": "5pBisBkfTEg",

  "attractions-bubble-machine": "hg5qW6nk0iU",

  "attractions-wedding-smoke": "Hggvb8jmNU8",

  "attractions-wedding-smoke-large": "ZDsMSF8sbNs",

  "attractions-confetti-cannon": "yjxF9pKzbr0",

  "photography-wedding": "ZDrWMYzUQHk",

  "photography-events": "ZDrWMYzUQHk",

  "photography-events-2": "kc8Qjo4B-PY",

  "photography-events-3": "cBga7VLWNN0",

  "photography-events-4": "xH1Ypsj6J0g",

  "attractions-cold-fireworks": "FMZY-Ck0clo",

  "attractions-giant-balloons": "hg5qW6nk0iU",

  "attractions-led-booth": "p6r16cNtXhI",

  "attractions-smoke-cannons": "hg5qW6nk0iU",

  "video-hub": "XUr2e5S4JSA",

  "video-reel-factory": "hg5qW6nk0iU",

  "video-event-filming": "EhWehkdTdc0",

  "video-corporate-video": "3bpNDppVFzA",

  "video-presentation": "6JN2blsL5W0",

  "video-photo-slideshow": "4uvElfJO8CQ",

  "studio-collab-feature": "q18Lu0MvXHo",

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


