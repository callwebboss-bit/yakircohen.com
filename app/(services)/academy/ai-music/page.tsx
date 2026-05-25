import type { Metadata } from "next";
import AiMusicPageContent from "@/components/seo/AiMusicPageContent";
import { constructMetadata } from "@/lib/metadata";

export const metadata: Metadata = constructMetadata({
  title: "קורס AI במוזיקה | לימוד ושירותים בליווי",
  description:
    "פיצול stems, שחזור שיר ישן, מלודיה לשיר מלא, שיפור ווקאל ושירותי AI מקוונים - קורס 1:1 באולפן או בליווי מקצועי. לא DIY לבד.",
  slug: "academy/ai-music",
  keywords: [
    "AI מוזיקה",
    "פיצול stems",
    "שחזור סאונד AI",
    "הפקה עם AI",
    "שירותי AI מקוונים",
    "Suno",
    "Udio",
  ],
});

export default function AiMusicPage() {
  return <AiMusicPageContent />;
}
