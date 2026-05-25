import type { AudioTrack } from "@/components/marketing/AudioPlayer";

/** Drop MP3 files into public/audio/samples/ with these filenames. */
export const PODCAST_SAMPLE_TRACKS: AudioTrack[] = [
  {
    src: "/audio/samples/podcast-intro.mp3",
    title: "פתיחת פודקאסט",
    label: "דוגמה מהאולפן",
  },
  {
    src: "/audio/samples/voice-edited.mp3",
    title: "קול אחרי עריכה",
    label: "דוגמה מהאולפן",
  },
];
