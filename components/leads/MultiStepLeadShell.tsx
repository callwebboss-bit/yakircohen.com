"use client";

import { useMemo, useState, type ReactNode } from "react";

type MultiStepLeadShellProps = {
  steps: { id: string; title: string }[];
  stepIndex: number;
  children: ReactNode;
};

export default function MultiStepLeadShell({
  steps,
  stepIndex,
  children,
}: MultiStepLeadShellProps) {
  const progress = useMemo(() => {
    if (steps.length <= 1) return 100;
    return Math.round(((stepIndex + 1) / steps.length) * 100);
  }, [stepIndex, steps.length]);

  return (
    <div className="space-y-4" style={{ minHeight: 280 }}>
      <div aria-hidden className="h-2 overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-brand-red transition-[width] duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="text-xs font-medium text-muted-foreground">
        שלב {stepIndex + 1} מתוך {steps.length}: {steps[stepIndex]?.title}
      </p>
      <ol className="sr-only">
        {steps.map((s, i) => (
          <li key={s.id} aria-current={i === stepIndex ? "step" : undefined}>
            {s.title}
          </li>
        ))}
      </ol>
      {children}
    </div>
  );
}

export function useMultiStep(total: number) {
  const [stepIndex, setStepIndex] = useState(0);
  return {
    stepIndex,
    setStepIndex,
    next: () => setStepIndex((s) => Math.min(total - 1, s + 1)),
    back: () => setStepIndex((s) => Math.max(0, s - 1)),
    isFirst: stepIndex === 0,
    isLast: stepIndex >= total - 1,
  };
}
