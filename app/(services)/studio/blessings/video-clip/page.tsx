import ServicePageFromRegistry from "@/components/services/ServicePageFromRegistry";
import {
  getStudioService,
  metadataFromService,
} from "@/lib/data/services";

const service = getStudioService("blessings-video-clip");

export const metadata = metadataFromService(service);

export default function VideoClipBlessingPage() {
  return (
    <ServicePageFromRegistry
      service={service}
      portfolioLabel="דוגמאות קליפים מהאולפן"
    />
  );
}
