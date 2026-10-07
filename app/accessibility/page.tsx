import type { Metadata } from "next";
import LegalPageLayout from "@/components/legal/LegalPageLayout";
import { ACCESSIBILITY_PAGE } from "@/lib/data/legal/accessibility-content";
import { constructMetadata } from "@/lib/metadata";

export const metadata: Metadata = constructMetadata({
  title: "הצהרת נגישות",
  description:
    "הצהרת נגישות של יקיר כהן הפקות: עמידה חלקית בת\"י 5568 ברמה AA, מה נגיש כיום, מגבלות ידועות, פרטי רכז הנגישות ודרכי פנייה.",
  slug: "accessibility",
});

export default function AccessibilityPage() {
  return <LegalPageLayout {...ACCESSIBILITY_PAGE} currentHref="/accessibility" />;
}
