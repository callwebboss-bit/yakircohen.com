"use client";

import LazyYouTubePlayer from "@/components/marketing/LazyYouTubePlayer";
import SoundImprovementShowcase from "@/components/seo/SoundImprovementShowcase";
import type { AudioShowcaseContext } from "@/components/seo/AudioShowcase";
import {
  getPodcastZoomYoutubeVideoId,
  PODCAST_ZOOM_PROOF,
} from "@/lib/data/podcast-proof";

type Props = {
  context?: AudioShowcaseContext;
  showYoutube?: boolean;
  showVideoHeading?: boolean;
  className?: string;
};

export default function PodcastZoomProofSection({
  context = "page",
  showYoutube = true,
  showVideoHeading = true,
  className,
}: Props) {
  const youtubeId = showYoutube ? getPodcastZoomYoutubeVideoId() : null;

  return (
    <div className={className}>
      <SoundImprovementShowcase
        demoId={PODCAST_ZOOM_PROOF.demoId}
        variant="remote"
        context={context}
      />

      {youtubeId ? (
        <div className="mt-8">
          {showVideoHeading ? (
            <h3 className="mb-3 text-center text-sm font-semibold text-foreground">
              {PODCAST_ZOOM_PROOF.videoSectionTitle}
            </h3>
          ) : null}
          <LazyYouTubePlayer
            videoId={youtubeId}
            title={PODCAST_ZOOM_PROOF.youtubeTitle}
          />
        </div>
      ) : null}
    </div>
  );
}
