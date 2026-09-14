import { RINGTONE_PRICE_NIS } from "@/lib/data/funny-ringtone-page";
import { ENTITY_IDS } from "@/lib/seo/entity-ids";

/* היה כאן LocalBusiness אנונימי עם כתובת חלקית. עכשיו הפניה לצומת הקנוני,
   ואזור השירות נשאר בנפרד כי הוא מתאר את הכיסוי של השירות ולא של העסק. */
const PROVIDER_REF = { "@id": ENTITY_IDS.localBusiness };
const GIFTS_AREA_SERVED = ["מודיעין", "ירושלים", "מרכז"];

export function buildStudioGiftsServiceSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "מתנות ושוברי מתנה מהאולפן",
    description:
      "שובר מתנה לכל שירות באולפן במודיעין - הקלטת שיר, פודקאסט עם סבא, קליפ לבת/בר מצווה, ברכות, רינגטון מצחיק ועוד.",
    provider: PROVIDER_REF,
    serviceType: "שובר מתנה מהאולפן",
    areaServed: GIFTS_AREA_SERVED,
  };
}

export function buildFunnyRingtoneServiceSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "רינגטון מצחיק במתנה",
    description:
      "מתנה מקורית ליום הולדת או הפתעה לחבר - רינגטון אישי מוקלט ומעובד באולפן, מוכן להתקנה ב-iPhone ו-Android.",
    provider: PROVIDER_REF,
    serviceType: "רינגטון מצחיק",
    areaServed: GIFTS_AREA_SERVED,
    offers: {
      "@type": "Offer",
      price: String(RINGTONE_PRICE_NIS),
      priceCurrency: "ILS",
      availability: "https://schema.org/InStock",
    },
  };
}
