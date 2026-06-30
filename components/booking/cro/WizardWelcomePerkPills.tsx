"use client";

import { cn } from "@/lib/utils";
import type { CroOption } from "@/lib/book-wizard-cro/types";

export function WizardWelcomePerkPills({
  question,
  options,
  value,
  onChange,
}: {
  question: string;
  options: readonly CroOption[];
  value: string;
  onChange: (id: string) => void;
}) {
  return (
    <div className="rounded-xl border border-dashed border-[var(--service-accent,#d42b2b)]/30 bg-[color-mix(in_srgb,var(--service-accent,#d42b2b)_4%,transparent)] px-4 py-4">
      <p className="mb-2 text-xs font-semibold text-foreground">{question}</p>
      <div className="grid grid-cols-1 gap-3" role="radiogroup" aria-label={question}>
        {options.map((opt) => {
          const active = value === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => onChange(opt.id)}
              className={cn(
                "min-h-12 rounded-2xl border px-4 py-3 text-start text-sm transition-colors",
                active
                  ? "border-[var(--service-accent,#d42b2b)] bg-surface font-semibold text-[var(--service-accent,#d42b2b)]"
                  : "border-border/60 bg-surface/80 text-foreground hover:border-[var(--service-accent,#d42b2b)]/30",
              )}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
