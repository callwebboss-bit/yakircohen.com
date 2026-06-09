import PodcastFaqPageContent from "@/components/seo/PodcastFaqPageContent";
import FaqPageSchema from "@/components/seo/FaqPageSchema";
import { constructMetadata } from "@/lib/metadata";
import { PODCAST_FAQ_SECTIONS } from "@/lib/data/podcast-faq-page";

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

const schemaItems = PODCAST_FAQ_SECTIONS.flatMap((s) =>
  s.items
    .filter((item) => typeof item.answer === "string")
    .map((item) => ({ question: item.question, answer: item.answer as string })),
);

export default function PodcastFaqPage() {
  return (
    <>
      <FaqPageSchema items={schemaItems} />
      <PodcastFaqPageContent />
    </>
  );
}
