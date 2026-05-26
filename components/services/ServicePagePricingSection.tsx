import ServicePricingBlock from "@/components/services/ServicePricingBlock";
import type { ServiceEntity } from "@/lib/data/services";
import { cn } from "@/lib/utils";

export type ServicePagePricingSectionProps = {
  service: Pick<ServiceEntity, "pricing" | "title" | "utmCampaign">;
  serviceTitle?: string;
  className?: string;
  heading?: string;
  subheading?: string;
};

export default function ServicePagePricingSection({
  service,
  serviceTitle,
  className,
  heading = "מחירון שקוף",
  subheading = "מחירים התחלתיים · הצעה מדויקת לאחר פרטי האירוע בוואטסאפ",
}: ServicePagePricingSectionProps) {
  if (!service.pricing?.length) return null;

  return (
    <section
      className={cn(
        "scroll-mt-24 rounded-2xl border border-border bg-surface px-4 py-10 sm:px-8",
        className,
      )}
      aria-labelledby="service-page-pricing-heading"
    >
      <header className="mx-auto mb-8 max-w-2xl text-center">
        <h2
          id="service-page-pricing-heading"
          className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
        >
          {heading}
        </h2>
        <p className="mt-3 text-sm text-muted-foreground">{subheading}</p>
      </header>
      <ServicePricingBlock
        tiers={service.pricing}
        serviceTitle={serviceTitle ?? service.title}
        utmCampaignPrefix={service.utmCampaign}
        embedded
      />
    </section>
  );
}
