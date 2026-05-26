import RecordingSongExampleVideos from "@/components/seo/RecordingSongExampleVideos";
import { cn } from "@/lib/utils";
import type { ShowcaseVideo } from "@/lib/data/youtube-showcases";
import { VIDEO_EXAMPLES_INITIAL_VISIBLE } from "@/lib/data/pricing";
import { SERVICE_SHOWCASE_VIDEO_ID } from "@/lib/service-portfolio-hero";

type ShowcaseVideoSectionProps = {
  heading: string;
  /** id לעוגן גלילה מה-HERO (ברירת מחדל: service-showcase-video) */
  sectionId?: string;
  /** @deprecated use sectionId */
  headingId?: string;
  subheading?: string;
  videos: readonly ShowcaseVideo[];
  initialVisible?: number;
  className?: string;
};

export default function ShowcaseVideoSection({
  heading,
  sectionId,
  headingId,
  subheading,
  videos,
  initialVisible = VIDEO_EXAMPLES_INITIAL_VISIBLE,
  className,
}: ShowcaseVideoSectionProps) {
  if (videos.length === 0) return null;

  const resolvedSectionId =
    sectionId ?? headingId ?? SERVICE_SHOWCASE_VIDEO_ID;

  return (
    <section
      id={resolvedSectionId}
      className={cn("scroll-mt-24", className)}
      aria-labelledby={`${resolvedSectionId}-heading`}
    >
      <header className="mx-auto max-w-2xl text-center">
        <h2
          id={`${resolvedSectionId}-heading`}
          className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
        >
          {heading}
        </h2>
        {subheading ? (
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
            {subheading}
          </p>
        ) : null}
      </header>
      <div className="mt-10">
        <RecordingSongExampleVideos
          videos={videos}
          initialVisible={initialVisible}
        />
      </div>
    </section>
  );
}
