import { metadataFromService } from "@/lib/data/service-metadata";
import ServicePageFromRegistry from "@/components/services/ServicePageFromRegistry";
import {
  getEventsService,
} from "@/lib/data/services";

const service = getEventsService("attractions-smoke-cannons");

export const metadata = metadataFromService(service);

export default function SmokeCannonsPage() {
  return (
    <ServicePageFromRegistry
      service={service}
      portfolioLabel="תותחי עשן לאירועים"
    />
  );
}
