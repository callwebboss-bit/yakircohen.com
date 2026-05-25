import ServicePageFromRegistry from "@/components/services/ServicePageFromRegistry";
import {
  getStudioService,
  metadataFromService,
} from "@/lib/data/services";

const service = getStudioService("blessings-bar-mitzvah");

export const metadata = metadataFromService(service);

export default function BarMitzvahBlessingPage() {
  return (
    <ServicePageFromRegistry
      service={service}
      portfolioLabel="דוגמאות ברכות לבר/בת מצווה"
    />
  );
}
