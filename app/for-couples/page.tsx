import type { Metadata } from "next";
import HubPageSchema from "@/components/seo/HubPageSchema";
import AudienceLandingPageContent from "@/components/marketing/AudienceLandingPageContent";
import { FOR_COUPLES_LANDING } from "@/lib/data/audience-landings";
import {
  FOR_COUPLES_HUB_SEO,
  hubSchemaPropsFromSeo,
  metadataForHubSeo,
} from "@/lib/seo/hub-pages";

export const metadata: Metadata = {
  ...metadataForHubSeo(FOR_COUPLES_HUB_SEO),
  robots: { index: false, follow: true },
};

export default function ForCouplesPage() {
  return (
    <>
      <HubPageSchema {...hubSchemaPropsFromSeo(FOR_COUPLES_HUB_SEO)} />
      <AudienceLandingPageContent config={FOR_COUPLES_LANDING} />
    </>
  );
}
