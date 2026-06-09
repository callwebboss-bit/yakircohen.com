import EventsEquipmentFaqPageContent from "@/components/seo/EventsEquipmentFaqPageContent";
import FaqPageSchema from "@/components/seo/FaqPageSchema";
import { constructMetadata } from "@/lib/metadata";
import { EVENTS_EQUIPMENT_FAQ_ITEMS } from "@/lib/data/events-equipment-faq-page";

export const metadata = constructMetadata({
  title: "שאלות ותשובות - השכרת הגברה לאירועים",
  description:
    "הגברה לזמרים, DJ, צ'ק סאונד והזמנה מקוונת - תשובות וקישורים לחבילות ולמחשבון.",
  slug: "events/equipment/faq",
  keywords: [
    "השכרת הגברה",
    "הגברה לזמרים שאלות",
    "ציוד לאירועים",
    "הזמנת הגברה",
  ],
});

const schemaItems = EVENTS_EQUIPMENT_FAQ_ITEMS.filter(
  (item) => typeof item.answer === "string",
).map((item) => ({ question: item.question, answer: item.answer as string }));

export default function EventsEquipmentFaqPage() {
  return (
    <>
      <FaqPageSchema items={schemaItems} />
      <EventsEquipmentFaqPageContent />
    </>
  );
}
