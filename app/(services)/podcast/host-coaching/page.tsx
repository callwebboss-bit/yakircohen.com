import type { Metadata } from "next";
import ServiceOfferPageContent from "@/components/seo/ServiceOfferPageContent";
import { HOST_COACHING_PAGE } from "@/lib/data/service-offers/host-coaching";
import { serviceOfferMetadata } from "@/lib/data/service-offers/metadata";

export const metadata: Metadata = serviceOfferMetadata(HOST_COACHING_PAGE);

export default function HostCoachingPage() {
  return <ServiceOfferPageContent page={HOST_COACHING_PAGE} />;
}
