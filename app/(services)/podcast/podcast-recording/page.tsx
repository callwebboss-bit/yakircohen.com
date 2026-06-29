import PodcastRecordingPageContent from "@/components/seo/PodcastRecordingPageContent";
import { constructMetadata } from "@/lib/metadata";

export const metadata = constructMetadata({
  title: "צילום והקלטת פודקאסט | הפקה מלאה  -  פרק מוכן תוך 24 שעות",
  description:
    "הפקת פודקאסט מלאה במודיעין. צילום 4K, סאונד אולפני ועריכה - מוכן לספוטיפיי ויוטיוב.",
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
