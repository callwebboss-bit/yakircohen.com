import { metadataFromService } from "@/lib/data/service-metadata";
import PhotoSlideshowPageContent from "@/components/seo/PhotoSlideshowPageContent";
import {
  getVideoService,
} from "@/lib/data/services";

const service = getVideoService("video-photo-slideshow");

export const metadata = metadataFromService(service);

export default function PhotoSlideshowPage() {
  return <PhotoSlideshowPageContent />;
}
