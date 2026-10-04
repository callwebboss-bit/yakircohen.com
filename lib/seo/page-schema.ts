import { withVat } from "@/lib/data/pricing";
import type { ServiceEntity, ServicePricingTier } from "@/lib/data/services";
import { absoluteUrl } from "@/lib/site-url";
import { ENTITY_IDS } from "@/lib/seo/entity-ids";
import { BRAND_SUFFIX } from "@/lib/seo/normalize-title";
import sitemapDates from "@/lib/data/sitemap-dates.generated.json";

/**
 * dateModified אמיתי, מאותו מקור שמזין את מפת האתר (תאריך git אחרון לקובץ).
 *
 * קודם שלושת הבונים כאן חתמו את תאריך הבנייה, כלומר כל 230 העמודים הצהירו
 * שהתעדכנו היום בכל דיפלוי. זה סותר במפורש את המדיניות הכתובה
 * ב-scripts/generate-sitemap-dates.mjs: גוגל מתייחס לתאריך מנופח כאות לא
 * אמין ומפסיק להסתמך עליו. כשאין תאריך אמיתי לנתיב, השדה מושמט. השמטה
 * עדיפה על זיוף.
 */
const SITEMAP_DATES = sitemapDates as Record<string, string>;
export function realDateModified(path: string): string | undefined {
  const normalized = `/${path.replace(/^\/+/, "").replace(/\/+$/, "")}`;
  const iso = SITEMAP_DATES[normalized === "/" ? "/" : normalized];
  return iso ? iso.slice(0, 10) : undefined;
}

const SPEAKABLE: Record<string, unknown> = {
  "@type": "SpeakableSpecification",
  cssSelector: ["h1", ".faq-answer", "[data-speakable]"],
};

/**
 * אזור השירות מוצהר פעם אחת ומשמש את שני צמתי ה-Service.
 * קודם הוא היה כתוב רק בתוך buildServiceSchema, ולכן 37 העמודים שנבנים
 * ישירות על ServicePageLayout פרסמו Service בלי אזור שירות בכלל.
 * מרכז המעגל הוא האולפן במודיעין, ורדיוס 50 קילומטר הוא טווח ההגעה.
 */
const SERVICE_AREA_SERVED: Record<string, unknown> = {
  "@type": "GeoCircle",
  geoMidpoint: {
    "@type": "GeoCoordinates",
    latitude: 31.896,
    longitude: 35.010,
  },
  geoRadius: "50000",
};

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

  const dateModified = realDateModified(slug);

  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${pageUrl}#webpage`,
    url: pageUrl,
    name: `${title}${BRAND_SUFFIX}`,
    description,
    inLanguage: "he-IL",
    ...(dateModified ? { dateModified } : {}),
    speakable: SPEAKABLE,
    isPartOf: { "@id": ENTITY_IDS.website },
    about: { "@id": ENTITY_IDS.organization },
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
  /*
   * שלב 4 WP12 (S28, PI-18, OE-34): מדרגה עם מחיר לפני מע״מ (priceExVat)
   * נפלטת תמיד בפורמט אחד: price כולל מע״מ, כמו שהצרכן רואה, ו-priceSpecification
   * עם המחיר לפני מע״מ ודגל valueAddedTaxIncluded: false. כשיש מזהה קטלוג הוא
   * נכנס ל-sku, ו-audit:schema-prices יכול לבדוק אותו מול הקטלוג. קודם "5,000 ₪"
   * של כרטיס נקרא כמחיר בלי שום ציון מע״מ.
   */
  if (tier.priceExVat != null) {
    return {
      "@type": "Offer",
      name: tier.name,
      description: tier.description,
      ...(tier.catalogId ? { sku: tier.catalogId } : {}),
      price: String(withVat(tier.priceExVat)),
      priceCurrency: "ILS",
      priceSpecification: {
        "@type": "UnitPriceSpecification",
        price: tier.priceExVat,
        priceCurrency: "ILS",
        valueAddedTaxIncluded: false,
      },
      url: serviceUrl,
      availability: "https://schema.org/InStock",
    };
  }

  /* schema.org דורש מספר נקי. מפריד אלפים בפסיק פוסל את ה-Offer בעיני גוגל. */
  const price = tier.price.replace(/[^\d.]/g, "");

  /**
   * מדרגות כמו "הצעה אישית" או "הצעה בוואטסאפ" הן הזמנה לשיחה, לא מחיר.
   * Offer עם priceCurrency ובלי price הוא צומת שבור, ולהמציא מספר אסור.
   * לכן המדרגה לא נכנסת ל-offers, וממשיכה להופיע בעמוד עצמו כרגיל.
   */
  if (!price) return null;

  return {
    "@type": "Offer",
    name: tier.name,
    description: tier.description,
    price,
    priceCurrency: "ILS",
    ...(/כולל מע["״]מ/.test(tier.price) ? { priceSpecification: { "@type": "PriceSpecification", priceCurrency: "ILS", valueAddedTaxIncluded: true } } : {}),
    url: serviceUrl,
    availability: "https://schema.org/InStock",
  };
}

export function buildServiceSchema(service: ServiceEntity) {
  const serviceUrl = absoluteUrl(service.slug.replace(/^\/+/, ""));
  const dateModified = realDateModified(service.slug);
  const offers = (service.pricing ?? [])
    .map((tier) => pricingToOffer(tier, serviceUrl))
    .filter(
      (offer): offer is NonNullable<ReturnType<typeof pricingToOffer>> =>
        offer !== null,
    );

  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${serviceUrl}#service`,
    name: service.title,
    description: service.metaDescription,
    url: serviceUrl,
    serviceType: service.title,
    inLanguage: "he-IL",
    ...(dateModified ? { dateModified } : {}),
    speakable: SPEAKABLE,
    provider: { "@id": ENTITY_IDS.organization },
    areaServed: SERVICE_AREA_SERVED,
    ...(offers.length ? { offers } : {}),
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

  const dateModified = realDateModified(pagePath);
  const serviceEntity = {
    "@type": "Service",
    "@id": `${pageUrl}#service`,
    name: title,
    description,
    url: pageUrl,
    serviceType: title,
    inLanguage: "he-IL",
    ...(dateModified ? { dateModified } : {}),
    speakable: SPEAKABLE,
    provider: { "@id": ENTITY_IDS.organization },
    areaServed: SERVICE_AREA_SERVED,
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
      /* WP12: כולל מע״מ ב-price ולפני מע״מ ב-priceSpecification עם דגל, כמו
         pricingToOffer. קודם המחיר לפני מע״מ נפלט בלי שום דגל. */
      ...(offer.priceExVat != null
        ? {
            price: String(withVat(offer.priceExVat)),
            priceCurrency: "ILS",
            priceSpecification: {
              "@type": "UnitPriceSpecification",
              price: offer.priceExVat,
              priceCurrency: "ILS",
              valueAddedTaxIncluded: false,
            },
          }
        : {}),
      url: pageUrl,
      availability: "https://schema.org/InStock",
    })),
  };
}

export const DEFAULT_OG_WIDTH = 1200;
export const DEFAULT_OG_HEIGHT = 630;
