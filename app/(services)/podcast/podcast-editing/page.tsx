import PodcastEditingPageContent from "@/components/seo/PodcastEditingPageContent";
import { constructMetadata } from "@/lib/metadata";

export const metadata = constructMetadata({
  title: "עריכת פודקאסט מקצועית | מההקלטה הגולמית לפרק מוכן",
  description:
    "עריכת פודקאסט כשירות נפרד. ניקוי רעשים, חיתוך ומיקס - MP3 מוכן להעלאה. בלי סשן אולפן חדש.",
  slug: "podcast/podcast-editing",
  keywords: [
    "עריכת פודקאסט",
    "עריכת פודקאסט מקצועית",
    "ניקוי רעשים",
    "פוסט פרודקשן פודקאסט",
    "עריכת אודיו",
    "מיקס פודקאסט",
  ],
});

export default function PodcastEditingPage() {
  return <PodcastEditingPageContent />;
}
