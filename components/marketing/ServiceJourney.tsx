import { JOURNEY_ACTOR_LABEL, type ServiceJourney as ServiceJourneyData } from "@/lib/data/service-journeys";
import { cn } from "@/lib/utils";

type ServiceJourneyProps = {
  journey: ServiceJourneyData;
  /** id ייחודי לכותרת. ProcessSteps קשיח על process-heading, ולכן כאן הוא חובה */
  headingId: string;
  /** שורה מתחת לציר, למשל המחיר מהקטלוג */
  footer?: React.ReactNode;
  className?: string;
};

/**
 * ציר "מה קורה מרגע שפונים" (תוכנית הבהירות, שלב 3, 11.10.2026). רכיב שרת.
 *
 * רשימה ממוספרת אנכית: בכל שלב מה קורה, מי עושה אותו ומתי. הקו בין השלבים
 * מתמלא בגלילה דרך CSS (journey-fill ב-globals.css, scroll-driven animation).
 * בדפדפן בלי תמיכה, או כשביקשו פחות תנועה, הקו פשוט מלא. בלי JS.
 * נגישות: ol אמיתי, כותרת לכל שלב, ו"מי" ו"מתי" כתובים גם לקורא מסך.
 */
export default function ServiceJourney({ journey, headingId, footer, className }: ServiceJourneyProps) {
  const { steps } = journey;
  return (
    <section className={cn("max-w-2xl", className)} aria-labelledby={headingId}>
      <header>
        <h2
          id={headingId}
          className="font-serif text-xl font-semibold tracking-tight text-foreground sm:text-2xl"
        >
          {journey.heading}
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground sm:text-base">
          {journey.subheading}
        </p>
      </header>

      <ol className="mt-8">
        {steps.map((step, index) => {
          const isLast = index === steps.length - 1;
          return (
            <li key={step.id} className="relative grid grid-cols-[3rem_1fr] gap-x-4 pb-8 last:pb-0">
              <div className="relative flex justify-center" aria-hidden="true">
                <span className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full border-2 border-brand-red bg-background text-base font-bold text-brand-red-text tabular-nums">
                  {index + 1}
                </span>
                {!isLast ? (
                  <span className="journey-line absolute top-12 -bottom-0 w-0.5 bg-border">
                    <span className="journey-fill block h-full w-full bg-brand-red" />
                  </span>
                ) : null}
              </div>
              <div className="min-w-0 pt-2">
                <h3 className="text-base font-semibold text-foreground">{step.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{step.body}</p>
                <p className="mt-2 flex flex-wrap gap-2 text-xs">
                  <span className="rounded-full border border-border bg-surface px-2.5 py-1 font-medium text-foreground">
                    <span className="sr-only">מי: </span>
                    {JOURNEY_ACTOR_LABEL[step.actor]}
                  </span>
                  {step.when ? (
                    <span className="rounded-full border border-border bg-surface px-2.5 py-1 text-muted-foreground">
                      <span className="sr-only">מתי: </span>
                      {step.when}
                    </span>
                  ) : null}
                </p>
              </div>
            </li>
          );
        })}
      </ol>

      {footer ? <div className="mt-6 text-sm text-foreground">{footer}</div> : null}
    </section>
  );
}
