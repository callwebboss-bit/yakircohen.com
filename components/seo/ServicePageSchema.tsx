import type { ServiceEntity } from "@/lib/data/services";
import { buildServiceSchema } from "@/lib/seo/page-schema";
import { safeJsonLdStringify } from "@/lib/safe-json-ld";

type ServicePageSchemaProps = {
  service: ServiceEntity;
};

export default function ServicePageSchema({ service }: ServicePageSchemaProps) {
  const schema = buildServiceSchema(service);

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: safeJsonLdStringify(schema) }}
    />
  );
}
