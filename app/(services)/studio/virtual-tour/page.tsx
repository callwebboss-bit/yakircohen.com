import type { Metadata } from "next";
import StudioVirtualTourPageContent from "@/components/seo/StudioVirtualTourPageContent";
import { constructMetadata } from "@/lib/metadata";
import { buildWebPageSchema } from "@/lib/seo/page-schema";
import { safeJsonLdStringify } from "@/lib/safe-json-ld";
import { STUDIO_VIRTUAL_TOUR_PAGE_PATH } from "@/lib/data/studio-virtual-tour";

export const metadata: Metadata = constructMetadata({
  title: "סיור וירטואלי באולפן | וידאו קצר ותהליך ההקלטה",
  description:
    "סיור וירטואלי קצר באולפן ההקלטות במודיעין - וידאו קצר, הסבר על החדר, המיקרופון, תהליך ההקלטה והתוצאה הסופית.",
  slug: "studio/virtual-tour",
  keywords: [
    "סיור באולפן",
    "אולפן הקלטות מודיעין",
    "וידאו אולפן הקלטות",
    "איך נראה אולפן הקלטות",
  ],
});

const PAGE_SCHEMA = buildWebPageSchema({
  slug: STUDIO_VIRTUAL_TOUR_PAGE_PATH,
  title: "מיני-סטודיו וירטואלי",
  description:
    "סיור וידאו קצר באולפן ההקלטות במודיעין, עם הסבר על החדר, תהליך ההקלטה והתוצאה הסופית.",
});

export default function StudioVirtualTourPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLdStringify(PAGE_SCHEMA) }}
      />
      <StudioVirtualTourPageContent />
    </>
  );
}
