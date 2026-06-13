import PodcastProductionPageContent from "@/components/seo/PodcastProductionPageContent";
import { constructMetadata } from "@/lib/metadata";

export const metadata = constructMetadata({
  title: "הפקת פודקאסט מא׳ עד ת׳ | ליווי מקצועי",
  description:
    "הפקת פודקאסט מלווה במודיעין. אפיון, מיתוג והפצה לספוטיפיי ואפל — לכל הארץ.",
  slug: "podcast/podcast-production",
  keywords: [
    "הפקת פודקאסט",
    "ליווי פודקאסט",
    "הפצת פודקאסט",
    "Spotify",
    "Apple Podcasts",
  ],
});

export default function PodcastProductionPage() {
  return <PodcastProductionPageContent />;
}
