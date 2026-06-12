"use client";

import Image from "next/image";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { BLUR_DATA_URL } from "@/lib/blur";
import { ensureImageAlt } from "@/lib/image-alt";
import { deriveHebrewAlt } from "@/lib/hebrew-image-alt";
import { cn } from "@/lib/utils";

/* ─────────────────────────────────────────────────────────────────────────────
   Types
   ───────────────────────────────────────────────────────────────────────────── */

export type GalleryItem = {
  src: string;
  /**
   * Explicit alt text. When omitted the component runs deriveHebrewAlt()
   * against the filename to produce a descriptive Hebrew string.
   */
  alt?: string;
  /**
   * Intrinsic pixel dimensions of the source file. Supplying these lets
   * next/image generate a correct srcset and allows the browser to reserve
   * the right amount of vertical space in the masonry column before the image
   * loads - eliminating CLS. When omitted a 4:3 default is assumed.
   */
  width?: number;
  height?: number;
};

export type MediaGalleryProps = {
  images: Array<GalleryItem | string>;
  heading?: string;
  subheading?: string;
  className?: string;
  /** When set, only this many images show until the visitor expands (perf + UX). */
  initialVisible?: number;
  /** Embedded inside another section (no extra vertical padding / outer header). */
  embedded?: boolean;
  /** Uniform grid works better for mixed event photos; masonry for editorial layouts. */
  layout?: "masonry" | "grid";
  /**
   * Optional images from `archive/` or `arcive/` under the service folder.
   * Shown after primary images, via a separate "הצג עוד מהארכיון" control.
   */
  archiveImages?: Array<GalleryItem | string>;
  /** הצג שורת ספירה בתחתית (ברירת מחדל: כן) */
  showFooterHint?: boolean;
};

/* ─────────────────────────────────────────────────────────────────────────────
   Internal normalisation
   ───────────────────────────────────────────────────────────────────────────── */

type NormalizedItem = Required<GalleryItem>;

function normalize(
  item: GalleryItem | string,
  index: number,
): NormalizedItem {
  const base: GalleryItem = typeof item === "string" ? { src: item } : item;
  return {
    src: base.src,
    alt: ensureImageAlt(base.alt, {
      filename: base.src.split("/").pop(),
      fallback: deriveHebrewAlt(base.src, index),
    }),
    width: base.width ?? 800,
    height: base.height ?? 600,
  };
}

/* ─────────────────────────────────────────────────────────────────────────────
   SVG Icons
   ───────────────────────────────────────────────────────────────────────────── */

function CloseIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M4 4L16 16M16 4L4 16"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ChevronLeftIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M15 5L8 12L15 19"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M9 5L16 12L9 19"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   Lightbox sub-component
   ─────────────────────────────────────────────────────────────────────────────
   Accessibility model:
   - role="dialog" + aria-modal on the overlay
   - Focus is moved to the close button on open; restored to the triggering
     thumbnail on close via a stored ref.
   - Document-level keydown listener handles ← Prev / → Next / Escape.
   - Body scroll is locked for the lifetime of the open dialog.
   - Touch swipe: left → next, right → previous.
   ───────────────────────────────────────────────────────────────────────────── */

type LightboxProps = {
  items: NormalizedItem[];
  index: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
};

