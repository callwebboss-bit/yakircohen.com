import { metadataFromService } from "@/lib/data/service-metadata";
import VoiceoverHubPageContent from "@/components/seo/VoiceoverHubPageContent";
import HubPageSchema from "@/components/seo/HubPageSchema";
import { hubSchemaPropsFromService } from "@/lib/seo/hub-pages";
import {
  getVoiceoverService,
} from "@/lib/data/services";

const service = getVoiceoverService("voiceover-hub");

export const metadata = metadataFromService(service);

export default function VoiceoverHubPage() {
  return (
    <>
      <HubPageSchema {...hubSchemaPropsFromService(service, "voiceover")} />
      <VoiceoverHubPageContent />
    </>
  );
}
