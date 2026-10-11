import type { Metadata } from "next";
import ServiceOfferPageContent from "@/components/seo/ServiceOfferPageContent";
import { PARODY_PAGE } from "@/lib/data/service-offers/parody";
import { serviceOfferMetadata } from "@/lib/data/service-offers/metadata";

export const metadata: Metadata = serviceOfferMetadata(PARODY_PAGE);

export default function ParodyPage() {
  return <ServiceOfferPageContent page={PARODY_PAGE} />;
}
