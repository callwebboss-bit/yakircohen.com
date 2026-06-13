import PodcastStudioModiinPageContent from "@/components/seo/PodcastStudioModiinPageContent";
import { constructMetadata } from "@/lib/metadata";

export const metadata = constructMetadata({
  title: "השכרת סטודיו לפודקאסט במודיעין",
  description:
    "השכרת אולפן פודקאסט במודיעין. חדר מבודד, ציוד מקצועי וליווי טכני - מירושלים והמרכז.",
  slug: "podcast/podcast-studio-modiin",
  keywords: [
    "השכרת סטודיו לפודקאסט במודיעין",
    "אולפן פודקאסט מודיעין",
    "הקלטת פודקאסט מודיעין",
    "סטודיו להשכרה מודיעין",
    "אולפן הקלטות מודיעין",
  ],
});

export default function PodcastStudioModiinPage() {
  return <PodcastStudioModiinPageContent />;
}
