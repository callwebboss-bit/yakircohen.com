"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { prefersReducedMotion, subscribeReducedMotion } from "@/lib/reduced-motion";

export default function ConfettiSlowMoVideo() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [shouldLoad, setShouldLoad] = useState(false);
  const [status, setStatus] = useState<"pending" | "loaded" | "error">("pending");
  /* F-67 (WCAG 2.2.2): מי שביקש פחות תנועה מקבל את הסרטון בלי ניגון אוטומטי ועם
     פקדים, כדי שהוא יחליט אם להפעיל ומתי לעצור. */
  const reducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    prefersReducedMotion,
    () => false,
  );

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  if (status === "error") return null;

  return (
    <section aria-label="תותח קונפטי בסלואו מושן">
      <h2 className="mb-4 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
        תותח קונפטי בסלואו מושן
      </h2>
      <div
        ref={wrapperRef}
        className="relative overflow-hidden rounded-xl bg-surface"
        style={{ aspectRatio: "16/9" }}
      >
        {shouldLoad ? (
          <video
            key={reducedMotion ? "still" : "auto"}
            autoPlay={!reducedMotion}
            controls={reducedMotion}
            muted
            loop
            playsInline
            className="h-full w-full object-cover"
            onLoadedData={() => setStatus("loaded")}
            onError={() => setStatus("error")}
          >
            <source src="/confetti-slowmo.webm" type="video/webm" />
          </video>
        ) : (
          <div className="flex h-full min-h-[200px] items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-border border-t-brand-red" />
          </div>
        )}
      </div>
    </section>
  );
}
