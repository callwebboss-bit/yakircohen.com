import type { Metadata } from "next";
import SocialMediaPageContent from "@/components/business/social-media/SocialMediaPageContent";
import { constructMetadata } from "@/lib/metadata";
import { ogImageToMetadataParam, resolveOgForHub } from "@/lib/seo/og-images";
import {
  ONE_OFF_SERVICES,
  RETAINER_TIERS,
  SOCIAL_MEDIA_BRAND,
} from "@/lib/data/social-media";
import { CONTACT_PHONE_E164, SITE_NAME } from "@/lib/constants";
import { absoluteUrl } from "@/lib/site-url";

export const metadata: Metadata = constructMetadata({
  title: `ניהול סושיאל לעסקים | ${SOCIAL_MEDIA_BRAND}`,
  description:
    "ניהול סושיאל ומדיה לעסקים עם יקיר איזמירלי: טיקטוק, אינסטגרם, תוכן ויראלי, צילום ועריכה. חבילות ריטיינר ושירותים חד פעמיים.",
  slug: "business/social-media",
  keywords: [
    "ניהול סושיאל לעסקים",
    "יקיר איזמירלי",
    "שיווק בטיקטוק ובאינסטגרם",
    "יצירת תוכן ויראלי",
    "ניהול רשתות חברתיות",
    "צילום ועריכה לעסקים",
    "רילס לעסקים",
  ],
  ogImage: ogImageToMetadataParam(resolveOgForHub("video")),
});

const pageUrl = absoluteUrl("business/social-media");

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "ProfessionalService",
      "@id": `${pageUrl}#service`,
      name: `ניהול סושיאל ומדיה - ${SOCIAL_MEDIA_BRAND}`,
      url: pageUrl,
      provider: {
        "@type": "Organization",
        name: SITE_NAME,
        url: absoluteUrl(),
      },
      areaServed: { "@type": "Country", name: "Israel" },
      description:
        "ניהול סושיאל, צילום, עריכה ואסטרטגיית תוכן לטיקטוק, אינסטגרם ופייסבוק.",
      telephone: CONTACT_PHONE_E164,
    },
    {
      "@type": "Person",
      "@id": `${pageUrl}#person`,
      name: SOCIAL_MEDIA_BRAND,
      jobTitle: "יוצר תוכן ומנהל סושיאל",
      worksFor: { "@id": absoluteUrl() },
    },
    {
      "@type": "OfferCatalog",
      name: "חבילות ניהול סושיאל",
      itemListElement: [
        ...RETAINER_TIERS.map((tier) => ({
          "@type": "Offer",
          name: tier.name,
          price: tier.priceNis,
          priceCurrency: "ILS",
          description: tier.deliverables.join(", "),
        })),
        ...ONE_OFF_SERVICES.map((svc) => ({
          "@type": "Offer",
          name: svc.name,
          description: svc.description,
        })),
      ],
    },
  ],
};

export default function SocialMediaPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SocialMediaPageContent />
    </>
  );
}
