import { metadataFromService } from "@/lib/data/service-metadata";
import AudienceTabs from "@/components/events/AudienceTabs";
import ClientJourneySteps from "@/components/marketing/ClientJourneySteps";
import HubPageSchema from "@/components/seo/HubPageSchema";
import EventsAttractionsSchema from "@/components/seo/EventsAttractionsSchema";
import HubServiceIndexStatic from "@/components/seo/HubServiceIndexStatic";
import ServiceHubLinks from "@/components/services/ServiceHubLinks";
import ServicePageFromRegistry from "@/components/services/ServicePageFromRegistry";
import { hubSchemaPropsFromService } from "@/lib/seo/hub-pages";
import {
  getEventsHubLinks,
  getEventsService,
} from "@/lib/data/services";

const service = getEventsService("events-hub");

export const metadata = metadataFromService(service);

export default function EventsHubPage() {
  const hubLinks = getEventsHubLinks();

  return (
    <>
      <HubPageSchema {...hubSchemaPropsFromService(service, "events")} />
      <EventsAttractionsSchema />
      <HubServiceIndexStatic
        heading="שירותי אירועים"
        links={hubLinks.map((link) => ({
          href: link.href,
          title: link.title,
          description: link.description,
        }))}
      />
      <ServicePageFromRegistry service={service} portfolioLabel="הפקות אירועים" valueFrame="אפקטים שמרימים את האירוע - בלי הפתעות ביום">
      <AudienceTabs />
      <ClientJourneySteps variant="events" display="compact" />
      <ServiceHubLinks
        heading="שירותי אירועים"
        subheading="DJ, הגברה ותאורה, הנחיה ואטרקציות - חבילות מותאמות לאירוע שלכם."
        links={getEventsHubLinks()}
        headingId="events-tracks-heading"
      />
    </ServicePageFromRegistry>
    </>
  );
}
