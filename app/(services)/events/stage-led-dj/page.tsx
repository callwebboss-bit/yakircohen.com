import StageLedDjPageContent from "@/components/seo/StageLedDjPageContent";
import {
  getEventsService,
  metadataFromService,
} from "@/lib/data/services";

const service = getEventsService("attractions-led-booth");

export const metadata = metadataFromService(service);

export default function StageLedDjPage() {
  return <StageLedDjPageContent />;
}
