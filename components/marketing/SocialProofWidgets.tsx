"use client";

import Script from "next/script";
import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

/* ─────────────────────────────────────────────────────────────────────────────
   SocialProofWidgets
   ─────────────────────────────────────────────────────────────────────────────
   Two independent export components:

   <InstagramFeed />   - Elfsight Instagram widget (platform.js, lazyOnload)
   <GoogleReviews />   - Elfsight-hosted Google Reviews in an <iframe>

   Both share the same loading architecture:
   1. The third-party content div/iframe is always in the DOM (opacity-0),
      so the browser begins fetching/rendering immediately.
   2. An absolutely-positioned pulse skeleton overlays the container while
      content loads - reserving the same spatial footprint → CLS ≈ 0.
   3. When content is ready, the skeleton fades out (opacity-0) and the
      widget fades in (opacity-100). Both are CSS `transition-opacity`, so
      no layout recalculation occurs during the transition.

   The outer container uses `min-h-*` rather than a fixed height so the
   widget can grow beyond the reserved space without triggering a shift
   (the skeleton has already absorbed the initial space budget).
   ───────────────────────────────────────────────────────────────────────────── */

/* ─── Shared prop type ───────────────────────────────────────────────────────*/

export type SocialProofWidgetProps = {
  /** Optional section heading rendered above the widget */
  heading?: string;
  /** Optional subtitle rendered below the heading */
  subheading?: string;
  className?: string;
};

/* ─────────────────────────────────────────────────────────────────────────────
   Skeleton sub-components
   ───────────────────────────────────────────────────────────────────────────── */

function Pulse({ className }: { className?: string }) {
  return (
    <div className={cn("animate-pulse rounded-lg bg-border/55", className)} />
  );
}

/** Simulates a 3×3 Instagram image grid */
function InstagramGridSkeleton() {
  return (
    <div
      className="grid grid-cols-3 gap-1.5 sm:gap-2"
      aria-label="טוען פיד אינסטגרם…"
      role="status"
    >
      {Array.from({ length: 9 }, (_, i) => (
        <Pulse key={i} className="aspect-square" />
      ))}
    </div>
  );
}

