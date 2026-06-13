import brandCopy from "./closer-brand-copy.json";

export type CrossSellBadge = "popular" | "recommended";

export type CrossSellOffer = {
  id: string;
  headline: string;
  subline: string;
  stat?: string;
  badge?: CrossSellBadge;
  contexts: string[];
};

export const BOOKING_CROSS_SELL_OFFERS: readonly CrossSellOffer[] =
  brandCopy.crossSellOffers as CrossSellOffer[];

export type CrossSellContext = {
  bookCategory?: string;
  routeId?: string | null;
  recordingType?: string | null;
  atmosphere?: string | null;
  mobileGeo?: string | null;
  /** קבוצה 12+ בלי אולפן נייד - הצעת mobile-upsell */
  largeGroup?: boolean;
};

export function getCrossSellOffers(ctx: CrossSellContext, limit = 3): CrossSellOffer[] {
  const keys = [
    ctx.bookCategory,
    ctx.routeId,
    ctx.recordingType,
    ctx.atmosphere,
    ctx.atmosphere ? `atmosphere-${ctx.atmosphere}` : null,
    ctx.mobileGeo ? "mobile" : null,
    ctx.largeGroup ? "mobile-upsell" : null,
  ].filter(Boolean) as string[];
  const scored = BOOKING_CROSS_SELL_OFFERS.map((offer) => {
    const score = offer.contexts.filter((c) => keys.includes(c)).length;
    return { offer, score };
  })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score);
  return scored.slice(0, limit).map((x) => x.offer);
}
