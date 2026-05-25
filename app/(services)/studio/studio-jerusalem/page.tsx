import StudioJerusalemPageContent from "@/components/seo/StudioJerusalemPageContent";

import {

  getStudioService,

  metadataFromService,

} from "@/lib/data/services";



const service = getStudioService("studio-jerusalem");



export const metadata = metadataFromService(service);



export default function StudioJerusalemPage() {

  return <StudioJerusalemPageContent />;

}

