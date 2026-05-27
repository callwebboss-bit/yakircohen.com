import EventsHostFaqPageContent from "@/components/seo/EventsHostFaqPageContent";
import { constructMetadata } from "@/lib/metadata";

export const metadata = constructMetadata({
  title: "שאלות ותשובות - מנחה אירועים",
  description:
    "מתי צריך מנחה, תכנון ערב, שילוב עם DJ והזמנה מקוונת - תשובות וקישורים לשירותי אירועים.",
  slug: "events/host/faq",
  keywords: [
    "מנחה אירועים שאלות",
    "MC לחתונה",
    "הנחיית אירוע",
    "הזמנת אירועים",
  ],
});

export default function EventsHostFaqPage() {
  return <EventsHostFaqPageContent />;
}
