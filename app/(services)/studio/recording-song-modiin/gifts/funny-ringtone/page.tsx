import type { Metadata } from "next";
import FunnyRingtonePageContent from "@/components/seo/FunnyRingtonePageContent";
import { constructMetadata } from "@/lib/metadata";
import { buildMetaDescription } from "@/lib/seo/share-description";

export const metadata: Metadata = constructMetadata({
  title: "רינגטון מצחיק במתנה | 299 ₪ מבצע",
  description: buildMetaDescription(
    "רינגטון מצחיק במתנה ממודיעין.",
    "299 ₪ מבצע - הקלטה, עיבוד וקובץ מוכן ל-iPhone ו-Android. שמעו לפני/אחרי והזמינו בוואטסאפ או בטופס.",
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
