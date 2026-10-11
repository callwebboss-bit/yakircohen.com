import type { Metadata } from "next";
import ServiceOfferPageContent from "@/components/seo/ServiceOfferPageContent";
import { ENLISTMENT_PAGE } from "@/lib/data/service-offers/enlistment";
import { serviceOfferMetadata } from "@/lib/data/service-offers/metadata";

export const metadata: Metadata = serviceOfferMetadata(ENLISTMENT_PAGE);

export default function EnlistmentPage() {
  return <ServiceOfferPageContent page={ENLISTMENT_PAGE} />;
}
