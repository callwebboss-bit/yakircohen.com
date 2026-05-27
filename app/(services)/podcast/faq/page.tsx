import PodcastFaqPageContent from "@/components/seo/PodcastFaqPageContent";
import { constructMetadata } from "@/lib/metadata";

export const metadata = constructMetadata({
  title: "שאלות ותשובות - הפקת פודקאסטים במודיעין",
  description:
    "מחירי פודקאסט, השכרת אולפן, הכנה להקלטה, עריכה והפצה לספוטיפיי ויוטיוב - תשובות מלאות עם קישורים לכל שירותי הפודקאסט ולמחשבון מחיר.",
  slug: "podcast/faq",
  keywords: [
    "שאלות פודקאסט",
    "מחיר אולפן פודקאסט",
    "הפצת פודקאסט",
    "הכנה להקלטה",
    "אולפן פודקאסט מודיעין",
    "כמה עולה פודקאסט",
    "עריכת פודקאסט",
  ],
});

export default function PodcastFaqPage() {
  return <PodcastFaqPageContent />;
}
