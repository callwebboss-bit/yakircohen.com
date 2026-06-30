"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { getAudioDemo, type AudioDemoId } from "@/lib/data/audio-demos";
import { cn } from "@/lib/utils";

const DEFAULT_CLIP_SECONDS = 5;

type MicroAudioAuditionProps = {
  demoId: AudioDemoId;
  className?: string;
  clipSeconds?: number;
};

export default function MicroAudioAudition({
  demoId,
  className,
  clipSeconds = DEFAULT_CLIP_SECONDS,
}: MicroAudioAuditionProps) {
  const demo = getAudioDemo(demoId);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const stop = useCallback(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
    setPlaying(false);
  }, []);

  useEffect(() => () => stop(), [stop]);

  if (!demo || demo.status === "pending") {
    return (
      <span
        className={cn(
          "inline-flex min-h-12 min-w-12 items-center justify-center rounded-full border border-border bg-muted/30 text-xs text-muted-foreground",
          className,
        )}
        title="דגימה בקרוב"
        aria-hidden="true"
      >
        ♪
      </span>
    );
  }

  const toggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    if (playing) {
      stop();
      return;
    }

    if (!audioRef.current) {
      const audio = new Audio(demo.afterSrc);
      audio.preload = "none";
      audioRef.current = audio;
      audio.addEventListener("timeupdate", () => {
        if (audio.currentTime >= clipSeconds) stop();
      });
      audio.addEventListener("ended", () => setPlaying(false));
      audio.addEventListener("error", () => setPlaying(false));
    }

    const audio = audioRef.current;
    audio.currentTime = 0;
    void audio.play().then(() => {
      setLoaded(true);
      setPlaying(true);
    }).catch(() => setPlaying(false));
  };

  return (
    <button
      type="button"
      onClick={toggle}
      className={cn(
        "inline-flex min-h-12 min-w-12 shrink-0 items-center justify-center rounded-full border transition-colors",
        playing
          ? "border-brand-red bg-brand-red/10 text-brand-red"
          : "border-border bg-background text-muted-foreground hover:border-brand-red/40 hover:text-brand-red",
        className,
      )}
      aria-label={playing ? "עצור דגימת שמע" : "נגן דגימת שמע 5 שניות"}
      aria-pressed={playing}
    >
      <span aria-hidden="true" className="text-sm font-bold">
        {playing ? "■" : "▶"}
      </span>
      {loaded ? null : (
        <span className="sr-only">דגימה אחרי עריכה</span>
      )}
    </button>
  );
}
