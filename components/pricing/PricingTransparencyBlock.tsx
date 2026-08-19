import CatalogOfferPanel from "@/components/pricing/CatalogOfferPanel";
import type { PriceItemId, PriceTransparency } from "@/lib/data/pricing-catalog";

type PricingTransparencyBlockProps = {
  catalogId?: PriceItemId;
  transparency?: PriceTransparency;
  className?: string;
  compact?: boolean;
};

/** תאימות לשם הישן - פאנל שרת עם details, בלי אי רנדור ב-homepage hero */
export default function PricingTransparencyBlock(props: PricingTransparencyBlockProps) {
  return <CatalogOfferPanel {...props} />;
}
