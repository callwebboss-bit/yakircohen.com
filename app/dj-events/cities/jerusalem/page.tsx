import type { Metadata } from "next";
import DjJerusalemPageContent from "@/components/seo/DjJerusalemPageContent";
import { constructMetadata } from "@/lib/metadata";

export const metadata: Metadata = constructMetadata({
  title: "די ג'יי לאירועים בירושלים",
  description:
    "די ג'יי לאירועים בירושלים - מוזיקה מותאמת לקהל דתי, מעורב וחילוני. עבודה ישירה עם יקיר כהן או די ג'יי בוגר האקדמיה. ציוד פרימיום וגיבוי מלא.",
  slug: "dj-events/cities/jerusalem",
  keywords: [
    "תקליטן לחתונה ירושלים",
    "DJ ירושלים",
    "תקליטן דתי ירושלים",
    "תקליטן לאירועים ירושלים",
    "די ג'יי לאירועים בירושלים",
  ],
});

export default function DjJerusalemPage() {
  return <DjJerusalemPageContent />;
}
