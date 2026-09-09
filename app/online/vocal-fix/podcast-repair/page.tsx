import type { Metadata } from "next";
import PodcastSoundRepairPageContent, {
  FAQ_ITEMS,
} from "@/components/seo/PodcastSoundRepairPageContent";
import { constructMetadata } from "@/lib/metadata";
import { buildFaqSchema } from "@/lib/seo/page-schema";
import { getExVat } from "@/lib/data/pricing-catalog";

const PRICE_EX_VAT = getExVat("noise_removal_segment");

export const metadata: Metadata = constructMetadata({
  /* בלי סיומת מותג: constructMetadata מוסיף אותה, ו-normalizeTitle מסיר רק
     את השם המלא, ולכן "| יקיר כהן" חלקי היה נשאר וגורם למותג כפול בתוצאות. */
  title: "תיקון סאונד פודקאסט מרחוק",
  description: `תיקון סאונד לפרק פודקאסט קיים: ניקוי רעשים, איזון ווליום ו-EQ. קטע מ-${PRICE_EX_VAT.toLocaleString("he-IL")} ₪ לפני מע״מ, סקיצה ראשונית חינם. שולחים קובץ ומקבלים אותו מוכן להעלאה.`,
  slug: "online/vocal-fix/podcast-repair",
  keywords: [
    "תיקון סאונד פודקאסט",
    "שיפור סאונד פודקאסט",
    "ניקוי רעשים פודקאסט",
    "תיקון הקלטת פודקאסט",
    "עריכת סאונד פודקאסט מרחוק",
    "איזון ווליום פודקאסט",
    "שחזור אודיו פודקאסט",
  ],
});

/* JSON-LD נגזר מאותו מקור כמו ה-FAQ הגלוי (FAQ_ITEMS) כדי שהסכמה תתאים מילה במילה
   לתוכן שרואים בעמוד - דרישת Google לתוצאות FAQ. */
const FAQ_SCHEMA = buildFaqSchema(
  FAQ_ITEMS.map((item) => ({ question: item.question, answer: item.answer })),
);

export default function PodcastSoundRepairPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_SCHEMA) }}
      />
      <PodcastSoundRepairPageContent />
    </>
  );
}
