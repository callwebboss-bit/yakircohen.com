import {
  buildBusinessPageMetadata,
  BusinessServicePage,
} from "@/lib/business-page-shell";
import FaqPageSchema from "@/components/seo/FaqPageSchema";
import FAQAccordion, { type FAQItem } from "@/components/ui/FAQAccordion";
import { WORKSHOPS_CONFIG } from "@/lib/data/workshops-page";

const SLUG = "academy/workshops";

export const metadata = buildBusinessPageMetadata({
  slug: SLUG,
  metaTitle: "סדנאות תוכן וטיקטוק לצוותים",
  metaDescription:
    "סדנה מעשית לצוות: רילז, טיקטוק, דיבור מול מצלמה. באולפן במודיעין או בחברה. החל מ-2,800 ₪.",
  keywords: ["סדנת טיקטוק לעסק", "סדנת תוכן לצוות", "הדרכת רילז"],
  config: WORKSHOPS_CONFIG,
  ogHub: "podcast",
});

const WORKSHOPS_FAQ: FAQItem[] = [
  {
    id: "workshop-price",
    question: "כמה עולה סדנה?",
    answer: "סדנה מתחילה מ-₪2,800. המחיר הסופי תלוי במשך, בכמות המשתתפים ובמיקום (אולפן או אצלכם בחברה).",
  },
  {
    id: "workshop-participants",
    question: "כמה משתתפים בסדנה?",
    answer: "בדרך כלל בין 5 ל-15 משתתפים. ניתן להתאים את הגודל לצרכי הצוות.",
  },
  {
    id: "workshop-beginners",
    question: "האם הסדנה מתאימה למתחילים?",
    answer: "כן. הסדנה מותאמת לרמת המשתתפים, כולל אנשים ללא ניסיון קודם בצילום או עריכת וידאו.",
  },
  {
    id: "workshop-location",
    question: "איפה מתקיימות הסדנאות?",
    answer: "באולפן במודיעין או אצלכם בחברה - לפי בחירתכם. סדנה במשרדים חוסכת זמן נסיעה לצוות.",
  },
];

export default function WorkshopsPage() {
  return (
    <>
      <FaqPageSchema items={WORKSHOPS_FAQ as { question: string; answer: string }[]} />
      <BusinessServicePage slug={SLUG} config={WORKSHOPS_CONFIG} />
      <section className="mx-auto max-w-3xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
        <FAQAccordion items={WORKSHOPS_FAQ} />
      </section>
    </>
  );
}
