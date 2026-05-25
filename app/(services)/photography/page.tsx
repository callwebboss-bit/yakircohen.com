import CalculatorDisclosure from "@/components/calculators/CalculatorDisclosure";
import PhotographyCalculator from "@/components/calculators/PhotographyCalculator";
import ServiceHubLinks from "@/components/services/ServiceHubLinks";
import ServicePageFromRegistry from "@/components/services/ServicePageFromRegistry";
import {
  getPhotographyHubLinks,
  getPhotographyService,
  metadataFromService,
} from "@/lib/data/services";

const service = getPhotographyService("photography-hub");

export const metadata = metadataFromService(service);

const VIDEO_HUB_LINK = {
  href: "/video",
  title: "הפקות וידאו",
  description: "אירועים, תדמית ומצגות וידאו מקצועיות.",
} as const;

export default function PhotographyHubPage() {
  return (
    <ServicePageFromRegistry service={service} portfolioLabel="גלריית צילום">
      <CalculatorDisclosure
        title="הזמנת צלם - מחשבון חבילה"
        description="שעות צילום, תוספות ושירותי AI - מחיר משוער לפני מע״מ."
        buttonLabel="פתחו מחשבון חבילה והמשיכו להזמנה"
      >
        <PhotographyCalculator />
      </CalculatorDisclosure>

      <ServiceHubLinks
        heading="מסלולי צילום"
        subheading="חתונות ואירועים - חבילות גמישות עם מסירה מסודרת."
        links={[...getPhotographyHubLinks(), VIDEO_HUB_LINK]}
        headingId="photography-tracks-heading"
      />
    </ServicePageFromRegistry>
  );
}
