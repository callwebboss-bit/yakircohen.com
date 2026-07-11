"use client";

import { useEffect, useRef } from "react";
import { trackConversion } from "@/lib/analytics/conversion-events";
import type { BookCategoryId } from "@/lib/book-url";

/** Fires `book_wizard_start` once, then `book_wizard_step` on each step change. */
export function useBookWizardStep(category: BookCategoryId, step: number): void {
  const prev = useRef<number | null>(null);
  const started = useRef(false);

  useEffect(() => {
    if (!started.current) {
      started.current = true;
      trackConversion("book_wizard_start", { category, step });
    }
    if (prev.current === step) return;
    prev.current = step;
    trackConversion("book_wizard_step", { category, step });
  }, [category, step]);
}
