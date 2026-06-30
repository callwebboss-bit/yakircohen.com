"use client";

import PriceWithVat from "@/components/booking/PriceWithVat";
import { useBookCoupon } from "@/components/booking/BookCouponContext";
import {
  applyCouponDiscountExVat,
  formatCouponTotalLabel,
} from "@/lib/data/coupon-offers";
import { cn } from "@/lib/utils";

type WizardCouponPriceLineProps = {
  totalExVat: number;
  size?: "sm" | "md" | "lg";
  className?: string;
};

export default function WizardCouponPriceLine({
  totalExVat,
  size = "lg",
  className,
}: WizardCouponPriceLineProps) {
  const { offer } = useBookCoupon();
  if (!offer || totalExVat <= 0) {
    return <PriceWithVat amountExVat={totalExVat} size={size} className={className} />;
  }

  const discounted = applyCouponDiscountExVat(offer, totalExVat);

  return (
    <div className={cn("space-y-2", className)}>
      <p className="text-xs text-muted-foreground line-through">
        <PriceWithVat amountExVat={totalExVat} size="sm" />
      </p>
      <p className="text-xs font-medium text-brand-red">
        {formatCouponTotalLabel(offer)}
      </p>
      <PriceWithVat amountExVat={discounted} size={size} />
    </div>
  );
}
