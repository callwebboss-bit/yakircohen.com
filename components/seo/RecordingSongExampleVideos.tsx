"use client";

import { useState } from "react";
import YouTube from "@/components/YouTube";
import {
  VIDEO_EXAMPLES_INITIAL_VISIBLE,
  VIDEO_WATCH_LABEL,
} from "@/lib/data/pricing";
import type { RecordingSongExampleVideo } from "@/lib/data/recording-song-modiin-page";
import { cn } from "@/lib/utils";

export type RecordingSongExampleVideosProps = {
  videos: readonly RecordingSongExampleVideo[];
  /** How many videos show before "הצג עוד" (default from pricing.ts). */
  initialVisible?: number;
  /** How many more videos load per click (default 6). */
  expandBatch?: number;
  className?: string;
  /** טוען את הסרטון הראשון מיד (ברירת מחדל: לא - רק בלחיצה). */
  autoPlayFeatured?: boolean;
};

export default function RecordingSongExampleVideos({
  videos,
  initialVisible = VIDEO_EXAMPLES_INITIAL_VISIBLE,
  expandBatch = 6,
  className,
  autoPlayFeatured: _autoPlayFeatured = false,
}: RecordingSongExampleVideosProps) {
  const [visibleCount, setVisibleCount] = useState(initialVisible);
  const cap = Math.min(visibleCount, videos.length);
  const visible = videos.slice(0, cap);
  const remaining = videos.length - cap;

  if (videos.length === 0) return null;

  return (
    <div className={className}>
      <p className="mb-4 text-center text-xs text-muted-foreground">
        {VIDEO_WATCH_LABEL}
        {visible.length > 1 ? " · לחצו לצפייה" : null}
      </p>

      <ul
        className={cn(
          "grid gap-6",
          visible.length === 1
            ? "mx-auto max-w-3xl grid-cols-1"
            : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
        )}
      >
        {visible.map((video) => (
          <li key={video.videoId} className="flex flex-col">
            <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-neutral-200">
              <YouTube videoId={video.videoId} title={video.title} fillParent />
            </div>
            <p className="mt-3 text-sm font-semibold text-foreground">
              {video.title}
            </p>
            {video.description ? (
              <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground line-clamp-3">
                {video.description}
              </p>
            ) : null}
            <a
              href={`https://www.youtube.com/watch?v=${video.videoId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 text-xs font-medium text-brand-red hover:underline"
            >
              צפייה ב-YouTube
            </a>
          </li>
        ))}
      </ul>

      {remaining > 0 ? (
        <div className="mt-8 flex justify-center">
          <button
            type="button"
            onClick={() =>
              setVisibleCount((c) => Math.min(c + expandBatch, videos.length))
            }
            className="rounded-xl border border-border bg-surface px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:border-brand-red/40 hover:text-brand-red focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red"
          >
            הצג עוד {Math.min(expandBatch, remaining)} דוגמאות
            {remaining > expandBatch
              ? ` (עוד ${remaining - expandBatch} אחרי זה)`
              : null}
          </button>
        </div>
      ) : null}
    </div>
  );
}
