import { formatFromPriceDual } from "@/lib/data/pricing-catalog";
import type { PriceItemId } from "@/lib/data/pricing-catalog";
import PricingTransparencyBlock from "@/components/pricing/PricingTransparencyBlock";
import { withVat, VAT_RATE } from "@/lib/data/pricing";
import { cn } from "@/lib/utils";

type BookPriceDualProps = {
  exVat: number;
  /** Use pre-formatted string from route data */
  dualLabel?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
  catalogId?: PriceItemId;
};

const SIZE_CLASS = {
  sm: "text-xs",
  md: "text-sm",
  lg: "text-base",
} as const;

export default function BookPriceDual({
  exVat,
  dualLabel,
  size = "md",
  className,
  catalogId,
}: BookPriceDualProps) {
  const vat = Math.round(exVat * VAT_RATE);
  const total = withVat(exVat);
  const main = dualLabel ?? formatFromPriceDual(exVat);

  return (
    <div className={cn("min-w-0 space-y-0.5", className)}>
      <p className={cn("break-words font-bold text-foreground", SIZE_CLASS[size])}>{main}</p>
      <p className="break-words text-xs text-muted-foreground">
        {exVat.toLocaleString("he-IL")} ₪ + מע״מ (18%) {vat.toLocaleString("he-IL")} ₪ ={" "}
        <span className="font-semibold text-foreground">
          {total.toLocaleString("he-IL")} ₪ סופי
        </span>
      </p>
      {catalogId ? <PricingTransparencyBlock catalogId={catalogId} compact /> : null}
    </div>
  );
}
