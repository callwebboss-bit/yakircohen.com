"use client";

import { trackConversion } from "@/lib/analytics/conversion-events";
import { getCrossSellOffers } from "@/lib/data/booking-cross-sell";
import { CROSS_SELL_PRICE_BY_ID } from "@/lib/data/hub-cross-sell";
import type { BookCategoryId } from "@/lib/book-url";
import { cn } from "@/lib/utils";

type BookingCrossSellSectionProps = {
  bookCategory?: BookCategoryId;
  routeId?: string | null;
  recordingType?: string | null;
  atmosphere?: string | null;
  className?: string;
  /** When true, clicks fire thank_you_upsell_click */
  trackThankYou?: boolean;
};

export default function BookingCrossSellSection({
  bookCategory,
  routeId,
  recordingType,
  atmosphere,
  className,
  trackThankYou = false,
}: BookingCrossSellSectionProps) {
  const offers = getCrossSellOffers(
    {
      bookCategory,
      routeId,
      recordingType,
      atmosphere,
    },
    3,
  );

  if (!offers.length) return null;

  return (
    <section className={cn("mt-8 text-right", className)} aria-label="הצעות משלימות">
      <h2 className="text-lg font-semibold text-foreground">אולי יעניין אתכם גם</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        שירותים נוספים עם מחיר התחלה שקוף
      </p>
      <ul className="mt-4 grid gap-3 sm:grid-cols-2">
        {offers.map((offer) => {
          const price = CROSS_SELL_PRICE_BY_ID[offer.id];
          return (
            <li
              key={offer.id}
              className="rounded-xl border border-border bg-card p-4 text-sm leading-relaxed shadow-sm"
            >
              {offer.badge === "popular" ? (
                <span className="mb-2 inline-block rounded-full bg-brand-red/10 px-2 py-0.5 text-xs font-semibold text-brand-red">
                  נפוץ
                </span>
              ) : null}
              {offer.badge === "recommended" ? (
                <span className="mb-2 inline-block rounded-full bg-amber-500/10 px-2 py-0.5 text-xs font-semibold text-amber-800">
                  מומלץ
                </span>
              ) : null}
              <p className="font-medium text-foreground">{offer.headline}</p>
              <p className="mt-2 text-muted-foreground">{offer.subline}</p>
              {price ? (
                <p className="mt-2 text-xs font-semibold text-brand-red">{price}</p>
              ) : offer.stat ? (
                <p className="mt-2 text-xs font-medium text-brand-red/80">{offer.stat}</p>
              ) : null}
              {trackThankYou ? (
                <button
                  type="button"
                  className="mt-3 text-xs font-semibold text-brand-red hover:underline"
                  onClick={() =>
                    trackConversion("thank_you_upsell_click", { offer: offer.id })
                  }
                >
                  שמרו לעצמכם לשיחה
                </button>
              ) : null}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
