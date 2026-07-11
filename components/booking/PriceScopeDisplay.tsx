import {
  billingLabelToDataAttr,
  formatDualPriceLines,
  formatPriceScopeDisplay,
  formatScopeLine,
} from "@/lib/data/pricing-display";
import type { PriceScope, PriceWithEditing } from "@/lib/data/pricing-catalog";
import { withVat } from "@/lib/data/pricing";
import { cn } from "@/lib/utils";

type PriceScopeDisplayProps = {
  exVat: number;
  scope?: PriceScope;
  size?: "sm" | "md" | "lg";
  className?: string;
  /** שורה אחת: מחיר + היקף */
  compact?: boolean;
  showFromPrefix?: boolean;
  /** הסתר שורת סכום כולל מע״מ (כשמוצגת במקום אחר) */
  hideVatLine?: boolean;
  /** למי השירות מתאים */
  suitedFor?: string;
  /** מחיר חלופי עם עריכה - מציג שני מחירים */
  withEditing?: PriceWithEditing;
};

const sizeClasses = {
  sm: { primary: "text-sm font-bold", scope: "text-[0.65rem]", vat: "text-[0.65rem]", suited: "text-[0.65rem]" },
  md: { primary: "text-lg font-bold", scope: "text-xs", vat: "text-xs", suited: "text-xs" },
  lg: { primary: "text-2xl font-bold", scope: "text-xs", vat: "text-xs", suited: "text-xs" },
} as const;

export default function PriceScopeDisplay({
  exVat,
  scope,
  size = "md",
  className,
  compact = false,
  showFromPrefix = false,
  hideVatLine = false,
  suitedFor,
  withEditing,
}: PriceScopeDisplayProps) {
  const lines = formatPriceScopeDisplay({ exVat, scope, showFromPrefix });
  const s = sizeClasses[size];

  if (compact) {
    return (
      <p className={cn(s.scope, "text-muted-foreground", className)}>
        {lines.compactLine}
      </p>
    );
  }

  if (withEditing) {
    const dual = formatDualPriceLines(exVat, withEditing);
    const editTotal = withVat(withEditing.exVat).toLocaleString("he-IL");
    return (
      <div className={cn("space-y-1", className)}>
        <p className={cn(s.primary, "text-foreground")}>{dual.recordingOnly}</p>
        <p className={cn(s.primary, "text-[var(--service-accent-ink,#8a1c1c)]")}>
          {dual.withEditing}
        </p>
        <p className={cn(s.scope, "text-muted-foreground italic")}>{dual.socialProof}</p>
        {lines.scopeLine ? (
          <p className={cn(s.scope, "text-muted-foreground")}>{lines.scopeLine}</p>
        ) : null}
        {!hideVatLine ? (
          <p className={cn(s.vat, "text-muted-foreground")}>
            כולל מע״מ (עריכה): {editTotal} ₪
          </p>
        ) : null}
        {suitedFor ? (
          <p className={cn(s.suited, "text-muted-foreground")}>
            <span className="font-semibold text-foreground">מתאים ל: </span>
            {suitedFor}
          </p>
        ) : null}
      </div>
    );
  }

  return (
    <div className={cn("space-y-0.5", className)}>
      <p className={cn(s.primary, "text-foreground")}>{lines.primary}</p>
      {lines.scopeLine ? (
        <p className={cn(s.scope, "text-muted-foreground")}>{lines.scopeLine}</p>
      ) : null}
      {!hideVatLine ? (
        <p className={cn(s.vat, "text-muted-foreground")}>{lines.vatLine}</p>
      ) : null}
      {suitedFor ? (
        <p className={cn(s.suited, "mt-1 text-muted-foreground")}>
          <span className="font-semibold text-foreground">מתאים ל: </span>
          {suitedFor}
        </p>
      ) : null}
    </div>
  );
}

/** תצוגה קומפקטית בלבד (למשל ליד שם שורה במחירון) */
export function PriceScopeCompact({
  exVat,
  scope,
  showFromPrefix = false,
  className,
}: {
  exVat: number;
  scope?: PriceScope;
  showFromPrefix?: boolean;
  className?: string;
}) {
  const scopeLine = formatScopeLine(scope);
  const amount = exVat.toLocaleString("he-IL");
  const billing = scope?.billingLabel ?? "חד-פעמי";
  const price = showFromPrefix ? `מ-${amount} ₪` : `${amount} ₪`;
  const text = scopeLine ? `${price} · ${scopeLine}` : `${price} · ${billing}`;

  return (
    <span className={cn("text-xs text-muted-foreground", className)}>{text}</span>
  );
}

/** data-billing-type לפי scope */
export function resolveBillingDataAttr(scope?: PriceScope): string {
  return billingLabelToDataAttr(scope?.billingLabel);
}
