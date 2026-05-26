import Link from "next/link";
import ServicePageLayout from "@/components/services/ServicePageLayout";
import StudioPricingGrid from "@/components/services/StudioPricingGrid";
import { STUDIO_PRICING, metadataFromPricing } from "@/lib/data/services";
import { PRICES_EXCLUDE_VAT_NOTE } from "@/lib/data/pricing";

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
      <div className="mx-auto max-w-[72rem] px-4 pb-4 sm:px-6 lg:px-8">
        <p className="text-center text-sm text-muted-foreground">
          {PRICES_EXCLUDE_VAT_NOTE}.{" "}
          <Link href="/pricing" className="font-semibold text-brand-red hover:underline">
            מחירון מרכזי (אולפן, פודקאסט, אירועים)
          </Link>
          {" · "}
          <Link href="/book" className="font-semibold text-brand-red hover:underline">
            הזמנה מקוונת
          </Link>
        </p>
      </div>
      <StudioPricingGrid tiers={STUDIO_PRICING.tiers} />
    </ServicePageLayout>
  );
}
