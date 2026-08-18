import GeoCityStudioPageContent from "@/components/seo/GeoCityStudioPageContent";
import { metadataFromService } from "@/lib/data/service-metadata";
import { getStudioService } from "@/lib/data/services";

const service = getStudioService("studio-beit-shemesh");

export const metadata = metadataFromService(service);

export default function StudioBeitShemeshPage() {
  return <GeoCityStudioPageContent citySlug="beit-shemesh" />;
}
