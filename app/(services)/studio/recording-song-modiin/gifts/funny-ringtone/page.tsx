import type { Metadata } from "next";
import FunnyRingtonePageContent from "@/components/seo/FunnyRingtonePageContent";
import { constructMetadata } from "@/lib/metadata";
import { buildMetaDescription } from "@/lib/seo/share-description";
import { RINGTONE_PRICE_LABEL } from "@/lib/data/funny-ringtone-page";

export const metadata: Metadata = constructMetadata({
  title: `רינגטון מצחיק במתנה | ${RINGTONE_PRICE_LABEL}`,
  description: buildMetaDescription(
    "רינגטון מצחיק במתנה ממודיעין.",
    `${RINGTONE_PRICE_LABEL}: הקלטה, עיבוד וקובץ מוכן ל-iPhone ו-Android. שמעו לפני/אחרי והזמינו בוואטסאפ או בטופס.`,
  ),
  slug: "studio/recording-song-modiin/gifts/funny-ringtone",
  keywords: [
    "רינגטון מצחיק",
    "רינגטון מתנה",
    "רינגטון אישי",
    "מתנה ליום הולדת",
    "מתנה לחבר",
    "רינגטון יום הולדת",
    "מתנה מקורית",
    "רינגטון מודיעין",
    "שובר מתנה אולפן",
  ],
});

export default function FunnyRingtonePage() {
  return <FunnyRingtonePageContent />;
}
