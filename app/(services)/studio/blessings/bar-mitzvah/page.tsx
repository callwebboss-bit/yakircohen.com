import { metadataFromService } from "@/lib/data/service-metadata";
import BlessingsBarMitzvahPageContent from "@/components/seo/BlessingsBarMitzvahPageContent";
import {
  getStudioService,
} from "@/lib/data/services";

const service = getStudioService("blessings-bar-mitzvah");

export const metadata = metadataFromService(service);

export default function BarMitzvahBlessingPage() {
  return <BlessingsBarMitzvahPageContent />;
}