/** Simulates 3 stacked review cards */
function ReviewsSkeleton() {
  return (
    <div
      className="space-y-4"
      aria-label="טוען ביקורות Google…"
      role="status"
    >
      {Array.from({ length: 3 }, (_, i) => (
        <div
          key={i}
          className="space-y-3 rounded-xl border border-border bg-surface p-5"
        >
          {/* Avatar + name row */}
          <div className="flex items-center gap-3">
            <Pulse className="h-10 w-10 shrink-0 rounded-full" />
            <div className="flex-1 space-y-2">
              <Pulse className="h-3 w-28" />
              <Pulse className="h-3 w-20" />
            </div>
            {/* Star rating placeholder */}
            <Pulse className="h-3 w-16 rounded-full" />
          </div>
          {/* Review text lines */}
          <Pulse className="h-3 w-full" />
          <Pulse className="h-3 w-5/6" />
          <Pulse className="h-3 w-4/6" />
        </div>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   InstagramFeed
   ─────────────────────────────────────────────────────────────────────────────
   Loads the Elfsight platform via next/script (lazyOnload = browser-idle).
   `onLoad` fires when platform.js has parsed and executed; a 400 ms buffer
   lets Elfsight initialise the widget DOM before the skeleton fades out.
   ───────────────────────────────────────────────────────────────────────────── */

export function InstagramFeed({
  heading,
  subheading,
  className,
}: SocialProofWidgetProps) {
  const [isReady, setIsReady] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const handleScriptLoad = useCallback(() => {
    timerRef.current = setTimeout(() => setIsReady(true), 400);
  }, []);

  return (
    <section
      className={cn("", className)}
      aria-labelledby={heading ? "instagram-feed-heading" : undefined}
    >
      {(heading ?? subheading) && (
        <header className="mb-8 text-center">
          {subheading && (
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-red">
              {subheading}
            </p>
          )}
          {heading && (
            <h2
              id="instagram-feed-heading"
              className="mt-2 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
            >
              {heading}
            </h2>
          )}
        </header>
      )}

      {/*
       * Container: `relative` + `min-h` reserves layout space.
       * Both skeleton and widget use `absolute` x-positioning on the y-axis so
       * the container height is driven by min-h only, preventing late shifts.
       */}
      <div className="relative min-h-[380px] sm:min-h-[440px]">
        {/* ── Pulse skeleton - sits in front via z-10 ── */}
        <div
          aria-hidden={isReady}
          className={cn(
            "absolute inset-x-0 top-0 z-10",
            "transition-opacity duration-500 ease-luxury",
            isReady ? "pointer-events-none opacity-0" : "opacity-100",
          )}
        >
          <InstagramGridSkeleton />
        </div>

        {/* ── Elfsight widget container ── */}
        {/*
         * div.elfsight-app-* must always be in the DOM so platform.js can
         * locate and hydrate it. We fade it in via opacity rather than
         * toggling display so there is no layout recalculation at reveal.
         */}
        <div
          className={cn(
            "transition-opacity duration-500 ease-luxury",
            isReady ? "opacity-100" : "opacity-0",
          )}
        >
          <div
            className="elfsight-app-add83c9e-faf0-42d9-a497-51832f222f74"
            data-elfsight-app-lazy
          />
        </div>
      </div>

      {/*
       * strategy="lazyOnload" defers the script until browser idle - docs
       * explicitly list "social media widgets" as the intended use case.
       * onLoad/onReady require a Client Component boundary (already set above).
       */}
      <Script
        src="https://static.elfsight.com/platform/platform.js"
        strategy="lazyOnload"
        onLoad={handleScriptLoad}
      />
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   GoogleReviews
   ─────────────────────────────────────────────────────────────────────────────
   Wraps the Elfsight-hosted Google Reviews page in a layout-safe iframe.
   The native iframe `onLoad` event marks the widget as ready; the skeleton
   overlays until then with the same opacity-swap technique as InstagramFeed.
   ───────────────────────────────────────────────────────────────────────────── */

export function GoogleReviews({
  heading,
  subheading,
  className,
}: SocialProofWidgetProps) {
  const [isReady, setIsReady] = useState(false);

  return (
    <section
      className={cn("", className)}
      aria-labelledby={heading ? "google-reviews-heading" : undefined}
    >
      {(heading ?? subheading) && (
        <header className="mb-8 text-center">
          {subheading && (
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-red">
              {subheading}
            </p>
          )}
          {heading && (
            <h2
              id="google-reviews-heading"
              className="mt-2 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
            >
              {heading}
            </h2>
          )}
        </header>
      )}

      {/* Container: fixed-height so absolute iframe and skeleton share the same box */}
      <div className="relative min-h-[500px] overflow-hidden rounded-2xl border border-border">
        {/* ── Pulse skeleton overlay ── */}
        <div
          aria-hidden={isReady}
          className={cn(
            "absolute inset-0 z-10 p-4",
            "transition-opacity duration-500 ease-luxury",
            isReady ? "pointer-events-none opacity-0" : "opacity-100",
          )}
        >
          <ReviewsSkeleton />
        </div>

        {/*
         * iframe: absolute inset-0 fills the container.
         * loading="lazy" lets the browser defer the request until the iframe
         * is near the viewport - complementing the lazyOnload Script strategy
         * used by InstagramFeed. The onLoad event triggers the skeleton fade.
         */}
        <iframe
          src="https://ff74d962794e489d84eaf017cae85dd5.elf.site/"
          title="ביקורות Google של יקיר כהן הפקות"
          loading="lazy"
          className={cn(
            "absolute inset-0 h-full w-full border-0",
            "transition-opacity duration-500 ease-luxury",
            isReady ? "opacity-100" : "opacity-0",
          )}
          /* Allow Elfsight full permissions without exposing sensitive APIs */
          allow="fullscreen"
          onLoad={() => setIsReady(true)}
        />
      </div>
    </section>
  );
}
