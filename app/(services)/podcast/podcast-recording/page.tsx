import PodcastRecordingPageContent from "@/components/seo/PodcastRecordingPageContent";
import { constructMetadata } from "@/lib/metadata";

export const metadata = constructMetadata({
  title: "הפקת פודקאסט מקצועית במודיעין | צילום 4K וסאונד אולפני",
  description:
    "רוצים פודקאסט מקצועי בלי להתעסק בציוד? מגיעים, מדברים, והפרק אצלכם באותה שנייה שמסיימים להקליט. צילום 4K וסאונד אולפני במודיעין.",
  slug: "podcast/podcast-recording",
  keywords: [
    "צילום והקלטת פודקאסט",
    "הפקת פודקאסט מלאה",
    "פודקאסט וידאו מודיעין",
    "אולפן פודקאסט",
    "הקלטת פודקאסט",
    "איך להקליט פודקאסט",
    "כמה עולה להקליט פודקאסט",
  ],
});

export default function PodcastRecordingPage() {
  return <PodcastRecordingPageContent />;
}
