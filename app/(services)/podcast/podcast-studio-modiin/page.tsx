import PodcastStudioModiinPageContent from "@/components/seo/PodcastStudioModiinPageContent";
import { constructMetadata } from "@/lib/metadata";

export const metadata = constructMetadata({
  title: "הקלטת פודקאסט במודיעין | קריינות אנושית - מקום, בדרך כלל תוך שעה",
  /* אישור הבעלים 8.10.2026: התיאור כמו העמוד, השכרת האולפן במילים שלו (היה: קריינות אנושית, "ללא AI-רובוטי") */
  description:
    "השכרת אולפן פודקאסט במודיעין: אולפן נקי, שקט ונוח, ליד פארקים גדולים, עם חניה בשפע. עד 4 מיקרופונים, 3 מצלמות וליווי טכני מלא. קביעת מקום בדרך כלל תוך שעה.",
  slug: "podcast/podcast-studio-modiin",
  keywords: [
    "הקלטת פודקאסט מודיעין",
    "קריינות אנושית לפודקאסט מודיעין",
    "השכרת סטודיו לפודקאסט במודיעין",
    "אולפן פודקאסט מודיעין",
    "סטודיו להשכרה מודיעין",
    "אולפן הקלטות מודיעין",
    "קריינות מקצועית מודיעין",
  ],
});

export default function PodcastStudioModiinPage() {
  return <PodcastStudioModiinPageContent />;
}
