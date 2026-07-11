import ShopPageContent from "@/components/seo/ShopPageContent";
import HubPageSchema from "@/components/seo/HubPageSchema";
import { SHOP_VOUCHER_TIERS } from "@/lib/data/shop-vouchers";
import { metadataForHubSeo, SHOP_HUB_SEO, hubSchemaPropsFromSeo } from "@/lib/seo/hub-pages";
import { safeJsonLdStringify } from "@/lib/safe-json-ld";
import { absoluteUrl } from "@/lib/site-url";
import { CONTACT_PHONE_E164, SITE_NAME } from "@/lib/constants";
import { VAT_RATE } from "@/lib/data/pricing";

export const metadata = metadataForHubSeo(SHOP_HUB_SEO);

const pageUrl = absoluteUrl("shop");

function productOffers() {
  return SHOP_VOUCHER_TIERS.filter((t) => t.priceExVat != null).map((tier, i) => ({
    "@type": "Product",
    "@id": `${pageUrl}#product-${tier.id}`,
    name: tier.title,
    description: tier.desc,
    brand: { "@type": "Brand", name: SITE_NAME },
    offers: {
      "@type": "Offer",
      price: String(Math.round(tier.priceExVat! * (1 + VAT_RATE))),
      priceCurrency: "ILS",
      availability: "https://schema.org/InStock",
      url: `${pageUrl}#vouchers`,
      seller: {
        "@type": "Organization",
        name: SITE_NAME,
        telephone: CONTACT_PHONE_E164,
      },
    },
    position: i + 1,
  }));
}

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": `${pageUrl}#webpage`,
      url: pageUrl,
      name: "חנות שוברים וציוד מקצועי במודיעין",
      description:
        "שוברי מתנה לאולפן ואירועים, חבילות משולבות וציוד יד שנייה מההפקות.",
      inLanguage: "he-IL",
      isPartOf: { "@id": `${absoluteUrl()}/#website` },
    },
    {
      "@type": "OfferCatalog",
      "@id": `${pageUrl}#catalog`,
      name: "חנות יקיר כהן",
      itemListElement: [
        ...productOffers(),
        {
          "@type": "Offer",
          position: 4,
          name: "רמקולים מוגברים RCF 745 כולל סאבוופר",
          itemCondition: "https://schema.org/UsedCondition",
          availability: "https://schema.org/InStock",
          url: `${pageUrl}#used-gear`,
        },
        {
          "@type": "Offer",
          position: 5,
          name: "עמדות די ג'יי Traktor S4 MK3",
          itemCondition: "https://schema.org/UsedCondition",
          availability: "https://schema.org/InStock",
          url: `${pageUrl}#used-gear`,
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
        dangerouslySetInnerHTML={{ __html: safeJsonLdStringify(jsonLd) }}
      />
      <ShopPageContent />
    </>
  );
}
