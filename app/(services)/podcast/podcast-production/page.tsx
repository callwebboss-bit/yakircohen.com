import PodcastProductionPageContent from "@/components/seo/PodcastProductionPageContent";
import { constructMetadata } from "@/lib/metadata";

export const metadata = constructMetadata({
  title: "הפקת פודקאסט מא׳ עד ת׳ | ליווי מקצועי",
  description:
    "ליווי והפקת פודקאסט משלב הרעיון: אפיון פורמט, עריכת תסריט, מיתוג, הפצה ל-Spotify ו-Apple Podcasts וצמיחה לטווח ארוך  -  במודיעין ולכל הארץ. החל מ-750 ₪ לפרק קצר.",
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
