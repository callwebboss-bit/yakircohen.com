import AcademyUlpanPageContent from "@/components/seo/AcademyUlpanPageContent";
import { ULPAN_META } from "@/lib/data/academy-ulpan-page";
import { constructMetadata } from "@/lib/metadata";
import { buildUlpanPageSchema } from "@/lib/seo/ulpan-page-schema";
import { safeJsonLdStringify } from "@/lib/safe-json-ld";
import { SITE_URL } from "@/lib/site-url";

const _base = constructMetadata({
  title: ULPAN_META.title,
  description: ULPAN_META.description,
  slug: "academy/ulpan",
  keywords: [...ULPAN_META.keywords],
});

export const metadata = {
  ..._base,
  alternates: {
    ..._base.alternates,
    languages: {
      "he-IL": `${SITE_URL}/academy/ulpan`,
      en: `${SITE_URL}/academy/hebrew-lessons`,
    },
  },
};

const jsonLd = buildUlpanPageSchema();

/* היו כאן 4 שאלות שנשלחו לגוגל ב-FaqPageSchema נפרד ולא הופיעו בעמוד (טקסט
   מוסתר). רשימת השאלות של העמוד נפלטת כבר מ-buildUlpanPageSchema, 14 מתוך 14
   גלויות. */

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
