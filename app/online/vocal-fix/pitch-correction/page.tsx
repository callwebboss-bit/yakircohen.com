import type { Metadata } from "next";
import OnlinePitchCorrectionPageContent from "@/components/seo/OnlinePitchCorrectionPageContent";
import { getExVat } from "@/lib/data/pricing-catalog";
import { formatConsumerPriceLine } from "@/lib/data/pricing-display";
import { constructMetadata } from "@/lib/metadata";
import { buildFaqSchema } from "@/lib/seo/page-schema";

export const metadata: Metadata = constructMetadata({
  title: "תיקון זיופים (Pitch Correction) מקצועי מרחוק | יקיר כהן",
  description:
    "תיקון זיופים טבעי ב-Melodyne ו-Auto-Tune - בלי סאונד רובוטי. עד 4 דקות, אספקה 1-3 ימים. דוגמת לפני/אחרי חינם. גם הקלטות ביתיות ומהנייד.",
  slug: "online/vocal-fix/pitch-correction",
  keywords: [
    "תיקון זיופים",
    "Pitch Correction",
    "Auto-Tune",
    "Melodyne",
    "תיקון שיר מרחוק",
  ],
});

const PITCH_FAQ_SCHEMA = buildFaqSchema([
  {
    question: "כמה עולה תיקון זיופים?",
    /* החלטת בעלים 4.10.2026: המחיר הנכון הוא studio_pitch_correction (עד אז "מ-250 ₪", בלי מזהה בקטלוג) */
    answer: `תיקון זיופים עולה ${formatConsumerPriceLine(getExVat("studio_pitch_correction"))} לעד 4 דקות. לשירים ארוכים מעל 4 דקות נוספים 100 ₪.`,
  },
  {
    question: "כמה זמן לוקח תיקון זיופים?",
    answer: "בדרך כלל 1-3 ימי עסקים. בדחיפות ניתן לסגל - שאל ונבדוק זמינות.",
  },
  {
    question: "האם התיקון ישמע מלאכותי?",
    answer: "לא. אנחנו עובדים ידנית עם Melodyne ושומרים על הקול הטבעי, הנשימות והניואנסים. התוצאה נשמעת כאילו הוקלט מושלם מהתחלה.",
  },
  {
    question: "איך שולחים קובץ לתיקון זיופים?",
    answer: "שולחים קובץ WAV, MP3 או M4A ישירות בוואטסאפ, במייל או דרך האתר. אפשר לבקש דמו חינם של 30 שניות לפני ואחרי לפני שמחליטים.",
  },
]);

export default function PitchCorrectionPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(PITCH_FAQ_SCHEMA) }}
      />
      <OnlinePitchCorrectionPageContent />
    </>
  );
}
