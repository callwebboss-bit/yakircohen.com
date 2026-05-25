import SingerAmplificationPageContent from "@/components/seo/SingerAmplificationPageContent";
import {
  getEventsService,
  metadataFromService,
} from "@/lib/data/services";

const service = getEventsService("events-singer-amplification");

export const metadata = metadataFromService(service);

export default function SingerAmplificationPage() {
  return <SingerAmplificationPageContent />;
}
