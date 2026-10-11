import type { Metadata } from "next";
import { constructMetadata } from "@/lib/metadata";
import type { ServiceOfferPage } from "@/lib/data/service-offers/types";

/** metadata לעמוד שירות חדש. טיוטה נשארת noindex עד אישור הבעלים. */
export function serviceOfferMetadata(page: ServiceOfferPage): Metadata {
  return constructMetadata({
    title: page.metaTitle,
    description: page.metaDescription,
    slug: page.path,
    keywords: [...page.keywords],
    ...(page.draft ? { robots: { index: false, follow: true } } : {}),
  });
}
