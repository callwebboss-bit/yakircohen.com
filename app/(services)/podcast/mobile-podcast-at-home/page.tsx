import MobilePodcastAtHomePageContent from "@/components/seo/MobilePodcastAtHomePageContent";
import { constructMetadata } from "@/lib/metadata";

export const metadata = constructMetadata({
  title: "פודקאסט נייד עד הבית | האולפן מגיע אליכם",
  description:
    "פודקאסט נייד עד הבית  -  יקיר כהן הפקות מביאה את האולפן אליכם. הקלטה בבית, במשרד או באירוע עם ציוד מקצועי ומהנדס סאונד. הגעה לכל הארץ.",
  slug: "podcast/mobile-podcast-at-home",
  keywords: [
    "פודקאסט נייד עד הבית",
    "הקלטת פודקאסט בבית",
    "אולפן נייד",
    "פודקאסט במשרד",
    "הקלטה ניידת",
  ],
});

export default function MobilePodcastAtHomePage() {
  return <MobilePodcastAtHomePageContent />;
}
