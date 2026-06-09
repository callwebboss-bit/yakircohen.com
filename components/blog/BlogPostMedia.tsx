"use client";

import LazyYouTubePlayer from "@/components/marketing/LazyYouTubePlayer";
import PodcastZoomProofSection from "@/components/seo/PodcastZoomProofSection";
import SoundImprovementShowcase from "@/components/seo/SoundImprovementShowcase";
import {
  getAudioDemo,
  type AudioDemoId,
} from "@/lib/data/audio-demos";
import { extractYouTubeVideoId } from "@/lib/youtube";

type BlogPostMediaProps = {
  title: string;
  youtubeUrl?: string;
  audioDemoId?: AudioDemoId;
};

export default function BlogPostMedia({
  title,
  youtubeUrl,
  audioDemoId,
}: BlogPostMediaProps) {
  if (audioDemoId === "podcast-zoom-cleanup") {
    return (
      <div className="mt-8">
        <PodcastZoomProofSection />
      </div>
    );
  }

  const youtubeId = youtubeUrl ? extractYouTubeVideoId(youtubeUrl) : null;
  const demo = audioDemoId ? getAudioDemo(audioDemoId) : null;
  const showcaseVariant =
    demo?.difficulty === "severe" ? "restoration" : "vocal";

  if (!youtubeId && !demo) return null;

  return (
    <>
      {youtubeId ? (
        <div className="mt-8">
          <LazyYouTubePlayer videoId={youtubeId} title={`וידאו: ${title}`} />
        </div>
      ) : null}

      {demo ? (
        <div className={youtubeId ? "mt-8" : "mt-8"}>
          <SoundImprovementShowcase
            demoId={audioDemoId!}
            variant={showcaseVariant}
            showDisclaimer={demo.difficulty === "severe"}
          />
        </div>
      ) : null}
    </>
  );
}
