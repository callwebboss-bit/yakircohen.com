import { metadataFromService } from "@/lib/data/service-metadata";
import WeddingPhotographyPageContent from "@/components/seo/WeddingPhotographyPageContent";
import {
  getPhotographyService,
} from "@/lib/data/services";

const service = getPhotographyService("photography-wedding");

export const metadata = metadataFromService(service);

export default function PhotographyWeddingPage() {
  return <WeddingPhotographyPageContent />;
}
