import type { Metadata } from "next";
import ReelFactoryPageContent from "@/components/business/reel-factory/ReelFactoryPageContent";
import { constructMetadata } from "@/lib/metadata";
import { ogImageToMetadataParam, resolveOgForHub } from "@/lib/seo/og-images";
import {
  ONE_OFF_TIERS,
  REEL_FACTORY_BRAND,
  REEL_FACTORY_TAGLINE,
  RETAINER_TIERS,
} from "@/lib/data/reel-factory";
import { CONTACT_PHONE_E164, SITE_NAME } from "@/lib/constants";
import { absoluteUrl } from "@/lib/site-url";

export const metadata: Metadata = constructMetadata({
  title: `${REEL_FACTORY_BRAND} | ${REEL_FACTORY_TAGLINE}`,
  description:
    "מפעל רילס לספקי אירועים: DJ, צלמים, מפיקים ואטרקציות. רילס Rave ערוך תוך 24 שעות + מנוי חודשי עם פרומואים ופוסטים שיווקיים.",
  slug: "business/reel-factory",
  keywords: [
    "רילס לספקי אירועים",
    "עריכת וידאו לדיג'יי",
    "פרומו אירועים אינסטגרם",
    "רילס טיקטוק לאירועים",
    "Content Hub לספקים",
    "The Reel Factory",
    "עריכת רילס מהירה",
  ],
  ogImage: ogImageToMetadataParam(resolveOgForHub("video")),
});

const pageUrl = absoluteUrl("business/reel-factory");

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "ProfessionalService",
      "@id": `${pageUrl}#service`,
      name: `${REEL_FACTORY_BRAND} - ${REEL_FACTORY_TAGLINE}`,
      url: pageUrl,
      provider: {
        "@type": "Organization",
        name: SITE_NAME,
        url: absoluteUrl(),
      },
      areaServed: { "@type": "Country", name: "Israel" },
      description:
        "פס ייצור לפרומואים: רילס Rave ערוך תוך 24 שעות ומנוי חודשי לספקי אירועים.",
      telephone: CONTACT_PHONE_E164,
    },
    {
      "@type": "OfferCatalog",
      name: "חבילות מפעל הרילס",
      itemListElement: [
        ...RETAINER_TIERS.map((tier) => ({
          "@type": "Offer",
          name: tier.name,
          price: tier.priceNis,
          priceCurrency: "ILS",
          description: tier.deliverables.join(", "),
        })),
        ...ONE_OFF_TIERS.map((tier) => ({
          "@type": "Offer",
          name: tier.name,
          price: tier.priceNis,
          priceCurrency: "ILS",
          description: tier.deliverables.join(", "),
        })),
      ],
    },
  ],
};

export default function ReelFactoryPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ReelFactoryPageContent />
    </>
  );
}
