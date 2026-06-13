import type { Metadata } from "next";
import EventIndexPageContent from "@/components/marketing/EventIndexPageContent";
import { constructMetadata } from "@/lib/metadata";

export const metadata: Metadata = constructMetadata({
  title: "דופק השוק - מחירים וביקוש באירועים",
  description:
    "מדד שבועי למחירים וביקוש באירועים בישראל - ממוצעי סגירה, מגמות אטרקציות, חבילת 3 אטרקציות למפיקים והשוואת מחירי ספק. מנוי לספקים ומפיקים.",
  slug: "pro/event-index",
  keywords: [
    "מחירון אירועים",
    "ביקוש אטרקציות",
    "הגברה לאירועים",
    "מגמות שוק אירועים",
    "מחירי ספקי אירועים",
    "חבילת אטרקציות למפיקים",
    "מחירון ספקים",
  ],
});

export default function EventIndexPage() {
  return <EventIndexPageContent />;
}
