import {
  formatPriceScopeDisplay,
  formatScopeLine,
} from "@/lib/data/pricing-display";
import type { PriceScope } from "@/lib/data/pricing-catalog";
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
};

const sizeClasses = {
  sm: { primary: "text-sm font-bold", scope: "text-[0.65rem]", vat: "text-[0.65rem]" },
  md: { primary: "text-lg font-bold", scope: "text-xs", vat: "text-xs" },
  lg: { primary: "text-2xl font-bold", scope: "text-xs", vat: "text-xs" },
} as const;

export default function PriceScopeDisplay({
  exVat,
  scope,
  size = "md",
  className,
  compact = false,
  showFromPrefix = true,
  hideVatLine = false,
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

  return (
    <div className={cn("space-y-0.5", className)}>
      <p className={cn(s.primary, "text-foreground")}>{lines.primary}</p>
      {lines.scopeLine ? (
        <p className={cn(s.scope, "text-muted-foreground")}>{lines.scopeLine}</p>
      ) : null}
      {!hideVatLine ? (
        <p className={cn(s.vat, "text-muted-foreground")}>{lines.vatLine}</p>
      ) : null}
    </div>
  );
}

/** תצוגה קומפקטית בלבד (למשל ליד שם שורה במחירון) */
export function PriceScopeCompact({
  exVat,
  scope,
  className,
}: {
  exVat: number;
  scope?: PriceScope;
  className?: string;
}) {
  const scopeLine = formatScopeLine(scope);
  const amount = exVat.toLocaleString("he-IL");
  const text = scopeLine
    ? `מ-${amount} ₪ + מע״מ · ${scopeLine}`
    : `מ-${amount} ₪ + מע״מ`;

  return (
    <span className={cn("text-xs text-muted-foreground", className)}>{text}</span>
  );
}
