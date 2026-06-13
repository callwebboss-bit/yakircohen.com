import { metadataFromService } from "@/lib/data/service-metadata";
import BlessingsBrideGroomPageContent from "@/components/seo/BlessingsBrideGroomPageContent";
import {
  getStudioService,
} from "@/lib/data/services";

const service = getStudioService("blessings-bride-groom");

export const metadata = metadataFromService(service);

export default function BrideGroomBlessingPage() {
  return <BlessingsBrideGroomPageContent />;
}
