import type { ServiceEntity, ServicePricingTier } from "@/lib/data/services";
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

export type ServicePageEntityInput = {
  /** Path used to derive the canonical URL (e.g. "/events/host"). */
  pagePath: string;
  title: string;
  description: string;
  faqs?: readonly FaqSchemaInput[];
};

/**
 * Combined `@graph` payload for pages built directly on ServicePageLayout
 * (i.e. not already covered by ServicePageSchema/FaqPageSchema via the
 * service registry). Always includes a Service entity; adds a nested
 * FAQPage entity only when faqs are supplied.
 */
export function buildServicePageEntitySchema({
  pagePath,
  title,
  description,
  faqs,
}: ServicePageEntityInput) {
  const pageUrl = absoluteUrl(pagePath.replace(/^\/+/, ""));

  const serviceEntity = {
    "@type": "Service",
    "@id": `${pageUrl}#service`,
    name: title,
    description,
    url: pageUrl,
    serviceType: title,
    inLanguage: "he-IL",
    provider: { "@id": `${absoluteUrl()}#organization` },
  };

  const graph: Record<string, unknown>[] = [serviceEntity];

  if (faqs?.length) {
    graph.push({
      "@type": "FAQPage",
      "@id": `${pageUrl}#faq`,
      mainEntity: faqs.map(({ question, answer }) => ({
        "@type": "Question",
        name: question,
        acceptedAnswer: {
          "@type": "Answer",
          text: answer,
        },
      })),
    });
  }

  return {
    "@context": "https://schema.org",
    "@graph": graph,
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

export type PricingOfferInput = {
  id: string;
  name: string;
  description?: string;
  priceExVat?: number | null;
};

export function buildPricingOffersSchema(
  pageUrl: string,
  offers: PricingOfferInput[],
) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    url: pageUrl,
    inLanguage: "he-IL",
    offers: offers.map((offer) => ({
      "@type": "Offer",
      "@id": `${pageUrl}#offer-${offer.id}`,
      name: offer.name,
      ...(offer.description ? { description: offer.description } : {}),
      ...(offer.priceExVat != null
        ? { price: offer.priceExVat, priceCurrency: "ILS" }
        : {}),
      url: pageUrl,
      availability: "https://schema.org/InStock",
    })),
  };
}

export const DEFAULT_OG_WIDTH = 1200;
export const DEFAULT_OG_HEIGHT = 630;
