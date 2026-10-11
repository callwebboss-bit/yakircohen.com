import type { Metadata } from "next";
import ServiceOfferPageContent from "@/components/seo/ServiceOfferPageContent";
import { GROUP_SESSION_PAGE } from "@/lib/data/service-offers/group-session";
import { serviceOfferMetadata } from "@/lib/data/service-offers/metadata";

export const metadata: Metadata = serviceOfferMetadata(GROUP_SESSION_PAGE);

export default function GroupSessionPage() {
  return <ServiceOfferPageContent page={GROUP_SESSION_PAGE} />;
}
