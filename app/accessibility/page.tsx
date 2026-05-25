import type { Metadata } from "next";
import LegalPageLayout from "@/components/legal/LegalPageLayout";
import { ACCESSIBILITY_PAGE } from "@/lib/data/legal/accessibility-content";
import { constructMetadata } from "@/lib/metadata";

export const metadata: Metadata = constructMetadata({
  title: "הצהרת נגישות",
  description:
    "הצהרת נגישות של יקיר כהן הפקות - WCAG 2.1 AA, ניווט מקלדת, טפסים נגישים ודרכי פנייה לבקשת סיוע.",
  slug: "accessibility",
});

export default function AccessibilityPage() {
  return <LegalPageLayout {...ACCESSIBILITY_PAGE} currentHref="/accessibility" />;
}
