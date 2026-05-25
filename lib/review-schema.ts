import type { TestimonialItem } from "@/components/marketing/Testimonials";
import { SITE_URL } from "@/lib/site-url";

const LOCAL_BUSINESS_ID = `${SITE_URL}/#localbusiness`;

/** Individual Review nodes linked to LocalBusiness — no fabricated aggregate rating. */
export function buildReviewSchemaGraph(
  testimonials: readonly TestimonialItem[],
): { "@type": "Review"; author: { "@type": "Person"; name: string }; reviewBody: string; itemReviewed: { "@id": string } }[] {
  return testimonials.map((item) => ({
    "@type": "Review" as const,
    author: {
      "@type": "Person" as const,
      name: item.name,
    },
    reviewBody: item.quote,
    itemReviewed: { "@id": LOCAL_BUSINESS_ID },
  }));
}
