import { metadataFromService } from "@/lib/data/service-metadata";
import ServicePageFromRegistry from "@/components/services/ServicePageFromRegistry";
import {
  getEventsService,
} from "@/lib/data/services";

const service = getEventsService("attractions-giant-balloons");

export const metadata = metadataFromService(service);

export default function GiantBalloonsPage() {
  return (
    <ServicePageFromRegistry
      service={service}
      portfolioLabel="בלוני ענק לרחבה"
    />
  );
}
