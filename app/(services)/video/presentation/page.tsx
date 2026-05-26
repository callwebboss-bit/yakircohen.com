import VideoPresentationPageContent from "@/components/seo/VideoPresentationPageContent";
import { getVideoService, metadataFromService } from "@/lib/data/services";

const service = getVideoService("video-presentation");

export const metadata = metadataFromService(service);

export default function VideoPresentationPage() {
  return <VideoPresentationPageContent />;
}
