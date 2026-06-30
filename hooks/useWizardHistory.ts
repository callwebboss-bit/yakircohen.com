"use client";

import { useEffect, useRef } from "react";
import type { TierACategoryId } from "@/lib/book-wizard-cro/types";

/**
 * מנהל history לכפתור Back בדפדפן - שלב אחורה בתוך הוויזארד.
 */
export function useWizardHistory(opts: {
  category: TierACategoryId;
  step: number;
  setStep: (n: number) => void;
  enabled?: boolean;
}) {
  const pushingRef = useRef(false);
  const stepRef = useRef(opts.step);

  useEffect(() => {
    stepRef.current = opts.step;
  }, [opts.step]);

  useEffect(() => {
    if (opts.enabled === false) return undefined;

    function onPopState() {
      if (pushingRef.current) {
        pushingRef.current = false;
        return;
      }
      const current = stepRef.current;
      if (current > 0) {
        opts.setStep(current - 1);
      }
    }

    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, [opts.enabled, opts.setStep]);

  useEffect(() => {
    if (opts.enabled === false) return;
    if (typeof window === "undefined") return;

    const hash = window.location.hash.replace(/^#/, "").split("/")[0];
    const base = hash.startsWith(opts.category) ? opts.category : opts.category;
    const nextUrl = `${window.location.pathname}${window.location.search}#${base}/step/${opts.step}`;

    if (window.location.hash !== `#${base}/step/${opts.step}`) {
      pushingRef.current = true;
      window.history.pushState({ wizardStep: opts.step }, "", nextUrl);
    }
  }, [opts.category, opts.step, opts.enabled]);
}