function Lightbox({ items, index, onClose, onPrev, onNext }: LightboxProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const touchStartX = useRef<number | null>(null);
  const item = items[index];

  /* Body scroll lock - save scrollY so we can restore it on unmount. */
  useEffect(() => {
    const y = window.scrollY;
    document.body.style.cssText = `overflow:hidden;position:fixed;top:-${y}px;width:100%;`;
    closeButtonRef.current?.focus();
    return () => {
      document.body.style.cssText = "";
      window.scrollTo(0, y);
    };
  }, []);

  /* Document-level keyboard handler. */
  useEffect(() => {
    const handleKey = (e: globalThis.KeyboardEvent) => {
      if (e.key === "ArrowLeft") { e.preventDefault(); onPrev(); }
      else if (e.key === "ArrowRight") { e.preventDefault(); onNext(); }
      else if (e.key === "Escape") { e.preventDefault(); onClose(); }
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose, onPrev, onNext]);

  const handleOverlayClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (e.target === e.currentTarget) onClose();
    },
    [onClose],
  );

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const delta = touchStartX.current - e.changedTouches[0].clientX;
    touchStartX.current = null;
    if (Math.abs(delta) < 48) return; // minimum swipe distance
    if (delta > 0) onNext();
    else onPrev();
  };

  if (!item) return null;

  const counter = `${index + 1} / ${items.length}`;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="תצוגת תמונה מוגדלת"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/92 backdrop-blur-sm"
      onClick={handleOverlayClick}
    >
      {/* ── Close button ── */}
      <button
        ref={closeButtonRef}
        type="button"
        onClick={onClose}
        className={cn(
          "absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full",
          "border border-white/20 bg-black/60 text-white/80",
          "transition-[background-color,color] duration-fast ease-luxury",
          "hover:bg-white/20 hover:text-white",
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--service-accent,#d42b2b)]",
        )}
        aria-label="סגור"
      >
        <CloseIcon />
      </button>

      {/* ── Previous button ── */}
      <button
        type="button"
        onClick={onPrev}
        className={cn(
          "absolute left-3 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full",
          "border border-white/20 bg-black/60 text-white/70",
          "transition-[background-color,color,border-color] duration-fast ease-luxury",
          "hover:border-[var(--service-accent,#d42b2b)]/60 hover:bg-black/80 hover:text-[var(--service-accent,#d42b2b)]",
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--service-accent,#d42b2b)]",
          "sm:left-5",
        )}
        aria-label="תמונה קודמת"
      >
        <ChevronLeftIcon />
      </button>

      {/* ── Next button ── */}
      <button
        type="button"
        onClick={onNext}
        className={cn(
          "absolute right-3 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full",
          "border border-white/20 bg-black/60 text-white/70",
          "transition-[background-color,color,border-color] duration-fast ease-luxury",
          "hover:border-[var(--service-accent,#d42b2b)]/60 hover:bg-black/80 hover:text-[var(--service-accent,#d42b2b)]",
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--service-accent,#d42b2b)]",
          "sm:right-5",
        )}
        aria-label="תמונה הבאה"
      >
        <ChevronRightIcon />
      </button>

      {/* ── Full-resolution image ── */}
      <div
        className="relative h-[85dvh] w-[90vw] max-w-5xl"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <Image
          key={item.src}
          src={item.src}
          alt={item.alt}
          fill
          className="object-contain"
          sizes="90vw"
          priority
          quality={90}
        />
      </div>

      {/* ── Counter + alt caption ── */}
      <div className="absolute bottom-4 inset-x-4 flex flex-col items-center gap-1 text-center">
        <p className="text-xs font-medium tabular-nums text-white/50">
          {counter}
        </p>
        <p className="max-w-lg text-sm text-white/75">{item.alt}</p>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   MediaGallery
   ─────────────────────────────────────────────────────────────────────────────
   CSS-columns masonry: items flow top-to-bottom within each column in reading
   order. `break-inside-avoid` prevents an item from splitting across columns.

   The first 6 thumbnails load eagerly (likely above the fold); the rest are
   lazy-loaded by the browser.

   Columns: 1 (mobile) → 2 (sm) → 3 (lg). Customise via `className`.
   ───────────────────────────────────────────────────────────────────────────── */

