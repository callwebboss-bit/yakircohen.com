import VoiceoverHubPageContent from "@/components/seo/VoiceoverHubPageContent";
import {
  getVoiceoverService,
  metadataFromService,
} from "@/lib/data/services";

const service = getVoiceoverService("voiceover-hub");

export const metadata = metadataFromService(service);

export default function VoiceoverHubPage() {
  return <VoiceoverHubPageContent />;
}
