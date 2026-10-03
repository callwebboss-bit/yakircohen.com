import { safeJsonLdStringify } from "@/lib/safe-json-ld";
import { getExVat } from "@/lib/data/pricing-catalog";

export default function EventsAttractionsSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: "אטרקציות לאירועים - יקיר כהן הפקות",
    description:
      "אטרקציות לחתונה, בר מצווה ואירועי חברה: מכונת עשן, זיקוקים קרים, קונפטי ועוד. DJ + אטרקציות בחבילה אחת.",
    brand: { "@type": "Brand", name: "יקיר כהן הפקות" },
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "ILS",
      /* WP4: היה 1,750 עד 5,500, שני מחירים שפרשו מהקטלוג. עכשיו אטרקציה בודדת
         עד חבילת ארבע, לפני מע״מ, עם דגל מע״מ מפורש. */
      lowPrice: getExVat("event_attraction_1"),
      highPrice: getExVat("event_attraction_4"),
      priceSpecification: {
        "@type": "PriceSpecification",
        priceCurrency: "ILS",
        valueAddedTaxIncluded: false,
      },
      offerCount: 12,
      availability: "https://schema.org/InStock",
      areaServed: {
        "@type": "GeoCircle",
        geoMidpoint: {
          "@type": "GeoCoordinates",
          latitude: 31.9,
          longitude: 35.0,
        },
        geoRadius: "60000",
      },
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: safeJsonLdStringify(schema) }}
    />
  );
}
