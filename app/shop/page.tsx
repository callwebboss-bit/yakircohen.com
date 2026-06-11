import UsedGearPageContent from "@/components/seo/UsedGearPageContent";
import HubPageSchema from "@/components/seo/HubPageSchema";
import { metadataForHubSeo, SHOP_HUB_SEO, hubSchemaPropsFromSeo } from "@/lib/seo/hub-pages";
import { absoluteUrl } from "@/lib/site-url";
import { CONTACT_PHONE_E164, SITE_NAME } from "@/lib/constants";

export const metadata = metadataForHubSeo(SHOP_HUB_SEO);

const pageUrl = absoluteUrl("shop");

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": `${pageUrl}#webpage`,
      url: pageUrl,
      name: "חנות ציוד מקצועי - יקיר כהן הפקות",
      description:
        "ציוד הגברה, אולפן, תאורה ואביזרים מקצועיים יד שנייה למכירה",
      inLanguage: "he-IL",
      isPartOf: { "@id": `${absoluteUrl()}/#website` },
    },
    {
      "@type": "OfferCatalog",
      "@id": `${pageUrl}#catalog`,
      name: "ציוד מקצועי למכירה",
      description:
        "ציוד הגברה, אולפן, תאורה ואביזרים מקצועיים יד שנייה מהפקות יקיר כהן",
      provider: {
        "@type": "Organization",
        name: SITE_NAME,
        url: absoluteUrl(),
        telephone: CONTACT_PHONE_E164,
      },
      itemListElement: [
        {
          "@type": "Offer",
          position: 1,
          name: "רמקולים מוגברים RCF 745 כולל סאבוופר",
          itemCondition: "https://schema.org/UsedCondition",
          availability: "https://schema.org/InStock",
        },
        {
          "@type": "Offer",
          position: 2,
          name: "עמדות די ג'יי - Traktor S4 MK3 (2 יחידות)",
          itemCondition: "https://schema.org/UsedCondition",
          availability: "https://schema.org/InStock",
        },
        {
          "@type": "Offer",
          position: 3,
          name: "ציוד אולפן - KRK Rokit 8, UAD Twin, Sphere L22",
          itemCondition: "https://schema.org/UsedCondition",
          availability: "https://schema.org/InStock",
        },
        {
          "@type": "Offer",
          position: 4,
          name: "ציוד תאורה - עמדות LED מקצועיות",
          itemCondition: "https://schema.org/UsedCondition",
          availability: "https://schema.org/InStock",
        },
        {
          "@type": "Offer",
          position: 5,
          name: "ציוד אפקטים - מכונת עשן, תותח קונפטי, תאורת פודקאסט",
          itemCondition: "https://schema.org/UsedCondition",
          availability: "https://schema.org/InStock",
        },
      ],
    },
  ],
};

export default function ShopPage() {
  return (
    <>
      <HubPageSchema {...hubSchemaPropsFromSeo(SHOP_HUB_SEO)} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <UsedGearPageContent />
    </>
  );
}
