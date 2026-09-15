import type { Metadata } from "next";
import HubPageSchema from "@/components/seo/HubPageSchema";
import PodcastHubPageContent from "@/components/seo/PodcastHubPageContent";
import { PODCAST_HUB_TRACKS } from "@/lib/data/podcast-hub-tracks";
import {
  hubSchemaPropsFromSeo,
  metadataForHubSeo,
  PODCAST_HUB_SEO,
} from "@/lib/seo/hub-pages";

export const metadata: Metadata = metadataForHubSeo(PODCAST_HUB_SEO);

export default function PodcastHubPage() {
  return (
    <>
      <HubPageSchema {...hubSchemaPropsFromSeo(PODCAST_HUB_SEO)} />
      <PodcastHubPageContent />
    </>
  );
}
