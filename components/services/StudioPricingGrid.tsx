import PriceWithVat from "@/components/booking/PriceWithVat";
import Container from "@/components/ui/Container";
import type { PricingTier } from "@/lib/data/services";
import { buildServiceWhatsAppText, buildWhatsAppHref } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

export type StudioPricingGridProps = {
  tiers: readonly PricingTier[];
};

export default function StudioPricingGrid({ tiers }: StudioPricingGridProps) {
  return (
    <Container>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {tiers.map((tier) => {
          const priceLabel =
            tier.priceExVat != null
              ? `${tier.priceExVat.toLocaleString("he-IL")} ₪`
              : tier.price;
          const whatsappHref = buildWhatsAppHref({
            text: buildServiceWhatsAppText(tier.name, priceLabel),
            utm_source: "website",
            utm_campaign: tier.utmCampaign,
          });

          return (
            <article
              key={tier.id}
              className={cn(
                // IMPROVED: hover-lift replaces raw translate-y on touch devices
                "group relative flex flex-col overflow-hidden rounded-2xl border bg-surface p-6 hover-lift",
                tier.featured
                  ? "border-[var(--service-accent,#d42b2b)]/40 shadow-md ring-1 ring-[var(--service-accent,#d42b2b)]/20 hover:border-[var(--service-accent,#d42b2b)]/60 hover:shadow-lg"
                  : "border-border hover:border-[var(--service-accent,#d42b2b)]/30 hover:shadow-md",
              )}
            >
              <span
                className={cn(
                  "pointer-events-none absolute inset-x-0 top-0 h-0.5 origin-right scale-x-0 bg-[var(--service-accent,#d42b2b)] transition-transform duration-normal ease-luxury group-hover:scale-x-100",
                  tier.featured && "scale-x-100",
                )}
                aria-hidden
              />

              {tier.featured ? (
                <span className="mb-3 inline-flex w-fit rounded-full bg-brand-red px-2.5 py-0.5 text-[0.65rem] font-bold text-white">
                  הכי מבוקש
                </span>
              ) : null}

              <h3 className="font-serif text-lg font-semibold text-foreground">
                {tier.name}
              </h3>
              {tier.priceExVat != null ? (
                <div className="mt-2">
                  <PriceWithVat amountExVat={tier.priceExVat} size="lg" />
                </div>
              ) : (
                <p className="mt-2 text-3xl font-semibold tracking-tight text-[var(--service-accent,#d42b2b)]">
                  {tier.price}
                </p>
              )}
              {tier.priceNote ? (
                <p className="mt-1 text-xs text-muted-foreground">{tier.priceNote}</p>
              ) : null}
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                {tier.description}
              </p>

              <ul className="mt-6 flex-1 space-y-2">
                {tier.highlights.map((item) => (
                  <li key={item} className="flex gap-2 text-sm text-foreground">
                    <span className="mt-0.5 text-[var(--service-accent,#d42b2b)]" aria-hidden="true">
                      ✓
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "mt-8 inline-flex min-h-11 w-full items-center justify-center rounded-xl px-4 text-sm font-semibold transition-[transform,colors] duration-normal ease-luxury active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--service-accent,#d42b2b)]",
                  tier.featured
                    ? "bg-brand-red text-white shadow-[0_0_16px_color-mix(in_srgb,var(--service-accent,#d42b2b)_25%,transparent)] hover:bg-brand-red-light"
                    : "border border-[var(--service-accent,#d42b2b)]/40 text-foreground hover:bg-[var(--service-accent,#d42b2b)]/10",
                )}
              >
                סגרו את המחיר הזה בוואטסאפ
              </a>
            </article>
          );
        })}
      </div>
    </Container>
  );
}
