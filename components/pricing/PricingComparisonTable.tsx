"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import InlineServiceLink from "@/components/marketing/InlineServiceLink";
import {
  PRICING_COMPARISON_FILTERS,
  PRICING_COMPARISON_ROWS,
  formatComparisonBreakdown,
  type PricingComparisonCluster,
  type PricingComparisonRow,
} from "@/lib/data/pricing-comparison";
import { getPriceById, getPriceTransparencyById } from "@/lib/data/pricing-catalog";
import { formatHubPriceDual, formatScopeLine } from "@/lib/data/pricing-display";
import { resolvePricingBookHref } from "@/lib/data/pricing-book-map";
import { cn } from "@/lib/utils";

const linkClass =
  "inline-flex min-h-11 touch-manipulation items-center focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red";

const STUDIO_BUILDER_HREF = "/studio/pricing#price-builder";

type ComparisonCells = {
  scope: string;
  breakdown: string;
  excluded: string;
  suitedFor: string;
  priceLine: string;
  bookHref: string;
  exVat: number;
};

function comparisonCells(row: PricingComparisonRow): ComparisonCells {
  const item = getPriceById(row.catalogId);
  const transparency = getPriceTransparencyById(row.catalogId);
  return {
    scope: formatScopeLine(item.scope) ?? item.context ?? "",
    breakdown: formatComparisonBreakdown(row.catalogId),
    excluded: transparency.excluded.slice(0, 2).join(" · "),
    suitedFor: item.suitedFor ?? "",
    priceLine: formatHubPriceDual(item.exVat, item.priceFrom === true),
    bookHref: resolvePricingBookHref(row.catalogId) ?? row.bookHref ?? "/book",
    exVat: item.exVat,
  };
}

export type PricingComparisonTableProps = {
  headingId: string;
  className?: string;
  enableCategoryFilter?: boolean;
  showBuilderLink?: boolean;
};

