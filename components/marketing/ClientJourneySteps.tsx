import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  getJourneyVariant,
  type JourneyVariant,
} from "@/lib/data/client-journey";

export type ClientJourneyStepsProps = {
  variant?: JourneyVariant;
  display?: "full" | "compact";
  className?: string;
  showFullLink?: boolean;
};

function StepBadge({ number }: { number: number }) {
  return (
    <div
      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-foreground text-sm font-bold text-brand-red ring-1 ring-brand-red/40"
      aria-hidden="true"
    >
      {number}
    </div>
  );
}

export default function ClientJourneySteps({
  variant = "general",
  display = "full",
  className,
  showFullLink = display === "compact",
}: ClientJourneyStepsProps) {
  const config = getJourneyVariant(variant);
  const fullHref = `/start#${config.anchor}`;

  if (display === "compact") {
    return (
      <section
        className={cn("border-y border-border bg-surface py-10 sm:py-12", className)}
        aria-labelledby={`journey-compact-${config.id}`}
      >
        <div className="mx-auto max-w-[72rem] px-4 sm:px-6 lg:px-8">
          <h2
            id={`journey-compact-${config.id}`}
            className="text-lg font-semibold text-foreground sm:text-xl"
          >
            מה קורה אחרי שפונים
          </h2>
          <ol className="mt-5 space-y-3">
            {config.steps.map((step) => (
              <li key={step.number} className="flex items-start gap-3">
                <StepBadge number={step.number} />
                <div className="min-w-0 pt-1">
                  <p className="text-sm font-semibold text-foreground">
                    {step.title}
                  </p>
                  <p className="mt-0.5 text-sm leading-relaxed text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              </li>
            ))}
          </ol>
          {showFullLink ? (
            <p className="mt-5">
              <Link
                href={fullHref}
                className="text-sm font-medium text-brand-red underline-offset-4 hover:underline"
              >
                פרטים מלאים ←
              </Link>
            </p>
          ) : null}
        </div>
      </section>
    );
  }

  return (
    <section
      className={cn("bg-background py-12 sm:py-16", className)}
      aria-labelledby={`journey-full-${config.id}`}
    >
      <div className="mx-auto max-w-[72rem] px-4 sm:px-6 lg:px-8">
        <ol className="grid grid-cols-1 gap-8 md:grid-cols-3 md:gap-6">
          {config.steps.map((step) => (
            <li key={step.number} className="flex flex-col items-center text-center md:items-start md:text-start">
              <StepBadge number={step.number} />
              <h3 className="mt-4 text-base font-semibold text-foreground">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {step.description}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
