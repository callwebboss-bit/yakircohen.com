"use client";

import { cn } from "@/lib/utils";

const STEPS = [
  { id: 0, label: "פרטי קשר" },
  { id: 1, label: "צורך וקובץ" },
  { id: 2, label: "סיכום ושליחה" },
] as const;

type IntakeStepperProps = {
  currentStep: number;
  orientation?: "horizontal" | "vertical";
  className?: string;
};

export default function IntakeStepper({
  currentStep,
  orientation = "horizontal",
  className,
}: IntakeStepperProps) {
  const vertical = orientation === "vertical";

  return (
    <ol
      className={cn(
        vertical
          ? "flex flex-col gap-3"
          : "flex flex-wrap items-center justify-center gap-2 sm:gap-3",
        className,
      )}
      aria-label="שלבי הפנייה"
    >
      {STEPS.map((step, index) => {
        const done = currentStep > step.id;
        const active = currentStep === step.id;
        return (
          <li
            key={step.id}
            className={cn(
              "flex items-center gap-2",
              vertical && "w-full",
            )}
          >
            <span
              className={cn(
                "inline-flex min-h-9 items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-colors duration-200",
                vertical && "w-full justify-start rounded-xl px-4 py-2.5 text-sm",
                done && "border-emerald-300/80 bg-emerald-50 text-emerald-900",
                active && !done && "border-brand-red bg-brand-red/10 text-brand-red",
                !done && !active && "border-border bg-surface text-muted-foreground",
              )}
              aria-current={active ? "step" : undefined}
            >
              <span aria-hidden="true">{done ? "✓" : index + 1}</span>
              <span>{step.label}</span>
            </span>
            {!vertical && index < STEPS.length - 1 ? (
              <span className="hidden text-muted-foreground sm:inline" aria-hidden="true">
                |
              </span>
            ) : null}
          </li>
        );
      })}
    </ol>
  );
}
