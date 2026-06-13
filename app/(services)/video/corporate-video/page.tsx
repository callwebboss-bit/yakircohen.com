import { metadataFromService } from "@/lib/data/service-metadata";
import ServicePageFromRegistry from "@/components/services/ServicePageFromRegistry";
import { getVideoService } from "@/lib/data/services";

const service = getVideoService("video-corporate");

export const metadata = metadataFromService(service);

export default function VideoCorporatePage() {
  return (
    <ServicePageFromRegistry
      service={service}
      portfolioLabel="סרטי תדמית לעסקים"
    />
  );
}
