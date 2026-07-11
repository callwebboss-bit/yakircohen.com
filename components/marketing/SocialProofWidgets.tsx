"use client";

import Script from "next/script";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  GOOGLE_REVIEW_COUNT,
  SOCIAL_LINKS,
  STUDIO_GOOGLE_MAPS_URL,
} from "@/lib/constants";
import { SITE_TESTIMONIALS } from "@/lib/data/testimonials";
import {
  getTestimonialYear,
  TESTIMONIAL_CATEGORY_LABELS,
} from "@/lib/data/testimonial-categories";
import { cn } from "@/lib/utils";

const INSTAGRAM_HREF = SOCIAL_LINKS.find((s) => s.label === "Instagram")?.href ?? "https://www.instagram.com/";

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
      content loads - reserving the same spatial footprint CLS ≈ 0.
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
  /** Hide section header (when parent already shows Google badge) */
  compactHeader?: boolean;
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
      aria-label="טוען פיד אינסטגרם..."
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
      aria-label="טוען ביקורות Google..."
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
  const [shouldLoadScript, setShouldLoadScript] = useState(false);
  const [loadFailed, setLoadFailed] = useState(false);
  const [preferStaticMobile, setPreferStaticMobile] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const fallbackTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (fallbackTimerRef.current) clearTimeout(fallbackTimerRef.current);
    };
  }, []);

  // Mobile: skip ~450KB Elfsight; show Instagram profile CTA instead.
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia("(max-width: 767px)");
    const apply = () => setPreferStaticMobile(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  // Only fetch the Elfsight platform script once this section is near the
  // viewport - avoids loading ~450KB of third-party JS on pages where the
  // widget sits below the fold and is never scrolled into view.
  useEffect(() => {
    if (preferStaticMobile) return;
    const el = sectionRef.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setShouldLoadScript(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoadScript(true);
          observer.disconnect();
        }
      },
      { rootMargin: "400px 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [preferStaticMobile]);

  useEffect(() => {
    if (!shouldLoadScript) return;
    fallbackTimerRef.current = setTimeout(() => {
      if (!isReady) setLoadFailed(true);
    }, 8000);
    return () => {
      if (fallbackTimerRef.current) clearTimeout(fallbackTimerRef.current);
    };
  }, [shouldLoadScript, isReady]);

  const handleScriptLoad = useCallback(() => {
    timerRef.current = setTimeout(() => setIsReady(true), 400);
  }, []);

  return (
    <section
      ref={sectionRef}
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

      {preferStaticMobile ? (
        <div className="flex min-h-[200px] flex-col items-center justify-center gap-4 rounded-2xl border border-border bg-surface p-8 text-center">
          <p className="text-sm text-muted-foreground">
            במובייל פותחים את האינסטגרם ישירות, בלי טעינת וידג׳ט כבד.
          </p>
          <a
            href={INSTAGRAM_HREF}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-12 items-center gap-2 rounded-lg bg-brand-red px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
          >
            לפרופיל האינסטגרם
          </a>
        </div>
      ) : (
      <div className="relative min-h-[380px] sm:min-h-[440px]">
        {/* ── Pulse skeleton - sits in front via z-10 ── */}
        <div
          aria-hidden={isReady || loadFailed}
          className={cn(
            "absolute inset-x-0 top-0 z-10",
            "transition-opacity duration-500 ease-luxury",
            isReady || loadFailed ? "pointer-events-none opacity-0" : "opacity-100",
          )}
        >
          <InstagramGridSkeleton />
        </div>

        {/* ── Fallback when script fails to load ── */}
        {loadFailed && !isReady && (
          <div className="flex min-h-[280px] flex-col items-center justify-center gap-4 rounded-2xl border border-border bg-surface p-8 text-center">
            <p className="text-sm text-muted-foreground">
              הפיד לא נטען. צפו בתמונות שלנו ישירות באינסטגרם.
            </p>
            <a
              href={INSTAGRAM_HREF}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg bg-brand-red px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
            >
              לפרופיל האינסטגרם שלנו
            </a>
          </div>
        )}

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
      )}

      {/*
       * strategy="lazyOnload" defers the script until browser idle - docs
       * explicitly list "social media widgets" as the intended use case.
       * onLoad/onReady require a Client Component boundary (already set above).
       * Gated by the IntersectionObserver above so it's only fetched once
       * this section is close to the viewport.
       */}
      {shouldLoadScript && !preferStaticMobile && (
        <Script
          src="https://static.elfsight.com/platform/platform.js"
          strategy="lazyOnload"
          onLoad={handleScriptLoad}
        />
      )}
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

/** ביקורות מקומיות - גיבוי מהיר בלי iframe */
function LocalReviewsStrip() {
  const items = SITE_TESTIMONIALS.slice(0, 4);
  return (
    <div className="space-y-3" aria-label="ביקורות לקוחות">
      {items.map((item) => (
        <blockquote
          key={item.id}
          className="rounded-xl border border-border bg-surface p-4 text-sm leading-relaxed text-muted-foreground"
        >
          <p className="text-foreground">&ldquo;{item.quote}&rdquo;</p>
          <footer className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs">
            <span className="font-semibold text-foreground">{item.name}</span>
            {item.role ? (
              <span className="text-muted-foreground">- {item.role}</span>
            ) : null}
            {item.serviceCategory ? (
              <>
                <span className="text-muted-foreground" aria-hidden>
                  ·
                </span>
                <span>
                  {TESTIMONIAL_CATEGORY_LABELS[item.serviceCategory]}
                  {getTestimonialYear(item.datePublished)
                    ? ` · ${getTestimonialYear(item.datePublished)}`
                    : ""}
                </span>
              </>
            ) : null}
            {item.serviceHref && item.serviceLabel ? (
              <>
                <span className="text-muted-foreground" aria-hidden>
                  ·
                </span>
                <Link
                  href={item.serviceHref}
                  className="font-semibold text-brand-red hover:underline"
                >
                  {item.serviceLabel}
                </Link>
              </>
            ) : null}
          </footer>
        </blockquote>
      ))}
      <p className="text-center text-xs text-muted-foreground">
        <Link
          href={STUDIO_GOOGLE_MAPS_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-brand-red hover:underline"
        >
          עוד {GOOGLE_REVIEW_COUNT}+ ביקורות ב-Google Maps
        </Link>
      </p>
    </div>
  );
}

export function GoogleReviews({
  heading,
  subheading,
  className,
  compactHeader = false,
}: SocialProofWidgetProps) {
  const [isReady, setIsReady] = useState(false);
  const [preferLocal, setPreferLocal] = useState(true);

  return (
    <section
      className={cn("", className)}
      aria-labelledby={heading && !compactHeader ? "google-reviews-heading" : undefined}
    >
      {!compactHeader && (heading ?? subheading) ? (
        <header className="mb-8 text-center">
          {subheading ? (
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-red">
              {subheading}
            </p>
          ) : null}
          {heading ? (
            <h2
              id="google-reviews-heading"
              className="mt-2 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
            >
              {heading}
            </h2>
          ) : null}
        </header>
      ) : null}

      <div
        className="mb-4 flex flex-wrap justify-center gap-2 text-xs"
        role="tablist"
        aria-label="מקור ביקורות"
      >
        <button
          type="button"
          role="tab"
          aria-selected={!preferLocal}
          onClick={() => setPreferLocal(false)}
          className={cn(
            "rounded-full px-3 py-1.5 font-semibold transition-colors",
            !preferLocal ? "bg-brand-red text-white" : "bg-surface text-muted-foreground",
          )}
        >
          ביקורות Google (חי)
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={preferLocal}
          onClick={() => setPreferLocal(true)}
          className={cn(
            "rounded-full px-3 py-1.5 font-semibold transition-colors",
            preferLocal ? "bg-brand-red text-white" : "bg-surface text-muted-foreground",
          )}
        >
          ביקורות נוספות מהאתר
        </button>
      </div>

      {preferLocal ? (
        <LocalReviewsStrip />
      ) : (
        <div className="relative max-h-[min(720px,85vh)] min-h-[420px] overflow-y-auto overflow-x-hidden rounded-2xl border border-border sm:min-h-[560px]">
          <div
            aria-hidden={isReady}
            className={cn(
              "sticky top-0 z-10 p-4",
              "transition-opacity duration-500 ease-luxury",
              isReady ? "pointer-events-none opacity-0" : "opacity-100",
            )}
          >
            <ReviewsSkeleton />
          </div>
          <iframe
            src="https://ff74d962794e489d84eaf017cae85dd5.elf.site/"
            title="ביקורות Google של יקיר כהן הפקות"
            loading="lazy"
            className={cn(
              "min-h-[720px] w-full border-0",
              "transition-opacity duration-500 ease-luxury",
              isReady ? "opacity-100" : "opacity-0",
            )}
            allow="fullscreen"
            onLoad={() => setIsReady(true)}
          />
        </div>
      )}
    </section>
  );
}
