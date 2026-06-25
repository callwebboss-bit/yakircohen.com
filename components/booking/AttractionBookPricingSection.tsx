import PriceWithVat from "@/components/booking/PriceWithVat";
import PriceActionRow from "@/components/booking/PriceActionRow";
import {
  getAttractionItemName,
  getAttractionPricingTiers,
  getBundlePricingTable,
  type AttractionPricingTier,
} from "@/lib/data/attraction-book-pricing";
import type { EventBookingItemId } from "@/lib/data/events-booking";
import { cn } from "@/lib/utils";

export type AttractionBookPricingSectionProps = {
  itemId?: EventBookingItemId | null;
  serviceTitle?: string;
  utmCampaign?: string;
  heading?: string;
  subheading?: string;
  showBundleTable?: boolean;
  className?: string;
};

function PricingTierCard({
  tier,
  serviceLabel,
  eventItemId,
  utmCampaign,
}: {
  tier: AttractionPricingTier;
  serviceLabel: string;
  eventItemId?: EventBookingItemId | null;
  utmCampaign?: string;
}) {
  return (
    <article
      className={cn(
        "flex h-full flex-col rounded-xl border p-5",
        tier.featured
          ? "border-brand-red/50 bg-brand-red/5"
          : "border-border bg-surface",
      )}
    >
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="text-base font-semibold text-foreground">{tier.name}</h3>
        <PriceWithVat amountExVat={tier.priceExVat} size="md" compact />
      </div>
      {tier.priceNote ? (
        <p className="mt-1 text-xs text-muted-foreground">{tier.priceNote}</p>
      ) : null}
      <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
        {tier.description}
      </p>
      <div className="mt-4 border-t border-border pt-4">
        <PriceActionRow
          serviceLabel={`${tier.name} - ${serviceLabel}`}
          priceExVat={tier.priceExVat}
          eventItemId={eventItemId}
          utmCampaign={utmCampaign}
          compact
        />
      </div>
    </article>
  );
}

export default function AttractionBookPricingSection({
  itemId = null,
  serviceTitle,
  utmCampaign = "attraction_book_pricing",
  heading = "מחירון - כמו בעמוד ההזמנה",
  subheading = "המחירים כאן זהים ל-/book#events. בוחרים אטרקציות, מוסיפים הפעלות ושולחים בוואטסאפ.",
  showBundleTable = true,
  className,
}: AttractionBookPricingSectionProps) {
  const itemName = itemId ? getAttractionItemName(itemId) : null;
  const label = serviceTitle ?? itemName ?? "אטרקציות לאירוע";
  const tiers = itemId ? getAttractionPricingTiers(itemId) : [];
  const bundleRows = showBundleTable ? getBundlePricingTable() : [];
  const anchorPrice = tiers[0]?.priceExVat ?? bundleRows[0]?.priceExVat ?? 0;

  return (
    <section
      id="pricing-section"
      className={cn(
        "scroll-mt-24 rounded-2xl border border-border bg-surface px-4 py-10 sm:px-8",
        className,
      )}
      aria-labelledby="attraction-book-pricing-heading"
    >
      <header className="mx-auto mb-8 max-w-2xl text-center">
        <h2
          id="attraction-book-pricing-heading"
          className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
        >
          {heading}
        </h2>
        <p className="mt-3 text-sm text-muted-foreground">{subheading}</p>
      </header>

      {tiers.length > 0 ? (
        <ul
          className={cn(
            "grid gap-5",
            tiers.length >= 3
              ? "sm:grid-cols-2 lg:grid-cols-3"
              : "md:grid-cols-2",
          )}
        >
          {tiers.map((tier) => (
            <li key={tier.name}>
              <PricingTierCard
                tier={tier}
                serviceLabel={label}
                eventItemId={itemId}
                utmCampaign={utmCampaign}
              />
            </li>
          ))}
        </ul>
      ) : null}

      {bundleRows.length > 0 ? (
        <div className={cn(tiers.length > 0 ? "mt-10" : "")}>
          <h3 className="text-center text-lg font-semibold text-foreground">
            חבילות משולבות
          </h3>
          <p className="mt-2 text-center text-xs text-muted-foreground">
            ככל שמוסיפים אטרקציות - המחיר ליחידה יורד
          </p>
          <ul className="mx-auto mt-6 grid max-w-3xl gap-3 sm:grid-cols-2">
            {bundleRows.map((row) => (
              <li
                key={row.count}
                className={cn(
                  "rounded-xl border px-4 py-3 text-sm",
                  row.highlight
                    ? "border-brand-red/40 bg-brand-red/5"
                    : "border-border bg-background",
                )}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-medium text-foreground">
                    {row.count >= 4 ? `${row.count}+ אטרקציות` : `${row.count} אטרקציות`}
                  </span>
                  <span className="font-semibold tabular-nums">
                    {row.priceExVat.toLocaleString("he-IL")} ₪
                  </span>
                </div>
                {row.saving ? (
                  <p className="mt-1 text-xs text-green-700">{row.saving}</p>
                ) : null}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {anchorPrice > 0 ? (
        <div className="mx-auto mt-8 max-w-md">
          <PriceActionRow
            serviceLabel={label}
            priceExVat={anchorPrice}
            eventItemId={itemId}
            utmCampaign={utmCampaign}
            bookLabel="בנו חבילה בעמוד ההזמנה"
          />
        </div>
      ) : null}

      <p className="mx-auto mt-6 max-w-lg text-center text-[0.7rem] leading-relaxed text-muted-foreground">
        תוספת נסיעה לפי אזור (צפון, דרום, אילת) - נסגור בוואטסאפ אחרי בחירת מיקום.
      </p>
    </section>
  );
}
