"use client";

import { useEffect, useRef } from "react";
import { trackConversion } from "@/lib/analytics/conversion-events";
import type { BookCategoryId } from "@/lib/book-url";

/** Fires `book_wizard_step` when the wizard step index changes. */
export function useBookWizardStep(category: BookCategoryId, step: number): void {
  const prev = useRef<number | null>(null);

  useEffect(() => {
    if (prev.current === step) return;
    prev.current = step;
    trackConversion("book_wizard_step", { category, step });
  }, [category, step]);
}
