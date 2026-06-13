import { metadataFromService } from "@/lib/data/service-metadata";
import SmokeBubbleMachinePageContent from "@/components/seo/SmokeBubbleMachinePageContent";
import {
  getEventsService,
} from "@/lib/data/services";

const service = getEventsService("attractions-smoke-bubble-machine");

export const metadata = metadataFromService(service);

export default function SmokeBubbleMachineEventsPage() {
  return <SmokeBubbleMachinePageContent />;
}
