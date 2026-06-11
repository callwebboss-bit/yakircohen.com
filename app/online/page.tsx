import type { Metadata } from "next";
import HubPageSchema from "@/components/seo/HubPageSchema";
import OnlinePageContent from "@/components/seo/OnlinePageContent";
import {
  hubSchemaPropsFromSeo,
  metadataForHubSeo,
  ONLINE_HUB_SEO,
} from "@/lib/seo/hub-pages";

export const metadata: Metadata = metadataForHubSeo(ONLINE_HUB_SEO);

export default function OnlinePage() {
  return (
    <>
      <HubPageSchema {...hubSchemaPropsFromSeo(ONLINE_HUB_SEO)} />
      <OnlinePageContent />
    </>
  );
}
