import type { Metadata } from "next";
import StutteringPageContent from "@/components/seo/StutteringPageContent";
import { constructMetadata } from "@/lib/metadata";

export const metadata: Metadata = constructMetadata({
  title: "טיפול בגמגום | ליווי מקצועי במודיעין",
  description:
    "ליווי לגמגום בגישה רגישה - ילדים, נוער ומבוגרים. שיטת NeverMind, קליניקה וקורס באולפן במודיעין.",
  slug: "stuttering",
  keywords: ["גמגום", "טיפול בגמגום", "קורס גמגום מודיעין"],
});

export default function StutteringPage() {
  return <StutteringPageContent />;
}
