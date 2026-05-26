"use client";

import Image from "next/image";
import { useState } from "react";
import { VIDEO_WATCH_LABEL } from "@/lib/data/pricing";
import { cn } from "@/lib/utils";

/* ─────────────────────────────────────────────────────────────────────────────
   LazyYouTubePlayer
   ─────────────────────────────────────────────────────────────────────────────
   Renders a static thumbnail placeholder on first paint - zero iframe weight.
   A single click swaps the placeholder for the real embed with autoplay.

   YouTube thumbnail resolution ladder (highest → lowest):
     maxresdefault (1280×720) → hqdefault (480×360) always-present fallback.

   We intentionally use a plain <img> for the thumbnail (not next/image) to
   avoid requiring `i.ytimg.com` in next.config remotePatterns. The thumbnail
   is replaced by an iframe on first interaction, so Next.js optimisation is
   not worthwhile here.
   ───────────────────────────────────────────────────────────────────────────── */

export type LazyYouTubePlayerProps = {
  /** YouTube video ID (the `v=` query param value). */
  videoId: string;
  /** Descriptive title rendered as the iframe title and the button aria-label. */
  title: string;
  /** Fill a parent with fixed aspect ratio (e.g. filter showcase). */
  fillParent?: boolean;
  className?: string;
  /** Overlay before play (default from pricing.ts). */
  watchLabel?: string;
  /** טוען את הנגן מיד (לסרטון ראשי בעמוד). */
  defaultActive?: boolean;
};

export default function LazyYouTubePlayer({
  videoId,
  title,
  fillParent = false,
  className,
  watchLabel = VIDEO_WATCH_LABEL,
  defaultActive = false,
}: LazyYouTubePlayerProps) {
  const [isActive, setIsActive] = useState(defaultActive);
  const [thumbnailSrc, setThumbnailSrc] = useState(
    `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
  );

  const embedSrc =
    `https://www.youtube.com/embed/${videoId}` +
    `?autoplay=1&rel=0&modestbranding=1&color=white`;

  return (
    /* aspect-video (16/9) is declared on the outermost element so the browser
       reserves the correct space before any content loads - CLS = 0. */
    <div
      className={cn(
        fillParent
          ? "absolute inset-0 h-full w-full overflow-hidden rounded-xl bg-neutral-200"
          : "relative aspect-video w-full overflow-hidden rounded-xl bg-neutral-200",
        className,
      )}
    >
      {isActive ? (
        /* ── Active state: real YouTube embed ── */
        <iframe
          src={embedSrc}
          title={title}
          className="absolute inset-0 h-full w-full border-0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          loading="eager"
        />
      ) : (
        /* ── Placeholder state: thumbnail + gold play button ── */
        <button
          type="button"
          className="group relative absolute inset-0 w-full focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-brand-red"
          onClick={() => setIsActive(true)}
          aria-label={`הפעל סרטון: ${title}`}
        >
          <Image
            src={thumbnailSrc}
            alt=""
            aria-hidden
            fill
            sizes="(max-width: 768px) 100vw, 720px"
            className="object-cover"
            loading="lazy"
            onError={() =>
              setThumbnailSrc(
                `https://i.ytimg.com/vi/${videoId}/mqdefault.jpg`,
              )
            }
          />

          {/* Multi-stop gradient: strong at the bottom for title legibility,
              subtle at the top to frame the play button */}
          <div
            className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-black/30 transition-opacity duration-normal ease-luxury group-hover:from-black/85 group-hover:via-black/25"
            aria-hidden="true"
          />

          {/* ── Gold play button ── */}
          <p className="absolute inset-x-0 top-[18%] z-10 text-center text-sm font-semibold tracking-wide text-white/95 sm:text-base">
            {watchLabel}
          </p>

          <div
            className="absolute inset-0 flex items-center justify-center"
            aria-hidden="true"
          >
            <span
              className={cn(
                "flex h-[4.5rem] w-[4.5rem] items-center justify-center rounded-full",
                "bg-black/75 ring-2 ring-brand-red/55",
                "shadow-[0_0_36px_rgba(212,43,43,0.45)]",
                "transition-[transform,box-shadow,ring-color,background-color] duration-normal ease-luxury",
                "group-hover:scale-[1.12] group-hover:bg-black/85",
                "group-hover:ring-brand-red group-hover:shadow-[0_0_56px_rgba(212,43,43,0.65)]",
                "group-focus-visible:scale-[1.12]",
              )}
            >
              {/* Play triangle - offset 2px right for optical centering */}
              <svg
                width="32"
                height="32"
                viewBox="0 0 32 32"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M12 8L26 16L12 24V8Z"
                  fill="#D42B2B"
                  stroke="#D42B2B"
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </div>

          {/* ── Video title - bottom of frame ── */}
          <p
            className="absolute inset-x-4 bottom-4 line-clamp-2 text-right text-sm font-medium leading-snug text-white/90"
            aria-hidden="true"
          >
            {title}
          </p>
        </button>
      )}
    </div>
  );
}
