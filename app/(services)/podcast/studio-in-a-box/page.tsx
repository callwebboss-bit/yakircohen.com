import type { Metadata } from "next";
import ProServicePageContent from "@/components/seo/ProServicePageContent";
import { constructMetadata } from "@/lib/metadata";
import { metadataFromProService } from "@/lib/data/pro-services";

export const metadata: Metadata = constructMetadata(metadataFromProService("studio-in-a-box"));

export default function StudioInABoxPage() {
  return <ProServicePageContent serviceId="studio-in-a-box" />;
}
