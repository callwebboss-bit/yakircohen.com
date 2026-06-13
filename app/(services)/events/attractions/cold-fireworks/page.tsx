import { metadataFromService } from "@/lib/data/service-metadata";
import ColdFireworksPageContent from "@/components/seo/ColdFireworksPageContent";
import {
  getEventsService,
} from "@/lib/data/services";

const service = getEventsService("attractions-cold-fireworks");

export const metadata = metadataFromService(service);

export default function ColdFireworksPage() {
  return <ColdFireworksPageContent />;
}
