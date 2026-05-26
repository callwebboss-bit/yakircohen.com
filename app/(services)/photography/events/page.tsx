import PhotographyEventsPageContent from "@/components/seo/PhotographyEventsPageContent";
import {
  getPhotographyService,
  metadataFromService,
} from "@/lib/data/services";

const service = getPhotographyService("photography-events");

export const metadata = metadataFromService(service);

export default function PhotographyEventsPage() {
  return <PhotographyEventsPageContent />;
}
