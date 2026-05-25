import type { Metadata } from "next";
import DjJerusalemPageContent from "@/components/seo/DjJerusalemPageContent";
import { constructMetadata } from "@/lib/metadata";

export const metadata: Metadata = constructMetadata({
  title: "תקליטן לחתונה בירושלים",
  description:
    "DJ לחתונות ואירועים בירושלים והסביבה - דתי ומעורב, ציוד מקצועי, תיאום עם חופה ואטרקציות. הצעת מחיר בוואטסאפ.",
  slug: "dj-events/cities/jerusalem",
  keywords: [
    "תקליטן לחתונה ירושלים",
    "DJ ירושלים",
    "תקליטן דתי ירושלים",
    "תקליטן לאירועים ירושלים",
  ],
});

export default function DjJerusalemPage() {
  return <DjJerusalemPageContent />;
}