export default function MediaGallery({
  images,
  heading,
  subheading,
  className,
  initialVisible,
  embedded = false,
  layout = "masonry",
  archiveImages = [],
  showFooterHint = true,
}: MediaGalleryProps) {
  const primaryItems = useMemo(() => images.map(normalize), [images]);
  const archiveItems = useMemo(
    () => archiveImages.map((item, index) => normalize(item, primaryItems.length + index)),
    [archiveImages, primaryItems.length],
  );

  const [primaryExpanded, setPrimaryExpanded] = useState(false);
  const [archiveVisible, setArchiveVisible] = useState(false);

  const visiblePrimary =
    initialVisible && initialVisible > 0 && !primaryExpanded
      ? primaryItems.slice(0, Math.min(initialVisible, primaryItems.length))
      : primaryItems;
  const visibleArchive = archiveVisible ? archiveItems : [];
  const visibleItems = [...visiblePrimary, ...visibleArchive];

  const remainingPrimary = primaryItems.length - visiblePrimary.length;
  const archiveCount = archiveItems.length;

  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  /* Store the DOM button that opened the lightbox so we can restore focus. */
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  const openLightbox = useCallback(
    (index: number, trigger: HTMLButtonElement) => {
      triggerRef.current = trigger;
      setLightboxIndex(index);
    },
    [],
  );

  const closeLightbox = useCallback(() => {
    setLightboxIndex(null);
    /* Restore focus after the overlay unmounts. */
    requestAnimationFrame(() => triggerRef.current?.focus());
  }, []);

  const itemCount = visibleItems.length;

  const goPrev = useCallback(() => {
    setLightboxIndex((i) =>
      i === null ? null : (i - 1 + itemCount) % itemCount,
    );
  }, [itemCount]);

  const goNext = useCallback(() => {
    setLightboxIndex((i) => (i === null ? null : (i + 1) % itemCount));
  }, [itemCount]);

  if (primaryItems.length === 0 && archiveItems.length === 0) return null;

  const openAtIndex = (index: number, trigger: HTMLButtonElement) => {
    openLightbox(index, trigger);
  };

  return (
    <section
      className={cn(!embedded && "bg-background py-12 sm:py-16", className)}
      aria-label={heading ?? "גלריית תמונות"}
    >
      <div
        className={cn(
          embedded ? undefined : "mx-auto max-w-[72rem] px-4 sm:px-6 lg:px-8",
        )}
      >
        {/* ── Optional header ── */}
        {!embedded && (heading ?? subheading) ? (
          <header className="mb-8 text-center">
            {subheading ? (
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--service-accent,#d42b2b)]">
                {subheading}
              </p>
            ) : null}
            {heading ? (
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                {heading}
              </h2>
            ) : null}
          </header>
        ) : null}

        {layout === "grid" ? (
          <ul
            className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:gap-4"
            aria-label="גלריית תמונות"
          >
            {visibleItems.map((item, index) => (
              <li
                key={item.src}
                className="hover-lift overflow-hidden rounded-xl border border-border bg-neutral-100"
              >
                <button
                  type="button"
                  className="group relative block aspect-[4/3] w-full overflow-hidden transition-transform duration-fast ease-luxury focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--service-accent,#d42b2b)] active:scale-[0.98]"
                  aria-label={`פתח תמונה: ${item.alt}`}
                  onClick={(e) =>
                    openAtIndex(index, e.currentTarget as HTMLButtonElement)
                  }
                >
                  <Image
                    src={item.src}
                    alt={item.alt}
                    fill
                    className="object-cover transition-[transform,filter] duration-normal ease-luxury group-hover:scale-[1.03] group-hover:brightness-95"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    loading={index < 6 ? "eager" : "lazy"}
                    priority={index < 2}
                    placeholder="blur"
                    blurDataURL={BLUR_DATA_URL}
                  />
                  <div
                    className="absolute inset-0 flex items-end bg-gradient-to-t from-black/50 via-transparent to-transparent p-3 opacity-0 transition-opacity duration-normal ease-luxury group-hover:opacity-100"
                    aria-hidden
                  >
                    <span className="text-xs font-semibold text-white">הגדל</span>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <ul
            className="columns-1 gap-3 sm:columns-2 lg:columns-3"
            aria-label="גלריית תמונות"
          >
            {visibleItems.map((item, index) => (
              <li
                key={item.src}
                className="hover-lift mb-3 break-inside-avoid overflow-hidden rounded-xl border border-border"
              >
                <button
                  type="button"
                  className="group relative block w-full overflow-hidden transition-transform duration-fast ease-luxury focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--service-accent,#d42b2b)] active:scale-[0.98]"
                  aria-label={`פתח תמונה: ${item.alt}`}
                  onClick={(e) =>
                    openAtIndex(index, e.currentTarget as HTMLButtonElement)
                  }
                >
                  <Image
                    src={item.src}
                    alt={item.alt}
                    width={item.width}
                    height={item.height}
                    className="block h-auto w-full transition-[transform,filter] duration-normal ease-luxury group-hover:scale-[1.03] group-hover:brightness-90"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    loading={index < 4 ? "eager" : "lazy"}
                    priority={index < 2}
                    placeholder="blur"
                    blurDataURL={BLUR_DATA_URL}
                  />
                  <div
                    className="absolute inset-0 flex items-end bg-gradient-to-t from-black/50 via-transparent to-transparent p-4 opacity-0 transition-opacity duration-normal ease-luxury group-hover:opacity-100"
                    aria-hidden="true"
                  >
                    <span className="flex items-center gap-1.5 rounded-full border border-[var(--service-accent,#d42b2b)]/60 bg-black/70 px-2.5 py-1 text-xs font-semibold text-[var(--service-accent,#d42b2b)] backdrop-blur-sm">
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 12 12"
                        fill="none"
                        aria-hidden="true"
                      >
                        <circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="1.5" />
                        <path d="M4 6h4M6 4v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                      </svg>
                      הגדל
                    </span>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        )}

        {remainingPrimary > 0 ? (
          <div className="mt-5 flex justify-center">
            <button
              type="button"
              onClick={() => setPrimaryExpanded(true)}
              className="rounded-xl border border-border bg-surface px-6 py-3 text-sm font-semibold text-foreground transition-colors duration-normal ease-luxury hover:border-[var(--service-accent,#d42b2b)]/40 hover:text-[var(--service-accent,#d42b2b)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--service-accent,#d42b2b)]"
            >
              הצג עוד {remainingPrimary} תמונות
            </button>
          </div>
        ) : null}
        {remainingPrimary === 0 && archiveCount > 0 && !archiveVisible ? (
          <div className="mt-5 flex justify-center">
            <button
              type="button"
              onClick={() => setArchiveVisible(true)}
              className="rounded-xl border border-dashed border-border bg-surface px-6 py-3 text-sm font-semibold text-foreground transition-colors duration-normal ease-luxury hover:border-[var(--service-accent,#d42b2b)]/40 hover:text-[var(--service-accent,#d42b2b)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--service-accent,#d42b2b)]"
            >
              הצג עוד {archiveCount} תמונות מהארכיון
            </button>
          </div>
        ) : null}

        {showFooterHint ? (
          <p className="mt-6 text-center text-xs text-muted-foreground">
            לחצו על תמונה להגדלה
          </p>
        ) : null}
      </div>

      {/* ── Lightbox - rendered outside the list, anchored to viewport ── */}
      {lightboxIndex !== null && (
        <Lightbox
          items={visibleItems}
          index={lightboxIndex}
          onClose={closeLightbox}
          onPrev={goPrev}
          onNext={goNext}
        />
      )}
    </section>
  );
}
