"use client";

import type { WizardStepCheckItem } from "@/lib/studio-wizard-step-guards";
import { cn } from "@/lib/utils";

export default function WizardStepProgress({
  items,
  className,
}: {
  items: readonly WizardStepCheckItem[];
  className?: string;
}) {
  if (!items.length) return null;

  return (
    <ul
      className={cn("flex flex-wrap gap-2", className)}
      aria-label="התקדמות בשלב"
    >
      {items.map((item) => (
        <li
          key={item.id}
          className={cn(
            "inline-flex min-h-9 items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium",
            item.done
              ? "border-emerald-300/80 bg-emerald-50 text-emerald-900"
              : item.optional
                ? "border-border/60 bg-surface text-muted-foreground"
                : "border-border/60 bg-background text-muted-foreground",
          )}
        >
          <span aria-hidden="true">{item.done ? "✓" : "○"}</span>
          <span>{item.label}</span>
        </li>
      ))}
    </ul>
  );
}
