import type { Metadata } from "next";
import ServiceOfferPageContent from "@/components/seo/ServiceOfferPageContent";
import { PROFESSIONAL_SINGER_PAGE } from "@/lib/data/service-offers/professional-singer";
import { serviceOfferMetadata } from "@/lib/data/service-offers/metadata";

export const metadata: Metadata = serviceOfferMetadata(PROFESSIONAL_SINGER_PAGE);

export default function ProfessionalSingerPage() {
  return <ServiceOfferPageContent page={PROFESSIONAL_SINGER_PAGE} />;
}
