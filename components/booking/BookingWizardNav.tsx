import { cn } from "@/lib/utils";

type BookingWizardNavProps = {
  steps: readonly string[];
  currentStep: number;
  label: string;
};

/** ניווט שלבים עם תמיכה בנגישות (מקלדת + screen reader) */
export default function BookingWizardNav({
  steps,
  currentStep,
  label,
}: BookingWizardNavProps) {
  return (
    <nav aria-label={label} className="w-full max-w-full min-w-0">
      <ol className="flex flex-wrap gap-2 sm:gap-3">
        {steps.map((stepLabel, i) => {
          const isCurrent = i === currentStep;
          const isComplete = i < currentStep;
          return (
            <li
              key={stepLabel}
              aria-current={isCurrent ? "step" : undefined}
              className={cn(
                "flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors duration-fast ease-luxury sm:px-4 sm:text-sm",
                isCurrent
                  ? "bg-[var(--service-accent,#d42b2b)] text-white"
                  : isComplete
                    ? "bg-[color-mix(in_srgb,var(--service-accent,#d42b2b)_15%,transparent)] text-[var(--service-accent,#d42b2b)]"
                    : "bg-surface text-muted-foreground",
              )}
            >
              <span
                className={cn(
                  "flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[0.65rem]",
                  isCurrent ? "bg-white/20" : "bg-background",
                )}
                aria-hidden="true"
              >
                {i + 1}
              </span>
              <span className="whitespace-nowrap">{stepLabel}</span>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
