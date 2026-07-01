"use client";

import type { WizardStepBlocker } from "@/lib/studio-wizard-step-guards";
import { cn } from "@/lib/utils";

export default function WizardStepBlockerBanner({
  blockers,
  className,
}: {
  blockers: readonly WizardStepBlocker[];
  className?: string;
}) {
  if (!blockers.length) return null;

  return (
    <div
      role="alert"
      aria-live="assertive"
      className={cn(
        "rounded-xl border border-amber-300/80 bg-amber-50 px-4 py-3 text-sm text-amber-950",
        className,
      )}
    >
      <p className="font-semibold">כדי להמשיך:</p>
      <ul className="mt-1.5 list-inside list-disc space-y-0.5 text-xs sm:text-sm">
        {blockers.map((b) => (
          <li key={b.fieldId}>{b.message}</li>
        ))}
      </ul>
    </div>
  );
}
