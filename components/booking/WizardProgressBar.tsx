"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { cn } from "@/lib/utils";

type WizardProgressBarProps = {
  currentStep: number;
  totalSteps: number;
  celebrateKey?: number;
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

export default function WizardProgressBar({
  currentStep,
  totalSteps,
  celebrateKey = 0,
  className,
}: WizardProgressBarProps) {
  const [flash, setFlash] = useState(false);
  const prevCelebrate = useRef(celebrateKey);
  const reducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    () => false,
  );

  useEffect(() => {
    if (celebrateKey > prevCelebrate.current && celebrateKey > 0 && !reducedMotion) {
      prevCelebrate.current = celebrateKey;
      queueMicrotask(() => {
        setFlash(true);
        window.setTimeout(() => setFlash(false), 450);
      });
      return undefined;
    }
    prevCelebrate.current = celebrateKey;
    return undefined;
  }, [celebrateKey, reducedMotion]);

  const pct = totalSteps <= 1 ? 100 : Math.round((currentStep / (totalSteps - 1)) * 100);

  return (
    <div
      className={cn("h-1 w-full overflow-hidden rounded-full bg-border", className)}
      role="progressbar"
      aria-valuenow={pct}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className={cn(
          "h-1 rounded-full transition-all duration-500",
          flash ? "bg-emerald-500" : "bg-[var(--service-accent,#d42b2b)]",
        )}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
