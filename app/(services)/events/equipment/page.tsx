import EquipmentPageContent from "@/components/seo/EquipmentPageContent";
import {
  getEventsService,
  metadataFromService,
} from "@/lib/data/services";

const service = getEventsService("events-equipment");

export const metadata = metadataFromService(service);

export default function EventsEquipmentPage() {
  return <EquipmentPageContent />;
}
