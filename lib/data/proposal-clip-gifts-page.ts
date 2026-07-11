import type { RecordingSongExampleVideo } from "@/lib/data/recording-song-modiin-page";
import { YOUTUBE_PROPOSAL_CLIP_IDS } from "@/lib/data/youtube-embeds";

const PROPOSAL_CLIP_VIDEO_TITLES = [
  "הקלטת שיר מתנה לחברה עם הקדשה אישית באולפן",
] as const;

export const PROPOSAL_CLIP_VIDEOS: readonly RecordingSongExampleVideo[] =
  YOUTUBE_PROPOSAL_CLIP_IDS.map((videoId, i) => ({
    videoId,
    title: PROPOSAL_CLIP_VIDEO_TITLES[i] ?? `קליפ מתננה ${i + 1}`,
    description:
      i === 0
        ? "שיר בהפתעה לאישה, לחברה או לבן/בת הזוג - הקלטה, עריכה ומיקס באולפן."
        : undefined,
  }));

export const PROPOSAL_CLIP_FEATURED_VIDEO_ID = YOUTUBE_PROPOSAL_CLIP_IDS[0];

/** לפני/אחרי תיקון זיופים מהקליפ - מקושר ל-audio-demos */
export const PROPOSAL_PITCH_AUDIO_DEMO_ID = "proposal-gift-pitch" as const;
