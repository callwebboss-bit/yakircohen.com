import Link from "next/link";
import LazyClickEmbed from "@/components/marketing/LazyClickEmbed";
import { PODCAST_SPOTIFY_SAMPLE } from "@/lib/data/podcast-media";
import { cn } from "@/lib/utils";

export type PodcastSpotifySampleProps = {
  className?: string;
  heading?: string;
  subheading?: string;
};

export default function PodcastSpotifySample({
  className,
  heading = "האזנה בספוטיפיי",
  subheading = PODCAST_SPOTIFY_SAMPLE.subtitle,
}: PodcastSpotifySampleProps) {
  return (
    <section
      className={cn("scroll-mt-24", className)}
      aria-labelledby="podcast-spotify-sample-heading"
    >
      <header className="mx-auto max-w-2xl text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-red">
          Spotify
        </p>
        <h2
          id="podcast-spotify-sample-heading"
          className="mt-2 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
        >
          {heading}
        </h2>
        <p className="mt-3 text-sm text-muted-foreground">{subheading}</p>
      </header>

      <div className="mx-auto mt-8 max-w-3xl space-y-4">
        <LazyClickEmbed
          src={PODCAST_SPOTIFY_SAMPLE.embedUrl}
          title={PODCAST_SPOTIFY_SAMPLE.title}
          hint="לחצו להאזנה בספוטיפיי"
          className="min-h-[352px] [&_iframe]:min-h-[352px]"
        />
        <p className="text-center text-sm text-muted-foreground">
          <Link
            href={PODCAST_SPOTIFY_SAMPLE.url}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-brand-red hover:underline"
          >
            פתיחה ב-Spotify ↗
          </Link>
        </p>
      </div>
    </section>
  );
}
