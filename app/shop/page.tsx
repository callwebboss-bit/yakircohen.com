import ShopPageContent from "@/components/seo/ShopPageContent";
import HubPageSchema from "@/components/seo/HubPageSchema";
import { SHOP_GEAR_ITEMS } from "@/lib/data/shop-page";
import { SHOP_VOUCHER_TIERS } from "@/lib/data/shop-vouchers";
import { metadataForHubSeo, SHOP_HUB_SEO, hubSchemaPropsFromSeo } from "@/lib/seo/hub-pages";
import { safeJsonLdStringify } from "@/lib/safe-json-ld";
import { absoluteUrl } from "@/lib/site-url";
import { ENTITY_IDS } from "@/lib/seo/entity-ids";
import { VAT_RATE } from "@/lib/data/pricing";

export const metadata = {
  ...metadataForHubSeo(SHOP_HUB_SEO),
};

const pageUrl = absoluteUrl("shop");
const popularVoucher =
  SHOP_VOUCHER_TIERS.find((t) => t.popular) ?? SHOP_VOUCHER_TIERS[0];

function productOffers() {
  return SHOP_VOUCHER_TIERS.filter((t) => t.priceExVat != null).map((tier, i) => ({
    "@type": "Product",
    "@id": `${pageUrl}#product-${tier.id}`,
    name: tier.title,
    description: tier.desc,
    image: absoluteUrl(tier.imageSrc.replace(/^\//, "")),
    /* בדיקת הלוגו 7.10.2026: היה Brand עם שם בלבד, בלי לוגו. הפניה לצומת
       הארגון (SiteSchema ב-app/layout.tsx, בכל עמוד) נותנת למוצר את השם ואת
       הלוגו מאותו מקור, ו-Google מקבל Organization כ-brand של Product. */
    brand: { "@id": ENTITY_IDS.organization },
    offers: {
      "@type": "Offer",
      price: String(Math.round(tier.priceExVat! * (1 + VAT_RATE))),
      priceCurrency: "ILS",
      availability: "https://schema.org/InStock",
      url: `${pageUrl}#vouchers`,
      seller: { "@id": ENTITY_IDS.organization },
    },
    position: i + 1,
  }));
}

function gearOffers(startPosition: number) {
  return SHOP_GEAR_ITEMS.map((item, i) => ({
    "@type": "Offer",
    "@id": `${pageUrl}#gear-${item.id}`,
    position: startPosition + i,
    name: item.schemaName,
    description: item.subtitle,
    image: absoluteUrl(item.imageSrc.replace(/^\//, "")),
    itemCondition: "https://schema.org/UsedCondition",
    availability: "https://schema.org/InStock",
    url: `${pageUrl}#used-gear`,
    seller: { "@id": ENTITY_IDS.organization },
  }));
}

const voucherProducts = productOffers();
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
      isPartOf: { "@id": ENTITY_IDS.website },
      primaryImageOfPage: {
        "@type": "ImageObject",
        url: absoluteUrl(popularVoucher.imageSrc.replace(/^\//, "")),
      },
    },
    {
      "@type": "OfferCatalog",
      "@id": `${pageUrl}#catalog`,
      name: "חנות יקיר כהן",
      itemListElement: [...voucherProducts, ...gearOffers(voucherProducts.length + 1)],
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
