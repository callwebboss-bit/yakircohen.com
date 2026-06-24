"use client";

import { useEffect, useRef } from "react";

export default function ScrollProgressBar() {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let rafId: number;

    const update = () => {
      const bar = barRef.current;
      if (!bar) return;
      const { scrollY } = window;
      const total = document.documentElement.scrollHeight - window.innerHeight;
      const pct = total > 0 ? Math.min(100, (scrollY / total) * 100) : 0;
      bar.style.width = `${pct}%`;
    };

    const onScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(update);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    update();

    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div
      role="progressbar"
      aria-label="התקדמות גלילה בעמוד"
      aria-valuemin={0}
      aria-valuemax={100}
      className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-[2px]"
    >
      <div
        ref={barRef}
        className="h-full bg-[var(--service-accent,#d42b2b)] will-change-[width]"
        style={{ width: "0%" }}
      />
    </div>
  );
}
