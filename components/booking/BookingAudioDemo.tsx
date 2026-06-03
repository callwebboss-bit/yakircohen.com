"use client";

import { useRef, useState } from "react";

type BookingAudioDemoProps = {
  beforeSrc: string;
  afterSrc: string;
  beforeLabel: string;
  afterLabel: string;
  beforeNote?: string;
  afterNote?: string;
};

export default function BookingAudioDemo({
  beforeSrc,
  afterSrc,
  beforeLabel,
  afterLabel,
  beforeNote,
  afterNote,
}: BookingAudioDemoProps) {
  const beforeRef = useRef<HTMLAudioElement>(null);
  const afterRef = useRef<HTMLAudioElement>(null);
  const [playingBefore, setPlayingBefore] = useState(false);
  const [playingAfter, setPlayingAfter] = useState(false);

  function toggleBefore() {
    const b = beforeRef.current;
    const a = afterRef.current;
    if (!b) return;
    if (b.paused) {
      a?.pause();
      setPlayingAfter(false);
      b.play();
      setPlayingBefore(true);
    } else {
      b.pause();
      setPlayingBefore(false);
    }
  }

  function toggleAfter() {
    const b = beforeRef.current;
    const a = afterRef.current;
    if (!a) return;
    if (a.paused) {
      b?.pause();
      setPlayingBefore(false);
      a.play();
      setPlayingAfter(true);
    } else {
      a.pause();
      setPlayingAfter(false);
    }
  }

  function handleEnded(which: "before" | "after") {
    if (which === "before") setPlayingBefore(false);
    else setPlayingAfter(false);
  }

  return (
    <div className="mt-4 rounded-xl border border-border bg-surface p-4">
      <p className="mb-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
        שמעו את ההבדל
      </p>
      <div className="grid grid-cols-2 gap-3">
        {[
          {
            label: beforeLabel,
            note: beforeNote,
            src: beforeSrc,
            playing: playingBefore,
            toggle: toggleBefore,
            side: "before" as const,
          },
          {
            label: afterLabel,
            note: afterNote,
            src: afterSrc,
            playing: playingAfter,
            toggle: toggleAfter,
            side: "after" as const,
          },
        ].map(({ label, note, src, playing, toggle, side }) => (
          <div
            key={side}
            className="flex flex-col items-center gap-2 rounded-lg border border-border bg-background p-3 text-center"
          >
            <p className="text-xs font-semibold text-foreground">{label}</p>
            {note ? <p className="text-[0.65rem] text-muted-foreground">{note}</p> : null}
            {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
            <audio
              ref={side === "before" ? beforeRef : afterRef}
              src={src}
              preload="metadata"
              onEnded={() => handleEnded(side)}
            />
            <button
              type="button"
              onClick={toggle}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-red text-white shadow-sm hover:bg-brand-red-light"
              aria-label={playing ? "עצור" : "הפעל"}
            >
              {playing ? (
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <rect x="2" y="2" width="4" height="10" rx="1" />
                  <rect x="8" y="2" width="4" height="10" rx="1" />
                </svg>
              ) : (
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M3 2l9 5-9 5V2z" />
                </svg>
              )}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
