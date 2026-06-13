import { metadataFromService } from "@/lib/data/service-metadata";
import RecordingSongModiinPageContent from "@/components/seo/RecordingSongModiinPageContent";

import {

  getStudioService,
} from "@/lib/data/services";



const service = getStudioService("recording-song-modiin");



export const metadata = metadataFromService(service);



export default function RecordingSongModiinPage() {

  return <RecordingSongModiinPageContent />;

}

