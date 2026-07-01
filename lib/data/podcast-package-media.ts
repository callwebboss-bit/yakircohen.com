import type { AudioDemoId } from "@/lib/data/audio-demos";
import type { PodcastPackageId } from "@/lib/data/podcast-calculator";

export const PODCAST_PACKAGE_AUDIO_DEMO: Partial<
  Record<PodcastPackageId, AudioDemoId>
> = {
  starter: "recording-vocal-polish",
  audio: "podcast-zoom-cleanup",
};

export const PODCAST_PACKAGE_YOUTUBE_VIDEO: Partial<
  Record<PodcastPackageId, string>
> = {
  video: "XiiOcx8doz0",
  social: "eKGkeVYzUl4",
};

export const PODCAST_MOBILE_YOUTUBE_VIDEO = "UECS5GpAck4";

export function getPodcastPackageYoutubeVideo(
  packageId: PodcastPackageId,
  location: "modiin" | "mobile",
): string | undefined {
  if (location === "mobile" && (packageId === "video" || packageId === "social")) {
    return PODCAST_MOBILE_YOUTUBE_VIDEO;
  }
  return PODCAST_PACKAGE_YOUTUBE_VIDEO[packageId];
}
