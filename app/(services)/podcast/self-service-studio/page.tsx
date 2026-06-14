import type { Metadata } from "next";
import PodcastSelfServicePageContent from "@/components/seo/PodcastSelfServicePageContent";
import { constructMetadata } from "@/lib/metadata";

export const metadata: Metadata = constructMetadata({
  title: "השכרת אולפן פודקאסט שירות עצמי",
  description: "650 ₪ לשעה (לפני מע״מ). מגיעים עם לפטופ, מקליטים, לוקחים קבצים גולמיים. בלי עריכה.",
  slug: "podcast/self-service-studio",
  keywords: [
    "השכרת אולפן פודקאסט",
    "אולפן שירות עצמי",
    "הקלטת פודקאסט DIY",
    "אולפן שירות עצמי מודיעין",
    "השכרת סטודיו לשעה",
  ],
});

export default function SelfServiceStudioPage() {
  return <PodcastSelfServicePageContent />;
}
