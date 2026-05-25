import RecordingStudioPageContent from "@/components/seo/RecordingStudioPageContent";
import {
  getStudioService,
  metadataFromService,
} from "@/lib/data/services";

const service = getStudioService("studio-recording-studio");

export const metadata = metadataFromService(service);

export default function RecordingStudioPage() {
  return <RecordingStudioPageContent />;
}
