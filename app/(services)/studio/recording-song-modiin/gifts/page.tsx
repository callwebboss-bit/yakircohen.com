import type { Metadata } from "next";
import StudioGiftsPageContent from "@/components/seo/StudioGiftsPageContent";
import { constructMetadata } from "@/lib/metadata";
import { buildMetaDescription } from "@/lib/seo/share-description";

export const metadata: Metadata = constructMetadata({
  title: "שובר מתנה מהאולפן | לבת מצווה, יום הולדת וחתונה - מסירה 48 שעות",
  description: buildMetaDescription(
    "שובר מתנה מקורי לכל אירוע - הקלטת שיר, קליפ לבת מצווה, פודקאסט עם סבא, רינגטון מצחיק ועוד.",
    "מודיעין, פתח תקווה ואזור המרכז - מסירה דיגיטלית תוך 48 שעות. הזמנה בוואטסאפ.",
  ),
  slug: "studio/recording-song-modiin/gifts",
  keywords: [
    "שובר מתנה מקורי לאירוע",
    "שובר מתנה אולפן הקלטות",
    "מתנה מקורית לבת מצווה",
    "שיר מתנה יום הולדת",
    "מתנה לאירוע פתח תקווה",
    "שובר מתנה אולפן",
    "מתנה מהאולפן",
    "פודקאסט עם סבא מתנה",
    "קליפ בת מצווה",
    "הקלטת שיר במתנה",
    "מתנה משפחתית",
    "רינגטון מצחיק במתנה",
  ],
});

export default function StudioGiftsPage() {
  return <StudioGiftsPageContent />;
}
