import ServiceHubLinks from "@/components/services/ServiceHubLinks";
import ServicePageFromRegistry from "@/components/services/ServicePageFromRegistry";
import {
  getVoiceoverHubLinks,
  getVoiceoverService,
  metadataFromService,
} from "@/lib/data/services";

const service = getVoiceoverService("voiceover-hub");

export const metadata = metadataFromService(service);

export default function VoiceoverHubPage() {
  return (
    <ServicePageFromRegistry service={service} portfolioLabel="דוגמאות קריינות">
      <ServiceHubLinks
        heading="שירותי קריינות"
        subheading="בחרו מסלול מותאם או התחילו בייעוץ קצר בוואטסאפ."
        links={getVoiceoverHubLinks()}
        headingId="voiceover-tracks-heading"
      />
    </ServicePageFromRegistry>
  );
}
