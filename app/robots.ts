import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site-url";

/**
 * Production indexing is ON (index: true in layout + constructMetadata).
 * Vercel *preview* deployments may still send X-Robots-Tag: noindex  -  that is
 * platform-only and does not apply to yakircohen.com production.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
