import GeoCityStudioPageContent from "@/components/seo/GeoCityStudioPageContent";
import { metadataFromService } from "@/lib/data/service-metadata";
import { getStudioService } from "@/lib/data/services";

const service = getStudioService("studio-shoham");

export const metadata = metadataFromService(service);

export default function StudioShohamPage() {
  return <GeoCityStudioPageContent citySlug="shoham" />;
}
