import type { Metadata } from "next";
import OnlinePageContent from "@/components/seo/OnlinePageContent";
import { constructMetadata } from "@/lib/metadata";

export const metadata: Metadata = constructMetadata({
  title: "שירותי עריכה ושיפור אודיו Online & AI | יקיר כהן הפקות",
  description:
    "עריכת ברכות, ניקוי רעשים, מיקס, הצלת הקלטות ו-AI מרחוק. שליחת קובץ בוואטסאפ, מסירה תוך 24-48 שעות. בדיקה והצעת מחיר ללא עלות.",
  slug: "online",
  keywords: [
    "עריכת אודיו מרחוק",
    "שיפור הקלטה",
    "ניקוי רעשים",
    "שירותי AI לאודיו",
    "אולפן מקוון",
  ],
});

export default function OnlinePage() {
  return <OnlinePageContent />;
}
