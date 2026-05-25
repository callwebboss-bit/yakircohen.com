import WeddingPackagesPageContent from "@/components/seo/WeddingPackagesPageContent";
import {
  getEventsService,
  metadataFromService,
} from "@/lib/data/services";

const service = getEventsService("events-wedding-packages");

export const metadata = metadataFromService(service);

export default function WeddingAttractionsPackagesPage() {
  return <WeddingPackagesPageContent />;
}
