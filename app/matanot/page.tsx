import type { Metadata } from "next";
import MatanotPageContent from "@/components/seo/MatanotPageContent";
import { constructMetadata } from "@/lib/metadata";

export const metadata: Metadata = constructMetadata({
  title: "מתנה מוקלטת לפי אירוע | חתונה, יום הולדת, בר מצווה ויום נישואין",
  description:
    "מתנה מוקלטת לפי סוג האירוע - שיר, ברכה או פודקאסט אישי לחתונה, יום הולדת, בר/בת מצווה ויום נישואין. אולפן במודיעין עם אפשרות למארזי מתנה.",
  slug: "matanot",
  keywords: [
    "מתנה מוקלטת",
    "מתנה לחתונה",
    "מתנה ליום הולדת",
    "מתנה לבר מצווה",
    "מתנה לבת מצווה",
    "מתנה ליום נישואין",
    "שיר במתנה",
    "ברכה מוקלטת במתנה",
    "מארז מתנה מוקלט",
  ],
});

export default function MatanotPage() {
  return <MatanotPageContent />;
}
