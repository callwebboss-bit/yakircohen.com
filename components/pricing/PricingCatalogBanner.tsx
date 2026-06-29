import { getPriceById, type PriceItemId } from "@/lib/data/pricing-catalog";
import { formatFromPriceDual } from "@/lib/data/pricing-catalog";

type PricingCatalogBannerProps = {
  catalogId: PriceItemId;
};

export default function PricingCatalogBanner({ catalogId }: PricingCatalogBannerProps) {
  const item = getPriceById(catalogId);
  const priceLine = formatFromPriceDual(item.exVat).replace("כרגע: ", "");

  return (
    <div
      className="mb-6 rounded-2xl border border-brand-red/20 bg-brand-red/5 px-4 py-3 text-sm text-foreground"
      role="status"
    >
      הגעתם מהמחירון:{" "}
      <strong className="font-semibold">{item.label}</strong>
      {" — "}
      {priceLine}
    </div>
  );
}
