"use client";

import { useEffect, useRef } from "react";
import { wasBookExitIntentShown } from "@/lib/book-wizard-urgency";

const DEFAULT_ARM_MS = 8_000;

export function useBookExitIntent(opts: {
  enabled: boolean;
  onTrigger: () => void;
  armAfterMs?: number;
}) {
  const armedRef = useRef(false);
  const triggeredRef = useRef(false);

  useEffect(() => {
    if (!opts.enabled || wasBookExitIntentShown()) return undefined;

    const armTimer = window.setTimeout(() => {
      armedRef.current = true;
    }, opts.armAfterMs ?? DEFAULT_ARM_MS);

    function handleMouseLeave(e: MouseEvent) {
      if (!armedRef.current || triggeredRef.current) return;
      if (e.clientY > 0) return;
      if (window.matchMedia("(max-width: 640px)").matches) return;
      triggeredRef.current = true;
      opts.onTrigger();
    }

    document.addEventListener("mouseleave", handleMouseLeave);
    return () => {
      window.clearTimeout(armTimer);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [opts.enabled, opts.onTrigger, opts.armAfterMs]);
}
