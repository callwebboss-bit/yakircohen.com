import ServicePageFromRegistry from "@/components/services/ServicePageFromRegistry";
import {
  getPhotographyService,
  metadataFromService,
} from "@/lib/data/services";

const service = getPhotographyService("photography-events");

export const metadata = metadataFromService(service);

export default function PhotographyEventsPage() {
  return (
    <ServicePageFromRegistry
      service={service}
      portfolioLabel="צילום אירועים וכנסים"
    />
  );
}
