import type { Metadata } from "next";
import ProfessionalVoiceoverPageContent from "@/components/business/ProfessionalVoiceoverPageContent";
import { constructMetadata } from "@/lib/metadata";

export const metadata: Metadata = constructMetadata({
  title: "קריינות לסט DJ | חבילת 5 משפטים | יקיר כהן הפקות",
  description:
    "קריינות מקצועית לסט DJ: 5 משפטים קצרים, הקלטה באולפן, קובץ MP3 מוכן. מיתוג, הבלטה וחוויית קהל מושלמת.",
  slug: "business/professional-voiceover",
  keywords: [
    "קריינות לסט",
    "קריינות DJ",
    "קריינות מקצועית",
    "מיתוג DJ",
    "הקלטת קריינות",
  ],
});

export default function ProfessionalVoiceoverPage() {
  return <ProfessionalVoiceoverPageContent />;
}
