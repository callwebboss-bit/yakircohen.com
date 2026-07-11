import siteSchema from "@/lib/seo/site-schema.json";
import { safeJsonLdStringify } from "@/lib/safe-json-ld";

// OPTIMIZED: static JSON - no heavy pricing/testimonial imports in layout bundle
export default function SiteSchema() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: safeJsonLdStringify(siteSchema) }}
    />
  );
}
