import type { Metadata } from "next";
import HubPageSchema from "@/components/seo/HubPageSchema";
import PackagesHubPageContent from "@/components/marketing/PackagesHubPageContent";
import {
  PACKAGES_HUB_SEO,
  hubSchemaPropsFromSeo,
  metadataForHubSeo,
} from "@/lib/seo/hub-pages";

export const metadata: Metadata = metadataForHubSeo(PACKAGES_HUB_SEO);

export default function PackagesPage() {
  return (
    <>
      <HubPageSchema {...hubSchemaPropsFromSeo(PACKAGES_HUB_SEO)} />
      <PackagesHubPageContent />
    </>
  );
}
