"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import MobileActionBar from "@/components/layout/MobileActionBar";

const FloatingFabs = dynamic(() => import("@/components/layout/FloatingFabs"), {
  ssr: false,
});

// פס הפעולה התחתון נטען מיד (הוא חלק מהעמוד במובייל); הכפתורים הצפים נדחים
export default function DeferredFloatingFabs() {
  const [showFabs, setShowFabs] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const reveal = () => {
      if (!cancelled) setShowFabs(true);
    };

    const isMobile = window.matchMedia("(max-width: 767px)").matches;
    const fallbackMs = isMobile ? 400 : 1200;

    let idleId: number | undefined;
    let timerId: ReturnType<typeof setTimeout> | undefined;

    if ("requestIdleCallback" in window) {
      idleId = requestIdleCallback(reveal, { timeout: fallbackMs });
    } else {
      timerId = setTimeout(reveal, fallbackMs);
    }

    return () => {
      cancelled = true;
      if (idleId !== undefined) cancelIdleCallback(idleId);
      if (timerId !== undefined) clearTimeout(timerId);
    };
  }, []);

  return (
    <>
      <MobileActionBar />
      {showFabs ? <FloatingFabs /> : null}
    </>
  );
}
