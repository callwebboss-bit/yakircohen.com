import ServicePageFromRegistry from "@/components/services/ServicePageFromRegistry";
import {
  getVoiceoverService,
  metadataFromService,
} from "@/lib/data/services";

const service = getVoiceoverService("voiceover-course");

export const metadata = metadataFromService(service);

export default function VoiceoverCoursePage() {
  return <ServicePageFromRegistry service={service} />;
}
