import type { Metadata } from "next";
import HubPageSchema from "@/components/seo/HubPageSchema";
import HubServiceIndexStatic from "@/components/seo/HubServiceIndexStatic";
import PodcastHubPageContent, {
  PODCAST_HUB_TRACKS,
} from "@/components/seo/PodcastHubPageContent";
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
      <HubServiceIndexStatic
        heading="שירותי פודקאסט"
        links={PODCAST_HUB_TRACKS.map((track) => ({
          href: track.href,
          title: track.title,
          description: track.description,
        }))}
      />
      <PodcastHubPageContent />
    </>
  );
}
