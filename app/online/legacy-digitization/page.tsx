import {
  buildBusinessPageMetadata,
  BusinessServicePage,
} from "@/lib/business-page-shell";
import { LEGACY_DIGITIZATION_CONFIG } from "@/lib/data/legacy-digitization-page";

const SLUG = "online/legacy-digitization";

export const metadata = buildBusinessPageMetadata({
  slug: SLUG,
  metaTitle: "המרת VHS וקלטות לדיגיטל | שחזור AI",
  metaDescription:
    "המרת VHS, MiniDV וקלטות לדיגיטל. שחזור AI לסאונד ותמונה. החל מ-350 ₪.",
  keywords: [
    "המרת VHS לדיגיטל",
    "המרת קלטות",
    "שחזור קלטות ישנות",
    "MiniDV דיגיטל",
    "שחזור וידאו AI",
  ],
  config: LEGACY_DIGITIZATION_CONFIG,
  ogHub: "online",
});

export default function LegacyDigitizationPage() {
  return (
    <BusinessServicePage slug={SLUG} config={LEGACY_DIGITIZATION_CONFIG} />
  );
}
