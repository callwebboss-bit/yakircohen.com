import {
  SEO_PORTFOLIO_MEDIA,
  SEO_PORTFOLIO_SERVICE_LABELS,
} from "@/lib/data/seo-portfolio-media";
import { getExVat, catalogWithVat } from "@/lib/data/pricing-catalog";
import { SITE_URL } from "@/lib/site-url";
import { SITE_NAME } from "@/lib/constants";

/** JSON-LD Service/Offer לפי מדיה בגלריה - מחירים מקטלוג בלבד */
export default function SeoPortfolioGalleryJsonLd() {
  const services = [
    {
      name: SEO_PORTFOLIO_SERVICE_LABELS.confetti,
      url: `${SITE_URL}/events/attractions/confetti-cannon`,
      catalogId: "event_attraction_1" as const,
    },
    {
      name: SEO_PORTFOLIO_SERVICE_LABELS.bubbles,
      url: `${SITE_URL}/events/attractions/bubble-machine`,
      catalogId: "event_attraction_1" as const,
    },
    {
      name: SEO_PORTFOLIO_SERVICE_LABELS["heavy-smoke"],
      url: `${SITE_URL}/events/attractions/wedding-smoking-machine/heavy-smoke-large-events`,
      catalogId: "event_attraction_1" as const,
    },
    {
      name: SEO_PORTFOLIO_SERVICE_LABELS.song,
      url: `${SITE_URL}/studio/recording-song-modiin`,
      catalogId: "cover_song" as const,
    },
    {
      name: SEO_PORTFOLIO_SERVICE_LABELS.podcast,
      url: `${SITE_URL}/podcast`,
      catalogId: "podcast_audio" as const,
    },
    {
      name: SEO_PORTFOLIO_SERVICE_LABELS["mobile-studio"],
      url: `${SITE_URL}/studio/mobile-studio`,
      catalogId: "mobile_studio" as const,
    },
  ];

  const graph = services.map((s) => {
    const exVat = getExVat(s.catalogId);
    return {
      "@type": "Service",
      name: s.name,
      url: s.url,
      provider: {
        "@type": "Organization",
        name: SITE_NAME,
        url: SITE_URL,
      },
      offers: {
        "@type": "Offer",
        priceCurrency: "ILS",
        price: catalogWithVat(exVat),
        priceSpecification: {
          "@type": "UnitPriceSpecification",
          price: exVat,
          priceCurrency: "ILS",
          valueAddedTaxIncluded: false,
        },
        availability: "https://schema.org/InStock",
        url: s.url,
      },
    };
  });

  const payload = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ItemList",
        name: "תיק עבודות לפי שירות ואזור",
        numberOfItems: SEO_PORTFOLIO_MEDIA.length,
        itemListElement: SEO_PORTFOLIO_MEDIA.map((item, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: item.title,
          url: item.href ? `${SITE_URL}${item.href}` : `${SITE_URL}/portfolio`,
        })),
      },
      ...graph,
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(payload) }}
    />
  );
}
