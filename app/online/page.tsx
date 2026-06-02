import type { Metadata } from "next";
import OnlinePageContent from "@/components/seo/OnlinePageContent";
import { constructMetadata } from "@/lib/metadata";

export const metadata: Metadata = constructMetadata({
  title: "מאגר שירותי AI אונליין | ביצוע מלא מקצה לקצה",
  description:
    "מרכז שירותי AI אונליין: אודיו, פודקאסט, וידאו, תמונה ותוכן עסקי. אתם שולחים חומר, אנחנו מבצעים הכל ומחזירים תוצר מוכן עם ליווי אישי.",
  slug: "online",
  keywords: [
    "שירותי AI אונליין",
    "הפקה מרחוק",
    "עריכת אודיו AI",
    "עריכת פודקאסט אונליין",
    "מאגר שירותים דיגיטליים",
  ],
});

export default function OnlinePage() {
  return <OnlinePageContent />;
}
