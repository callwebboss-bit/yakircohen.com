"use client";

import { useEffect, useRef, useState, type RefObject } from "react";

const DEFAULT_IDLE_MS = 45_000;

export function useWizardUserIdle(opts: {
  enabled: boolean;
  delayMs?: number;
  targetRef?: RefObject<HTMLElement | null>;
}) {
  const [idle, setIdle] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!opts.enabled) return undefined;

    const delay = opts.delayMs ?? DEFAULT_IDLE_MS;

    function resetTimer() {
      setIdle(false);
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setIdle(true), delay);
    }

    const root = opts.targetRef?.current ?? document;
    const events = ["pointerdown", "keydown", "scroll", "touchstart"] as const;

    for (const event of events) {
      root.addEventListener(event, resetTimer, { passive: true });
    }
    resetTimer();

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      for (const event of events) {
        root.removeEventListener(event, resetTimer);
      }
    };
  }, [opts.enabled, opts.delayMs, opts.targetRef]);

  const dismiss = () => setIdle(false);

  return { idle: opts.enabled ? idle : false, dismiss };
}
