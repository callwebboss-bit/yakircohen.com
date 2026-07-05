"use client";

import { getPriceById, type PriceItemId } from "@/lib/data/pricing-catalog";
import { formatFromPriceDual } from "@/lib/data/pricing-catalog";
import { useBookCoupon } from "@/components/booking/BookCouponContext";

type PricingCatalogBannerProps = {
  catalogId: PriceItemId;
};

export default function PricingCatalogBanner({ catalogId }: PricingCatalogBannerProps) {
  const { offer } = useBookCoupon();
  const item = getPriceById(catalogId);
  const priceLine = formatFromPriceDual(item.exVat).replace("כרגע: ", "");
  const couponApplies = offer != null && offer.catalogId === catalogId;

  return (
    <div
      className="mb-6 rounded-2xl border border-brand-red/20 bg-brand-red/5 px-4 py-3 text-sm text-foreground"
      role="status"
    >
      הגעתם מהמחירון:{" "}
      <strong className="font-semibold">{item.label}</strong>
      {", "}
      {priceLine}
      {couponApplies && offer ? (
        <p className="mt-2 text-xs font-medium text-brand-red">
          קוד {offer.code} הוחל: -{offer.amountOffExVat.toLocaleString("he-IL")} ₪ לפני מע״מ
        </p>
      ) : null}
    </div>
  );
}
