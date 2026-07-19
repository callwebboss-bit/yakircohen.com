import LazyYouTubePlayer from "@/components/marketing/LazyYouTubePlayer";
import VideoObjectSchema from "@/components/seo/VideoObjectSchema";
import {
  AI_SONG_CASE_STUDY,
  AI_SONG_CASE_STUDY_COPY,
  type AiSongCaseStudyPlacement,
} from "@/lib/data/ai-song-case-study";
import { cn } from "@/lib/utils";

type AiSongCaseStudyVideoProps = {
  placement: AiSongCaseStudyPlacement;
  className?: string;
  /** Larger visual weight on AI page */
  featured?: boolean;
};

export default function AiSongCaseStudyVideo({
  placement,
  className,
  featured = false,
}: AiSongCaseStudyVideoProps) {
  const copy = AI_SONG_CASE_STUDY_COPY[placement];

  return (
    <section
      className={cn(
        featured ? "mx-auto max-w-3xl" : "mx-auto max-w-4xl",
        className,
      )}
      aria-labelledby={copy.headingId}
    >
      <VideoObjectSchema
        videos={[
          {
            videoId: AI_SONG_CASE_STUDY.videoId,
            name: AI_SONG_CASE_STUDY.name,
            description: AI_SONG_CASE_STUDY.description,
            uploadDate: AI_SONG_CASE_STUDY.uploadDate,
          },
        ]}
      />
      <header className={cn("mb-5", featured ? "text-center" : "text-center sm:text-right")}>
        <h2
          id={copy.headingId}
          className={cn(
            "font-serif font-semibold tracking-tight text-foreground",
            featured
              ? "text-2xl sm:text-3xl"
              : "text-xl sm:text-2xl",
          )}
        >
          {copy.heading}
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground sm:text-base">
          {copy.body}
        </p>
      </header>
      <figure className="overflow-hidden rounded-xl border border-border bg-background shadow-sm">
        <LazyYouTubePlayer
          videoId={AI_SONG_CASE_STUDY.videoId}
          title={AI_SONG_CASE_STUDY.name}
          className="rounded-none"
        />
        <figcaption className="border-t border-border px-4 py-3 text-xs leading-relaxed text-muted-foreground sm:text-sm">
          {AI_SONG_CASE_STUDY.description}
        </figcaption>
      </figure>
    </section>
  );
}
