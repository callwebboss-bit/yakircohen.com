import type { Metadata } from "next";
import StudioGiftsPageContent from "@/components/seo/StudioGiftsPageContent";
import { constructMetadata } from "@/lib/metadata";
import { buildMetaDescription } from "@/lib/seo/share-description";

export const metadata: Metadata = constructMetadata({
  title: "מתנות מהאולפן ושוברי מתנה | מודיעין",
  description: buildMetaDescription(
    "שובר מתנה לאולפן במודיעין.",
    "פודקאסט עם סבא, שיר ליום הולדת, קליפ לבת/בר מצווה, רינגטון מצחיק - וידאו לכל רעיון והזמנה בוואטסאפ.",
  ),
  slug: "studio/recording-song-modiin/gifts",
  keywords: [
    "שובר מתנה אולפן",
    "מתנה מהאולפן",
    "מתנה מקורית מודיעין",
    "פודקאסט עם סבא מתנה",
    "שיר מתנה יום הולדת",
    "קליפ בת מצווה",
    "מתנה לבת מצווה",
    "הקלטת שיר במתנה",
    "מתנה משפחתית",
    "רינגטון מצחיק במתנה",
  ],
});

export default function StudioGiftsPage() {
  return <StudioGiftsPageContent />;
}
