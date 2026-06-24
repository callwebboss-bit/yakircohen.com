import type { Metadata } from "next";
import HubPageSchema from "@/components/seo/HubPageSchema";
import TestimonialsPageContent from "@/components/marketing/TestimonialsPageContent";
import {
  TESTIMONIALS_HUB_SEO,
  hubSchemaPropsFromSeo,
  metadataForHubSeo,
} from "@/lib/seo/hub-pages";

export const metadata: Metadata = metadataForHubSeo(TESTIMONIALS_HUB_SEO);

export default function TestimonialsPage() {
  return (
    <>
      <HubPageSchema {...hubSchemaPropsFromSeo(TESTIMONIALS_HUB_SEO)} />
      <TestimonialsPageContent />
    </>
  );
}
