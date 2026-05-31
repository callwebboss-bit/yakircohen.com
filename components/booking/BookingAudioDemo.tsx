"use client";

import { useRef } from "react";

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

  function pauseOther(playing: "before" | "after") {
    if (playing === "before") afterRef.current?.pause();
    else beforeRef.current?.pause();
  }

  return (
    <div className="rounded-xl border border-border bg-surface p-4 sm:p-5">
      <p className="mb-3 text-xs font-semibold text-muted-foreground">
        🎧 שמעו את ההבדל — לפני ואחרי
      </p>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {/* Before */}
        <div className="rounded-lg border border-border bg-background p-4">
          <div className="mb-1 flex items-center gap-2">
            <span className="rounded-full bg-muted px-2 py-0.5 text-[0.65rem] font-semibold text-muted-foreground">
              לפני
            </span>
            <span className="text-sm font-medium text-foreground">{beforeLabel}</span>
          </div>
          {beforeNote && (
            <p className="mb-2 text-xs text-muted-foreground">{beforeNote}</p>
          )}
          {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
          <audio
            ref={beforeRef}
            controls
            preload="metadata"
            className="w-full"
            onPlay={() => pauseOther("before")}
            aria-label={`לפני: ${beforeLabel}`}
          >
            <source src={beforeSrc} type="audio/mpeg" />
          </audio>
        </div>

        {/* After */}
        <div className="rounded-lg border border-brand-red/30 bg-brand-red/5 p-4">
          <div className="mb-1 flex items-center gap-2">
            <span className="rounded-full bg-brand-red/15 px-2 py-0.5 text-[0.65rem] font-semibold text-brand-red">
              אחרי
            </span>
            <span className="text-sm font-medium text-foreground">{afterLabel}</span>
          </div>
          {afterNote && (
            <p className="mb-2 text-xs text-muted-foreground">{afterNote}</p>
          )}
          {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
          <audio
            ref={afterRef}
            controls
            preload="metadata"
            className="w-full"
            onPlay={() => pauseOther("after")}
            aria-label={`אחרי: ${afterLabel}`}
          >
            <source src={afterSrc} type="audio/mpeg" />
          </audio>
        </div>
      </div>
    </div>
  );
}
