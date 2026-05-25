import type { Metadata } from "next";
import OnlinePitchCorrectionPageContent from "@/components/seo/OnlinePitchCorrectionPageContent";
import { constructMetadata } from "@/lib/metadata";

export const metadata: Metadata = constructMetadata({
  title: "תיקון זיופים (Pitch Correction) | יקיר כהן הפקות",
  description:
    "תיקון זיופים טבעי ב-Melodyne ו-Auto-Tune - בלי סאונד רובוטי. עד 4 דקות, אספקה 3-5 ימים. דוגמת לפני/אחרי חינם. גם הקלטות ביתיות.",
  slug: "online/vocal-fix/pitch-correction",
  keywords: [
    "תיקון זיופים",
    "Pitch Correction",
    "Auto-Tune",
    "Melodyne",
    "תיקון שיר מרחוק",
  ],
});

export default function PitchCorrectionPage() {
  return <OnlinePitchCorrectionPageContent />;
}
