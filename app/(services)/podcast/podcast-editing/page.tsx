import PodcastEditingPageContent from "@/components/seo/PodcastEditingPageContent";
import { constructMetadata } from "@/lib/metadata";

export const metadata = constructMetadata({
  title: "עריכת פודקאסט מלאה | מההקלטה הגולמית לפרק מושלם",
  description:
    "עריכת פודקאסט מקצועית  -  ניקוי רעשים, שיפור קול, חיתוך, איזון עוצמות, מוזיקה וסנכרון מיקרופונים. MP3 מוכן לפרסום. סבב תיקונים כלול.",
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
