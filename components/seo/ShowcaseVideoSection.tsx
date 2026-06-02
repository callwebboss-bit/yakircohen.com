import RecordingSongExampleVideos from "@/components/seo/RecordingSongExampleVideos";
import VideoObjectSchema from "@/components/seo/VideoObjectSchema";
import { cn } from "@/lib/utils";
import type { ShowcaseVideoItem } from "@/lib/data/video-catalog";
import { VIDEO_EXAMPLES_INITIAL_VISIBLE } from "@/lib/data/pricing";
import {
  getPlaylistConfig,
  type PlaylistId,
} from "@/lib/data/video-playlists";
import { getPlaylistVideos } from "@/lib/data/video-portfolio";
import { SERVICE_SHOWCASE_VIDEO_ID } from "@/lib/service-portfolio-hero";

type ShowcaseVideoSectionProps = {
  heading?: string;
  sectionId?: string;
  headingId?: string;
  subheading?: string;
  /** Load videos from central catalog playlist */
  playlistId?: PlaylistId;
  videos?: readonly ShowcaseVideoItem[];
  initialVisible?: number;
  expandBatch?: number;
  className?: string;
  kicker?: string;
  /** Max videos in VideoObject schema (performance) */
  schemaVideoLimit?: number;
};

export default function ShowcaseVideoSection({
  heading,
  sectionId,
  headingId,
  subheading,
  playlistId,
  videos: videosProp,
  initialVisible: initialVisibleProp,
  expandBatch: expandBatchProp,
  className,
  kicker: kickerProp,
  schemaVideoLimit = 12,
}: ShowcaseVideoSectionProps) {
  const config = playlistId ? getPlaylistConfig(playlistId) : null;
  const videos =
    videosProp ?? (playlistId ? getPlaylistVideos(playlistId) : []);

  if (videos.length === 0) return null;

  const initialVisible =
    initialVisibleProp ?? config?.initialVisible ?? VIDEO_EXAMPLES_INITIAL_VISIBLE;
  const expandBatch = expandBatchProp ?? config?.expandBatch ?? 6;
  const kicker = kickerProp ?? config?.kicker;
  const resolvedHeading = config?.heading ?? heading ?? "דוגמאות וידאו";
  const resolvedSubheading = config?.subheading ?? subheading;

  const resolvedSectionId =
    sectionId ?? headingId ?? (playlistId ? `playlist-${playlistId}` : SERVICE_SHOWCASE_VIDEO_ID);

  const schemaVideos = videos.slice(0, schemaVideoLimit).map((v) => ({
    videoId: v.videoId,
    name: v.title,
    description: v.description,
  }));

  return (
    <section
      id={resolvedSectionId}
      className={cn("scroll-mt-24", className)}
      aria-labelledby={`${resolvedSectionId}-heading`}
    >
      <VideoObjectSchema videos={schemaVideos} />
      <header className="mx-auto max-w-2xl text-center">
        {kicker ? (
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.22em] text-brand-red">
            {kicker}
          </p>
        ) : null}
        <h2
          id={`${resolvedSectionId}-heading`}
          className="font-serif text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
        >
          {resolvedHeading}
        </h2>
        {resolvedSubheading ? (
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
            {resolvedSubheading}
          </p>
        ) : null}
      </header>
      <div className="mt-10">
        <RecordingSongExampleVideos
          videos={videos}
          initialVisible={initialVisible}
          expandBatch={expandBatch}
        />
      </div>
    </section>
  );
}
