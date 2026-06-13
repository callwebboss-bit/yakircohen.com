import { metadataFromService } from "@/lib/data/service-metadata";
import ConfettiCannonPageContent from "@/components/seo/ConfettiCannonPageContent";
import {
  getEventsService,
} from "@/lib/data/services";

const service = getEventsService("attractions-confetti-cannon");

export const metadata = metadataFromService(service);

export default function ConfettiCannonPage() {
  return <ConfettiCannonPageContent />;
}
