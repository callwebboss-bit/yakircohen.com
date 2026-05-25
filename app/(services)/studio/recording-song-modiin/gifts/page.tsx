import type { Metadata } from "next";
import StudioGiftsPageContent from "@/components/seo/StudioGiftsPageContent";
import { constructMetadata } from "@/lib/metadata";

export const metadata: Metadata = constructMetadata({
  title: "מתנות מהאולפן ושוברי מתנה | הקלטות, פודקאסט עם סבא, בת מצווה",
  description:
    "שובר מתנה לכל שירות באולפן - לא ממחיר קבוע. פודקאסט עם סבא, שיר ליום הולדת, קליפ לבת/בר מצווה, ברכות ועוד. וידאו ליד כל רעיון והזמנה בוואטסאפ.",
  slug: "studio/recording-song-modiin/gifts",
  keywords: [
    "שובר מתנה אולפן",
    "מתנה מהאולפן",
    "פודקאסט עם סבא מתנה",
    "שיר מתנה יום הולדת",
    "קליפ בת מצווה",
    "מתנה לבת מצווה",
    "הקלטת שיר במתנה",
    "מתנה משפחתית",
  ],
});

export default function StudioGiftsPage() {
  return <StudioGiftsPageContent />;
}
