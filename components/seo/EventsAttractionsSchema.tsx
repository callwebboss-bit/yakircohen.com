import { safeJsonLdStringify } from "@/lib/safe-json-ld";

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
      lowPrice: 1750,
      highPrice: 5500,
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
