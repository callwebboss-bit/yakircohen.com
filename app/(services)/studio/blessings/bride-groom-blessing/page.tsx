import ServicePageFromRegistry from "@/components/services/ServicePageFromRegistry";
import {
  getStudioService,
  metadataFromService,
} from "@/lib/data/services";

const service = getStudioService("blessings-bride-groom");

export const metadata = metadataFromService(service);

export default function BrideGroomBlessingPage() {
  return (
    <ServicePageFromRegistry
      service={service}
      portfolioLabel="דוגמאות ברכות חתן וכלה"
    />
  );
}
