"use client";

import FAQAccordion from "@/components/ui/FAQAccordion";
import InlineServiceLink from "@/components/marketing/InlineServiceLink";
import { PRICING_FAQ_ITEMS } from "@/lib/data/pricing-faq";
import {
  PODCAST_EDITING_PER_HOUR_NIS,
  STUDIO_HALF_HOUR_NIS,
  STUDIO_ONE_HOUR_NIS,
} from "@/lib/data/pricing";
import { buildWhatsAppHref } from "@/lib/whatsapp";

const FAQ_ANSWERS: Record<string, React.ReactNode> = {
  "studio-half-vs-hour": (
    <>
      חצי שעה ({STUDIO_HALF_HOUR_NIS.toLocaleString("he-IL")} ₪ לפני מע״מ) מתאימה להקלטה בודדת, פיילוט או ברכה קצרה.
      שעה ({STUDIO_ONE_HOUR_NIS.toLocaleString("he-IL")} ₪) מתאימה לכמה ניסיונות, מספר משתתפים או עריכה בסיסית באותו יום.
      שניהם כוללים ליווי טכני מלא.{" "}
      <InlineServiceLink href="/studio/pricing">מחירון אולפן</InlineServiceLink>
    </>
  ),
  "podcast-which-package": (
    <>
      פודקאסט אודיו (מ-950 ₪) - פרק בודד עם הקלטה ועריכה. וידאו (מ-1,650 ₪) - אם צריך נוכחות ביוטיוב.
      חבילת תוכן (מ-2,800 ₪) - אם רוצים גם רילז מהפרק. לא בטוחים?{" "}
      <a
        href={buildWhatsAppHref({
          text: "היי, לא בטוח איזו חבילת פודקאסט מתאימה לי",
          source: "pricing-faq-podcast",
        })}
        target="_blank"
        rel="noopener noreferrer"
        className="font-semibold text-brand-red hover:underline"
      >
        שלחו הודעה
      </a>{" "}
      ונמליץ.{" "}
      <InlineServiceLink href="/podcast">חבילות פודקאסט</InlineServiceLink>
    </>
  ),
  "unsure-which-service": (
    <>
      תתקשרו או{" "}
      <a
        href={buildWhatsAppHref({
          text: "היי, לא בטוח איזה שירות מתאים לי - אשמח לייעוץ",
          source: "pricing-faq-unsure",
        })}
        target="_blank"
        rel="noopener noreferrer"
        className="font-semibold text-brand-red hover:underline"
      >
        שלחו וואטסאפ
      </a>
      . תארו מה אתם צריכים - אשאל שלוש שאלות ואמליץ על שירות אחד, בלי לחץ.
    </>
  ),
  "need-more-time": (
    <>
      תוספת זמן באולפן - לפי מחיר חצי שעה ({STUDIO_HALF_HOUR_NIS.toLocaleString("he-IL")} ₪ לפני מע״מ).
      בפודקאסט - תוספת משתתף או זמן עריכה ({PODCAST_EDITING_PER_HOUR_NIS.toLocaleString("he-IL")} ₪ לשעת חומר) נספרים בנפרד ומוסברים לפני שמתחילים.
    </>
  ),
  "vat-included": (
    <>
      לא - המחירים במחירון הם לפני מע״מ (+18%). בלחיצה על שורה רואים גם את המחיר כולל מע״מ. ב{" "}
      <InlineServiceLink href="/book">טופס ההזמנה</InlineServiceLink>{" "}
      מוצג המחיר הסופי.
    </>
  ),
  "how-to-book": (
    <>
      דרך{" "}
      <InlineServiceLink href="/book">טופס ההזמנה המקוונת</InlineServiceLink>
      {" - בוחרים שירות, רואים מחיר סופי עם מע״מ, מאשרים תאריך. אפשר גם וואטסאפ אם צריך עזרה לבחור."}
    </>
  ),
  "try-before-commit": (
    <>
      כן. פודקאסט - חבילת פתיחה (חצי שעה) או פרק אודיו בודד. אולפן - חצי שעה. עסקים - פיילוט תוכן. פרטים ב{" "}
      <InlineServiceLink href="/packages">עמוד החבילות</InlineServiceLink>.
    </>
  ),
};

export default function PricingFaqSection() {
  return (
    <FAQAccordion
      className="border-t border-border bg-surface"
      title="שאלות נפוצות על מחירים"
      subtitle="השוואות, בחירת שירות והזמנה"
      allowMultiple
      items={PRICING_FAQ_ITEMS.map((item) => ({
        id: item.id,
        question: item.question,
        answer: FAQ_ANSWERS[item.id] ?? item.answerPlain,
      }))}
    />
  );
}
