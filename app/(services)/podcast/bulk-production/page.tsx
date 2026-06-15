import type { Metadata } from "next";
import ProServicePageContent from "@/components/seo/ProServicePageContent";
import { constructMetadata } from "@/lib/metadata";
import { metadataFromProService } from "@/lib/data/pro-services";

export const metadata: Metadata = constructMetadata(metadataFromProService("bulk-production"));

export default function BulkProductionPage() {
  return <ProServicePageContent serviceId="bulk-production" />;
}
