import Link from "next/link";
import type { HubDecisionRow } from "@/lib/data/hub-decision-matrix";

type Props = {
  rows: readonly HubDecisionRow[];
  heading?: string;
  headingId?: string;
};

/** מטריצת החלטה קצרה ל-hubs - אם רוצים X → הולכים ל-Y */
export default function HubDecisionMatrix({
  rows,
  heading = "מה לבחור עכשיו",
  headingId = "hub-decision-heading",
}: Props) {
  return (
    <section
      className="rounded-2xl border border-border bg-surface p-6 sm:p-8"
      aria-labelledby={headingId}
    >
      <h2
        id={headingId}
        className="font-serif text-xl font-semibold text-foreground sm:text-2xl"
      >
        {heading}
      </h2>
      <p className="mt-2 text-sm text-muted-foreground">
        שלוש־ארבע שורות. בלי בלבול.
      </p>
      <ul className="mt-6 divide-y divide-border">
        {rows.map((row) => (
          <li
            key={row.href + row.ifYouWant}
            className="flex flex-col gap-2 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6"
          >
            <p className="text-sm text-foreground sm:text-base">
              <span className="text-muted-foreground">אם אתם רוצים </span>
              <strong>{row.ifYouWant}</strong>
            </p>
            <Link
              href={row.href}
              className="inline-flex min-h-12 shrink-0 items-center justify-center rounded-xl border border-brand-red/30 bg-brand-red/5 px-4 py-2 text-sm font-semibold text-brand-red transition-colors hover:bg-brand-red hover:text-white"
            >
              {row.thenGo}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
