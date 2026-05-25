import ServiceHubLinks from "@/components/services/ServiceHubLinks";
import ServicePageFromRegistry from "@/components/services/ServicePageFromRegistry";
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
  return (
    <ServicePageFromRegistry service={service} portfolioLabel="הפקות וידאו">
      <ServiceHubLinks
        heading="מסלולי וידאו"
        subheading="בחרו שירות ממוקד או שלבו מספר מסלולים לחבילה מותאמת."
        links={[...getVideoHubLinks(), PHOTOGRAPHY_HUB_LINK]}
        headingId="video-tracks-heading"
      />
    </ServicePageFromRegistry>
  );
}
