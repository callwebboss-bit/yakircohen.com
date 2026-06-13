import type { Metadata } from "next";
import ProServicePageContent from "@/components/seo/ProServicePageContent";
import { constructMetadata } from "@/lib/metadata";
import { metadataFromProService } from "@/lib/data/pro-services";

export const metadata: Metadata = constructMetadata(metadataFromProService("dj-voice-tags"));

export default function DjVoiceTagsPage() {
  return <ProServicePageContent serviceId="dj-voice-tags" />;
}
