import BubbleMachinePageContent from "@/components/seo/BubbleMachinePageContent";

import {

  getEventsService,

  metadataFromService,

} from "@/lib/data/services";



const service = getEventsService("attractions-bubble-machine");



export const metadata = metadataFromService(service);



export default function BubbleMachinePage() {

  return <BubbleMachinePageContent />;

}

