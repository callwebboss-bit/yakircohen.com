import type { Metadata } from "next";
import ServiceOfferPageContent from "@/components/seo/ServiceOfferPageContent";
import { ORIGINAL_SONG_PAGE } from "@/lib/data/service-offers/original-song";
import { serviceOfferMetadata } from "@/lib/data/service-offers/metadata";

export const metadata: Metadata = serviceOfferMetadata(ORIGINAL_SONG_PAGE);

export default function OriginalSongPage() {
  return <ServiceOfferPageContent page={ORIGINAL_SONG_PAGE} />;
}
