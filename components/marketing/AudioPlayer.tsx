"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

/* ─── Types ──────────────────────────────────────────────────────────────── */

export type AudioTrack = {
  src: string;
  /** Displayed track title */
  title: string;
  /** Genre/category badge displayed above the title (e.g. "פרסומת", "פודקאסט") */
  label?: string;
};

export type AudioPlayerProps = {
  /** One or more audio tracks. Single-item array hides prev/next controls. */
  tracks: AudioTrack[];
  className?: string;
};

/* ─── Helpers ────────────────────────────────────────────────────────────── */

function formatTime(seconds: number): string {
  if (!isFinite(seconds) || isNaN(seconds)) return "--:--";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

/* ─── SVG Icons ──────────────────────────────────────────────────────────── */

function PlayIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M5 3.5L14.5 9L5 14.5V3.5Z" />
    </svg>
  );
}

function PauseIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="currentColor"
      aria-hidden="true"
    >
      <rect x="4" y="3" width="3" height="12" rx="1" />
      <rect x="11" y="3" width="3" height="12" rx="1" />
    </svg>
  );
}

function PrevIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 15 15"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M10.5 2.5L5 7.5L10.5 12.5V2.5Z" />
      <rect x="2.5" y="2.5" width="2" height="10" rx="0.5" />
    </svg>
  );
}

function NextIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 15 15"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M4.5 2.5L10 7.5L4.5 12.5V2.5Z" />
      <rect x="10.5" y="2.5" width="2" height="10" rx="0.5" />
    </svg>
  );
}

/* ─── Component ──────────────────────────────────────────────────────────── */

