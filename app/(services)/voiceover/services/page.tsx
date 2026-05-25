import ServicePageFromRegistry from "@/components/services/ServicePageFromRegistry";
import {
  getVoiceoverService,
  metadataFromService,
} from "@/lib/data/services";

const service = getVoiceoverService("voiceover-services");

export const metadata = metadataFromService(service);

export default function VoiceoverServicesPage() {
  return (
    <ServicePageFromRegistry
      service={service}
      portfolioLabel="דוגמאות קריינות מסחרית ומרכזיות"
    />
  );
}
