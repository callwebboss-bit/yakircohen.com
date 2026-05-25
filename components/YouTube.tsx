"use client";

import LazyYouTubePlayer from "@/components/marketing/LazyYouTubePlayer";
import { VIDEO_WATCH_LABEL } from "@/lib/data/pricing";
import { cn } from "@/lib/utils";
import {
  FEATURED_YOUTUBE_TITLE,
  FEATURED_YOUTUBE_VIDEO_ID,
} from "@/lib/constants";

export type YouTubeProps = {
  /** Raw video ID or full YouTube / youtu.be URL */
  videoId?: string;
  title?: string;
  fillParent?: boolean;
  className?: string;
};

/** Extracts a watch ID from a URL or returns the string when already an ID. */
export function parseYouTubeVideoId(input: string): string {
  const trimmed = input.trim();
  if (!trimmed.includes("youtube") && !trimmed.includes("youtu.be")) {
    return trimmed;
  }

  try {
    const url = new URL(trimmed);
    if (url.hostname.includes("youtu.be")) {
      return url.pathname.replace(/^\//, "").split("/")[0] ?? trimmed;
    }
    const fromQuery = url.searchParams.get("v");
    if (fromQuery) return fromQuery;
    const embedMatch = url.pathname.match(/\/embed\/([^/?]+)/);
    if (embedMatch?.[1]) return embedMatch[1];
  } catch {
    return trimmed;
  }

  return trimmed;
}

export default function YouTube({
  videoId = FEATURED_YOUTUBE_VIDEO_ID,
  title = FEATURED_YOUTUBE_TITLE,
  fillParent = false,
  className,
}: YouTubeProps) {
  const resolvedId = parseYouTubeVideoId(videoId);
  const isPlaceholder =
    !resolvedId ||
    resolvedId.includes("PLACEHOLDER") ||
    resolvedId.includes("VIDEO_ID");

  if (isPlaceholder) {
    return (
      <div
        className={cn(
          fillParent
            ? "absolute inset-0 flex h-full w-full items-center justify-center rounded-xl border border-border bg-surface p-8 text-center"
            : "relative flex aspect-video w-full items-center justify-center rounded-xl border border-border bg-surface p-8 text-center",
          className,
        )}
      >
        <div>
          <p className="text-sm font-semibold text-brand-red">סרטון בקרוב</p>
          <p className="mt-2 text-sm text-zinc-400">{title}</p>
          <a
            href="https://www.youtube.com/@yakircohen"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-block text-sm font-medium text-brand-red underline-offset-4 hover:text-brand-red-light hover:underline"
          >
            לערוץ YouTube שלנו
          </a>
        </div>
      </div>
    );
  }

  return (
    <LazyYouTubePlayer
      videoId={resolvedId}
      title={title}
      fillParent={fillParent}
      className={className}
      watchLabel={VIDEO_WATCH_LABEL}
    />
  );
}
