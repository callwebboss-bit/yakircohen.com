import { metadataFromService } from "@/lib/data/service-metadata";
import RecordingSongModiinPageContent from "@/components/seo/RecordingSongModiinPageContent";

import {

  getStudioService,
} from "@/lib/data/services";
import NewServicesLinks from "@/components/seo/NewServicesLinks";



const service = getStudioService("recording-song-modiin");



export const metadata = metadataFromService(service);



export default function RecordingSongModiinPage() {

  return (
    <>
      <RecordingSongModiinPageContent />
      <NewServicesLinks paths={["/studio/original-song", "/studio/parody", "/studio/professional-singer", "/studio/group-session", "/studio/ai-song-gift", "/studio/renew-old-song"]} />
    </>
  );

}

