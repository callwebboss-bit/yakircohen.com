import type { Metadata } from "next";
import { constructMetadata } from "@/lib/metadata";
import { ogImageToMetadataParam } from "@/lib/seo/og-images";
import { resolveServiceOgImage } from "@/lib/service-portfolio-hero";
import type { ServiceEntity, StudioPricingConfig } from "@/lib/data/services";

export function metadataFromService(service: ServiceEntity): Metadata {
  return constructMetadata({
    title: service.metaTitle,
    description: service.metaDescription,
    slug: service.slug,
    keywords: [...service.keywords],
    ogImage: ogImageToMetadataParam(resolveServiceOgImage(service)),
  });
}

export function metadataFromPricing(config: StudioPricingConfig): Metadata {
  return constructMetadata({
    title: config.metaTitle,
    description: config.metaDescription,
    slug: config.slug,
    keywords: [...config.keywords],
  });
}
