import type { AudioDemoId } from "@/lib/data/audio-demos";
import type { StudioPackageId } from "@/lib/data/studio-recording-booking";

/** דוגמאות שמע לפני/אחרי לפי מסלול הזמנה */
export const STUDIO_PACKAGE_AUDIO_DEMO: Partial<
  Record<StudioPackageId, AudioDemoId>
> = {
  remote: "proposal-gift-pitch",
  classic: "proposal-gift-pitch",
};

/** דוגמאות וידאו לחבילות עם קליפ */
export const STUDIO_PACKAGE_YOUTUBE_VIDEO: Partial<
  Record<StudioPackageId, string>
> = {
  remote: "LKg3pwdon_M",
  classic: "LKg3pwdon_M",
  pro: "wINztIFDN08",
  viral: "exEKzKh99ic",
  all_in: "qtCRD0K60ww",
};

export const STUDIO_DECOY_YOUTUBE_VIDEO = "q18Lu0MvXHo";
