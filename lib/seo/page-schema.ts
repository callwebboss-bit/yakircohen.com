import type { ServiceEntity, ServicePricingTier } from "@/lib/data/services";
import { SITE_NAME } from "@/lib/constants";
import { absoluteUrl } from "@/lib/site-url";
import { BRAND_SUFFIX } from "@/lib/seo/normalize-title";

export type FaqSchemaInput = {
  question: string;
  answer: string;
};

export type WebPageSchemaInput = {
  slug: string;
  title: string;
  description: string;
  imagePath?: string;
  imageAlt?: string;
};

export function buildWebPageSchema({
  slug,
  title,
  description,
  imagePath,
  imageAlt,
}: WebPageSchemaInput) {
  const pageUrl = absoluteUrl(slug.replace(/^\/+/, ""));
  const imageUrl = imagePath
    ? absoluteUrl(imagePath.replace(/^\/+/, ""))
    : undefined;

  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${pageUrl}#webpage`,
    url: pageUrl,
    name: `${title}${BRAND_SUFFIX}`,
    description,
    inLanguage: "he-IL",
    isPartOf: { "@id": `${absoluteUrl()}#website` },
    about: { "@id": `${absoluteUrl()}#organization` },
    ...(imageUrl
      ? {
          primaryImageOfPage: {
            "@type": "ImageObject",
            url: imageUrl,
            ...(imageAlt ? { caption: imageAlt } : {}),
          },
        }
      : {}),
  };
}

function pricingToOffer(tier: ServicePricingTier, serviceUrl: string) {
  return {
    "@type": "Offer",
    name: tier.name,
    description: tier.description,
    price: tier.price.replace(/[^\d.,]/g, "") || undefined,
    priceCurrency: "ILS",
    url: serviceUrl,
    availability: "https://schema.org/InStock",
  };
}

export function buildServiceSchema(service: ServiceEntity) {
  const serviceUrl = absoluteUrl(service.slug.replace(/^\/+/, ""));

  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${serviceUrl}#service`,
    name: service.title,
    description: service.metaDescription,
    url: serviceUrl,
    serviceType: service.title,
    inLanguage: "he-IL",
    provider: { "@id": `${absoluteUrl()}#organization` },
    areaServed: {
      "@type": "GeoCircle",
      geoMidpoint: {
        "@type": "GeoCoordinates",
        latitude: 31.896,
        longitude: 35.010,
      },
      geoRadius: "50000",
    },
    ...(service.pricing?.length
      ? {
          offers: service.pricing.map((tier) => pricingToOffer(tier, serviceUrl)),
        }
      : {}),
  };
}

export function buildFaqSchema(items: FaqSchemaInput[]) {
  if (!items.length) return null;

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map(({ question, answer }) => ({
      "@type": "Question",
      name: question,
      acceptedAnswer: {
        "@type": "Answer",
        text: answer,
      },
    })),
  };
}

export function buildItemListSchema(
  name: string,
  items: { name: string; url: string; description?: string }[],
) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name,
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      url: item.url,
      ...(item.description ? { description: item.description } : {}),
    })),
  };
}

export const DEFAULT_OG_WIDTH = 1200;
export const DEFAULT_OG_HEIGHT = 630;
