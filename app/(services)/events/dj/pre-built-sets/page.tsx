import type { Metadata } from "next";
import ProServicePageContent from "@/components/seo/ProServicePageContent";
import { constructMetadata } from "@/lib/metadata";
import { metadataFromProService } from "@/lib/data/pro-services";

export const metadata: Metadata = constructMetadata(metadataFromProService("pre-built-sets"));

export default function PreBuiltSetsPage() {
  return <ProServicePageContent serviceId="pre-built-sets" />;
}
