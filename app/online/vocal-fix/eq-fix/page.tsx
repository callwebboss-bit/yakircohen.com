import type { Metadata } from "next";
import OnlineEqFixPageContent from "@/components/seo/OnlineEqFixPageContent";
import { constructMetadata } from "@/lib/metadata";
import { buildFaqSchema } from "@/lib/seo/page-schema";

export const metadata: Metadata = constructMetadata({
  title: "תיקון תדרים ו-EQ מקצועי אונליין | יקיר כהן",
  description:
    "הסאונד נשמע עמום, צורמני או \"ביתי\"? שירות מקצועי לתיקון תדרים ו-EQ לקטעים של עד 5 דקות. שלחו קובץ וקבלו סאונד ברור ומקצועי ב-500 ₪ (לפני מע\"מ).",
  slug: "online/vocal-fix/eq-fix",
  keywords: [
    "תיקון תדרים",
    "EQ אודיו אונליין",
    "שיפור סאונד ביתי",
    "הסרת צרימה מהקלטה",
    "שיפור קול מקצועי מרחוק",
    "audio EQ online",
  ],
});

const FAQ_SCHEMA = buildFaqSchema([
  {
    question: "כמה עולה שירות תיקון תדרים ו-EQ?",
    answer: "עלות השירות לתיקון תדרים ו-EQ לקטע של עד 5 דקות היא 500 ₪ לפני מע\"מ (590 ₪ כולל מע\"מ).",
  },
  {
    question: "מה זה EQ בשפה פשוטה?",
    answer: "EQ הוא קיצור של Equalizer - כלי לאיזון תדרים. כל קול מורכב מתדרים שונים: בסים, אמצע וחרשים. כשהיחס ביניהם לא נכון, הסאונד נשמע עמום, צורמני או ביתי. תיקון EQ מאזן אותם כך שהסאונד נשמע ברור, חם ומקצועי.",
  },
  {
    question: "האם הקול ישתנה לאחר התיקון?",
    answer: "לא - הקול שלכם ישאר שלכם. המטרה היא שיישמע כאילו הוקלט בתנאים מעולים. מתקנים את הסאונד, לא את הזהות הקולית.",
  },
  {
    question: "אפשר לשלב תיקון EQ עם ניקוי רעשים?",
    answer: "בהחלט - ורוב הלקוחות שלנו עושים את זה. שאלו אותנו בוואטסאפ על חבילה משולבת.",
  },
]);

export default function EqFixPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_SCHEMA) }}
      />
      <OnlineEqFixPageContent />
    </>
  );
}
