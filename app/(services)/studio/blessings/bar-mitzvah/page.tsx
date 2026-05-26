import BlessingsBarMitzvahPageContent from "@/components/seo/BlessingsBarMitzvahPageContent";
import {
  getStudioService,
  metadataFromService,
} from "@/lib/data/services";

const service = getStudioService("blessings-bar-mitzvah");

export const metadata = metadataFromService(service);

export default function BarMitzvahBlessingPage() {
  return <BlessingsBarMitzvahPageContent />;
}
