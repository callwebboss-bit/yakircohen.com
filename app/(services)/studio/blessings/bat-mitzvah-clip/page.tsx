import type { Metadata } from "next";
import BatMitzvahClipPageContent from "@/components/seo/BatMitzvahClipPageContent";
import { constructMetadata } from "@/lib/metadata";
import { buildMetaDescription } from "@/lib/seo/share-description";

export const metadata: Metadata = constructMetadata({
  title: "קליפ בת מצווה - תמונות ילדות וקליפ מהאולפן | מודיעין",
  description: buildMetaDescription(
    "קליפ לבת מצווה במודיעין.",
    "שילוב תמונות ילדות, סרטונים מהבית והקלטה באולפן - שיר אישי, צילום ועריכה. גם כשובר מתנה.",
  ),
  slug: "studio/blessings/bat-mitzvah-clip",
  keywords: [
    "קליפ בת מצווה",
    "קליפ לבת מצווה",
    "מתנה לבת מצווה",
    "תמונות ילדות בקליפ",
    "הקלטת שיר בת מצווה",
    "אולפן בת מצווה מודיעין",
    "קליפ מוזיקלי בת מצווה",
    "שובר מתנה בת מצווה",
  ],
});

export default function BatMitzvahClipPage() {
  return <BatMitzvahClipPageContent />;
}
