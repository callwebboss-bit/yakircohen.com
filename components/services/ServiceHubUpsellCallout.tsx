import Link from "next/link";
import { HUB_CROSS_SELL, type HubCrossSellOffer } from "@/lib/data/hub-cross-sell";
import { buildWhatsAppHref } from "@/lib/whatsapp";

type HubCategory = keyof typeof HUB_CROSS_SELL;

type ServiceHubUpsellCalloutProps = {
  category: HubCategory;
};

function UpsellBlock({ offer }: { offer: HubCrossSellOffer }) {
  const waHref = buildWhatsAppHref({
    text: offer.waText,
    utm_source: "website",
    utm_campaign: offer.utmCampaign,
  });

  return (
    <aside
      className="rounded-2xl border border-[var(--service-accent,#d42b2b)]/30 bg-surface px-6 py-7 sm:px-8"
      aria-labelledby={`hub-upsell-${offer.id}`}
    >
      <p className="text-xs font-semibold tracking-[0.15em] text-[var(--service-accent-ink,#8a1c1c)] uppercase">
        {offer.eyebrow}
      </p>
      <h2
        id={`hub-upsell-${offer.id}`}
        className="mt-2 text-lg font-semibold text-foreground sm:text-xl"
      >
        {offer.title}
      </h2>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
        {offer.body}
      </p>
      <p className="mt-2 text-sm font-semibold text-brand-red">{offer.priceLabel}</p>
      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
        <a
          href={waHref}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-12 items-center justify-center rounded-md bg-brand-red px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-red-light"
        >
          בקשו הצעה בוואטסאפ
        </a>
        <Link
          href={offer.primaryHref}
          className="text-sm font-medium text-[var(--service-accent-ink,#8a1c1c)] transition-colors hover:opacity-80"
        >
          {offer.primaryLabel}
        </Link>
        {offer.secondaryHref && offer.secondaryLabel ? (
          <Link
            href={offer.secondaryHref}
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-[var(--service-accent-ink,#8a1c1c)]"
          >
            {offer.secondaryLabel}
          </Link>
        ) : null}
      </div>
    </aside>
  );
}

export default function ServiceHubUpsellCallout({
  category,
}: ServiceHubUpsellCalloutProps) {
  return <UpsellBlock offer={HUB_CROSS_SELL[category]} />;
}
