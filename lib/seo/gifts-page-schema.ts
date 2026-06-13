import { RINGTONE_PRICE_NIS } from "@/lib/data/funny-ringtone-page";
import { SITE_NAME } from "@/lib/constants";
import { buildGoogleAggregateRatingSchema } from "@/lib/google-trust";

const LOCAL_BUSINESS_PROVIDER = {
  "@type": "LocalBusiness" as const,
  name: SITE_NAME,
  address: {
    "@type": "PostalAddress" as const,
    addressLocality: "מודיעין-מכבים-רעות",
    addressCountry: "IL",
  },
  areaServed: ["מודיעין", "ירושלים", "מרכז"],
};

export function buildStudioGiftsServiceSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "מתנות ושוברי מתנה מהאולפן",
    description:
      "שובר מתנה לכל שירות באולפן במודיעין - הקלטת שיר, פודקאסט עם סבא, קליפ לבת/בר מצווה, ברכות, רינגטון מצחיק ועוד.",
    provider: LOCAL_BUSINESS_PROVIDER,
    serviceType: "שובר מתנה מהאולפן",
    areaServed: LOCAL_BUSINESS_PROVIDER.areaServed,
    aggregateRating: buildGoogleAggregateRatingSchema(),
  };
}

export function buildFunnyRingtoneServiceSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "רינגטון מצחיק במתנה",
    description:
      "מתנה מקורית ליום הולדת או הפתעה לחבר - רינגטון אישי מוקלט ומעובד באולפן, מוכן להתקנה ב-iPhone ו-Android.",
    provider: LOCAL_BUSINESS_PROVIDER,
    serviceType: "רינגטון מצחיק",
    areaServed: LOCAL_BUSINESS_PROVIDER.areaServed,
    offers: {
      "@type": "Offer",
      price: String(RINGTONE_PRICE_NIS),
      priceCurrency: "ILS",
      availability: "https://schema.org/InStock",
    },
    aggregateRating: buildGoogleAggregateRatingSchema(),
  };
}
