"use client";

import { useRef, useState, useEffect, useCallback } from "react";

type Props = {
  beforeSrc: string;
  afterSrc: string;
  beforeLabel: string;
  afterLabel: string;
  storageKey?: string;
  onListenComplete?: () => void;
};

const SYNC_THRESHOLD = 0.1; // seconds - seek lagging channel if gap exceeds this
const THROTTLE_MS = 100;   // timeupdate handler budget in ms

export default function PremiumCrossfadePlayer({
  beforeSrc,
  afterSrc,
  beforeLabel,
  afterLabel,
  storageKey,
  onListenComplete,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null); // owns --sp CSS variable
  const trackRef = useRef<HTMLDivElement>(null);     // slider ARIA target
  const beforeAudio = useRef<HTMLAudioElement | null>(null);
  const afterAudio = useRef<HTMLAudioElement | null>(null);
  const sliderPos = useRef(50);    // current mix 0-100 (no state - CSS var drives visuals)
  const isDragging = useRef(false);
  const lastSync = useRef(0);      // timestamp of last throttle gate
  const cbRef = useRef(onListenComplete);

  const [isPlaying, setIsPlaying] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => { cbRef.current = onListenComplete; }, [onListenComplete]);

  // Write slider position as CSS variable - no React re-render, 60 FPS
  const applyPos = useCallback((pos: number) => {
    containerRef.current?.style.setProperty("--sp", `${pos.toFixed(1)}%`);
    if (trackRef.current) {
      trackRef.current.setAttribute("aria-valuenow", String(Math.round(pos)));
    }
  }, []);

  const applyVols = useCallback((pos: number) => {
    const b = beforeAudio.current;
    const a = afterAudio.current;
    if (b) b.volume = 1 - pos / 100;
    if (a) a.volume = pos / 100;
  }, []);

  // Create and wire Audio nodes once per src pair
  useEffect(() => {
    const before = new Audio(beforeSrc);
    const after = new Audio(afterSrc);
    before.preload = "none";
    after.preload = "none";
    before.volume = 0.5;
    after.volume = 0.5;
    beforeAudio.current = before;
    afterAudio.current = after;

    const onErr = () => setHasError(true);

    const onEnded = () => {
      setIsPlaying(false);
      if (storageKey) {
        try { localStorage.setItem(`acp-${storageKey}`, "1"); } catch { /* private mode */ }
      }
      cbRef.current?.();
    };

    // Throttled sync: if channels drift beyond threshold, seek the lagging one
    const onTime = () => {
      const now = performance.now();
      if (now - lastSync.current < THROTTLE_MS) return;
      lastSync.current = now;
      const diff = Math.abs(before.currentTime - after.currentTime);
      if (diff > SYNC_THRESHOLD) after.currentTime = before.currentTime;
    };

    before.addEventListener("error", onErr);
    after.addEventListener("error", onErr);
    before.addEventListener("ended", onEnded);
    before.addEventListener("timeupdate", onTime);

    return () => {
      before.removeEventListener("error", onErr);
      after.removeEventListener("error", onErr);
      before.removeEventListener("ended", onEnded);
      before.removeEventListener("timeupdate", onTime);
      before.pause();
      after.pause();
      // Detach src to release media resources
      before.src = "";
      after.src = "";
      beforeAudio.current = null;
      afterAudio.current = null;
    };
  }, [beforeSrc, afterSrc, storageKey]);

  // Hover / touch intent: switch preload to auto only when user shows intent
  const triggerLoad = useCallback(() => {
    const b = beforeAudio.current;
    const a = afterAudio.current;
    if (!b || !a || b.preload === "auto") return;
    b.preload = "auto";
    a.preload = "auto";
    b.load();
    a.load();
  }, []);

  const togglePlay = useCallback(async () => {
    const b = beforeAudio.current;
    const a = afterAudio.current;
    if (!b || !a) return;
    triggerLoad();
    if (isPlaying) {
      b.pause();
      a.pause();
      setIsPlaying(false);
    } else {
      // Resync before resuming to eliminate drift from paused state
      a.currentTime = b.currentTime;
      try {
        await Promise.all([b.play(), a.play()]);
        setIsPlaying(true);
      } catch { /* interrupted or blocked */ }
    }
  }, [isPlaying, triggerLoad]);

  // Resolve pointer X into a 0-100 percentage of the track width
  const getPct = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    return Math.max(0, Math.min(100, ((e.clientX - r.left) / r.width) * 100));
  }, []);

  const handleDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    isDragging.current = true;
    const p = getPct(e);
    sliderPos.current = p;
    applyPos(p);
    applyVols(p);
  }, [getPct, applyPos, applyVols]);

  const handleMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging.current) return;
    const p = getPct(e);
    sliderPos.current = p;
    applyPos(p);
    applyVols(p);
  }, [getPct, applyPos, applyVols]);

  const handleUp = useCallback(() => { isDragging.current = false; }, []);

  // Keyboard: arrows step ±5 (±10 with Shift), space toggles playback
  const handleKey = useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === " ") { e.preventDefault(); togglePlay(); return; }
    if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
    e.preventDefault();
    const step = e.shiftKey ? 10 : 5;
    const p = Math.max(0, Math.min(100, sliderPos.current + (e.key === "ArrowRight" ? step : -step)));
    sliderPos.current = p;
    applyPos(p);
    applyVols(p);
  }, [applyPos, applyVols, togglePlay]);

  if (hasError) {
    return (
      <div className="flex min-h-[160px] items-center justify-center rounded-2xl border border-border bg-surface px-6 text-center text-sm text-muted-foreground">
        קבצי ההדגמה יועלו בקרוב - בינתיים אפשר לבקש דוגמה בוואטסאפ.
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      dir="ltr"
      className="min-h-[160px] space-y-5 rounded-2xl border border-border bg-surface p-6 sm:p-8"
      style={{ "--sp": "50%" } as React.CSSProperties}
      onPointerEnter={triggerLoad}
      onTouchStart={triggerLoad}
    >
      {/* Physical left=before, right=after - matches slider clientX math */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 flex-col items-start gap-1 text-start">
          <span className="rounded-full bg-muted px-2 py-0.5 text-[0.65rem] font-semibold text-muted-foreground">
            לפני
          </span>
          <span dir="rtl" className="text-xs font-medium leading-snug text-foreground">
            {beforeLabel}
          </span>
        </div>
        <div className="flex min-w-0 flex-col items-end gap-1 text-end">
          <span className="rounded-full bg-brand-red/10 px-2 py-0.5 text-[0.65rem] font-semibold text-brand-red">
            אחרי
          </span>
          <span dir="rtl" className="text-xs font-medium leading-snug text-foreground">
            {afterLabel}
          </span>
        </div>
      </div>

      {/* Crossfade track - touch-none prevents accidental page scroll while dragging */}
      <div
        ref={trackRef}
        role="slider"
        aria-label="מיקס בין ערוץ לפני לערוץ אחרי - גרור לשמוע כל אחד"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={50}
        tabIndex={0}
        className="relative h-2.5 cursor-pointer touch-none select-none rounded-full bg-muted outline-none focus-visible:ring-2 focus-visible:ring-brand-red focus-visible:ring-offset-2"
        onPointerDown={handleDown}
        onPointerMove={handleMove}
        onPointerUp={handleUp}
        onPointerCancel={handleUp}
        onKeyDown={handleKey}
      >
        {/* Fill - width driven by --sp, zero JS re-renders */}
        <div
          className="pointer-events-none absolute inset-y-0 left-0 rounded-full bg-brand-red/25"
          style={{ width: "var(--sp)" }}
          aria-hidden
        />
        {/* Thumb */}
        <div
          className="pointer-events-none absolute top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-brand-red bg-background shadow-md"
          style={{ left: "var(--sp)" }}
          aria-hidden
        />
      </div>

      {/* Play / Pause - inline SVG, no icon library dependency */}
      <div className="flex justify-center pt-1">
        <button
          type="button"
          onClick={togglePlay}
          aria-label={isPlaying ? "עצור ניגון" : "הפעל ניגון"}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-red text-white transition-colors hover:bg-brand-red-light focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red"
        >
          {isPlaying ? (
            <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor" aria-hidden>
              <rect x="2" y="1" width="4" height="12" rx="1" />
              <rect x="8" y="1" width="4" height="12" rx="1" />
            </svg>
          ) : (
            <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor" aria-hidden>
              <path d="M3 1.5 13 7 3 12.5V1.5Z" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}
