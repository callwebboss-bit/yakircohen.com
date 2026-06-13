import type { Metadata } from "next";
import HubPageSchema from "@/components/seo/HubPageSchema";
import ProHubPageContent from "@/components/seo/ProHubPageContent";
import {
  hubSchemaPropsFromSeo,
  metadataForHubSeo,
  PRO_HUB_SEO,
} from "@/lib/seo/hub-pages";

export const metadata: Metadata = metadataForHubSeo(PRO_HUB_SEO);

export default function ProHubPage() {
  return (
    <>
      <HubPageSchema {...hubSchemaPropsFromSeo(PRO_HUB_SEO)} />
      <ProHubPageContent />
    </>
  );
}
