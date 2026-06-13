import { metadataFromService } from "@/lib/data/service-metadata";
import WeddingSmokePageContent from "@/components/seo/WeddingSmokePageContent";

import {

  getEventsService,
} from "@/lib/data/services";



const service = getEventsService("attractions-wedding-smoke");



export const metadata = metadataFromService(service);



export default function WeddingSmokeMachinePage() {

  return <WeddingSmokePageContent />;

}

