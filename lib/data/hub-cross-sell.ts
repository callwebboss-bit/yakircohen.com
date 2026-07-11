import {
  EVENT_ATTRACTION_FROM_NIS,
  formatMeNis,
  formatNis,
  PODCAST_EDITING_PER_HOUR_NIS,
} from "@/lib/data/pricing";
import { getExVat } from "@/lib/data/pricing-catalog";

export type HubCrossSellOffer = {
  id: string;
  eyebrow: string;
  title: string;
  body: string;
  priceLabel: string;
  primaryHref: string;
  primaryLabel: string;
  secondaryHref?: string;
  secondaryLabel?: string;
  waText: string;
  utmCampaign: string;
};

const slideshowPrice = getExVat("cinematic_slideshow");
const singleEffectPrice = getExVat("single_effect");

export const HUB_CROSS_SELL: Record<
  "studio" | "events" | "podcast",
  HubCrossSellOffer
> = {
  studio: {
    id: "studio-smoke-photo",
    eyebrow: "תוספת לחבילה",
    title: "עשן כבד או צילום אחרי ההקלטה",
    body: "אותו תיאום, ספק אחד. מתאים לחתונה או בר/בת מצווה.",
    priceLabel: `אטרקציה ${formatMeNis(EVENT_ATTRACTION_FROM_NIS)} לפני מע״מ`,
    primaryHref: "/events/attractions/wedding-smoking-machine",
    primaryLabel: "עשן כבד לאירוע",
    secondaryHref: "/photography/wedding",
    secondaryLabel: "צילום לחתונה",
    waText: "שלום, אחרי הקלטה באולפן - אשמח לשמוע על תוספת עשן כבד או צילום",
    utmCampaign: "hub_upsell_studio",
  },
  events: {
    id: "events-slideshow",
    eyebrow: "תוספת לאירוע",
    title: "מצגת תמונות קולנועית",
    body: `מוכנה ליום האירוע. מחיר נפרד מאטרקציות: ${formatNis(slideshowPrice)} לפני מע״מ.`,
    priceLabel: formatNis(slideshowPrice),
    primaryHref: "/photo-slideshow",
    primaryLabel: "מצגת תמונות",
    secondaryHref: "/shop#bundles",
    secondaryLabel: "חבילות בחנות",
    waText: "שלום, מעוניין/ת במצגת תמונות לאירוע בנוסף להגברה/DJ",
    utmCampaign: "hub_upsell_events",
  },
  podcast: {
    id: "podcast-edit",
    eyebrow: "תוספת לפודקאסט",
    title: "עריכת פרק מוכן לפרסום",
    body: "הקלטה באולפן ועריכה באותו תהליך. בלי שני ספקים.",
    priceLabel: `${formatNis(PODCAST_EDITING_PER_HOUR_NIS)} לשעת חומר גולמי, לפני מע״מ`,
    primaryHref: "/podcast/podcast-editing",
    primaryLabel: "עריכת פודקאסט",
    secondaryHref: "/shop#bundles",
    secondaryLabel: "חבילות בחנות",
    waText: "שלום, אשמח לשמוע על חבילת הקלטה + עריכת פודקאסט",
    utmCampaign: "hub_upsell_podcast",
  },
};

/** Prices shown on thank-you cross-sell cards (offer id → label). */
export const CROSS_SELL_PRICE_BY_ID: Record<string, string> = {
  prep_digital: "149 ₪",
  slideshow: formatNis(slideshowPrice),
  bts_clip: formatMeNis(singleEffectPrice),
};
