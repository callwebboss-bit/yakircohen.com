import type { Metadata } from "next";
import HubPageSchema from "@/components/seo/HubPageSchema";
import StutteringPageContent from "@/components/seo/StutteringPageContent";
import {
  hubSchemaPropsFromSeo,
  metadataForHubSeo,
  STUTTERING_HUB_SEO,
} from "@/lib/seo/hub-pages";

export const metadata: Metadata = metadataForHubSeo(STUTTERING_HUB_SEO);

export default function StutteringPage() {
  return (
    <>
      <HubPageSchema {...hubSchemaPropsFromSeo(STUTTERING_HUB_SEO)} />
      <StutteringPageContent />
    </>
  );
}
