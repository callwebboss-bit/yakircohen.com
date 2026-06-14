import {
  buildBusinessPageMetadata,
  BusinessServicePage,
} from "@/lib/business-page-shell";
import { EMPLOYER_BRANDING_CONFIG } from "@/lib/data/employer-branding-page";

const SLUG = "business/employer-branding";

export const metadata = buildBusinessPageMetadata({
  slug: SLUG,
  metaTitle: "סרטוני onboarding ותוכן HR",
  metaDescription:
    "סרטון ברוכים הבאים, סיור וירטואלי, תוכן לעובדים חדשים. יום צילום או ריטיינר. החל מ-4,500 ₪.",
  keywords: ["סרטון onboarding", "תוכן HR", "קליטת עובדים"],
  config: EMPLOYER_BRANDING_CONFIG,
});

export default function EmployerBrandingPage() {
  return (
    <BusinessServicePage slug={SLUG} config={EMPLOYER_BRANDING_CONFIG} />
  );
}
