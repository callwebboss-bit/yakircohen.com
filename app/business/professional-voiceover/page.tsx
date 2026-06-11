import type { Metadata } from "next";
import ProfessionalVoiceoverPageContent from "@/components/business/ProfessionalVoiceoverPageContent";
import HubPageSchema from "@/components/seo/HubPageSchema";
import { constructMetadata } from "@/lib/metadata";
import { ogImageToMetadataParam, resolveOgForCategory } from "@/lib/seo/og-images";
import { normalizeTitle } from "@/lib/seo/normalize-title";

const PAGE_SEO = {
  slug: "business/professional-voiceover",
  title: "קריינות לסט DJ | חבילת 5 משפטים",
  description:
    "קריינות מקצועית לסט DJ: 5 משפטים קצרים, הקלטה באולפן, קובץ MP3 מוכן. מיתוג, הבלטה וחוויית קהל מושלמת.",
  keywords: [
    "קריינות לסט",
    "קריינות DJ",
    "קריינות מקצועית",
    "מיתוג DJ",
    "הקלטת קריינות",
  ],
} as const;

export const metadata: Metadata = constructMetadata({
  title: PAGE_SEO.title,
  description: PAGE_SEO.description,
  slug: PAGE_SEO.slug,
  keywords: [...PAGE_SEO.keywords],
  ogImage: ogImageToMetadataParam(resolveOgForCategory("voiceover")),
});

export default function ProfessionalVoiceoverPage() {
  return (
    <>
      <HubPageSchema
        slug={PAGE_SEO.slug}
        title={normalizeTitle(PAGE_SEO.title)}
        description={PAGE_SEO.description}
        hub="voiceover"
      />
      <ProfessionalVoiceoverPageContent />
    </>
  );
}
