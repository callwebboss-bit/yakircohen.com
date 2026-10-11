import type { Metadata } from "next";
import ServiceOfferPageContent from "@/components/seo/ServiceOfferPageContent";
import { RENEW_OLD_SONG_PAGE } from "@/lib/data/service-offers/renew-old-song";
import { serviceOfferMetadata } from "@/lib/data/service-offers/metadata";

export const metadata: Metadata = serviceOfferMetadata(RENEW_OLD_SONG_PAGE);

export default function RenewOldSongPage() {
  return <ServiceOfferPageContent page={RENEW_OLD_SONG_PAGE} />;
}
