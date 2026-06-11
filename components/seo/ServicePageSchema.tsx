import type { ServiceEntity } from "@/lib/data/services";
import { buildServiceSchema } from "@/lib/seo/page-schema";

type ServicePageSchemaProps = {
  service: ServiceEntity;
};

export default function ServicePageSchema({ service }: ServicePageSchemaProps) {
  const schema = buildServiceSchema(service);

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
