"use client";

import { useEffect, useState } from "react";

export type ScrollDirection = "up" | "down" | "idle";

export function useScrollDirection(threshold = 10): ScrollDirection {
  const [direction, setDirection] = useState<ScrollDirection>("idle");

  useEffect(() => {
    let lastY = typeof window !== "undefined" ? window.scrollY : 0;

    const onScroll = () => {
      const currentY = window.scrollY;
      const delta = currentY - lastY;
      if (Math.abs(delta) < threshold) return;
      setDirection(delta > 0 ? "down" : "up");
      lastY = currentY;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);

  return direction;
}
