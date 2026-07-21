import type { AcademyCourseFit } from "@/lib/data/academy-course-fit";
import { cn } from "@/lib/utils";

export type AcademyCourseFitSectionsProps = {
  fit: AcademyCourseFit;
  /** מזהה ייחודי לעמוד - לכותרות נגישות */
  idPrefix: string;
  className?: string;
};

/**
 * שלושה בלוקים עובדתיים לדפי קורסים: למי זה מתאים, תוצאה, ותהליך.
 * Overlay בלבד - לא מחליף sections קיימים.
 */
export default function AcademyCourseFitSections({
  fit,
  idPrefix,
  className,
}: AcademyCourseFitSectionsProps) {
  return (
    <div className={cn("space-y-10", className)}>
      {/* למי זה מתאים */}
      <section aria-labelledby={`${idPrefix}-audience-heading`}>
        <h2
          id={`${idPrefix}-audience-heading`}
          className="text-center text-xl font-semibold tracking-tight text-foreground sm:text-2xl"
        >
          למי זה מתאים
        </h2>
        <ul className="mx-auto mt-6 grid max-w-3xl gap-3 sm:grid-cols-2">
          {fit.audience.map((item) => (
            <li
              key={item}
              className="flex gap-2 rounded-xl border border-border bg-background px-4 py-3 text-sm leading-relaxed text-muted-foreground"
            >
              <span className="text-brand-red" aria-hidden="true">
                ✓
              </span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
        {fit.notFor?.length ? (
          <ul className="mx-auto mt-3 grid max-w-3xl gap-2">
            {fit.notFor.map((item) => (
              <li
                key={item}
                className="flex gap-2 rounded-xl border border-dashed border-border px-4 py-2.5 text-xs leading-relaxed text-muted-foreground"
              >
                <span aria-hidden="true">✕</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        ) : null}
      </section>

      {/* תוצאה */}
      <section
        aria-labelledby={`${idPrefix}-outcome-heading`}
        className="mx-auto max-w-3xl rounded-2xl border border-brand-red/25 bg-surface p-6 sm:p-8"
      >
        <h2
          id={`${idPrefix}-outcome-heading`}
          className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl"
        >
          {fit.outcome.title}
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
          {fit.outcome.body}
        </p>
        <ul className="mt-5 space-y-2 text-sm text-foreground sm:text-base">
          {fit.outcome.bullets.map((bullet) => (
            <li key={bullet} className="flex gap-2">
              <span className="text-brand-red" aria-hidden="true">
                ✓
              </span>
              <span>{bullet}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* תהליך */}
      <section aria-labelledby={`${idPrefix}-process-heading`}>
        <h2
          id={`${idPrefix}-process-heading`}
          className="text-center text-xl font-semibold tracking-tight text-foreground sm:text-2xl"
        >
          איך זה עובד
        </h2>
        <ol className="mx-auto mt-6 grid max-w-3xl gap-4 sm:grid-cols-3">
          {fit.steps.map((step, i) => (
            <li
              key={step.title}
              className="rounded-2xl border border-border bg-background p-5"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-red/10 text-sm font-bold text-brand-red">
                {i + 1}
              </div>
              <h3 className="mt-3 text-sm font-semibold text-foreground">
                {step.title}
              </h3>
              <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                {step.body}
              </p>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
