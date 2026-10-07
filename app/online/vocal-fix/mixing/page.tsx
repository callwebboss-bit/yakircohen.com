import type { Metadata } from "next";
import OnlineMixingPageContent from "@/components/seo/OnlineMixingPageContent";
import { constructMetadata } from "@/lib/metadata";
import { getExVat } from "@/lib/data/pricing-catalog";

export const metadata: Metadata = constructMetadata({
  title: "מיקס ומאסטרינג מרחוק",
  /* D73: המספר מהקטלוג (online_home_mix). הטקסט עצמו לא השתנה, כי שינוי תיאור
     עובר באישור הבעלים ב-audit:seo-diff */
  description: `מיקס ומאסטרינג לשיר שהוקלט בבית - ${getExVat("online_home_mix")} ₪, עד 16 ערוצים, 5 דקות. מאושר אישית. MP3+WAV תוך 5-7 ימים. סבב תיקונים כלול.`,
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
