import type { Metadata } from "next";
import { SITE_NAME } from "@/lib/constants";
import {
  DEFAULT_OPEN_GRAPH,
  DEFAULT_OG_IMAGE_URL,
  DEFAULT_TWITTER,
  SITE_ROBOTS,
} from "@/lib/seo-config";

const BASE_URL = "https://yakircohen.com";
const BRAND_SUFFIX = " | יקיר כהן הפקות";

export type ConstructMetadataParams = {
  title: string;
  description: string;
  slug: string;
  keywords?: string[];
};

export function constructMetadata({
  title,
  description,
  slug,
  keywords = [],
}: ConstructMetadataParams): Metadata {
  const normalizedSlug = slug.replace(/^\/+/, "");
  const url = `${BASE_URL}/${normalizedSlug}`;
  const absoluteTitle = `${title}${BRAND_SUFFIX}`;

  return {
    title: { absolute: absoluteTitle },
    description,
    keywords: [
      ...keywords,
      "יקיר כהן הפקות",
      "מודיעין",
      "ירושלים והסביבה",
    ],
    alternates: {
      canonical: url,
      languages: {
        "he-IL": url,
      },
    },
    openGraph: {
      ...DEFAULT_OPEN_GRAPH,
      url,
      title: absoluteTitle,
      description,
      images: [{ ...DEFAULT_OPEN_GRAPH.images[0], url: DEFAULT_OG_IMAGE_URL }],
    },
    twitter: {
      ...DEFAULT_TWITTER,
      title: absoluteTitle,
      description,
    },
    robots: SITE_ROBOTS,
    category: "music",
  };
}
