import type { Metadata } from "next";
import ProServicePageContent from "@/components/seo/ProServicePageContent";
import BusinessCrossLink from "@/components/marketing/BusinessCrossLink";
import Container from "@/components/ui/Container";
import { constructMetadata } from "@/lib/metadata";
import { metadataFromProService } from "@/lib/data/pro-services";

export const metadata: Metadata = constructMetadata(metadataFromProService("bulk-production"));

export default function BulkProductionPage() {
  return (
    <>
      <Container className="py-8">
        <BusinessCrossLink
          title="כל הפתרונות לעסקים"
          text="רילז, אולפן בחברה, מיתוג קולי. הכל במקום אחד."
          href="/business"
          linkLabel="מרכז לעסקים"
        />
      </Container>
      <ProServicePageContent serviceId="bulk-production" />
    </>
  );
}
