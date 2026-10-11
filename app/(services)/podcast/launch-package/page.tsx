import type { Metadata } from "next";
import ServiceOfferPageContent from "@/components/seo/ServiceOfferPageContent";
import { PODCAST_LAUNCH_PAGE } from "@/lib/data/service-offers/podcast-launch";
import { serviceOfferMetadata } from "@/lib/data/service-offers/metadata";

export const metadata: Metadata = serviceOfferMetadata(PODCAST_LAUNCH_PAGE);

export default function PodcastLaunchPackagePage() {
  return <ServiceOfferPageContent page={PODCAST_LAUNCH_PAGE} />;
}
