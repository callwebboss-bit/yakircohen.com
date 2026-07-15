"use client";

import { useEffect, useRef, useState } from "react";
import type { SmartFormEstimate } from "@/lib/smart-form-estimate";
import {
  CATALOG_VAT_RATE,
  catalogWithVat,
  formatFromPriceDual,
} from "@/lib/data/pricing-catalog";

type VisualReceiptProps = {
  estimate: SmartFormEstimate;
  /** לקוח שזוהה עם contact קודם - מסלול פריוריטי לאישור */
  isReturning?: boolean;
};

/**
 * קבלה ויזואלית - כל השורות ב-exVat בלבד.
 * מע״מ 18% מוצג פעם אחת דרך formatFromPriceDual / catalogWithVat - בלי כפל בחישוב.
 */
export default function VisualReceipt({
  estimate,
  isReturning = false,
}: VisualReceiptProps) {
  const [justUpdated, setJustUpdated] = useState(false);
  const prevTotalRef = useRef<number | null>(null);

  useEffect(() => {
    const changed =
      prevTotalRef.current !== null && prevTotalRef.current !== estimate.totalExVat;
    prevTotalRef.current = estimate.totalExVat;
    if (!changed) return;
    setJustUpdated(true);
    const t = setTimeout(() => setJustUpdated(false), 700);
    return () => clearTimeout(t);
  }, [estimate.totalExVat]);

  if (!estimate.baseCatalogId || estimate.lines.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-border bg-surface/60 px-4 py-6 text-center text-sm text-muted-foreground">
        בחרו סוג שירות ותוספות כדי לראות הערכת תקציב
      </div>
    );
  }

  const baseLine = estimate.lines.find((l) => l.kind === "base");
  const upsellLines = estimate.lines.filter((l) => l.kind === "upsell");
  const totalWithVat = catalogWithVat(estimate.totalExVat);
  const vatPct = Math.round(CATALOG_VAT_RATE * 100);

  return (
    <div className="rounded-lg border border-border bg-surface/40 p-4 text-sm">
      <p className="mb-3 font-semibold text-foreground">הערכת תקציב</p>

      {isReturning ? (
        <p className="mb-2 rounded-md bg-emerald-50 px-2 py-1.5 text-[11px] text-emerald-800">
          מזוהה כלקוח חוזר - אחרי אישור נחיל מסלול פריוריטי (הנחת עוגן).
        </p>
      ) : null}

      {baseLine ? (
        <div className="flex items-baseline justify-between gap-3 text-muted-foreground">
          <span>בסיס: {baseLine.label}</span>
          <span className="shrink-0 tabular-nums text-foreground">
            {baseLine.exVat.toLocaleString("he-IL")} ₪
          </span>
        </div>
      ) : null}

      {upsellLines.length > 0 ? (
        <div className="mt-3 space-y-2">
          <p className="text-xs font-medium text-foreground">תוספות</p>
          <ul className="space-y-2">
            {upsellLines.map((line) => (
              <li
                key={`upsell-${line.catalogId}`}
                className="flex items-baseline justify-between gap-3 text-muted-foreground"
              >
                <span>+ {line.label}</span>
                <span className="shrink-0 tabular-nums text-foreground">
                  {line.exVat.toLocaleString("he-IL")} ₪
                </span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <div
        aria-live="polite"
        className={`mt-3 flex items-baseline justify-between gap-3 rounded-md border-t border-border pt-3 font-semibold text-foreground transition-colors duration-300 ${
          justUpdated ? "bg-emerald-50" : "bg-transparent"
        }`}
      >
        <span>סה״כ משוער</span>
        <span className="tabular-nums">
          {estimate.totalExVat.toLocaleString("he-IL")} ₪
        </span>
      </div>
      <p className="mt-1 text-xs text-muted-foreground">
        לפני מע״מ ({vatPct}%). כולל מע״מ: {totalWithVat.toLocaleString("he-IL")} ₪
      </p>

      <p className="mt-2 text-[11px] leading-snug text-muted-foreground">
        המחיר כולל עריכה יסודית ללא תוספות נסתרות
      </p>

      {estimate.softFromCopy ? (
        <p className="mt-2 text-xs text-muted-foreground">{estimate.softFromCopy}</p>
      ) : (
        <p className="mt-2 text-xs text-muted-foreground">
          הערכת תקציב בסיסית לפרויקט מתחילה ב-
          {formatFromPriceDual(estimate.baseExVat)}
        </p>
      )}

      {estimate.availabilityNote ? (
        <p className="mt-2 text-[11px] leading-snug text-muted-foreground">
          {estimate.availabilityNote}
        </p>
      ) : null}
    </div>
  );
}
