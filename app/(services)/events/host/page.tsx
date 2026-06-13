import { metadataFromService } from "@/lib/data/service-metadata";
import EventsHostPageContent from "@/components/seo/EventsHostPageContent";
import {
  getEventsService,
} from "@/lib/data/services";

const service = getEventsService("events-host");

export const metadata = metadataFromService(service);

export default function EventsHostPage() {
  return <EventsHostPageContent />;
}
