import { metadataFromService } from "@/lib/data/service-metadata";
import MobileStudioPageContent from "@/components/seo/MobileStudioPageContent";
import {
  getStudioService,
} from "@/lib/data/services";

const service = getStudioService("studio-mobile-studio");

export const metadata = metadataFromService(service);

export default function MobileStudioPage() {
  return <MobileStudioPageContent />;
}
