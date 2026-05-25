import ServicePageLayout from "@/components/services/ServicePageLayout";
import StudioPricingGrid from "@/components/services/StudioPricingGrid";
import { STUDIO_PRICING, metadataFromPricing } from "@/lib/data/services";

export const metadata = metadataFromPricing(STUDIO_PRICING);

export default function StudioPricingPage() {
  return (
    <ServicePageLayout
      title={STUDIO_PRICING.title}
      subtitle={STUDIO_PRICING.subtitle}
      features={STUDIO_PRICING.features}
      whatsappText="שלום, מעוניין לקבל הצעת מחיר מותאמת לאולפן"
      utmCampaign="studio_pricing_general"
      ctaLabel="ייעוץ תמחור בוואטסאפ"
    >
      <StudioPricingGrid tiers={STUDIO_PRICING.tiers} />
    </ServicePageLayout>
  );
}
