"use client";

import Link from "next/link";
import type { EventIndexWeek } from "@/lib/data/event-index.generated";
import {
  PRO_ATTRACTIONS,
  formatProPriceExVat,
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

function DiffCell({ diff }: { diff: number | null }) {
  if (diff == null) return <span className="text-muted-foreground">—</span>;
  if (diff === 0) {
    return <span className="text-muted-foreground tabular-nums">זהה</span>;
  }
  const saving = diff < 0;
  return (
    <span
      className={cn(
        "font-medium tabular-nums",
        saving ? "text-emerald-700 dark:text-emerald-400" : "text-brand-red",
      )}
    >
      {saving ? "חיסכון " : "+"}
      {Math.abs(diff).toLocaleString("he-IL")} ₪
    </span>
  );
}

function DemandCell({
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
      <span className="blur-[3px] select-none text-xs text-muted-foreground" aria-hidden>
        +12% · 8 לידים
      </span>
    );
  }

  if (!row) {
    return <span className="text-muted-foreground">—</span>;
  }

  return (
    <span className="text-xs tabular-nums sm:text-sm">
      {row.demandTrendPct >= 0 ? "+" : ""}
      {row.demandTrendPct}% · {row.leadCount} לידים
    </span>
  );
}

export default function EventIndexAttractionsCatalog({ index, hasFullAccess }: Props) {
  const { prices, setPrice, clearPrices } = useSupplierPriceDraft();

  return (
    <section aria-labelledby="attractions-catalog-heading">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2
            id="attractions-catalog-heading"
            className="font-serif text-xl font-semibold text-foreground"
          >
            קטלוג אטרקציות — השוואת מחירי ספק
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            הזינו מה אתם משלמים היום לספק לפני מע״מ — נשווה למחירון יקיר ולמגמת ביקוש
            (למנויים). הנתונים נשמרים במכשיר שלכם בלבד.
          </p>
        </div>
        <button
          type="button"
          onClick={clearPrices}
          className="text-xs font-medium text-muted-foreground underline-offset-2 hover:text-foreground hover:underline"
        >
          נקה השוואה
        </button>
      </div>

      <div className="mt-6 overflow-x-auto rounded-xl border border-border">
        <table className="w-full min-w-[640px] text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/40 text-start text-xs font-semibold text-muted-foreground">
              <th className="px-4 py-3 font-semibold">אטרקציה</th>
              <th className="px-4 py-3 font-semibold whitespace-nowrap">מחיר יקיר</th>
              <th className="px-4 py-3 font-semibold whitespace-nowrap">המחיר שלכם</th>
              <th className="px-4 py-3 font-semibold">הפרש</th>
              <th className="px-4 py-3 font-semibold">ביקוש</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {PRO_ATTRACTIONS.map((item) => {
              const yourPrice = prices[item.id] ?? null;
              const diff =
                yourPrice != null ? yourPrice - item.supplierExVat : null;

              return (
                <tr key={item.id} className="bg-background">
                  <td className="px-4 py-4">
                    <Link
                      href={item.href}
                      className="group flex items-start gap-2 hover:text-brand-red"
                    >
                      <span className="text-lg" aria-hidden>
                        {item.icon}
                      </span>
                      <span>
                        <span className="font-medium group-hover:underline">
                          {item.name}
                        </span>
                        <span className="mt-0.5 block text-xs text-muted-foreground">
                          {item.shortDesc}
                        </span>
                      </span>
                    </Link>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap tabular-nums text-muted-foreground">
                    {formatProPriceExVat(item.supplierExVat)}
                  </td>
                  <td className="px-4 py-4">
                    <label className="sr-only" htmlFor={`price-${item.id}`}>
                      המחיר שלכם ל{item.name}
                    </label>
                    <input
                      id={`price-${item.id}`}
                      type="number"
                      min={0}
                      step={50}
                      inputMode="numeric"
                      placeholder="₪ לפני מע״מ"
                      value={yourPrice ?? ""}
                      onChange={(e) =>
                        setPrice(item.id, parsePriceInput(e.target.value))
                      }
                      className="w-full min-w-[7rem] max-w-[9rem] rounded-lg border border-border bg-background px-3 py-2 text-sm tabular-nums"
                    />
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <DiffCell diff={diff} />
                  </td>
                  <td className="px-4 py-4">
                    <DemandCell
                      marketId={item.marketId}
                      index={index}
                      hasFullAccess={hasFullAccess}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {!hasFullAccess && (
        <p className="mt-3 text-xs text-muted-foreground">
          עמודת ביקוש — תצוגה מקדימה. מנוי דופק השוק מציג מגמות אמיתיות מהשבוע.
        </p>
      )}
    </section>
  );
}
