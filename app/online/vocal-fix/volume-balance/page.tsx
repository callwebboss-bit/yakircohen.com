import type { Metadata } from "next";
import OnlineVolumeBalancePageContent from "@/components/seo/OnlineVolumeBalancePageContent";
import { constructMetadata } from "@/lib/metadata";
import { buildFaqSchema } from "@/lib/seo/page-schema";

export const metadata: Metadata = constructMetadata({
  title: "איזון ווליום ועוצמות שמע מקצועי אונליין | יקיר כהן",
  description:
    "סובלים מווליום לא אחיד בהקלטה? שירות מקצועי לאיזון עוצמות קול לקטעים של עד 5 דקות. שלחו קובץ וקבלו אודיו מאוזן ומוכן לפרסום ב-500 ₪ (לפני מע\"מ).",
  slug: "online/vocal-fix/volume-balance",
  keywords: [
    "איזון ווליום",
    "איזון עוצמות שמע",
    "נורמליזציה סאונד",
    "תיקון ווליום לא אחיד",
    "שיפור איכות סאונד מרחוק",
    "עריכת סאונד אונליין",
  ],
});

const FAQ_SCHEMA = buildFaqSchema([
  {
    question: "כמה עולה שירות לאיזון ווליום?",
    answer: "עלות השירות לאיזון עוצמות קול לקטע של עד 5 דקות היא 500 ₪ לפני מע\"מ (590 ₪ כולל מע\"מ).",
  },
  {
    question: "תוך כמה זמן אקבל את הקובץ המאוזן?",
    answer: "זמן האספקה עומד לרוב על 1-3 ימי עסקים. עם זאת, קטעי אודיו קצרים מוכנים בדרך כלל הרבה יותר מהר.",
  },
  {
    question: "מה קורה אם קטע האודיו שלי ארוך מ-5 דקות?",
    answer: "במידה וההקלטה שלכם ארוכה מ-5 דקות, אתם מוזמנים לשלוח לנו הודעה בוואטסאפ ולקבל הצעת מחיר מותאמת אישית לפי אורך הקטע.",
  },
]);

export default function VolumeBalancePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_SCHEMA) }}
      />
      <OnlineVolumeBalancePageContent />
    </>
  );
}
