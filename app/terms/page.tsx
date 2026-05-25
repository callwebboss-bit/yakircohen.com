import type { Metadata } from "next";
import LegalPageLayout from "@/components/legal/LegalPageLayout";
import { TERMS_PAGE } from "@/lib/data/legal/terms-content";
import { constructMetadata } from "@/lib/metadata";

export const metadata: Metadata = constructMetadata({
  title: "תנאי שירות",
  description:
    "תנאי השירות של יקיר כהן הפקות - ביטול והחזר כספי, נגישות, אחריות ציוד ותקלות טכניות.",
  slug: "terms",
});

export default function TermsPage() {
  return <LegalPageLayout {...TERMS_PAGE} currentHref="/terms" />;
}
