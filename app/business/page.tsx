import type { Metadata } from "next";
import HubPageSchema from "@/components/seo/HubPageSchema";
import BusinessHubPageContent from "@/components/business/BusinessHubPageContent";
import {
  BUSINESS_HUB_SEO,
  hubSchemaPropsFromSeo,
  metadataForHubSeo,
} from "@/lib/seo/hub-pages";

export const metadata: Metadata = metadataForHubSeo(BUSINESS_HUB_SEO);

export default function BusinessHubPage() {
  return (
    <>
      <HubPageSchema {...hubSchemaPropsFromSeo(BUSINESS_HUB_SEO)} />
      <BusinessHubPageContent />
    </>
  );
}
