import { metadataFromService } from "@/lib/data/service-metadata";
import HubPageSchema from "@/components/seo/HubPageSchema";
import HubServiceIndexStatic from "@/components/seo/HubServiceIndexStatic";
import HubDecisionMatrix from "@/components/seo/HubDecisionMatrix";
import HubAudienceFitBlock from "@/components/seo/HubAudienceFitBlock";
import ServiceHubLinks from "@/components/services/ServiceHubLinks";
import ServicePageFromRegistry from "@/components/services/ServicePageFromRegistry";
import { hubSchemaPropsFromService } from "@/lib/seo/hub-pages";
import { VIDEO_HUB_DECISIONS } from "@/lib/data/hub-decision-matrix";
import {
  getVideoHubLinks,
  getVideoService,
} from "@/lib/data/services";

const service = getVideoService("video-hub");

export const metadata = metadataFromService(service);

const PHOTOGRAPHY_HUB_LINK = {
  href: "/photography",
  title: "צילום מקצועי",
  description: "חתונות, אירועים וכנסים - גלריה ותיעוד סטילס.",
} as const;

export default function VideoHubPage() {
  const hubLinks = [...getVideoHubLinks(), PHOTOGRAPHY_HUB_LINK];

  return (
    <>
      <HubPageSchema {...hubSchemaPropsFromService(service, "video")} />
      <HubServiceIndexStatic
        heading="מסלולי וידאו"
        links={hubLinks.map((link) => ({
          href: link.href,
          title: link.title,
          description: link.description,
        }))}
      />
      <ServicePageFromRegistry service={service} portfolioLabel="הפקות וידאו">
        <div className="space-y-12">
          <HubAudienceFitBlock hubPath="/video" />
          <HubDecisionMatrix
            rows={VIDEO_HUB_DECISIONS}
            heading="מה מתאים לי?"
            headingId="video-hub-decision-heading"
          />
          <ServiceHubLinks
            heading="מסלולי וידאו"
            subheading="בחרו שירות ממוקד או שלבו מספר מסלולים לחבילה מותאמת."
            links={hubLinks}
            headingId="video-tracks-heading"
          />
        </div>
      </ServicePageFromRegistry>
    </>
  );
}
