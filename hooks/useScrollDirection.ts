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

/**
 * true אחרי שהגולש גלל יותר מ-threshold פיקסלים. משמש להסתרת שכבות צפות
 * (FAB, סרגל ניווט תחתון) במסך הראשון בנייד, כדי שהן לא יכסו את ה-CTA של
 * העמוד עצמו (סיור לקוח 4.10.2026: עד 86% מה-CTA ב-/online היה מכוסה).
 * רק opacity ונראות, בלי שינוי פריסה, ולכן בלי CLS.
 */
export function usePastFold(threshold = 280): boolean {
  const [past, setPast] = useState(false);

  useEffect(() => {
    const onScroll = () => setPast(window.scrollY > threshold);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);

  return past;
}
