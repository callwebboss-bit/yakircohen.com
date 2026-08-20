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
    <progress
      className={cn("studio-meter", flash && "studio-meter-flash", className)}
      max={100}
      value={pct}
      aria-label="התקדמות השאלון"
    />
  );
}