export default function PricingComparisonTable({
  headingId,
  className,
  enableCategoryFilter = false,
  showBuilderLink = false,
}: PricingComparisonTableProps) {
  const [cluster, setCluster] = useState<"all" | PricingComparisonCluster>("all");
  const [compareOn, setCompareOn] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const rows = useMemo(() => {
    if (!enableCategoryFilter || cluster === "all") return PRICING_COMPARISON_ROWS;
    return PRICING_COMPARISON_ROWS.filter((row) => row.cluster === cluster);
  }, [cluster, enableCategoryFilter]);

  const showStudioBuilder =
    showBuilderLink && (!enableCategoryFilter || cluster === "all" || cluster === "studio");

  const pairSame = useMemo(() => {
    if (!compareOn || selectedIds.length !== 2) return null;
    const [aId, bId] = selectedIds;
    const a = rows.find((row) => row.id === aId);
    const b = rows.find((row) => row.id === bId);
    if (!a || !b) return null;
    const aCells = comparisonCells(a);
    const bCells = comparisonCells(b);
    return {
      scope: aCells.scope === bCells.scope,
      breakdown: aCells.breakdown === bCells.breakdown,
      excluded: aCells.excluded === bCells.excluded,
      suitedFor: aCells.suitedFor === bCells.suitedFor,
    };
  }, [compareOn, selectedIds, rows]);

  function toggleSelect(id: string) {
    setSelectedIds((prev) => {
      if (prev.includes(id)) return prev.filter((item) => item !== id);
      if (prev.length >= 2) return [prev[1], id];
      return [...prev, id];
    });
  }

  function toggleCompare() {
    setCompareOn((on) => {
      if (on) setSelectedIds([]);
      return !on;
    });
  }

  return (
    <div className={className}>
      {enableCategoryFilter ? (
        <div className="mb-4">
          <p className="text-sm font-medium text-foreground">
            מה אתם צריכים? בחרו קטגוריה - ונדע להמליץ
          </p>
          <div
            className="mt-2 flex flex-wrap gap-2"
            role="group"
            aria-label="סינון לפי קטגוריה"
          >
            {PRICING_COMPARISON_FILTERS.map((filter) => (
              <button
                key={filter.id}
                type="button"
                aria-pressed={cluster === filter.id}
                onClick={() => setCluster(filter.id)}
                className={cn(
                  "hardware-toggle inline-flex min-h-12 items-center rounded-xl border px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red",
                  cluster === filter.id
                    ? "border-brand-red bg-brand-red/10 text-brand-red"
                    : "border-border bg-background text-foreground hover:border-brand-red/40",
                )}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      {showStudioBuilder ? (
        <p className="mb-4 text-sm text-muted-foreground">
          <Link
            href={STUDIO_BUILDER_HREF}
            className={`${linkClass} min-h-12 font-semibold text-brand-red hover:underline`}
          >
            בנה את החבילה שלך
          </Link>
          {" - "}
          4 שאלות, מחיר מהמחירון.
        </p>
      ) : null}

      <div className="mb-3 hidden md:block">
        <button
          type="button"
          aria-pressed={compareOn}
          onClick={toggleCompare}
          className={cn(
            "hardware-toggle inline-flex min-h-12 items-center rounded-xl border px-4 py-2 text-sm font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red",
            compareOn
              ? "border-brand-red bg-brand-red/10 text-brand-red"
              : "border-border bg-background text-foreground hover:border-brand-red/40",
          )}
        >
          A/B השוואת מסלולים
        </button>
        {compareOn ? (
          <p className="mt-2 text-xs text-muted-foreground">
            בחרו שני מסלולים. סעיפים זהים יועמעמו.
          </p>
        ) : null}
      </div>

      <div
        className={cn(
          "hidden overflow-x-auto rounded-2xl border border-border bg-surface md:block",
          compareOn && "compare-on",
        )}
      >
        <table className="w-full text-sm" aria-labelledby={headingId}>
          <thead>
            <tr className="border-b border-border bg-background text-right">
              {compareOn ? (
                <th scope="col" className="sticky top-20 z-10 bg-background px-4 py-3">
                  <span className="sr-only">בחירה להשוואה</span>
                </th>
              ) : null}
              <th scope="col" className="sticky top-20 z-10 bg-background px-4 py-3 font-semibold text-foreground">
                מסלול
              </th>
              <th scope="col" className="sticky top-20 z-10 bg-background px-4 py-3 font-semibold text-foreground">
                מה כלול
              </th>
              <th scope="col" className="sticky top-20 z-10 bg-background px-4 py-3 font-semibold text-foreground">
                פירוק המחיר
              </th>
              <th scope="col" className="sticky top-20 z-10 bg-background px-4 py-3 font-semibold text-foreground">
                מתאים ל
              </th>
              <th scope="col" className="sticky top-20 z-10 bg-background px-4 py-3 font-semibold text-foreground">
                מחיר
              </th>
              <th scope="col" className="sticky top-20 z-10 bg-background px-4 py-3">
                <span className="sr-only">הזמנה</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {rows.map((row) => {
              const cells = comparisonCells(row);
              const selected = selectedIds.includes(row.id);
              const dimUnselected =
                compareOn && selectedIds.length === 2 && !selected;
              return (
                <tr
                  key={row.id}
                  className={cn(
                    "align-top transition-colors hover:bg-brand-red/[0.03]",
                    dimUnselected && "opacity-35",
                  )}
                >
                  {compareOn ? (
                    <td className="px-4 py-4">
                      <button
                        type="button"
                        aria-pressed={selected}
                        onClick={() => toggleSelect(row.id)}
                        className={cn(
                          "hardware-toggle inline-flex min-h-12 min-w-12 items-center justify-center rounded-lg border text-xs font-semibold",
                          selected
                            ? "border-brand-red bg-brand-red/10 text-brand-red"
                            : "border-border text-muted-foreground",
                        )}
                      >
                        {selected ? "נבחר" : "השווה"}
                      </button>
                    </td>
                  ) : null}
                  <th scope="row" className="px-4 py-4 text-right font-medium">
                    <InlineServiceLink href={row.href}>{row.title}</InlineServiceLink>
                    {row.badge ? (
                      <span className="mt-1 block w-fit rounded-full bg-brand-red px-2 py-0.5 text-[0.65rem] font-bold text-white">
                        {row.badge}
                      </span>
                    ) : null}
                  </th>
                  <td
                    className="px-4 py-4 text-muted-foreground"
                    data-same={pairSame && selected && pairSame.scope ? "" : undefined}
                  >
                    <div>{cells.scope}</div>
                    {cells.excluded ? (
                      <div
                        className="mt-1 text-xs"
                        data-same={pairSame && selected && pairSame.excluded ? "" : undefined}
                      >
                        <span className="font-semibold text-foreground">לא כלול: </span>
                        {cells.excluded}
                      </div>
                    ) : null}
                  </td>
                  <td
                    className="px-4 py-4 text-muted-foreground"
                    data-same={pairSame && selected && pairSame.breakdown ? "" : undefined}
                  >
                    {cells.breakdown || "-"}
                  </td>
                  <td
                    className="px-4 py-4 text-muted-foreground"
                    data-same={pairSame && selected && pairSame.suitedFor ? "" : undefined}
                  >
                    {cells.suitedFor || "-"}
                  </td>
                  <td className="whitespace-nowrap px-4 py-4 font-semibold text-brand-red">
                    <data value={String(cells.exVat)}>{cells.priceLine}</data>
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

      <ul className="space-y-3 md:hidden">
        {rows.map((row) => {
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
              {cells.breakdown ? (
                <p className="mt-1 text-xs text-muted-foreground">
                  <span className="font-semibold text-foreground">פירוק המחיר: </span>
                  {cells.breakdown}
                </p>
              ) : null}
              {cells.excluded ? (
                <p className="mt-1 text-xs text-muted-foreground">
                  <span className="font-semibold text-foreground">לא כלול: </span>
                  {cells.excluded}
                </p>
              ) : null}
              {cells.suitedFor ? (
                <p className="mt-1 text-xs text-muted-foreground">
                  <span className="font-semibold text-foreground">מתאים ל: </span>
                  {cells.suitedFor}
                </p>
              ) : null}
              <p className="mt-2 text-sm font-semibold text-brand-red">
                <data value={String(cells.exVat)}>{cells.priceLine}</data>
              </p>
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
