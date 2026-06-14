"use client";

import Link from "next/link";
import type { EventIndexWeek } from "@/lib/data/event-index.generated";
import {
  PRO_ATTRACTIONS,
  formatProPriceShort,
} from "@/lib/data/event-index-attractions-pro";
import { useSupplierPriceDraft } from "@/hooks/useSupplierPriceDraft";
import { cn } from "@/lib/utils";

type Props = {
  index: EventIndexWeek;
  hasFullAccess: boolean;
};

function parsePriceInput(raw: string): number | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;
  const n = Number(trimmed.replace(/[^\d.]/g, ""));
  return Number.isFinite(n) && n >= 0 ? Math.round(n) : null;
}

function PriceDiff({ diff }: { diff: number | null }) {
  if (diff == null) {
    return (
      <span className="text-xs text-muted-foreground">הזינו מחיר להשוואה</span>
    );
  }
  if (diff === 0) {
    return (
      <span className="inline-flex rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
        זהה למחירון
      </span>
    );
  }
  const saving = diff < 0;
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold tabular-nums",
        saving
          ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300"
          : "bg-brand-red/10 text-brand-red",
      )}
    >
      {saving ? "חיסכון " : "יקר יותר ב"}
      {Math.abs(diff).toLocaleString("he-IL")} ₪
    </span>
  );
}

function DemandBadge({
  marketId,
  index,
  hasFullAccess,
}: {
  marketId?: string;
  index: EventIndexWeek;
  hasFullAccess: boolean;
}) {
  const row = marketId
    ? index.attractions.find((a) => a.id === marketId)
    : undefined;

  if (!hasFullAccess) {
    return (
      <p className="text-xs text-muted-foreground">
        מגמת ביקוש זמינה למנוי דופק השוק
      </p>
    );
  }

  if (!row) {
    return null;
  }

  const trend =
    row.demandTrendPct >= 0
      ? `עלייה ${row.demandTrendPct}%`
      : `ירידה ${Math.abs(row.demandTrendPct)}%`;

  return (
    <p className="text-xs text-muted-foreground">
      {trend}, {row.leadCount} לידים השבוע
    </p>
  );
}

export default function EventIndexAttractionsCatalog({ index, hasFullAccess }: Props) {
  const { prices, setPrice, clearPrices } = useSupplierPriceDraft();
  const filledCount = PRO_ATTRACTIONS.filter(
    (a) => prices[a.id] != null,
  ).length;

  return (
    <section id="price-compare" className="scroll-mt-24" aria-labelledby="attractions-catalog-heading">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="max-w-xl">
          <h2
            id="attractions-catalog-heading"
            className="font-serif text-xl font-semibold text-foreground"
          >
            השוואת מחירים
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            כמה אתם משלמים היום לספק? הזינו מחיר לפני מע״מ ונראה את ההפרש מול
            המחירון שלנו. הנתונים נשמרים רק במכשיר הזה.
          </p>
        </div>
        {filledCount > 0 ? (
          <button
            type="button"
            onClick={clearPrices}
            className="shrink-0 rounded-lg border border-border px-3 py-2 text-xs font-medium text-muted-foreground hover:border-foreground/30 hover:text-foreground"
          >
            נקה הכל
          </button>
        ) : null}
      </div>

      <ul className="mt-6 space-y-3">
        {PRO_ATTRACTIONS.map((item) => {
          const yourPrice = prices[item.id] ?? null;
          const diff =
            yourPrice != null ? yourPrice - item.supplierExVat : null;

          return (
            <li
              key={item.id}
              className="rounded-2xl border border-border bg-background p-4 sm:p-5"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <Link
                    href={item.href}
                    className="font-semibold text-foreground hover:text-brand-red hover:underline"
                  >
                    {item.name}
                  </Link>
                  <p className="mt-1 text-sm text-muted-foreground">{item.pitch}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    מתאים ל{item.moment}
                  </p>
                </div>
                <p className="shrink-0 text-sm tabular-nums text-muted-foreground">
                  אצלנו{" "}
                  <span className="font-semibold text-foreground">
                    {formatProPriceShort(item.supplierExVat)}
                  </span>
                  <span className="text-xs"> לפני מע״מ</span>
                </p>
              </div>

              <div className="mt-4 flex flex-col gap-3 border-t border-border pt-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex-1">
                  <label
                    htmlFor={`price-${item.id}`}
                    className="mb-1.5 block text-xs font-medium text-muted-foreground"
                  >
                    המחיר שלכם לפני מע״מ
                  </label>
                  <input
                    id={`price-${item.id}`}
                    type="number"
                    min={0}
                    step={50}
                    inputMode="numeric"
                    placeholder="לדוגמה 2000"
                    value={yourPrice ?? ""}
                    onChange={(e) =>
                      setPrice(item.id, parsePriceInput(e.target.value))
                    }
                    className="w-full max-w-[12rem] min-h-11 rounded-xl border border-border bg-surface px-4 text-base tabular-nums sm:text-sm"
                  />
                </div>
                <div className="sm:text-end">
                  <PriceDiff diff={diff} />
                  <div className="mt-2">
                    <DemandBadge
                      marketId={item.marketId}
                      index={index}
                      hasFullAccess={hasFullAccess}
                    />
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
