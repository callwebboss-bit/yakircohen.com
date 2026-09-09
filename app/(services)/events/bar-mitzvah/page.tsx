import { metadataFromService } from "@/lib/data/service-metadata";
import BarMitzvahPageContent from "@/components/seo/BarMitzvahPageContent";
import { getEventsService } from "@/lib/data/services";

const service = getEventsService("events-bar-mitzvah");

export const metadata = metadataFromService(service);

export default function EventsBarMitzvahPage() {
  return <BarMitzvahPageContent />;
}
