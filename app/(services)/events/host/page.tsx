import ServicePageFromRegistry from "@/components/services/ServicePageFromRegistry";
import {
  getEventsService,
  metadataFromService,
} from "@/lib/data/services";

const service = getEventsService("events-host");

export const metadata = metadataFromService(service);

export default function EventsHostPage() {
  return <ServicePageFromRegistry service={service} />;
}
