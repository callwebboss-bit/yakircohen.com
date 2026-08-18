import type { Metadata } from "next";
import LegalPageLayout from "@/components/legal/LegalPageLayout";
import { SUSTAINABILITY_PAGE } from "@/lib/data/legal/sustainability-content";
import { constructMetadata } from "@/lib/metadata";

export const metadata: Metadata = constructMetadata({
  title: "הצהרת מדיניות קיימות",
  description:
    "הצהרת מדיניות קיימות של יקיר כהן הפקות - מסירה דיגיטלית, התנהלות ללא נייר ועבודה מרחוק כשזה מתאים לשירות.",
  slug: "sustainability",
});

export default function SustainabilityPage() {
  return <LegalPageLayout {...SUSTAINABILITY_PAGE} currentHref="/sustainability" />;
}
