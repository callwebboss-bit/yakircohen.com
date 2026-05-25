import PodcastHubPageContent from "@/components/seo/PodcastHubPageContent";
import { constructMetadata } from "@/lib/metadata";

export const metadata = constructMetadata({
  title: "הפקת פודקאסט מלאה במודיעין | פרק מוכן תוך 24 שעות",
  description:
    "הפקת פודקאסט מלאה  -  צילום 4K, הקלטה אולפנית ועריכה מקצועית. מגיעים, בוחרים חלל, מדברים  -  ויוצאים עם פרק מוכן לספוטיפיי ויוטיוב. החל מ-750 ₪.",
  slug: "podcast",
  keywords: [
    "הפקת פודקאסט",
    "אולפן פודקאסט מודיעין",
    "הקלטת פודקאסט",
    "פודקאסט וידאו",
    "עריכת פודקאסט",
    "אולפן 4K",
  ],
});

export default function PodcastHubPage() {
  return <PodcastHubPageContent />;
}
