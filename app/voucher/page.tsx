import type { Metadata } from "next";
import HubPageSchema from "@/components/seo/HubPageSchema";
import VoucherPageContent from "@/components/seo/VoucherPageContent";
import {
  hubSchemaPropsFromSeo,
  metadataForHubSeo,
  VOUCHER_HUB_SEO,
} from "@/lib/seo/hub-pages";

export const metadata: Metadata = metadataForHubSeo(VOUCHER_HUB_SEO);

export default function VoucherPage() {
  return (
    <>
      <HubPageSchema {...hubSchemaPropsFromSeo(VOUCHER_HUB_SEO)} />
      <VoucherPageContent />
    </>
  );
}
