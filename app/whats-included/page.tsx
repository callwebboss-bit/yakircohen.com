import type { Metadata } from "next";
import LegalPageLayout from "@/components/legal/LegalPageLayout";
import FaqPageSchema from "@/components/seo/FaqPageSchema";
import { INCLUDED_FAQ, INCLUDED_PAGE } from "@/lib/data/legal/included-content";
import { constructMetadata } from "@/lib/metadata";

export const metadata: Metadata = constructMetadata({
  title: "מה כלול במחיר",
  description:
    "מה כלול ומה לא כלול בכל שירות, כמה סבבי תיקונים יש, דוגמה חינם לפני תשלום באונליין, קבצים, זמנים, ביטול ותקלה. כדי שתדעו בדיוק על מה אתם משלמים.",
  slug: "whats-included",
});

export default function WhatsIncludedPage() {
  return (
    <>
      <FaqPageSchema items={[...INCLUDED_FAQ]} />
      <LegalPageLayout {...INCLUDED_PAGE} currentHref="/whats-included" />
    </>
  );
}
