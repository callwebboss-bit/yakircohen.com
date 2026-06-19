import type { Metadata } from "next";
import ProServicePageContent from "@/components/seo/ProServicePageContent";
import MashupFixerJsonLd from "@/components/seo/MashupFixerJsonLd";
import { constructMetadata } from "@/lib/metadata";
import { metadataFromProService } from "@/lib/data/pro-services";

export const metadata: Metadata = constructMetadata(metadataFromProService("mashup-fixer"));

export default function MashupFixerPage() {
  return (
    <>
      <MashupFixerJsonLd />
      <ProServicePageContent serviceId="mashup-fixer" />
    </>
  );
}
