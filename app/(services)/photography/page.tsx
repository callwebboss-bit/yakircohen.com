import { metadataFromService } from "@/lib/data/service-metadata";
import CalculatorDisclosure from "@/components/calculators/CalculatorDisclosure";
import PhotographyCalculator from "@/components/calculators/PhotographyCalculator";
import HubPageSchema from "@/components/seo/HubPageSchema";
import ProfessionalStanceSection from "@/components/seo/ProfessionalStanceSection";
import ServiceHubLinks from "@/components/services/ServiceHubLinks";
import ServicePageFromRegistry from "@/components/services/ServicePageFromRegistry";
import { hubSchemaPropsFromService } from "@/lib/seo/hub-pages";
import {
  getPhotographyHubLinks,
  getPhotographyService,
} from "@/lib/data/services";

const service = getPhotographyService("photography-hub");

export const metadata = metadataFromService(service);

const VIDEO_HUB_LINK = {
  href: "/video",
  title: "הפקות וידאו",
  description: "אירועים, תדמית ומצגות וידאו מקצועיות.",
} as const;

export default function PhotographyHubPage() {
  const hubLinks = [...getPhotographyHubLinks(), VIDEO_HUB_LINK];

  return (
    <>
      <HubPageSchema {...hubSchemaPropsFromService(service, "photography")} />
      <ServicePageFromRegistry service={service} portfolioLabel="גלריית צילום">
        <ProfessionalStanceSection pathname="/photography" />

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
          links={hubLinks}
          headingId="photography-tracks-heading"
        />
      </ServicePageFromRegistry>
    </>
  );
}
