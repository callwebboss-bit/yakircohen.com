import { metadataFromService } from "@/lib/data/service-metadata";
import BlessingsHubPageContent from "@/components/seo/BlessingsHubPageContent";

import {

  getStudioService,
} from "@/lib/data/services";



const service = getStudioService("blessings-hub");



export const metadata = metadataFromService(service);



export default function BlessingsHubPage() {

  return <BlessingsHubPageContent />;

}

