import { metadataFromService } from "@/lib/data/service-metadata";
import BlessingsVideoClipPageContent from "@/components/seo/BlessingsVideoClipPageContent";
import {
  getStudioService,
} from "@/lib/data/services";

const service = getStudioService("blessings-video-clip");

export const metadata = metadataFromService(service);

export default function VideoClipBlessingPage() {
  return <BlessingsVideoClipPageContent />;
}