export default function AudioPlayer({ tracks, className }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [trackIndex, setTrackIndex] = useState(0);

  const isMultiTrack = tracks.length > 1;
  const currentTrack = tracks[trackIndex] ?? tracks[0];
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  /* When the track index changes, reload the audio element and resume if
     it was previously playing. We read the audio element's paused state
     directly so we don't close over stale React state. */
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const resume = !audio.paused;
    audio.load();
    setCurrentTime(0);
    setDuration(0);
    if (resume) {
      void audio.play();
    }
  }, [trackIndex]);

  const togglePlay = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
    } else {
      try {
        await audio.play();
      } catch {
        setIsPlaying(false);
      }
    }
  }, [isPlaying]);

  const seek = useCallback((clientX: number) => {
    const bar = progressRef.current;
    const audio = audioRef.current;
    if (!bar || !audio || !isFinite(audio.duration)) return;
    const { left, width } = bar.getBoundingClientRect();
    /* Progress fills left → right regardless of page direction (standard for
       media players) so we use the physical left offset here. */
    const pct = Math.max(0, Math.min(1, (clientX - left) / width));
    audio.currentTime = pct * audio.duration;
  }, []);

  const handleProgressPointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      e.currentTarget.setPointerCapture(e.pointerId);
      seek(e.clientX);
    },
    [seek],
  );

  const handleProgressPointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (e.buttons === 0) return;
      seek(e.clientX);
    },
    [seek],
  );

  const handlePrev = useCallback(() => {
    const audio = audioRef.current;
    /* Restart current track if more than 3 s in, otherwise go to previous */
    if (audio && audio.currentTime > 3) {
      audio.currentTime = 0;
      return;
    }
    setTrackIndex((i) => (i - 1 + tracks.length) % tracks.length);
  }, [tracks.length]);

  const handleNext = useCallback(() => {
    setTrackIndex((i) => (i + 1) % tracks.length);
  }, [tracks.length]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      switch (e.code) {
        case "Space":
          e.preventDefault();
          void togglePlay();
          break;
        case "ArrowLeft":
          if (audioRef.current)
            audioRef.current.currentTime = Math.max(
              0,
              audioRef.current.currentTime - 5,
            );
          break;
        case "ArrowRight":
          if (audioRef.current)
            audioRef.current.currentTime = Math.min(
              duration,
              audioRef.current.currentTime + 5,
            );
          break;
      }
    },
    [togglePlay, duration],
  );

  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-background p-5 shadow-sm transition-shadow duration-normal ease-luxury hover:shadow-md",
        className,
      )}
      role="region"
      aria-label="נגן שמע"
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      {/* ── Hidden native audio element ── */}
      {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
      <audio
        ref={audioRef}
        src={currentTrack.src}
        preload="metadata"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => {
          if (isMultiTrack) {
            handleNext();
          } else {
            setIsPlaying(false);
            setCurrentTime(0);
          }
        }}
        onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
      />

      {/* ── Controls + track info row ── */}
      <div className="flex items-center gap-3">
        {/* Prev (multi-track) */}
        {isMultiTrack && (
          <button
            type="button"
            onClick={handlePrev}
            className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition-colors duration-normal ease-luxury hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red"
            aria-label="רצועה קודמת"
          >
            <PrevIcon />
          </button>
        )}

        {/* Play / Pause */}
        <button
          type="button"
          onClick={() => void togglePlay()}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-foreground text-background transition-[background-color,transform] duration-normal ease-luxury hover:bg-brand-red hover:text-white active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red"
          aria-label={isPlaying ? "השהה" : "נגן"}
          aria-pressed={isPlaying}
        >
          {isPlaying ? <PauseIcon /> : <PlayIcon />}
        </button>

        {/* Next (multi-track) */}
        {isMultiTrack && (
          <button
            type="button"
            onClick={handleNext}
            className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition-colors duration-normal ease-luxury hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red"
            aria-label="רצועה הבאה"
          >
            <NextIcon />
          </button>
        )}

        {/* Track info */}
        <div className="min-w-0 flex-1">
          {currentTrack.label && (
            <p className="text-[0.6rem] font-semibold uppercase tracking-[0.18em] text-brand-red">
              {currentTrack.label}
            </p>
          )}
          <p className="truncate text-sm font-medium text-foreground">
            {currentTrack.title}
          </p>
        </div>

        {/* Timestamp */}
        <div
          className="shrink-0 font-mono text-xs tabular-nums text-muted-foreground"
          aria-live="polite"
          aria-atomic="true"
        >
          <span>{formatTime(currentTime)}</span>
          <span className="mx-1 text-border" aria-hidden="true">
            /
          </span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* ── Progress bar ── */}
      <div
        ref={progressRef}
        role="slider"
        aria-label="מיקום ניגון"
        aria-valuenow={Math.round(progress)}
        aria-valuemin={0}
        aria-valuemax={100}
        className="group relative mt-4 h-1.5 cursor-pointer rounded-full bg-border"
        onPointerDown={handleProgressPointerDown}
        onPointerMove={handleProgressPointerMove}
      >
        {/* Filled track */}
        <div
          className="h-full rounded-full bg-brand-red transition-[width] duration-75"
          style={{ width: `${progress}%` }}
          aria-hidden="true"
        />

        {/* Scrubber thumb - appears on hover */}
        <div
          className="pointer-events-none absolute top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-brand-red bg-background opacity-0 shadow-sm transition-opacity duration-fast ease-luxury group-hover:opacity-100"
          style={{ left: `${progress}%` }}
          aria-hidden="true"
        />
      </div>

      {/* ── Track dot-pager (multi-track only) ── */}
      {isMultiTrack && (
        <div
          className="mt-4 flex justify-center gap-1.5"
          role="tablist"
          aria-label="רצועות"
        >
          {tracks.map((track, i) => (
            <button
              key={i}
              type="button"
              role="tab"
              aria-selected={i === trackIndex}
              aria-label={`רצועה ${i + 1}: ${track.title}`}
              onClick={() => setTrackIndex(i)}
              className={cn(
                "h-1 rounded-full transition-[width,background-color] duration-normal ease-luxury focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red",
                i === trackIndex
                  ? "w-4 bg-brand-red"
                  : "w-1 bg-border hover:bg-muted-foreground",
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
}
