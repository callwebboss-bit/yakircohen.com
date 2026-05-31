import type { Metadata } from "next";
import StutteringPageContent from "@/components/seo/StutteringPageContent";
import { constructMetadata } from "@/lib/metadata";

export const metadata: Metadata = constructMetadata({
  title: "טיפול בגמגום ילדים ומבוגרים | שיטת NeverMind | יקיר כהן הפקות",
  description:
    "ליווי אישי לגמגום — ילדים, נוער ומבוגרים. שיטת NeverMind: נשימה, ביטחון עצמי ודיבור חופשי. תרגול מציאותי מול מיקרופון באולפן במודיעין.",
  slug: "stuttering",
  keywords: [
    "טיפול בגמגום",
    "גמגום ילדים",
    "גמגום מבוגרים",
    "הפסקת גמגום",
    "NeverMind גמגום",
    "קורס גמגום מודיעין",
    "ליווי גמגום",
  ],
});

export default function StutteringPage() {
  return <StutteringPageContent />;
}
