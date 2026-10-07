import type { Metadata } from "next";
import OnlineVocalFixPageContent from "@/components/seo/OnlineVocalFixPageContent";
import { constructMetadata } from "@/lib/metadata";
import { getExVat } from "@/lib/data/pricing-catalog";

export const metadata: Metadata = constructMetadata({
  title: "תיקון זיופים ושיפור קול מרחוק | יקיר כהן",
  /* D75: המספר מהקטלוג (vocal_fix_short). הטקסט עצמו לא השתנה, כי שינוי תיאור
     עובר באישור הבעלים ב-audit:seo-diff */
  description: `הפכו הקלטה ביתית לאיכות אולפן: הסרת רעשים, חידוד והעשרת קול. ${getExVat("vocal_fix_short")} ₪ עד 5 דקות. אספקה 1-3 ימים. סקיצה לפני/אחרי חינם.`,
  slug: "online/vocal-fix",
  keywords: [
    "שיפור קול",
    "ניקוי רעשים",
    "עריכת פודקאסט מרחוק",
    "שיפור הקלטה בטלפון",
    "vocal fix",
  ],
});

export default function VocalFixPage() {
  return <OnlineVocalFixPageContent />;
}
