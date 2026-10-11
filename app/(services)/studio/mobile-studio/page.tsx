import { metadataFromService } from "@/lib/data/service-metadata";
import MobileStudioPageContent from "@/components/seo/MobileStudioPageContent";
import {
  getStudioService,
} from "@/lib/data/services";
import NewServicesLinks from "@/components/seo/NewServicesLinks";

const service = getStudioService("studio-mobile-studio");

export const metadata = metadataFromService(service);

export default function MobileStudioPage() {
  return (
    <>
      <MobileStudioPageContent />
      <NewServicesLinks paths={["/studio/class-song", "/podcast/live-podcast"]} />
    </>
  );
}
