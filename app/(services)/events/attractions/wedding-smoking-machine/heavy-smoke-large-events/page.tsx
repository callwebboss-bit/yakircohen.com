import HeavySmokeLargeEventsPageContent from "@/components/seo/HeavySmokeLargeEventsPageContent";
import {
  getEventsService,
  metadataFromService,
} from "@/lib/data/services";

const service = getEventsService("attractions-heavy-smoke-large");

export const metadata = metadataFromService(service);

export default function HeavySmokeLargeEventsPage() {
  return <HeavySmokeLargeEventsPageContent />;
}
