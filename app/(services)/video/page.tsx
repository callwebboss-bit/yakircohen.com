import HubPageSchema from "@/components/seo/HubPageSchema";
import HubServiceIndexStatic from "@/components/seo/HubServiceIndexStatic";
import ServiceHubLinks from "@/components/services/ServiceHubLinks";
import ServicePageFromRegistry from "@/components/services/ServicePageFromRegistry";
import { hubSchemaPropsFromService } from "@/lib/seo/hub-pages";
import {
  getVideoHubLinks,
  getVideoService,
  metadataFromService,
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
        <ServiceHubLinks
          heading="מסלולי וידאו"
          subheading="בחרו שירות ממוקד או שלבו מספר מסלולים לחבילה מותאמת."
          links={hubLinks}
          headingId="video-tracks-heading"
        />
      </ServicePageFromRegistry>
    </>
  );
}
