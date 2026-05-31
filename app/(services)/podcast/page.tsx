import PodcastHubPageContent from "@/components/seo/PodcastHubPageContent";
import { constructMetadata } from "@/lib/metadata";

export const metadata = constructMetadata({
  title: "אולפן פודקאסט מקצועי במודיעין | הקלטת פודקאסט ושיפור סאונד - יקיר כהן הפקות",
  description:
    "הקלטת פודקאסט באולפן מקצועי במודיעין — שיפור הקלטות, עריכה מקצועית ומסירה תוך 24 שעות. החל מ-750 ₪. מגיעים, מדברים, ויוצאים עם פרק מוכן לספוטיפיי.",
  slug: "podcast",
  keywords: [
    "אולפן פודקאסט",
    "הקלטת פודקאסט",
    "אולפן פודקאסט מודיעין",
    "הקלטת פודקאסט מודיעין",
    "שיפור הקלטות",
    "פודקאסט משפחתי",
    "עריכת פודקאסט",
    "פודקאסט וידאו",
  ],
});

export default function PodcastHubPage() {
  return <PodcastHubPageContent />;
}
