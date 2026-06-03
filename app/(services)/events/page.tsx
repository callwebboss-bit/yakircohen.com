import AudienceTabs from "@/components/events/AudienceTabs";
import ClientJourneySteps from "@/components/marketing/ClientJourneySteps";
import ServiceHubLinks from "@/components/services/ServiceHubLinks";
import ServicePageFromRegistry from "@/components/services/ServicePageFromRegistry";
import {
  getEventsHubLinks,
  getEventsService,
  metadataFromService,
} from "@/lib/data/services";

const service = getEventsService("events-hub");

export const metadata = metadataFromService(service);

export default function EventsHubPage() {
  return (
    <ServicePageFromRegistry service={service} portfolioLabel="הפקות אירועים">
      <AudienceTabs />
      <ClientJourneySteps variant="events" display="compact" />
      <ServiceHubLinks
        heading="שירותי אירועים"
        subheading="DJ, הגברה ותאורה, הנחיה ואטרקציות - חבילות מותאמות לאירוע שלכם."
        links={getEventsHubLinks()}
        headingId="events-tracks-heading"
      />
    </ServicePageFromRegistry>
  );
}
