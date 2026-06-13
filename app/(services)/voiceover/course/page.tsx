import { metadataFromService } from "@/lib/data/service-metadata";
import VoiceoverCoursePageContent from "@/components/seo/VoiceoverCoursePageContent";
import {
  getVoiceoverService,
} from "@/lib/data/services";

const service = getVoiceoverService("voiceover-course");

export const metadata = metadataFromService(service);

export default function VoiceoverCoursePage() {
  return <VoiceoverCoursePageContent />;
}
