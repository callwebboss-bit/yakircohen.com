import type { Metadata } from "next";
import OnlineMixingPageContent from "@/components/seo/OnlineMixingPageContent";
import { constructMetadata } from "@/lib/metadata";

export const metadata: Metadata = constructMetadata({
  title: "מיקס ומאסטרינג מרחוק",
  description:
    "מיקס ומאסטרינג לשיר שהוקלט בבית - 500 ₪, עד 16 ערוצים, 5 דקות. מאושר אישית. MP3+WAV תוך 5-7 ימים. סבב תיקונים כלול.",
  slug: "online/vocal-fix/mixing",
  keywords: [
    "מיקס ומאסטרינג",
    "מיקס מרחוק",
    "מאסטרינג שיר",
    "מיקס הקלטה ביתית",
    "מיקס stems",
  ],
});

export default function MixingPage() {
  return <OnlineMixingPageContent />;
}
