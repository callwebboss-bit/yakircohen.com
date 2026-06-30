"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { trackConversion } from "@/lib/analytics/conversion-events";
import type { BookCategoryId } from "@/lib/book-url";
import { cn } from "@/lib/utils";

type WizardStepCelebrateProps = {
  category: BookCategoryId;
  fromStep: number;
  toStep: number;
  message?: string;
  className?: string;
};

function subscribeReducedMotion(onStoreChange: () => void) {
  if (typeof window === "undefined") return () => {};
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", onStoreChange);
  return () => mq.removeEventListener("change", onStoreChange);
}

function getReducedMotionSnapshot() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export default function WizardStepCelebrate({
  category,
  fromStep,
  toStep,
  message = "בחירה טובה, ממשיכים",
  className,
}: WizardStepCelebrateProps) {
  const reducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    () => false,
  );
  const [visible, setVisible] = useState(() => !reducedMotion);

  useEffect(() => {
    trackConversion("book_wizard_step_celebrate", {
      category,
      from_step: fromStep,
      to_step: toStep,
    });
    if (reducedMotion) return undefined;
    const t = window.setTimeout(() => setVisible(false), 1400);
    return () => window.clearTimeout(t);
  }, [category, fromStep, toStep, reducedMotion]);

  if (!visible) {
    return (
      <span className="sr-only" aria-live="polite">
        {message}
      </span>
    );
  }

  return (
    <p
      className={cn(
        "flex items-center justify-center gap-2 text-center text-sm font-medium text-emerald-700 transition-opacity duration-300",
        className,
      )}
      role="status"
      aria-live="polite"
    >
      <span
        className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-700"
        aria-hidden="true"
      >
        ✓
      </span>
      {message}
    </p>
  );
}
