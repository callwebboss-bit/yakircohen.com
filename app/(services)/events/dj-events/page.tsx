import DjEventsPageContent from "@/components/seo/DjEventsPageContent";
import {
  getEventsService,
  metadataFromService,
} from "@/lib/data/services";

const service = getEventsService("events-dj");

export const metadata = metadataFromService(service);

export default function EventsDjPage() {
  return <DjEventsPageContent />;
}
