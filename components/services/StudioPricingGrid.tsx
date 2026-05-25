import type { PricingTier } from "@/lib/data/services";
import { buildServiceWhatsAppText, buildWhatsAppHref } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

export type StudioPricingGridProps = {
  tiers: readonly PricingTier[];
};

export default function StudioPricingGrid({ tiers }: StudioPricingGridProps) {
  return (
    <div className="mx-auto max-w-[72rem] px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {tiers.map((tier) => {
          const whatsappHref = buildWhatsAppHref({
            text: buildServiceWhatsAppText(tier.name),
            utm_source: "website",
            utm_campaign: tier.utmCampaign,
          });

          return (
            <article
              key={tier.id}
              className={cn(
                "relative flex flex-col rounded-xl border bg-background p-6 shadow-sm transition-[border-color,box-shadow,transform] duration-normal ease-luxury",
                tier.featured
                  ? "border-brand-red shadow-md ring-1 ring-brand-red/30"
                  : "border-border hover:border-brand-red/30 hover:shadow-md",
              )}
            >
              {tier.featured ? (
                <span className="absolute -top-3 start-6 rounded-full border border-brand-red/40 bg-brand-red px-3 py-0.5 text-[0.65rem] font-bold text-white">
                  הכי מבוקש
                </span>
              ) : null}

              <h3 className="text-lg font-semibold text-foreground">{tier.name}</h3>
              <p className="mt-2 text-3xl font-semibold tracking-tight text-foreground">
                {tier.price}
              </p>
              {tier.priceNote ? (
                <p className="mt-1 text-xs text-muted-foreground">{tier.priceNote}</p>
              ) : null}
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                {tier.description}
              </p>

              <ul className="mt-6 flex-1 space-y-2">
                {tier.highlights.map((item) => (
                  <li
                    key={item}
                    className="flex gap-2 text-sm text-foreground"
                  >
                    <span
                      className="mt-0.5 text-brand-red"
                      aria-hidden="true"
                    >
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
                  "mt-8 inline-flex w-full items-center justify-center rounded-md px-4 py-2.5 text-sm font-semibold transition-colors duration-normal ease-luxury",
                  tier.featured
                    ? "bg-brand-red text-white hover:bg-brand-red-light"
                    : "border border-brand-red text-foreground hover:bg-brand-red/10",
                )}
              >
                הזמנה בוואטסאפ
              </a>
            </article>
          );
        })}
      </div>
    </div>
  );
}
