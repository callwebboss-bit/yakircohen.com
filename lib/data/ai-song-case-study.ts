/**
 * Case study: הקלטת שיר עם AI באולפן (~10 דק׳).
 * Shared across home, recording-studio, and academy/ai-music.
 */

export const AI_SONG_CASE_STUDY_VIDEO_ID = "hmEuYVR4ifA" as const;

export const AI_SONG_CASE_STUDY = {
  videoId: AI_SONG_CASE_STUDY_VIDEO_ID,
  name: "להקליט שיר ב-10 דקות עם AI - יקיר כהן הפקות",
  description:
    "תהליך הקלטת שיר באולפן יקיר כהן הפקות בשילוב בינה מלאכותית (AI). חווית הקלטה בגובה העיניים, בלי לחץ ובלי פלייבק מוכן מראש, תוך הפקת סאונד מקצועי ומזכרת וידאו מהתהליך.",
  uploadDate: "2026-07-19",
  thumbnailUrl: `https://img.youtube.com/vi/${AI_SONG_CASE_STUDY_VIDEO_ID}/hqdefault.jpg`,
  embedUrl: `https://www.youtube.com/embed/${AI_SONG_CASE_STUDY_VIDEO_ID}`,
} as const;

export type AiSongCaseStudyPlacement = "home" | "recording-studio" | "ai-music";

export const AI_SONG_CASE_STUDY_COPY: Record<
  AiSongCaseStudyPlacement,
  { heading: string; body: string; headingId: string }
> = {
  home: {
    headingId: "ai-song-case-home-heading",
    heading: "איך מפיקים שיר ב-10 דקות עם AI? צפו בתהליך מאחורי הקלעים",
    body: "סשן אמיתי באולפן: רעיון, הקלטה, ועיבוד AI - בלי פלייבק מוכן מראש.",
  },
  "recording-studio": {
    headingId: "ai-song-case-studio-heading",
    heading: "חווית הקלטה משחררת בגובה העיניים – בלי פוזות ובלי טכנאים קרירים",
    body: "ככה נראית הקלטה אצלנו: שיחה בגובה העיניים, ליווי צמוד, וסאונד מקצועי בסוף.",
  },
  "ai-music": {
    headingId: "ai-song-case-ai-heading",
    heading:
      "רוצים מזכרת כזו מההקלטה שלכם? אנחנו מפיקים גם קליפים, מצגות וסרטונים לפי דרישה",
    body: "Case study מהאולפן: שיר מלא עם AI תוך כ־10 דקות - כולל תיעוד וידאו של התהליך.",
  },
};
