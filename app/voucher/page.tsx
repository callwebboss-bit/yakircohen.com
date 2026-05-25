import type { Metadata } from "next";
import VoucherPageContent from "@/components/seo/VoucherPageContent";
import { constructMetadata } from "@/lib/metadata";

export const metadata: Metadata = constructMetadata({
  title: "שובר מתנה | אולפן ואירועים",
  description:
    "שובר מתנה לאולפן (מ-750 ₪ חצי שעה), אטרקציות והפקות. מתנה מקורית לחתונה, יום הולדת או כל אירוע. תיאום מהיר בוואטסאפ.",
  slug: "voucher",
  keywords: ["שובר מתנה", "שובר אולפן", "מתנה לאירוע", "שובר חתונה"],
});

export default function VoucherPage() {
  return <VoucherPageContent />;
}
