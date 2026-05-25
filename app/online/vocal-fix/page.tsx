import type { Metadata } from "next";
import OnlineVocalFixPageContent from "@/components/seo/OnlineVocalFixPageContent";
import { constructMetadata } from "@/lib/metadata";

export const metadata: Metadata = constructMetadata({
  title: "שיפור קול מהנייד | עריכת אודיו מרחוק",
  description:
    "הפכו הקלטה ביתית לאיכות אולפן: הסרת רעשים, חידוד והעשרת קול. 250 ₪ עד 5 דקות. אספקה 1-3 ימים. סקיצה לפני/אחרי חינם.",
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
