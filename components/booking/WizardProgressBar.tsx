"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { cn } from "@/lib/utils";
import { prefersReducedMotion, subscribeReducedMotion } from "@/lib/reduced-motion";

type WizardProgressBarProps = {
  currentStep: number;
  totalSteps: number;
  celebrateKey?: number;
  className?: string;
};

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
    prefersReducedMotion,
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
