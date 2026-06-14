import { metadataFromService } from "@/lib/data/service-metadata";
import ServicePageFromRegistry from "@/components/services/ServicePageFromRegistry";
import BusinessCrossLink from "@/components/marketing/BusinessCrossLink";
import Container from "@/components/ui/Container";
import { getVideoService } from "@/lib/data/services";

const service = getVideoService("video-corporate");

export const metadata = metadataFromService(service);

export default function VideoCorporatePage() {
  return (
    <>
      <Container className="py-8">
        <BusinessCrossLink
          title="כל הפתרונות לעסקים"
          text="רילז, אולפן בחברה, מיתוג קולי, פודקאסט. הכל במקום אחד."
          href="/business"
          linkLabel="מרכז לעסקים"
        />
      </Container>
      <ServicePageFromRegistry
        service={service}
        portfolioLabel="סרטי תדמית לעסקים"
      />
    </>
  );
}
