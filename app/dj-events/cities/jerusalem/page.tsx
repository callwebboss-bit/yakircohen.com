import type { Metadata } from "next";
import DjJerusalemPageContent from "@/components/seo/DjJerusalemPageContent";
import { constructMetadata } from "@/lib/metadata";

export const metadata: Metadata = constructMetadata({
  title: "דיג׳יי לאירועים בירושלים | ניהול מוזיקלי לאירועים דתיים ומעורבים | יקיר כהן הפקות",
  description:
    "ניהול מוזיקלי ותקלוט לאירועים בירושלים - חתונות, בר/בת מצווה, אירועי חברה. מפרט טכני קבוע, עבודה ישירה מול יקיר כהן או תקליטן מנוסה מהצוות.",
  slug: "dj-events/cities/jerusalem",
  keywords: [
    "דיגגיי בירושלים",
    "תקליטן לחתונה ירושלים",
    "DJ לאירועים בירושלים",
    "תקליטן דתי ירושלים",
    "ניהול מוזיקלי ירושלים",
    "דיגגיי לבר מצווה ירושלים",
  ],
});

export default function DjJerusalemPage() {
  return <DjJerusalemPageContent />;
}
