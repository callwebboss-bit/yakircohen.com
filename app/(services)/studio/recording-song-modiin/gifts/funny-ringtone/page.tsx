import type { Metadata } from "next";
import FunnyRingtonePageContent from "@/components/seo/FunnyRingtonePageContent";
import { constructMetadata } from "@/lib/metadata";

export const metadata: Metadata = constructMetadata({
  title: "רינגטון מצחיק במתנה | 299 ש\"ח מבצע",
  description:
    "מתנה מקורית ליום הולדת או הפתעה לחבר - רינגטון מצחיק אישי, מעובד באולפן, מוכן להתקנה. שמעו לפני ואחרי והזמינו בוואטסאפ או בטופס.",
  slug: "studio/recording-song-modiin/gifts/funny-ringtone",
  keywords: [
    "רינגטון מצחיק",
    "רינגטון מתנה",
    "רינגטון אישי",
    "מתנה ליום הולדת",
    "מתנה לחבר",
    "רינגטון יום הולדת",
    "מתנה מקורית",
  ],
});

export default function FunnyRingtonePage() {
  return <FunnyRingtonePageContent />;
}
