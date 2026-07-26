import { metadataFromService } from "@/lib/data/service-metadata";
import HubDecisionMatrix from "@/components/seo/HubDecisionMatrix";
import ServiceHubLinks from "@/components/services/ServiceHubLinks";
import ServicePageFromRegistry from "@/components/services/ServicePageFromRegistry";
import ShowcaseVideoSection from "@/components/seo/ShowcaseVideoSection";
import { ATTRACTIONS_HUB_DECISIONS } from "@/lib/data/hub-decision-matrix";
import {
  getAttractionsHubLinks,
  getEventsService,
} from "@/lib/data/services";

const service = getEventsService("events-attractions-hub");

export const metadata = metadataFromService(service);

export default function EventsAttractionsHubPage() {
  return (
    <ServicePageFromRegistry
      service={service}
      portfolioLabel="אטרקציות לאירועים"
    >
      <ShowcaseVideoSection playlistId="events-attractions" className="mt-12" />
      <div className="mt-12 space-y-12">
        <HubDecisionMatrix
          rows={ATTRACTIONS_HUB_DECISIONS}
          heading="מה מתאים לי?"
          headingId="attractions-hub-decision-heading"
        />
        <ServiceHubLinks
          heading="אטרקציות יוקרתיות"
          subheading="עשן כבד, בועות וקונפטי - אפקט מדויק לרגעי השיא."
          links={getAttractionsHubLinks()}
          headingId="attractions-tracks-heading"
        />
      </div>
    </ServicePageFromRegistry>
  );
}
