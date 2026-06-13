import type { ServicePricingTier } from "@/lib/data/services";
import PriceSocialProof from "@/components/booking/PriceSocialProof";
import PriceWithVat from "@/components/booking/PriceWithVat";
import { buildWhatsAppHref } from "@/lib/whatsapp";
import { whatsappAriaLabel, whatsappQuoteCta } from "@/lib/data/conversion-copy";
import { buildPricingInquiryMessage } from "@/lib/whatsapp-closing";
import { cn } from "@/lib/utils";

export type ServicePricingBlockProps = {
  tiers: readonly ServicePricingTier[];
  serviceTitle: string;
  utmCampaignPrefix?: string;
  /** בתוך כרטיס עמוד - בלי padding חיצוני וכותרת כפולה */
  embedded?: boolean;
  hideHeader?: boolean;
  source?: string;
};

export default function ServicePricingBlock({
  tiers,
  serviceTitle,
  utmCampaignPrefix = "service_pricing",
  embedded = false,
  hideHeader = false,
  source,
}: ServicePricingBlockProps) {
  if (tiers.length === 0) return null;

  const colClass =
    tiers.length >= 3
      ? "grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
      : "grid-cols-1 gap-5 md:grid-cols-2";

  const grid = (
    <ul className={embedded ? `grid ${colClass}` : `mt-10 grid ${colClass}`}>
          {tiers.map((tier, index) => {
            const packageLabel = `${tier.name} - ${serviceTitle}`;
            const whatsappText = buildPricingInquiryMessage({
              packageLabel,
              priceExVat: tier.priceExVat,
              source: source ?? serviceTitle,
            });
            const whatsappHref = buildWhatsAppHref({
              text: whatsappText,
              utm_source: "website",
              utm_campaign: `${utmCampaignPrefix}_${index}`,
            });

            return (
              <li key={tier.name}>
                <article
                  data-billing-type="one-time"
                  data-package-id={tier.name}
                  itemScope
                  itemType="https://schema.org/Offer"
                  className={cn(
                    "relative flex h-full flex-col rounded-xl border p-6",
                    tier.featured
                      ? "border-[var(--service-accent,#d42b2b)]/50 bg-[var(--service-accent,#d42b2b)]/5"
                      : "border-border bg-surface",
                  )}
                >
                {tier.badge ? (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-brand-red px-3 py-1 text-xs font-semibold text-white">
                    {tier.badge}
                  </span>
                ) : null}
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="text-lg font-semibold text-foreground">
                    {tier.name}
                  </h3>
                  {tier.priceExVat !== undefined ? (
                    <PriceWithVat amountExVat={tier.priceExVat} size="md" compact />
                  ) : (
                    <p className="text-xl font-semibold text-[var(--service-accent-ink,#d42b2b)]">{tier.price}</p>
                  )}
                </div>
                {tier.priceExVat !== undefined ? (
                  <>
                    <p className="mt-1 text-xs text-muted-foreground">
                      כולל מע״מ - {tier.priceNote ?? "לפני מע״מ +18%"}
                    </p>
                    {tier.featured ? (
                      <PriceSocialProof className="mt-2" testimonialIndex={1} />
                    ) : null}
                  </>
                ) : tier.priceNote ? (
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
                  aria-label={
                    tier.priceExVat !== undefined
                      ? whatsappAriaLabel(tier.name, tier.priceExVat)
                      : `סגרו ${tier.name} בוואטסאפ`
                  }
                  className="touch-press mt-6 inline-flex w-full items-center justify-center rounded-md bg-brand-red px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-red-light active:bg-brand-red-dark"
                >
                  {tier.priceExVat !== undefined
                    ? whatsappQuoteCta(tier.name, tier.priceExVat)
                    : "סגרו את המחיר הזה בוואטסאפ"}
                </a>
                </article>
              </li>
            );
          })}
    </ul>
  );

  if (embedded) {
    return grid;
  }

  return (
    <section
      className="border-b border-border bg-background py-12 sm:py-16"
      aria-labelledby={hideHeader ? undefined : "service-pricing-heading"}
    >
      <div className="mx-auto max-w-[72rem] px-4 sm:px-6 lg:px-8">
        {!hideHeader ? (
          <header className="mx-auto max-w-2xl text-center">
            <h2
              id="service-pricing-heading"
              className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
            >
              חבילות ומחירון שקוף
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
              מחירים לפני מע״מ וכולל מע״מ - הצעה מדויקת לאחר פרטי האירוע בוואטסאפ.
            </p>
          </header>
        ) : null}
        {grid}
      </div>
    </section>
  );
}
