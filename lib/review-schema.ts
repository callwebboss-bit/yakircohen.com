import type { TestimonialItem } from "@/components/marketing/Testimonials";
import { SITE_URL } from "@/lib/site-url";

const LOCAL_BUSINESS_ID = `${SITE_URL}/#localbusiness`;

export type ReviewSchemaNode = {
  "@type": "Review";
  "@id": string;
  inLanguage: "he-IL";
  author: { "@type": "Person"; name: string };
  reviewBody: string;
  datePublished?: string;
  itemReviewed: { "@id": string };
};

/** Individual Review nodes linked to LocalBusiness — no fabricated aggregate rating. */
export function buildReviewSchemaGraph(
  testimonials: readonly TestimonialItem[],
): ReviewSchemaNode[] {
  return testimonials.map((item, index) => ({
    "@type": "Review" as const,
    "@id": `${SITE_URL}/#review-${item.id ?? index + 1}`,
    inLanguage: "he-IL" as const,
    author: {
      "@type": "Person" as const,
      name: item.name,
    },
    reviewBody: item.quote,
    ...(item.datePublished
      ? { datePublished: item.datePublished }
      : {}),
    itemReviewed: { "@id": LOCAL_BUSINESS_ID },
  }));
}
