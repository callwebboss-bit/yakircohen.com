import { buildWebPageSchema } from "@/lib/seo/page-schema";
import type { HubOgKey } from "@/lib/seo/og-images";
import { resolveOgForHub } from "@/lib/seo/og-images";
import { safeJsonLdStringify } from "@/lib/safe-json-ld";

type HubPageSchemaProps = {
  slug: string;
  title: string;
  description: string;
  hub?: HubOgKey;
};

export default function HubPageSchema({
  slug,
  title,
  description,
  hub,
}: HubPageSchemaProps) {
  const og = hub ? resolveOgForHub(hub) : undefined;
  const schema = buildWebPageSchema({
    slug,
    title,
    description,
    imagePath: og?.path,
    imageAlt: og?.alt,
  });

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: safeJsonLdStringify(schema) }}
    />
  );
}
