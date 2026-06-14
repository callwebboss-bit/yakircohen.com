import type { Metadata } from "next";
import ContentStudioPageContent from "@/components/business/content-studio/ContentStudioPageContent";
import { constructMetadata } from "@/lib/metadata";
import { ogImageToMetadataParam, resolveOgForHub } from "@/lib/seo/og-images";
import {
  CONTENT_STUDIO_BRAND,
  CONTENT_STUDIO_TAGLINE,
  CONTENT_STUDIO_TIERS,
} from "@/lib/data/content-studio";
import { CONTACT_PHONE_E164, SITE_NAME } from "@/lib/constants";
import { absoluteUrl } from "@/lib/site-url";

export const metadata: Metadata = constructMetadata({
  title: `חבילות רילז לעסקים | ${CONTENT_STUDIO_BRAND}`,
  description:
    "יום צילום באולפן במודיעין. 10–15 רילז ושורטס ערוכים, כתוביות צבעוניות, ריטיינר חודשי.",
  slug: "business/content-studio",
  keywords: [
    "רילז לעסקים",
    "חבילת טיקטוק לעסק",
    "יום צילום תוכן",
    "סושיאל דאמפ",
    "שורטס לעסקים מודיעין",
    "Content Studio",
    "batch filming",
  ],
  ogImage: ogImageToMetadataParam(resolveOgForHub("video")),
});

const pageUrl = absoluteUrl("business/content-studio");

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "ProfessionalService",
      "@id": `${pageUrl}#service`,
      name: `${CONTENT_STUDIO_BRAND}, ${CONTENT_STUDIO_TAGLINE}`,
      url: pageUrl,
      provider: {
        "@type": "Organization",
        name: SITE_NAME,
        url: absoluteUrl(),
      },
      areaServed: { "@type": "Country", name: "Israel" },
      description:
        "יום צילום מרוכז באולפן. רילז, שורטס וטיקטוק לעסקים. כתוביות צבעוניות וריטיינר חודשי.",
      telephone: CONTACT_PHONE_E164,
    },
    {
      "@type": "OfferCatalog",
      name: "חבילות סושיאל דאמפ",
      itemListElement: CONTENT_STUDIO_TIERS.map((tier) => ({
        "@type": "Offer",
        name: tier.name,
        price: tier.priceNis,
        priceCurrency: "ILS",
        description: tier.deliverables.join(", "),
      })),
    },
  ],
};

export default function ContentStudioPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ContentStudioPageContent />
    </>
  );
}
