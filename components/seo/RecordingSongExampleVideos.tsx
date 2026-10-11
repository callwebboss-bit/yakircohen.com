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
  /**
   * כרטיס של תיק העבודות: השם מופיע פעם אחת, ככותרת h3 מתחת לנגן, וה-VideoObject
   * מגיע מהסקשן ולא מכל נגן בנפרד (11.10.2026: 194 רשומות על 126 סרטונים).
   */
  portfolioCards?: boolean;
  /** רמת הכותרת של כרטיס בתיק העבודות (ברירת מחדל h3) */
  cardHeadingLevel?: 3 | 4;
};

export default function RecordingSongExampleVideos({
  videos,
  initialVisible = VIDEO_EXAMPLES_INITIAL_VISIBLE,
  expandBatch = 6,
  className,
  autoPlayFeatured: _autoPlayFeatured = false,
  portfolioCards = false,
  cardHeadingLevel = 3,
}: RecordingSongExampleVideosProps) {
  const TitleTag = portfolioCards ? (cardHeadingLevel === 4 ? "h4" : "h3") : "p";
  const [visibleCount, setVisibleCount] = useState(initialVisible);
  const cap = Math.min(visibleCount, videos.length);
  const visible = videos.slice(0, cap);
  const remaining = videos.length - cap;

  if (videos.length === 0) return null;

  return (
    <div className={className}>
      {portfolioCards ? null : (
        <p className="mb-4 text-center text-xs text-muted-foreground">
          {VIDEO_WATCH_LABEL}
          {visible.length > 1 ? " - לחצו לצפייה" : null}
        </p>
      )}

      <ul
        className={cn(
          portfolioCards && visible.length > 1
            ? /* בנייד: שורה שגוללת לרוחב במקום עמודה של כרטיסים ברוחב מלא (12.10.2026) */
              "-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-6 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-3"
            : "grid gap-6",
          portfolioCards && visible.length > 1
            ? null
            : visible.length === 1
              ? "mx-auto max-w-3xl grid-cols-1"
              : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
        )}
      >
        {visible.map((video) => (
          <li
            key={video.videoId}
            className={cn(
              "flex flex-col",
              portfolioCards && visible.length > 1 ? "w-[78%] shrink-0 snap-start sm:w-auto" : null,
            )}
          >
            <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-neutral-200">
              <YouTube
                videoId={video.videoId}
                title={video.title}
                fillParent
                withSchema={!portfolioCards}
                showTitle={!portfolioCards}
              />
            </div>
            {video.badge ? (
              <p className="mt-3 text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-brand-red">
                {video.badge}
              </p>
            ) : null}
            <TitleTag
              className={cn(
                "text-sm font-semibold text-foreground",
                video.badge ? "mt-1" : "mt-3",
              )}
            >
              {video.title}
            </TitleTag>
            {video.description ? (
              <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground line-clamp-3">
                {video.description}
              </p>
            ) : null}
            <a
              href={`https://www.youtube.com/watch?v=${video.videoId}`}
              target="_blank"
              rel="noopener noreferrer"
              /* F-63 (7.10.2026): עד 30 קישורים באותו שם בעמוד. השם מתחיל בטקסט הגלוי ומוסיף את שם הסרטון. */
              aria-label={`צפייה ב-YouTube: ${video.title} (נפתח בלשונית חדשה)`}
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
