import GeoCityDjPageContent from "@/components/seo/GeoCityDjPageContent";
import { constructMetadata } from "@/lib/metadata";
import { getNewGeoCity } from "@/lib/data/geo-cities";

const city = getNewGeoCity("rehovot");

export const metadata = constructMetadata({
  title: city.djMeta.title,
  description: city.djMeta.description,
  slug: city.djPath,
  keywords: [...city.keywords.dj],
});

export default function DjRehovotPage() {
  return <GeoCityDjPageContent citySlug="rehovot" />;
}
