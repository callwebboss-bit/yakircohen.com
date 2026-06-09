import EventFilmingPageContent from "@/components/seo/EventFilmingPageContent";
import { getVideoService, metadataFromService } from "@/lib/data/services";

const service = getVideoService("video-event-filming");

export const metadata = metadataFromService(service);

export default function VideoEventFilmingPage() {
  return <EventFilmingPageContent />;
}
