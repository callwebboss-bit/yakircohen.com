import { SITE_URL } from "@/lib/site-url";
import { ENTITY_IDS } from "@/lib/seo/entity-ids";
import { safeJsonLdStringify } from "@/lib/safe-json-ld";

/** Reinforces #founder Person entity on the About page. */
export default function PersonAboutSchema() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "@id": `${SITE_URL}/about#webpage`,
    url: `${SITE_URL}/about`,
    name: "אודות יקיר כהן",
    inLanguage: "he-IL",
    mainEntity: { "@id": ENTITY_IDS.founder },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: safeJsonLdStringify(jsonLd) }}
    />
  );
}
