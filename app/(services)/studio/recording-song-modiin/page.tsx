import RecordingSongModiinPageContent from "@/components/seo/RecordingSongModiinPageContent";

import {

  getStudioService,

  metadataFromService,

} from "@/lib/data/services";



const service = getStudioService("recording-song-modiin");



export const metadata = metadataFromService(service);



export default function RecordingSongModiinPage() {

  return <RecordingSongModiinPageContent />;

}

