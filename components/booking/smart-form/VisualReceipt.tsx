"use client";

import { useEffect, useRef, useState } from "react";
import type { SmartFormEstimate } from "@/lib/smart-form-estimate";
import { catalogWithVat, formatFromPriceDual } from "@/lib/data/pricing-catalog";

type VisualReceiptProps = {
  estimate: SmartFormEstimate;
  /** לקוח שזוהה עם contact קודם - מסלול פריוריטי לאישור */
  isReturning?: boolean;
};

/**
 * קבלה ויזואלית: כל השורות והסה״כ כולל מע״מ בלבד (D86, 11.10.2026, הועבר
 * בהחלטה D124 ב-12.10). כלל העיגול של D102: הסה״כ הוא מע״מ על סכום השורות
 * (catalogWithVat(totalExVat)), והפרש עיגול של שקל נבלע בשורה הגדולה, כך
 * שהשורות תמיד מסתכמות בדיוק לסה״כ.
 */
function withVatLines(exVats: readonly number[], totalWithVat: number): number[] {
  const lines = exVats.map((x) => catalogWithVat(x));
  const diff = totalWithVat - lines.reduce((a, b) => a + b, 0);
  if (diff !== 0 && lines.length > 0) {
    const biggest = lines.indexOf(Math.max(...lines));
    lines[biggest] += diff;
  }
  return lines;
}
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
  const [baseWithVat, ...upsellWithVat] = withVatLines(
    [baseLine?.exVat ?? 0, ...upsellLines.map((l) => l.exVat)],
    totalWithVat,
  );

  return (
    <div className="rounded-lg border border-border bg-surface/40 p-4 text-sm">
      <p className="mb-3 font-semibold text-foreground">הערכת תקציב</p>

      {isReturning ? (
        <p className="mb-2 rounded-md bg-emerald-50 px-2 py-1.5 text-[11px] text-emerald-800">
          מזוהה כלקוח חוזר - אחרי אישור נחיל מסלול פריוריטי (הנחת עוגן).
        </p>
      ) : null}

      <p className="mb-1 text-[11px] text-muted-foreground">פירוט, כולל מע״מ</p>

      {baseLine ? (
        <div className="flex items-baseline justify-between gap-3 text-muted-foreground">
          <span>בסיס: {baseLine.label}</span>
          <span className="shrink-0 tabular-nums text-foreground">
            {baseWithVat.toLocaleString("he-IL")} ₪
          </span>
        </div>
      ) : null}

      {upsellLines.length > 0 ? (
        <div className="mt-3 space-y-2">
          <p className="text-xs font-medium text-foreground">תוספות</p>
          <ul className="space-y-2">
            {upsellLines.map((line, i) => (
              <li
                key={`upsell-${line.catalogId}`}
                className="flex items-baseline justify-between gap-3 text-muted-foreground"
              >
                <span>+ {line.label}</span>
                <span className="shrink-0 tabular-nums text-foreground">
                  {upsellWithVat[i].toLocaleString("he-IL")} ₪
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
        <span>סה״כ משוער, כולל מע״מ</span>
        <span className="tabular-nums">
          {totalWithVat.toLocaleString("he-IL")} ₪
        </span>
      </div>

      <p className="mt-2 text-[11px] leading-snug text-muted-foreground">
        המחיר כולל עריכה יסודית ללא תוספות נסתרות
      </p>

      {estimate.softFromCopy ? (
        <p className="mt-2 text-xs text-muted-foreground">{estimate.softFromCopy}</p>
      ) : (
        <p className="mt-2 text-xs text-muted-foreground">
          הערכת תקציב בסיסית לפרויקט מתחילה{" "}
          {formatFromPriceDual(estimate.baseExVat, "consumer", "page")}
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
