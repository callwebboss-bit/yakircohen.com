import { metadataFromService } from "@/lib/data/service-metadata";
import ServicePageFromRegistry from "@/components/services/ServicePageFromRegistry";
import { getEventsService } from "@/lib/data/services";

const service = getEventsService("attractions-inflatables");

export const metadata = metadataFromService(service);

export default function InflatablesPage() {
  return (
    <ServicePageFromRegistry
      service={service}
      portfolioLabel="מגלשת מים מתנפחת"
    />
  );
}
