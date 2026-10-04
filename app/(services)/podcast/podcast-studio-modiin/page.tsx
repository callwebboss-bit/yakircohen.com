import PodcastStudioModiinPageContent from "@/components/seo/PodcastStudioModiinPageContent";
import { constructMetadata } from "@/lib/metadata";

export const metadata = constructMetadata({
  title: "הקלטת פודקאסט במודיעין | קריינות אנושית - מקום, בדרך כלל תוך 24 שעות",
  description:
    "אולפן לפודקאסט וקריינות אנושית במודיעין. ציוד מקצועי, ליווי טכני מלא וקביעת מקום, בדרך כלל תוך 24 שעות. ללא AI-רובוטי - קול נקי, אנושי ומרשים. מירושלים, המרכז ומודיעין.",
  slug: "podcast/podcast-studio-modiin",
  keywords: [
    "הקלטת פודקאסט מודיעין",
    "קריינות אנושית לפודקאסט מודיעין",
    "תיקון זיופים מקצועי",
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
