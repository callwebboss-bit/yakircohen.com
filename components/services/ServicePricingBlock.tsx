import type { ServicePricingTier } from "@/lib/data/services";
import { buildServiceWhatsAppText, buildWhatsAppHref } from "@/lib/whatsapp";

export type ServicePricingBlockProps = {
  tiers: readonly ServicePricingTier[];
  serviceTitle: string;
  utmCampaignPrefix?: string;
};

export default function ServicePricingBlock({
  tiers,
  serviceTitle,
  utmCampaignPrefix = "service_pricing",
}: ServicePricingBlockProps) {
  if (tiers.length === 0) return null;

  return (
    <section
      className="border-b border-border bg-background py-12 sm:py-16"
      aria-labelledby="service-pricing-heading"
    >
      <div className="mx-auto max-w-[72rem] px-4 sm:px-6 lg:px-8">
        <header className="mx-auto max-w-2xl text-center">
          <h2
            id="service-pricing-heading"
            className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
          >
            חבילות ומחירון שקוף
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
            מחירים התחלתיים - הצעה מדויקת לאחר פרטי האירוע בוואטסאפ.
          </p>
        </header>
        <ul className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-2">
          {tiers.map((tier, index) => {
            const packageLabel = `${tier.name} - ${serviceTitle}`;
            const whatsappHref = buildWhatsAppHref({
              text: buildServiceWhatsAppText(packageLabel),
              utm_source: "website",
              utm_campaign: `${utmCampaignPrefix}_${index}`,
            });

            return (
              <li
                key={tier.name}
                className="flex flex-col rounded-xl border border-border bg-surface p-6"
              >
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="text-lg font-semibold text-foreground">
                    {tier.name}
                  </h3>
                  <p className="text-xl font-semibold text-brand-red">{tier.price}</p>
                </div>
                {tier.priceNote ? (
                  <p className="mt-1 text-xs text-muted-foreground">
                    {tier.priceNote}
                  </p>
                ) : null}
                <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                  {tier.description}
                </p>
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 inline-flex w-full items-center justify-center rounded-md bg-brand-red px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-red-light"
                >
                  הזמנה בוואטסאפ
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
