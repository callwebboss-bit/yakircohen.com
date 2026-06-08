import type { AudioDemoId } from "@/lib/data/audio-demos";

/**
 * דמו לפני/אחרי - עריכת פודקאסט / ניקוי זום.
 *
 * אודיו: העתיקו ל-`public/audio/`:
 *   - podcast-raw-sample.mp3 (לפני)
 *   - podcast-clean-sample.mp3 (אחרי)
 *
 * YouTube: אחרי העלאה, הדביקו כאן רק את ה-videoId (החלק אחרי watch?v=).
 * דוגמה: https://www.youtube.com/watch?v=ABC123xyz → ABC123xyz
 */
export const PODCAST_ZOOM_PROOF = {
  demoId: "podcast-zoom-cleanup" as AudioDemoId,
  youtubeVideoId: "wa_mOrjJvK8",
  youtubeTitle: "עריכת פודקאסט - לפני ואחרי (וידאו)",
  audioSectionTitle: "שומעים את ההבדל - אודיו",
  videoSectionTitle: "רואים את ההבדל - וידאו",
} as const;

export function getPodcastZoomYoutubeVideoId(): string | null {
  const id = PODCAST_ZOOM_PROOF.youtubeVideoId.trim();
  return id.length >= 6 ? id : null;
}
