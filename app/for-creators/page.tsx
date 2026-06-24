import type { Metadata } from "next";
import HubPageSchema from "@/components/seo/HubPageSchema";
import AudienceLandingPageContent from "@/components/marketing/AudienceLandingPageContent";
import { FOR_CREATORS_LANDING } from "@/lib/data/audience-landings";
import {
  FOR_CREATORS_HUB_SEO,
  hubSchemaPropsFromSeo,
  metadataForHubSeo,
} from "@/lib/seo/hub-pages";

export const metadata: Metadata = {
  ...metadataForHubSeo(FOR_CREATORS_HUB_SEO),
  robots: { index: false, follow: true },
};

export default function ForCreatorsPage() {
  return (
    <>
      <HubPageSchema {...hubSchemaPropsFromSeo(FOR_CREATORS_HUB_SEO)} />
      <AudienceLandingPageContent config={FOR_CREATORS_LANDING} />
    </>
  );
}
