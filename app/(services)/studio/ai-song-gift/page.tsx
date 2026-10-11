import type { Metadata } from "next";
import ServiceOfferPageContent from "@/components/seo/ServiceOfferPageContent";
import { AI_SONG_PAGE } from "@/lib/data/service-offers/ai-song";
import { serviceOfferMetadata } from "@/lib/data/service-offers/metadata";

export const metadata: Metadata = serviceOfferMetadata(AI_SONG_PAGE);

export default function AiSongGiftPage() {
  return <ServiceOfferPageContent page={AI_SONG_PAGE} />;
}
