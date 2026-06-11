"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import MobileStickyCta from "@/components/layout/MobileStickyCta";

const FloatingFabs = dynamic(() => import("@/components/layout/FloatingFabs"), {
  ssr: false,
});

// OPTIMIZED: mobile sticky CTA renders immediately; FABs defer with shorter mobile timeout
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
      <MobileStickyCta />
      {showFabs ? <FloatingFabs /> : null}
    </>
  );
}
