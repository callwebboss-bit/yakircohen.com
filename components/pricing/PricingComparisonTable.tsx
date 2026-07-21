import Link from "next/link";
import InlineServiceLink from "@/components/marketing/InlineServiceLink";
import {
  PRICING_COMPARISON_ROWS,
  type PricingComparisonRow,
} from "@/lib/data/pricing-comparison";
import { getPriceById } from "@/lib/data/pricing-catalog";
import { formatHubPriceDual, formatScopeLine } from "@/lib/data/pricing-display";
import { resolvePricingBookHref } from "@/lib/data/pricing-book-map";
import { cn } from "@/lib/utils";

const linkClass =
  "inline-flex min-h-11 items-center focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red";

function comparisonCells(row: PricingComparisonRow) {
  const item = getPriceById(row.catalogId);
  return {
    scope: formatScopeLine(item.scope) ?? item.context ?? "",
    suitedFor: item.suitedFor,
    priceLine: formatHubPriceDual(item.exVat, item.priceFrom === true),
    bookHref: resolvePricingBookHref(row.catalogId) ?? row.bookHref ?? "/book",
  };
}

export type PricingComparisonTableProps = {
  headingId: string;
  className?: string;
};

/**
 * טבלת השוואה בין מסלולי אולפן, פודקאסט, הקלטת שיר ואפשרויות נוספות.
 * דסקטופ: טבלה. מובייל: כרטיסים מוערמים - אותם נתונים.
 */
export default function PricingComparisonTable({
  headingId,
  className,
}: PricingComparisonTableProps) {
  return (
    <div className={className}>
      {/* דסקטופ */}
      <div className="hidden overflow-x-auto rounded-2xl border border-border bg-surface md:block">
        <table className="w-full text-sm" aria-labelledby={headingId}>
          <thead>
            <tr className="border-b border-border bg-background text-right">
              <th scope="col" className="px-4 py-3 font-semibold text-foreground">
                מסלול
              </th>
              <th scope="col" className="px-4 py-3 font-semibold text-foreground">
                מה כלול
              </th>
              <th scope="col" className="px-4 py-3 font-semibold text-foreground">
                מתאים ל
              </th>
              <th scope="col" className="px-4 py-3 font-semibold text-foreground">
                מחיר
              </th>
              <th scope="col" className="px-4 py-3">
                <span className="sr-only">הזמנה</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {PRICING_COMPARISON_ROWS.map((row) => {
              const cells = comparisonCells(row);
              return (
                <tr key={row.id} className="align-top transition-colors hover:bg-brand-red/[0.03]">
                  <th scope="row" className="px-4 py-4 text-right font-medium">
                    <InlineServiceLink href={row.href}>{row.title}</InlineServiceLink>
                    {row.badge ? (
                      <span className="mt-1 block w-fit rounded-full bg-brand-red px-2 py-0.5 text-[0.65rem] font-bold text-white">
                        {row.badge}
                      </span>
                    ) : null}
                  </th>
                  <td className="px-4 py-4 text-muted-foreground">{cells.scope}</td>
                  <td className="px-4 py-4 text-muted-foreground">
                    {cells.suitedFor ?? "-"}
                  </td>
                  <td className="whitespace-nowrap px-4 py-4 font-semibold text-brand-red">
                    {cells.priceLine}
                  </td>
                  <td className="px-4 py-4">
                    <Link
                      href={cells.bookHref}
                      className={`${linkClass} rounded-xl border border-brand-red px-3 py-1.5 text-xs font-semibold text-brand-red transition-colors hover:bg-brand-red hover:text-white`}
                    >
                      הזמנה
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* מובייל */}
      <ul className="space-y-3 md:hidden">
        {PRICING_COMPARISON_ROWS.map((row) => {
          const cells = comparisonCells(row);
          return (
            <li
              key={row.id}
              className={cn(
                "rounded-2xl border bg-surface p-4",
                row.badge ? "border-brand-red/40 ring-1 ring-brand-red/20" : "border-border",
              )}
            >
              <div className="flex items-start justify-between gap-2">
                <InlineServiceLink href={row.href}>{row.title}</InlineServiceLink>
                {row.badge ? (
                  <span className="shrink-0 rounded-full bg-brand-red px-2 py-0.5 text-[0.65rem] font-bold text-white">
                    {row.badge}
                  </span>
                ) : null}
              </div>
              {cells.scope ? (
                <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                  {cells.scope}
                </p>
              ) : null}
              {cells.suitedFor ? (
                <p className="mt-1 text-xs text-muted-foreground">
                  <span className="font-semibold text-foreground">מתאים ל: </span>
                  {cells.suitedFor}
                </p>
              ) : null}
              <p className="mt-2 text-sm font-semibold text-brand-red">{cells.priceLine}</p>
              <Link
                href={cells.bookHref}
                className={`${linkClass} mt-3 w-full justify-center rounded-xl border border-brand-red px-4 py-2 text-sm font-semibold text-brand-red transition-colors hover:bg-brand-red hover:text-white`}
              >
                הזמנה מקוונת
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
