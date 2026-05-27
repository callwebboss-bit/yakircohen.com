import EventsEquipmentFaqPageContent from "@/components/seo/EventsEquipmentFaqPageContent";
import { constructMetadata } from "@/lib/metadata";

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

export default function EventsEquipmentFaqPage() {
  return <EventsEquipmentFaqPageContent />;
}
