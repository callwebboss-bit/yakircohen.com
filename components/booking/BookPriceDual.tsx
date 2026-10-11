import type { PriceItemId } from "@/lib/data/pricing-catalog";
import PricingTransparencyBlock from "@/components/pricing/PricingTransparencyBlock";
import { formatPrice, type PriceAudience } from "@/lib/data/pricing-display";
import { cn } from "@/lib/utils";

type BookPriceDualProps = {
  exVat: number;
  /** @deprecated השורה נגזרת מ-exVat. נשאר לתאימות, לא מוצג */
  dualLabel?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
  catalogId?: PriceItemId;
  /** "business" בעמודי /business ו-/pro: לפני מע״מ קודם */
  audience?: PriceAudience;
};

const SIZE_CLASS = {
  sm: "text-xs",
  md: "text-sm",
  lg: "text-base",
} as const;

/**
 * מחיר התחלה בכרטיסי /book. צרכן: מחיר אחד, כולל מע״מ (D86, 11.10.2026, במקום
 * "ולפני מע״מ בקטן" של 2.10.2026). עסק: לפני מע״מ קודם, והכולל מתחת.
 * בלי "סופי" ליד מחיר "מ-" (WP2): מחיר התחלה אינו מחיר סופי.
 */
export default function BookPriceDual({
  exVat,
  size = "md",
  className,
  catalogId,
  audience = "consumer",
}: BookPriceDualProps) {
  const price = formatPrice(exVat, { from: true, audience, channel: "page" });

  return (
    <div className={cn("min-w-0 space-y-0.5", className)}>
      <p className={cn("break-words font-bold text-foreground", SIZE_CLASS[size])}>
        {price.headline}
      </p>
      {price.vatNote ? (
        <p className="break-words text-xs text-muted-foreground">{price.vatNote}</p>
      ) : null}
      {catalogId ? <PricingTransparencyBlock catalogId={catalogId} compact /> : null}
    </div>
  );
}
