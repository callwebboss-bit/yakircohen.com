"use client";

import type { BookCategoryId } from "@/lib/book-url";
import { isTierACategory } from "@/lib/book-wizard-cro/types";
import { PRICING_HUB_SECTIONS } from "@/lib/data/pricing-hub";
import { absoluteUrl } from "@/lib/site-url";
import { SITE_NAME } from "@/lib/constants";

function priceRangeForCategory(category: BookCategoryId): { low: number; high: number } | null {
  const section = PRICING_HUB_SECTIONS.find((s) => s.bookHref === `/book#${category}`);
  if (!section?.rows.length) return null;
  const prices = section.rows.map((r) => r.exVat);
  return { low: Math.min(...prices), high: Math.max(...prices) };
}

export default function BookCategorySchema({ category }: { category: BookCategoryId }) {
  if (!isTierACategory(category)) return null;

  const range = priceRangeForCategory(category);
  if (!range) return null;

  const pageUrl = absoluteUrl("book");

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `${SITE_NAME} - ${category}`,
    description: `שירות ${category} במודיעין והמרכז`,
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "ILS",
      lowPrice: range.low,
      highPrice: range.high,
      availability: "https://schema.org/InStock",
      url: `${pageUrl}#${category}`,
    },
  };

  const localSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: SITE_NAME,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Modiin",
      addressCountry: "IL",
    },
    areaServed: "Modiin-Maccabim-Reut",
    url: pageUrl,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localSchema) }}
      />
    </>
  );
}
