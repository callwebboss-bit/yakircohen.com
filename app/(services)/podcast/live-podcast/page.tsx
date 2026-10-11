import type { Metadata } from "next";
import ServiceOfferPageContent from "@/components/seo/ServiceOfferPageContent";
import { LIVE_PODCAST_PAGE } from "@/lib/data/service-offers/live-podcast";
import { serviceOfferMetadata } from "@/lib/data/service-offers/metadata";

export const metadata: Metadata = serviceOfferMetadata(LIVE_PODCAST_PAGE);

export default function LivePodcastPage() {
  return <ServiceOfferPageContent page={LIVE_PODCAST_PAGE} />;
}
