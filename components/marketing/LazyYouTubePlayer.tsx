"use client";

import { useState } from "react";
import VideoObjectSchema from "@/components/seo/VideoObjectSchema";
import { VIDEO_WATCH_LABEL } from "@/lib/data/pricing";
import { cn } from "@/lib/utils";

/* ─────────────────────────────────────────────────────────────────────────────
   LazyYouTubePlayer
   ─────────────────────────────────────────────────────────────────────────────
   Renders a static thumbnail placeholder on first paint - zero iframe weight.
   A single click swaps the placeholder for the real embed (no iframe until then - no auto sound).

   YouTube thumbnail resolution ladder (highest lowest):
     maxresdefault (1280×720) hqdefault (480×360) always-present fallback.

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
        /* ── Placeholder state: thumbnail + gold play button ──
           F-13 (7.10.2026): הכפתור absolute inset-0 בתוך מסגרת overflow-hidden, ולכן
           טבעת הפוקוס שלו נחתכה (offset 0 ובצבע ה---service-accent הגולמי). טבעת על
           המסגרת עצמה לא עבדה: ב-Chromium outline של אלמנט נצבע מתחת לילדים שלו
           כשהם absolute, ולכן הטבעת נמצאת על שכבת-על פנימית (המסגרת האחרונה למטה),
           בלבן עם הילה כהה, כך שהיא נראית על כל פוסטר ובכל הורה עם overflow-hidden. */
        <button
          type="button"
          className="group absolute inset-0 h-full w-full transition-transform duration-fast ease-luxury focus-visible:outline-none active:scale-[0.98]"
          onClick={() => setIsActive(true)}
          /* בלי aria-label: השם הנגיש נגזר מהתוכן הגלוי, watchLabel ואחריו כותרת
             הסרטון, כלומר "לצפייה בדוגמא <כותרת>", בסדר שבו הם נראים. כל נוסח נפרד
             נכשל ב-axe label-content-name-mismatch על 11 מ-12 התבניות (16.9.2026).
             F-31 (7.10.2026): ה-aria-hidden ישב על העטיפה כולה, כולל התווית, ולכן
             השם היה הכותרת בלבד ודיבור "לצפייה בדוגמא" לא הפעיל את הכפתור (2.5.3).
             עכשיו הוא רק על אייקון ה-play, והתווית נשארת בשם. F-58: העטיפות הן
             span ולא div/p, כי בתוך button מותר רק תוכן ביטויי (phrasing). כולן
             absolute, ולכן הן כבר בלוק בלי להוסיף display. */
        >
          {/* 6.10.2026: <img> רגיל ולא next/image. מקור ה-hqdefault הוא 480x360, וה-sizes הקודם
              ביקש מהאופטימייזר רוחבים עד 1920 (הגדלה בלי שיפור), בכל פוסטר ובכמה פורמטים.
              ב-12 השעות שנמדדו ב-Vercel 35 מ-83 הטרנספורמציות הגיעו מ-10 פוסטרים כאלה,
              ומכסת ה-Hobby (5,000 ל-30 יום) נוצלה. הכותרת למעלה כבר הצהירה על הכוונה הזו. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={thumbnailSrc}
            alt=""
            aria-hidden
            className="absolute inset-0 h-full w-full object-cover"
            loading="lazy"
            decoding="async"
            onError={() =>
              setThumbnailSrc(
                `https://i.ytimg.com/vi/${videoId}/mqdefault.jpg`,
              )
            }
          />

          <span
            className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/40 transition-opacity duration-normal ease-luxury group-hover:from-black/90 group-hover:via-black/30"
            aria-hidden="true"
          />

          <span
            className="pointer-events-none absolute inset-0 rounded-xl group-focus-visible:outline-[3px] group-focus-visible:-outline-offset-4 group-focus-visible:outline-white group-focus-visible:shadow-[inset_0_0_0_8px_rgba(0,0,0,0.55)]"
            aria-hidden="true"
          />

          <span className="absolute inset-0 flex flex-col items-center justify-center gap-3">
            <span
              aria-hidden="true"
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
            {/* F-08 (7.10.2026): התווית ישבה על הפוסטר בלי רקע, ובנקודות הבהירות של התמונה
                נמדדה ב-1.7 עד 2.8 מול 4.5 הנדרשים. גלולה כהה מתחתיה נותנת לה רקע קבוע
                (לבן על שחור 70% מעל פיקסל לבן הוא כ-8.6:1), בלי תלות בצבעי התמונה. */}
            <span className="rounded-full bg-black/70 px-3 py-1 text-sm font-semibold tracking-wide text-white sm:text-base">
              {watchLabel}
            </span>
          </span>

          {/* ── Video title - bottom of frame ── */}
          <span className="absolute inset-x-4 bottom-4 line-clamp-2 text-right text-sm font-medium leading-snug text-white/90">
            {title}
          </span>
        </button>
      )}
    </div>
    </>
  );
}
