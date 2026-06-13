"use client";

import Image from "next/image";
import { useState } from "react";
import VideoObjectSchema from "@/components/seo/VideoObjectSchema";
import { VIDEO_WATCH_LABEL } from "@/lib/data/pricing";
import { cn } from "@/lib/utils";

/* ─────────────────────────────────────────────────────────────────────────────
   LazyYouTubePlayer
   ─────────────────────────────────────────────────────────────────────────────
   Renders a static thumbnail placeholder on first paint - zero iframe weight.
   A single click swaps the placeholder for the real embed (no iframe until then - no auto sound).

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
  /** מזריק VideoObject JSON-LD לפני הפלייסהולדר */
  withSchema?: boolean;
};

export default function LazyYouTubePlayer({
  videoId,
  title,
  fillParent = false,
  className,
  watchLabel = VIDEO_WATCH_LABEL,
  defaultActive = false,
  withSchema = false,
}: LazyYouTubePlayerProps) {
  const [isActive, setIsActive] = useState(defaultActive);
  const [thumbnailSrc, setThumbnailSrc] = useState(
    `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
  );

  const embedSrc =
    `https://www.youtube.com/embed/${videoId}` +
    `?rel=0&modestbranding=1&color=white`;

  return (
    <>
      {withSchema ? (
        <VideoObjectSchema videos={[{ videoId, name: title }]} />
      ) : null}
      {/* aspect-video (16/9) is declared on the outermost element so the browser
       reserves the correct space before any content loads - CLS = 0. */}
      <div
      className={cn(
        fillParent
          ? "absolute inset-0 h-full w-full overflow-hidden rounded-xl bg-neutral-900"
          : "relative aspect-video w-full overflow-hidden rounded-xl bg-neutral-900",
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
          className="group absolute inset-0 h-full w-full transition-transform duration-fast ease-luxury focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-[var(--service-accent,#d42b2b)] active:scale-[0.98]"
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

          <div
            className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/40 transition-opacity duration-normal ease-luxury group-hover:from-black/90 group-hover:via-black/30"
            aria-hidden="true"
          />

          <div
            className="absolute inset-0 flex flex-col items-center justify-center gap-3"
            aria-hidden="true"
          >
            <span
              className={cn(
                "flex h-20 w-20 items-center justify-center rounded-full text-[var(--service-accent,#d42b2b)]",
                "bg-black/80 ring-2 ring-[var(--service-accent,#d42b2b)]/70",
                "shadow-[0_0_44px_color-mix(in_srgb,var(--service-accent,#d42b2b)_55%,transparent)]",
                "transition-[transform,box-shadow,ring-color,background-color] duration-normal ease-luxury",
                "group-hover:scale-[1.12] group-hover:bg-black/90",
                "group-hover:ring-[var(--service-accent,#d42b2b)] group-hover:shadow-[0_0_64px_color-mix(in_srgb,var(--service-accent,#d42b2b)_75%,transparent)]",
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
                  fill="currentColor"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <span className="text-sm font-semibold tracking-wide text-white/95 sm:text-base">
              {watchLabel}
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
    </>
  );
}
