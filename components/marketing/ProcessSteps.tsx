import { cn } from "@/lib/utils";

/* ─── Types ──────────────────────────────────────────────────────────────── */

export type ProcessStep = {
  number: 1 | 2 | 3 | 4;
  title: string;
  description: string;
};

export type ProcessStepsProps = {
  steps?: ProcessStep[];
  heading?: string;
  subheading?: string;
  className?: string;
};

/* ─── Defaults ───────────────────────────────────────────────────────────── */

const DEFAULT_STEPS: ProcessStep[] = [
  {
    number: 1,
    title: "שליחת הקובץ",
    description:
      "שולחים לנו את קובץ האודיו או הוידאו המקורי - בכל פורמט ובכל רמת איכות, כולל הקלטות ישנות.",
  },
  {
    number: 2,
    title: "ניתוח ואבחון",
    description:
      "המערכת שלנו סורקת את הקובץ לאיתור רעשים, הד, עיוותים וחוסרים, ומספקת תמונה מלאה של מצב הסאונד.",
  },
  {
    number: 3,
    title: "עיבוד AI מתקדם",
    description:
      "אלגוריתמים חכמים ומיקסינג אנושי ידני מנקים את הסאונד ומחזירים את הצלילות המקורית ברמה אולפנית.",
  },
  {
    number: 4,
    title: "אישור ומסירה",
    description:
      "מקבלים קובץ מוכן לשימוש עם השוואת לפני ואחרי - ללא הפתעות, עם אחריות מלאה על האיכות.",
  },
];

/* ─── Sub-components ─────────────────────────────────────────────────────── */

type StepBadgeProps = { number: number };

function StepBadge({ number }: StepBadgeProps) {
  return (
    <div
      className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-foreground text-lg font-bold text-brand-red ring-1 ring-brand-red/40 shadow-[0_0_22px_rgba(212,43,43,0.18)]"
      aria-hidden="true"
    >
      {number}
    </div>
  );
}

/* ─── Component ──────────────────────────────────────────────────────────── */

/**
 * ProcessSteps - server-safe static component.
 *
 * Mobile  → vertical stack: badge column (with dashed connector) + content column.
 * Desktop → 4-column horizontal grid with a dashed gold line spanning badge centres.
 */
export default function ProcessSteps({
  steps,
  heading = "איך זה עובד",
  subheading = "תהליך העבודה שלנו",
  className,
}: ProcessStepsProps) {
  const resolvedSteps = steps ?? DEFAULT_STEPS;

  return (
    <section
      className={cn("bg-background py-16 sm:py-20 lg:py-24", className)}
      aria-labelledby="process-heading"
    >
      <div className="mx-auto max-w-[72rem] px-4 sm:px-6 lg:px-8">
        {/* ── Header ── */}
        <header className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-red">
            {subheading}
          </p>
          <h2
            id="process-heading"
            className="mt-3 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
          >
            {heading}
          </h2>
        </header>

        {/* ── Steps grid ── */}
        <div className="relative mt-14">
          {/*
           * Desktop horizontal connecting line.
           * Spans from the centre of the first badge to the centre of the last.
           * With 4 equal columns the badge centres sit at 12.5 % from each edge.
           * We use inset-inline-* (logical properties) so the span is correct in
           * RTL - inset-inline-start maps to `right` in RTL, end to `left`.
           */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute top-6 hidden lg:block"
            style={{
              insetInlineStart: "12.5%",
              insetInlineEnd: "12.5%",
              height: 0,
              borderTopWidth: "2px",
              borderTopStyle: "dashed",
              borderTopColor: "rgba(212, 175, 55, 0.32)",
            }}
          />

          <ol className="grid grid-cols-1 lg:grid-cols-4 lg:gap-8">
            {resolvedSteps.map((step, index) => {
              const isLast = index === resolvedSteps.length - 1;

              return (
                <li
                  key={step.number}
                  className="relative flex items-start gap-5 pb-10 last:pb-0 lg:flex-col lg:items-center lg:pb-0 lg:text-center"
                >
                  {/* ── Mobile vertical connector ── */}
                  {!isLast && (
                    /*
                     * A thin column rendered inside the badge's flex column.
                     * `inset-inline-start: 1.5rem` centres it under the badge
                     * (badge = 3 rem wide → centre = 1.5 rem from start edge).
                     * In RTL "start" resolves to `right`.
                     */
                    <div
                      aria-hidden="true"
                      className="absolute bottom-0 top-14 lg:hidden"
                      style={{
                        insetInlineStart: "1.5rem",
                        width: 0,
                        borderInlineStartWidth: "2px",
                        borderInlineStartStyle: "dashed",
                        borderInlineStartColor: "rgba(212, 175, 55, 0.32)",
                      }}
                    />
                  )}

                  {/* ── Badge ── */}
                  <StepBadge number={step.number} />

                  {/* ── Step content ── */}
                  <div className="min-w-0 flex-1 pt-1 lg:mt-6 lg:flex-none lg:pt-0">
                    <h3 className="text-base font-semibold text-foreground">
                      {step.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {step.description}
                    </p>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
