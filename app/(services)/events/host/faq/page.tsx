import EventsHostFaqPageContent from "@/components/seo/EventsHostFaqPageContent";
import FaqPageSchema from "@/components/seo/FaqPageSchema";
import { constructMetadata } from "@/lib/metadata";
import { EVENTS_HOST_FAQ_ITEMS } from "@/lib/data/events-host-faq-page";

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

const schemaItems = EVENTS_HOST_FAQ_ITEMS.filter(
  (item) => typeof item.answer === "string",
).map((item) => ({ question: item.question, answer: item.answer as string }));

export default function EventsHostFaqPage() {
  return (
    <>
      <FaqPageSchema items={schemaItems} />
      <EventsHostFaqPageContent />
    </>
  );
}
