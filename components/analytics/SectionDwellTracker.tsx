"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

type SectionDwellTrackerProps = {
  sectionId: string;
  eventLabel: string;
  dwellMs?: number;
};

export default function SectionDwellTracker({
  sectionId,
  eventLabel,
  dwellMs = 3000,
}: SectionDwellTrackerProps) {
  const firedRef = useRef(false);

  useEffect(() => {
    const el = document.getElementById(sectionId);
    if (!el) return;

    let timer: ReturnType<typeof setTimeout> | null = null;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (firedRef.current || !entry) return;

        if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
          timer = setTimeout(() => {
            if (firedRef.current) return;
            firedRef.current = true;
            window.gtag?.("event", "section_dwell", {
              section: eventLabel,
              page: "dj_jerusalem",
            });
          }, dwellMs);
        } else if (timer) {
          clearTimeout(timer);
          timer = null;
        }
      },
      { threshold: [0, 0.5, 1] },
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
      if (timer) clearTimeout(timer);
    };
  }, [sectionId, eventLabel, dwellMs]);

  return null;
}
