"use client";

import { useState } from "react";
import YouTube from "@/components/YouTube";
import {
  VIDEO_EXAMPLES_INITIAL_VISIBLE,
  VIDEO_WATCH_LABEL,
} from "@/lib/data/pricing";
import type { RecordingSongExampleVideo } from "@/lib/data/recording-song-modiin-page";

export type RecordingSongExampleVideosProps = {
  videos: readonly RecordingSongExampleVideo[];
  /** How many videos show before "הצג עוד" (default from pricing.ts). */
  initialVisible?: number;
  className?: string;
  /** טוען את הסרטון הראשון מיד (ברירת מחדל: לא - רק בלחיצה). */
  autoPlayFeatured?: boolean;
};

export default function RecordingSongExampleVideos({
  videos,
  initialVisible = VIDEO_EXAMPLES_INITIAL_VISIBLE,
  className,
  autoPlayFeatured: _autoPlayFeatured = false,
}: RecordingSongExampleVideosProps) {
  const [expanded, setExpanded] = useState(false);
  const cap =
    !expanded && videos.length > initialVisible
      ? initialVisible
      : videos.length;
  const visible = videos.slice(0, cap);
  const remaining = videos.length - visible.length;

  if (videos.length === 0) return null;

  return (
    <div className={className}>
      <p className="mb-4 text-center text-xs text-muted-foreground">
        {VIDEO_WATCH_LABEL}
        {visible.length > 1 ? " · לחצו לצפייה" : null}
      </p>

      <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((video) => (
          <li key={video.videoId} className="flex flex-col">
            <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-neutral-200">
              <YouTube videoId={video.videoId} title={video.title} fillParent />
            </div>
            <p className="mt-3 text-sm font-medium text-foreground">
              {video.title}
            </p>
          </li>
        ))}
      </ul>

      {remaining > 0 ? (
        <div className="mt-8 flex justify-center">
          <button
            type="button"
            onClick={() => setExpanded(true)}
            className="rounded-xl border border-border bg-surface px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:border-brand-red/40 hover:text-brand-red focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red"
          >
            הצג עוד {remaining} דוגמאות ({videos.length} בסך הכל)
          </button>
        </div>
      ) : null}
    </div>
  );
}
