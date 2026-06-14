import AcademyUlpanPageContent from "@/components/seo/AcademyUlpanPageContent";
import { ULPAN_META } from "@/lib/data/academy-ulpan-page";
import { constructMetadata } from "@/lib/metadata";
import { buildUlpanPageSchema } from "@/lib/seo/ulpan-page-schema";
import { safeJsonLdStringify } from "@/lib/safe-json-ld";

export const metadata = constructMetadata({
  title: ULPAN_META.title,
  description: ULPAN_META.description,
  slug: "academy/ulpan",
  keywords: [...ULPAN_META.keywords],
});

const jsonLd = buildUlpanPageSchema();

export default function AcademyUlpanPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLdStringify(jsonLd) }}
      />
      <AcademyUlpanPageContent />
    </>
  );
}
