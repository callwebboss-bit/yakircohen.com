import BlessingsHubPageContent from "@/components/seo/BlessingsHubPageContent";

import {

  getStudioService,

  metadataFromService,

} from "@/lib/data/services";



const service = getStudioService("blessings-hub");



export const metadata = metadataFromService(service);



export default function BlessingsHubPage() {

  return <BlessingsHubPageContent />;

}

