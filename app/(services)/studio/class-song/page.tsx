import type { Metadata } from "next";
import ServiceOfferPageContent from "@/components/seo/ServiceOfferPageContent";
import { CLASS_SONG_PAGE } from "@/lib/data/service-offers/class-song";
import { serviceOfferMetadata } from "@/lib/data/service-offers/metadata";

export const metadata: Metadata = serviceOfferMetadata(CLASS_SONG_PAGE);

export default function ClassSongPage() {
  return <ServiceOfferPageContent page={CLASS_SONG_PAGE} />;
}
