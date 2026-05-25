import PhotoSlideshowPageContent from "@/components/seo/PhotoSlideshowPageContent";
import {
  getVideoService,
  metadataFromService,
} from "@/lib/data/services";

const service = getVideoService("video-photo-slideshow");

export const metadata = metadataFromService(service);

export default function PhotoSlideshowPage() {
  return <PhotoSlideshowPageContent />;
}
