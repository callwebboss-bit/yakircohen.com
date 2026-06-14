import type { Metadata } from "next";
import BusinessTierPageContent from "@/components/business/BusinessTierPageContent";
import type { BusinessPageConfig } from "@/lib/data/business-tier-types";
import { constructMetadata } from "@/lib/metadata";
import { ogImageToMetadataParam, resolveOgForHub } from "@/lib/seo/og-images";
import { CONTACT_PHONE_E164, SITE_NAME } from "@/lib/constants";
import { absoluteUrl } from "@/lib/site-url";

type BusinessPageOptions = {
  slug: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  config: BusinessPageConfig;
  ogHub?: "video" | "online" | "podcast";
};

export function buildBusinessPageMetadata(opts: BusinessPageOptions): Metadata {
  return constructMetadata({
    title: opts.metaTitle,
    description: opts.metaDescription,
    slug: opts.slug,
    keywords: opts.keywords,
    ogImage: ogImageToMetadataParam(resolveOgForHub(opts.ogHub ?? "video")),
  });
}

export function buildBusinessPageJsonLd(slug: string, config: BusinessPageConfig) {
  const pageUrl = absoluteUrl(slug);
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ProfessionalService",
        "@id": `${pageUrl}#service`,
        name: config.pageTitle,
        url: pageUrl,
        provider: {
          "@type": "Organization",
          name: SITE_NAME,
          url: absoluteUrl(),
        },
        areaServed: { "@type": "Country", name: "Israel" },
        description: config.subtitle,
        telephone: CONTACT_PHONE_E164,
      },
      {
        "@type": "OfferCatalog",
        name: `חבילות ${config.brand}`,
        itemListElement: config.tiers.map((tier) => ({
          "@type": "Offer",
          name: tier.name,
          price: tier.priceNis,
          priceCurrency: "ILS",
          description: tier.deliverables.join(", "),
        })),
      },
    ],
  };
}

export function BusinessServicePage({
  slug,
  config,
}: {
  slug: string;
  config: BusinessPageConfig;
}) {
  const jsonLd = buildBusinessPageJsonLd(slug, config);
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <BusinessTierPageContent config={config} />
    </>
  );
}
