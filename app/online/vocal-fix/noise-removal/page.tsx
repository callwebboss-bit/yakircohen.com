import type { Metadata } from "next";
import OnlineNoiseRemovalPageContent from "@/components/seo/OnlineNoiseRemovalPageContent";
import { constructMetadata } from "@/lib/metadata";
import { buildFaqSchema } from "@/lib/seo/page-schema";

export const metadata: Metadata = constructMetadata({
  title: "ניקוי רעשים מקצועי אונליין | יקיר כהן",
  description:
    "מזגן, רחש, רוח ברקע? שירות מקצועי להסרת רעשי רקע לקטעים של עד 5 דקות. שלחו קובץ וקבלו אודיו נקי ומוכן לפרסום ב-500 ₪ (לפני מע\"מ).",
  slug: "online/vocal-fix/noise-removal",
  keywords: [
    "ניקוי רעשים",
    "הסרת רעשי רקע",
    "noise removal אונליין",
    "ניקוי מזגן מהקלטה",
    "שיפור הקלטה ביתית",
    "עריכת סאונד מרחוק",
  ],
});

const FAQ_SCHEMA = buildFaqSchema([
  {
    question: "כמה עולה שירות ניקוי רעשים?",
    answer: "עלות השירות לניקוי רעשי רקע מקטע של עד 5 דקות היא 500 ₪ לפני מע\"מ (590 ₪ כולל מע\"מ).",
  },
  {
    question: "האם הניקוי ישמע מלאכותי?",
    answer: "לא. ניקוי שנעשה נכון שמור על הקול הטבעי לחלוטין. אנחנו עובדים בשכבות ובעדינות, כדי שהתוצאה תישמע מקצועית ולא \"לחוצה\".",
  },
  {
    question: "אילו סוגי רעשים אפשר להסיר?",
    answer: "מזגן, מאוורר, רחש חשמלי, ציפורים, רוח, רעש רחוב ועוד. שלחו קובץ ונגיד מראש מה ריאלי לפני שמתחילים.",
  },
  {
    question: "אילו פורמטים מתקבלים?",
    answer: "MP3, WAV, M4A, MP4. אפשר לשלוח ישירות בוואטסאפ, קישור ל-Google Drive, Dropbox - מה שנוח לכם.",
  },
]);

export default function NoiseRemovalPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_SCHEMA) }}
      />
      <OnlineNoiseRemovalPageContent />
    </>
  );
}
