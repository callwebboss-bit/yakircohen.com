import type { Metadata } from "next";
import { SITE_NAME } from "@/lib/constants";
import {
  DEFAULT_OPEN_GRAPH,
  DEFAULT_OG_IMAGE_PATH,
  DEFAULT_TWITTER,
  SITE_ROBOTS,
} from "@/lib/seo-config";
import { BRAND_SUFFIX, normalizeTitle } from "@/lib/seo/normalize-title";
import { SITE_URL } from "@/lib/site-url";

export type ConstructMetadataParams = {
  title: string;
  description: string;
  slug: string;
  keywords?: string[];
  robots?: Metadata["robots"];
  /** Override default OG/Twitter image path, alt, and dimensions */
  ogImage?: { path?: string; alt?: string; width?: number; height?: number };
  /** Blog/article pages -- sets OG type article + published/modified times */
  article?: { publishedTime: string; modifiedTime?: string };
};

export { BRAND_SUFFIX, normalizeTitle };

export function constructMetadata({
  title,
  description,
  slug,
  keywords = [],
  robots,
  ogImage,
  article,
}: ConstructMetadataParams): Metadata {
  const normalizedSlug = slug.replace(/^\/+/, "");
  const url = `${SITE_URL}/${normalizedSlug}`;
  const absoluteTitle = `${normalizeTitle(title)}${BRAND_SUFFIX}`;
  const ogImagePath = ogImage?.path ?? DEFAULT_OG_IMAGE_PATH;
  const ogImageUrl = `${SITE_URL}${encodeURI(ogImagePath)}`;
  const ogImageAlt =
    ogImage?.alt ?? DEFAULT_OPEN_GRAPH.images[0].alt ?? `${SITE_NAME} - אולפן הקלטות במודיעין`;
  const ogImageWidth = ogImage?.width ?? DEFAULT_OPEN_GRAPH.images[0].width;
  const ogImageHeight = ogImage?.height ?? DEFAULT_OPEN_GRAPH.images[0].height;

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
      type: article ? "article" : DEFAULT_OPEN_GRAPH.type,
      url,
      title: absoluteTitle,
      description,
      ...(article
        ? {
            publishedTime: article.publishedTime,
            modifiedTime: article.modifiedTime ?? article.publishedTime,
          }
        : {}),
      images: [
        {
          ...DEFAULT_OPEN_GRAPH.images[0],
          url: ogImageUrl,
          alt: ogImageAlt,
          width: ogImageWidth,
          height: ogImageHeight,
        },
      ],
    },
    twitter: {
      ...DEFAULT_TWITTER,
      title: absoluteTitle,
      description,
      images: [ogImageUrl],
    },
    robots: robots ?? SITE_ROBOTS,
    category: "music",
  };
}
