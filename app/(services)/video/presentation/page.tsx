import ServicePageFromRegistry from "@/components/services/ServicePageFromRegistry";
import { getVideoService, metadataFromService } from "@/lib/data/services";

const service = getVideoService("video-presentation");

export const metadata = metadataFromService(service);

export default function VideoPresentationPage() {
  return (
    <ServicePageFromRegistry
      service={service}
      portfolioLabel="מצגות וידאו מקצועיות"
    />
  );
}
