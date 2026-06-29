"use client";

import FAQAccordion from "@/components/ui/FAQAccordion";
import InlineServiceLink from "@/components/marketing/InlineServiceLink";
import { PRICING_FAQ_ITEMS } from "@/lib/data/pricing-faq";
import {
  PODCAST_EDITING_PER_HOUR_NIS,
  STUDIO_HALF_HOUR_NIS,
  STUDIO_ONE_HOUR_NIS,
} from "@/lib/data/pricing";

const FAQ_ANSWERS: Record<string, React.ReactNode> = {
  "studio-hour-price": (
    <>
      חצי שעה באולפן עולה {STUDIO_HALF_HOUR_NIS.toLocaleString("he-IL")} ₪ לפני מע״מ, ושעה מלאה עולה{" "}
      {STUDIO_ONE_HOUR_NIS.toLocaleString("he-IL")} ₪ לפני מע״מ. כל המחירים כוללים ליווי טכני מלא.{" "}
      <InlineServiceLink href="/studio/pricing">מחירון אולפן</InlineServiceLink>
      {" · "}
      <InlineServiceLink href="/studio/recording-studio">הקלטה באולפן</InlineServiceLink>
    </>
  ),
  "podcast-recording-price": (
    <>
      פודקאסט אודיו מ-950 ₪ לפרק (הקלטה + עריכה + מסירה לספוטיפיי). פודקאסט וידאו מ-1,650 ₪. חבילות תוכן מלאות עם רילז מ-2,800 ₪.{" "}
      <InlineServiceLink href="/podcast">חבילות פודקאסט</InlineServiceLink>
    </>
  ),
  "podcast-editing-price": (
    <>
      עריכת פודקאסט עולה {PODCAST_EDITING_PER_HOUR_NIS.toLocaleString("he-IL")} ₪ לשעת חומר גולמי, לפני מע״מ. כולל ניקוי רעשים, סנכרון וכתוביות.{" "}
      <InlineServiceLink href="/podcast/podcast-editing">עריכת פודקאסט</InlineServiceLink>
    </>
  ),
  "vat-included": (
    <>
      לא – כל המחירים המוצגים הם לפני מע״מ (+18%). ליד כל שורה מוצג גם המחיר כולל מע״מ, וב{" "}
      <InlineServiceLink href="/book">טופס ההזמנה המקוונת</InlineServiceLink>{" "}
      נראה המחיר הסופי עם מע״מ.
    </>
  ),
  "how-to-book": (
    <>
      דרך{" "}
      <InlineServiceLink href="/book">טופס ההזמנה המקוונת</InlineServiceLink>
      {" – בוחרים שירות, רואים מחיר סופי, מאשרים תאריך. ניתן גם לפנות בוואטסאפ."}
    </>
  ),
  packages: (
    <>
      כן – חבילות מוכנות לאולפן, פודקאסט וחתונות ב{" "}
      <InlineServiceLink href="/packages">עמוד החבילות</InlineServiceLink>. כולל מחיר שקוף לפני ואחרי מע״מ.
    </>
  ),
};

export default function PricingFaqSection() {
  return (
    <FAQAccordion
      className="border-t border-border bg-surface"
      title="שאלות נפוצות על מחירים"
      subtitle="תשובות קצרות על מחירים, מע״מ והזמנה"
      allowMultiple
      items={PRICING_FAQ_ITEMS.map((item) => ({
        id: item.id,
        question: item.question,
        answer: FAQ_ANSWERS[item.id] ?? item.answerPlain,
      }))}
    />
  );
}
