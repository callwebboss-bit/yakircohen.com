import { metadataFromService } from "@/lib/data/service-metadata";
import BlessingsHubPageContent from "@/components/seo/BlessingsHubPageContent";

import {

  getStudioService,
} from "@/lib/data/services";
import NewServicesLinks from "@/components/seo/NewServicesLinks";



const service = getStudioService("blessings-hub");



export const metadata = metadataFromService(service);



export default function BlessingsHubPage() {

  return (
    <>
      <BlessingsHubPageContent />
      <NewServicesLinks paths={["/studio/blessings/enlistment", "/studio/original-song"]} />
    </>
  );

}

