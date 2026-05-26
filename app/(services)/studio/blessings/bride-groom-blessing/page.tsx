import BlessingsBrideGroomPageContent from "@/components/seo/BlessingsBrideGroomPageContent";
import {
  getStudioService,
  metadataFromService,
} from "@/lib/data/services";

const service = getStudioService("blessings-bride-groom");

export const metadata = metadataFromService(service);

export default function BrideGroomBlessingPage() {
  return <BlessingsBrideGroomPageContent />;
}
