import type { Metadata } from "next";
import ProServicePageContent from "@/components/seo/ProServicePageContent";
import { constructMetadata } from "@/lib/metadata";
import { metadataFromProService } from "@/lib/data/pro-services";

export const metadata: Metadata = constructMetadata(metadataFromProService("mashup-fixer"));

export default function MashupFixerPage() {
  return <ProServicePageContent serviceId="mashup-fixer" />;
}
