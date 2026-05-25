"use client";

import { useCallback, useId, useState, type KeyboardEvent } from "react";
import YouTube from "@/components/YouTube";
import {
  DEFAULT_YOUTUBE_SHOWCASE_CATEGORY,
  YOUTUBE_SHOWCASE_FILTERS,
  YOUTUBE_SHOWCASE_VIDEOS,
  type YouTubeShowcaseCategory,
} from "@/lib/data/youtube-showcase";
import { cn } from "@/lib/utils";

export type YouTubeShowcaseProps = {
  className?: string;
  defaultCategory?: YouTubeShowcaseCategory;
};

export default function YouTubeShowcase({
  className,
  defaultCategory = DEFAULT_YOUTUBE_SHOWCASE_CATEGORY,
}: YouTubeShowcaseProps) {
  const baseId = useId();
  const [activeCategory, setActiveCategory] =
    useState<YouTubeShowcaseCategory>(defaultCategory);
  const [isFading, setIsFading] = useState(false);

  const activeVideo = YOUTUBE_SHOWCASE_VIDEOS[activeCategory];

  const selectCategory = useCallback(
    (category: YouTubeShowcaseCategory) => {
      if (category === activeCategory) return;
      setIsFading(true);
      window.setTimeout(() => {
        setActiveCategory(category);
        setIsFading(false);
      }, 120);
    },
    [activeCategory],
  );

  const onTabKeyDown = (
    event: KeyboardEvent<HTMLButtonElement>,
    index: number,
  ) => {
    const total = YOUTUBE_SHOWCASE_FILTERS.length;
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      const next = (index + 1) % total;
      selectCategory(YOUTUBE_SHOWCASE_FILTERS[next]!.id);
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      const prev = (index - 1 + total) % total;
      selectCategory(YOUTUBE_SHOWCASE_FILTERS[prev]!.id);
    }
  };

  const activeIndex = YOUTUBE_SHOWCASE_FILTERS.findIndex(
    (f) => f.id === activeCategory,
  );
  const panelId = `${baseId}-youtube-panel`;

  return (
    <div className={cn("w-full", className)}>
      <div
        role="tablist"
        aria-label="סינון סרטוני YouTube"
        className="flex min-h-[3.25rem] flex-wrap justify-center gap-2 sm:gap-3"
      >
        {YOUTUBE_SHOWCASE_FILTERS.map((filter, index) => {
          const isActive = filter.id === activeCategory;
          return (
            <button
              key={filter.id}
              type="button"
              role="tab"
              id={`${baseId}-tab-${filter.id}`}
              aria-selected={isActive}
              aria-controls={panelId}
              tabIndex={isActive ? 0 : -1}
              onClick={() => selectCategory(filter.id)}
              onKeyDown={(event) => onTabKeyDown(event, index)}
              className={cn(
                "rounded-full border px-4 py-2 text-xs font-semibold transition-[background-color,border-color,color,box-shadow] duration-normal ease-luxury sm:text-sm",
                "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red",
                isActive
                  ? "border-brand-red/50 bg-foreground text-background shadow-sm"
                  : "border-border bg-background text-muted-foreground hover:border-brand-red/35 hover:text-foreground",
              )}
            >
              {filter.label}
            </button>
          );
        })}
      </div>

      <div
        id={panelId}
        role="tabpanel"
        aria-labelledby={`${baseId}-tab-${activeCategory}`}
        className="relative mt-6 aspect-video w-full overflow-hidden rounded-xl bg-foreground"
      >
        <div
          className={cn(
            "absolute inset-0 transition-opacity duration-normal ease-luxury",
            isFading ? "opacity-0" : "opacity-100",
          )}
        >
          <YouTube
            key={activeCategory}
            videoId={activeVideo.videoId}
            title={activeVideo.title}
            fillParent
            className="rounded-none"
          />
        </div>
      </div>

      <p className="sr-only" aria-live="polite" aria-atomic="true">
        מוצג: {YOUTUBE_SHOWCASE_FILTERS[activeIndex]?.label}
      </p>
    </div>
  );
}
