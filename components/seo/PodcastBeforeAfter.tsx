"use client";

import { useRef } from "react";
import { buildWhatsAppHref } from "@/lib/whatsapp";

/*
 * Audio files must be placed in /public/audio/:
 *   podcast-raw-sample.mp3   — a short raw clip (home/Zoom, with noise)
 *   podcast-clean-sample.mp3 — the same clip after AI noise cleaning
 */
const BEFORE_SRC = "/audio/podcast-raw-sample.mp3";
const AFTER_SRC = "/audio/podcast-clean-sample.mp3";

const whatsappHref = buildWhatsAppHref({
  text: "שלום, אשמח לשלוח קובץ הקלטה לבדיקת ניקוי רעשים ושיפור סאונד.",
  utm_source: "website",
  utm_campaign: "podcast_before_after",
});

export default function PodcastBeforeAfter() {
  const beforeRef = useRef<HTMLAudioElement>(null);
  const afterRef = useRef<HTMLAudioElement>(null);

  function pauseOther(playing: "before" | "after") {
    if (playing === "before") afterRef.current?.pause();
    else beforeRef.current?.pause();
  }

  return (
    <div className="rounded-2xl border border-border bg-surface p-6 sm:p-8">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        {/* Before */}
        <div className="rounded-xl border border-border bg-background p-5">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center rounded-full bg-muted px-2.5 py-0.5 text-xs font-semibold text-muted-foreground">
              לפני
            </span>
            <p className="text-sm font-semibold text-foreground">
              הקלטת זום גולמית
            </p>
          </div>
          <p className="mt-1.5 text-xs text-muted-foreground">
            רעשי רקע, אקו ותהודה בחדר
          </p>
          {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
          <audio
            ref={beforeRef}
            controls
            preload="metadata"
            className="mt-4 w-full"
            onPlay={() => pauseOther("before")}
            aria-label="הקלטת פודקאסט גולמית לפני ניקוי רעשים"
          >
            <source src={BEFORE_SRC} type="audio/mpeg" />
          </audio>
        </div>

        {/* After */}
        <div className="rounded-xl border border-brand-red/30 bg-brand-red/5 p-5">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center rounded-full bg-brand-red/15 px-2.5 py-0.5 text-xs font-semibold text-brand-red">
              אחרי
            </span>
            <p className="text-sm font-semibold text-foreground">
              אחרי שיפור הקלטות בבינה מלאכותית
            </p>
          </div>
          <p className="mt-1.5 text-xs text-muted-foreground">
            קול נקי, חם ומאוזן — כמו רדיו
          </p>
          {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
          <audio
            ref={afterRef}
            controls
            preload="metadata"
            className="mt-4 w-full"
            onPlay={() => pauseOther("after")}
            aria-label="הקלטת פודקאסט אחרי ניקוי רעשים ושיפור קול"
          >
            <source src={AFTER_SRC} type="audio/mpeg" />
          </audio>
        </div>
      </div>

      <div className="mt-7 text-center">
        <p className="text-sm text-muted-foreground">
          גם ההקלטה שלכם יכולה להישמע ככה
        </p>
        <a
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-flex items-center gap-2 rounded-xl bg-brand-red px-6 py-3 text-sm font-semibold text-white hover:bg-brand-red-light"
        >
          שלחו קובץ לבדיקה מהירה בוואטסאפ ←
        </a>
      </div>
    </div>
  );
}
