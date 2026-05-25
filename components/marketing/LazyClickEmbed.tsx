"use client";

import { useState } from "react";
import { VIDEO_WATCH_LABEL } from "@/lib/data/pricing";
import { cn } from "@/lib/utils";

export type LazyClickEmbedProps = {
  src: string;
  title: string;
  className?: string;
  /** Shown on the facade before the iframe loads. */
  hint?: string;
};

/**
 * Click-to-load iframe facade - avoids third-party weight until the visitor opts in.
 * Used for playlists, Spotify, and other embed URLs without a single video thumbnail.
 */
export default function LazyClickEmbed({
  src,
  title,
  className,
  hint = VIDEO_WATCH_LABEL,
}: LazyClickEmbedProps) {
  const [active, setActive] = useState(false);

  return (
    <div
      className={cn(
        "relative aspect-video w-full overflow-hidden rounded-xl border border-border bg-neutral-200",
        className,
      )}
    >
      {active ? (
        <iframe
          src={src}
          title={title}
          className="absolute inset-0 h-full w-full border-0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          loading="lazy"
        />
      ) : (
        <button
          type="button"
          onClick={() => setActive(true)}
          className="group absolute inset-0 flex w-full flex-col items-center justify-center gap-5 bg-black/92 px-6 text-center focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-brand-red"
          aria-label={`${hint}: ${title}`}
        >
          <p className="text-[0.65rem] font-bold tracking-[0.25em] text-white/35 uppercase">
            לחצו לצפייה
          </p>
          <span
            className={cn(
              "flex h-20 w-20 items-center justify-center rounded-full",
              "bg-brand-red shadow-[0_0_48px_rgba(212,43,43,0.55)]",
              "transition-[transform,box-shadow] duration-200 group-hover:scale-110 group-hover:shadow-[0_0_64px_rgba(212,43,43,0.75)]",
            )}
            aria-hidden
          >
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden>
              <path d="M13 9L25 16L13 23V9Z" fill="white" stroke="white" strokeWidth="1" strokeLinejoin="round" />
            </svg>
          </span>
          <div className="text-center">
            <p className="text-base font-bold text-white">{hint}</p>
            <p className="mt-1 text-xs text-white/50">{title}</p>
          </div>
        </button>
      )}
    </div>
  );
}
