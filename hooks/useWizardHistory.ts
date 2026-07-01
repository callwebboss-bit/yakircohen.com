"use client";

import { useEffect, useRef } from "react";
import {
  parseBookCategoryFromHash,
  parseBookWizardStepFromHash,
} from "@/lib/book-url";
import type { TierACategoryId } from "@/lib/book-wizard-cro/types";

/**
 * מסנכרן hash לשלב הנוכחי ב-URL.
 * משתמש ב-replaceState (לא pushState) כדי שלא ייווצר מגזר history שתוקע את כפתור Back.
 */
export function useWizardHistory(opts: {
  category: TierACategoryId;
  step: number;
  setStep: (n: number) => void;
  enabled?: boolean;
}) {
  const syncingRef = useRef(false);
  const stepRef = useRef(opts.step);

  useEffect(() => {
    stepRef.current = opts.step;
  }, [opts.step]);

  useEffect(() => {
    if (opts.enabled === false) return undefined;

    function onPopState() {
      if (syncingRef.current) {
        syncingRef.current = false;
        return;
      }

      const hashCategory = parseBookCategoryFromHash(window.location.hash);
      if (hashCategory !== opts.category) return;

      const hashStep = parseBookWizardStepFromHash(window.location.hash);
      if (hashStep !== null) {
        opts.setStep(hashStep);
        return;
      }

      opts.setStep(0);
    }

    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, [opts.enabled, opts.setStep, opts.category]);

  useEffect(() => {
    if (opts.enabled === false) return;
    if (typeof window === "undefined") return;

    const targetHash = `#${opts.category}/step/${opts.step}`;
    const currentHash = window.location.hash;

    if (currentHash === targetHash) return;

    if (
      opts.step === 0 &&
      (currentHash === `#${opts.category}` || currentHash === "")
    ) {
      return;
    }

    syncingRef.current = true;
    const nextUrl = `${window.location.pathname}${window.location.search}${targetHash}`;
    window.history.replaceState({ wizardStep: opts.step }, "", nextUrl);
  }, [opts.category, opts.step, opts.enabled]);
}
