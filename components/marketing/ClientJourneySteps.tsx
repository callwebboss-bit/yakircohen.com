import Link from "next/link";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
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
      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-foreground text-sm font-bold text-brand-red ring-1 ring-brand-red/40"
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
      <Section
        padding="sm"
        className={cn("border-y border-border bg-surface", className)}
        ariaLabelledby={`journey-compact-${config.id}`}
      >
        <Container>
          <h2
            id={`journey-compact-${config.id}`}
            className="font-serif text-section-title font-semibold text-foreground"
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
                className="inline-flex min-h-11 items-center text-sm font-medium text-brand-red underline-offset-4 transition-colors hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red"
              >
                פרטים מלאים ←
              </Link>
            </p>
          ) : null}
        </Container>
      </Section>
    );
  }

  return (
    <Section
      padding="sm"
      className={cn("bg-background", className)}
      ariaLabelledby={`journey-full-${config.id}`}
    >
      <Container>
        <h2 id={`journey-full-${config.id}`} className="sr-only">
          שלבי העבודה
        </h2>
        <ol className="grid grid-cols-1 gap-8 md:grid-cols-3 md:gap-6">
          {config.steps.map((step) => (
            <li
              key={step.number}
              className="flex flex-col items-center text-center md:items-start md:text-start"
            >
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
      </Container>
    </Section>
  );
}
