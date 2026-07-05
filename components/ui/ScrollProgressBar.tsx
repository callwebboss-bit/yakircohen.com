"use client";

import { useEffect, useRef, useState } from "react";

export default function ScrollProgressBar() {
  const barRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let rafId: number;

    const update = () => {
      const bar = barRef.current;
      if (!bar) return;
      const { scrollY } = window;
      const total = document.documentElement.scrollHeight - window.innerHeight;
      const pct = total > 0 ? Math.min(100, (scrollY / total) * 100) : 0;
      const rounded = Math.round(pct);
      bar.style.width = `${pct}%`;
      setProgress((prev) => (prev === rounded ? prev : rounded));
    };

    const onScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(update);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    update();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div
      role="progressbar"
      aria-label="התקדמות גלילה בעמוד"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={progress}
      className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-[3px] bg-border/50 sm:h-1"
    >
      <div
        ref={barRef}
        className="h-full rounded-e-full bg-brand-red shadow-[0_0_10px_rgba(212,43,43,0.65)] will-change-[width]"
        style={{ width: "0%" }}
      />
    </div>
  );
}
