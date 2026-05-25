import type { Metadata } from "next";
import LegalPageLayout from "@/components/legal/LegalPageLayout";
import { PRIVACY_PAGE } from "@/lib/data/legal/privacy-content";
import { constructMetadata } from "@/lib/metadata";

export const metadata: Metadata = constructMetadata({
  title: "מדיניות פרטיות",
  description:
    "מדיניות הפרטיות של יקיר כהן הפקות - איסוף מידע, שימוש בטפסים, תשלומים חיצוניים ובקשות נגישות.",
  slug: "privacy",
});

export default function PrivacyPage() {
  return <LegalPageLayout {...PRIVACY_PAGE} currentHref="/privacy" />;
}
