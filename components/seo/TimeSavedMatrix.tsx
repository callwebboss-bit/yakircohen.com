import Link from "next/link";
import InlineServiceLink from "@/components/marketing/InlineServiceLink";
import {
  SERVICE_CARD_DETAILS_CTA,
  SKEPTICISM_CTA,
  TIME_PROMISE_DISCLAIMER,
} from "@/lib/data/conversion-copy";
import {
  getTimeSavedRows,
  TIME_SAVED_MATRIX_INTRO,
  type TimeSavedHub,
} from "@/lib/data/time-saved-matrix";
import { cn } from "@/lib/utils";

type TimeSavedMatrixProps = {
  hub: TimeSavedHub;
  headingId: string;
  className?: string;
};

const actionClass =
  "inline-flex min-h-12 items-center justify-center rounded-xl border border-brand-red/30 bg-brand-red/5 px-4 py-2 text-sm font-semibold text-brand-red transition-colors hover:bg-brand-red hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red";

export default function TimeSavedMatrix({
  hub,
  headingId,
  className,
}: TimeSavedMatrixProps) {
  const rows = getTimeSavedRows(hub);

  return (
    <section
      className={cn("rounded-2xl border border-border bg-surface p-6 sm:p-8", className)}
      aria-labelledby={headingId}
    >
      <h2
        id={headingId}
        className="font-serif text-xl font-semibold text-foreground sm:text-2xl"
      >
        מה עדיף
      </h2>
      <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
        {TIME_SAVED_MATRIX_INTRO}
      </p>

      <div className="mt-6 hidden overflow-x-auto rounded-2xl border border-border bg-background md:block">
        <table className="w-full text-sm" aria-labelledby={headingId}>
          <thead>
            <tr className="border-b border-border bg-surface text-right">
              <th scope="col" className="px-4 py-3 font-semibold text-foreground">
                מה בודקים
              </th>
              <th scope="col" className="px-4 py-3 font-semibold text-muted-foreground">
                אצל אחרים
              </th>
              <th scope="col" className="bg-brand-red/5 px-4 py-3 font-semibold text-brand-red">
                אצלנו
              </th>
              <th scope="col" className="px-4 py-3">
                <span className="sr-only">קישור</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {rows.map((row) => (
              <tr key={row.id} className="align-top">
                <th scope="row" className="px-4 py-4 text-right font-medium text-foreground">
                  {row.criterion}
                </th>
                <td className="px-4 py-4 leading-relaxed text-muted-foreground">
                  {row.others}
                </td>
                <td className="bg-brand-red/[0.03] px-4 py-4 font-medium leading-relaxed text-foreground">
                  {row.ours}
                </td>
                <td className="px-4 py-4">
                  <Link href={row.href} className={actionClass}>
                    {SERVICE_CARD_DETAILS_CTA}
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ul className="mt-6 space-y-3 md:hidden">
        {rows.map((row) => (
          <li key={row.id} className="rounded-2xl border border-border bg-background p-4">
            <p className="text-sm font-semibold text-foreground">{row.criterion}</p>
            <p className="mt-3 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              אצל אחרים
            </p>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{row.others}</p>
            <p className="mt-3 text-xs font-semibold uppercase tracking-[0.14em] text-brand-red">
              אצלנו
            </p>
            <p className="mt-1 text-sm font-medium leading-relaxed text-foreground">
              {row.ours}
            </p>
            <div className="mt-3">
              <InlineServiceLink href={row.href}>{row.linkLabel}</InlineServiceLink>
            </div>
            <Link href={row.href} className={`${actionClass} mt-4 w-full`}>
              {SERVICE_CARD_DETAILS_CTA}
            </Link>
          </li>
        ))}
      </ul>

      <p className="mt-5 text-xs text-muted-foreground">{TIME_PROMISE_DISCLAIMER}</p>
      <p className="mt-2 text-sm text-muted-foreground">{SKEPTICISM_CTA}</p>
    </section>
  );
}
