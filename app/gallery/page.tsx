import type { Metadata } from "next";
import HubPageSchema from "@/components/seo/HubPageSchema";
import GalleryPageContent from "@/components/marketing/GalleryPageContent";
import {
  GALLERY_HUB_SEO,
  hubSchemaPropsFromSeo,
  metadataForHubSeo,
} from "@/lib/seo/hub-pages";

export const metadata: Metadata = metadataForHubSeo(GALLERY_HUB_SEO);

export default function GalleryPage() {
  return (
    <>
      <HubPageSchema {...hubSchemaPropsFromSeo(GALLERY_HUB_SEO)} />
      <GalleryPageContent />
    </>
  );
}
