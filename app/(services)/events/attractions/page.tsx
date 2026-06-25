import { metadataFromService } from "@/lib/data/service-metadata";
import ServiceHubLinks from "@/components/services/ServiceHubLinks";
import ServicePageFromRegistry from "@/components/services/ServicePageFromRegistry";
import ShowcaseVideoSection from "@/components/seo/ShowcaseVideoSection";
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
      <ServiceHubLinks
        heading="אטרקציות יוקרתיות"
        subheading="עשן כבד, בועות וקונפטי - אפקט מדויק לרגעי השיא."
        links={getAttractionsHubLinks()}
        headingId="attractions-tracks-heading"
      />
    </ServicePageFromRegistry>
  );
}
