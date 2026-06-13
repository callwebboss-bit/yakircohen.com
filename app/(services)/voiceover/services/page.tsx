import { metadataFromService } from "@/lib/data/service-metadata";
import VoiceoverServicesPageContent from "@/components/seo/VoiceoverServicesPageContent";
import {
  getVoiceoverService,
} from "@/lib/data/services";

const service = getVoiceoverService("voiceover-services");

export const metadata = metadataFromService(service);

export default function VoiceoverServicesPage() {
  return <VoiceoverServicesPageContent />;
}
