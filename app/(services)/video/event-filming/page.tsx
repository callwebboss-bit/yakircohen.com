import ServicePageFromRegistry from "@/components/services/ServicePageFromRegistry";
import { getVideoService, metadataFromService } from "@/lib/data/services";

const service = getVideoService("video-event-filming");

export const metadata = metadataFromService(service);

export default function VideoEventFilmingPage() {
  return (
    <ServicePageFromRegistry
      service={service}
      portfolioLabel="צילום והפקת וידאו לאירועים"
    />
  );
}
