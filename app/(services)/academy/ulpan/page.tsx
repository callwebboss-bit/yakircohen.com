import AcademyUlpanPageContent from "@/components/seo/AcademyUlpanPageContent";
import FaqPageSchema from "@/components/seo/FaqPageSchema";
import { ULPAN_META } from "@/lib/data/academy-ulpan-page";
import { constructMetadata } from "@/lib/metadata";
import { buildUlpanPageSchema } from "@/lib/seo/ulpan-page-schema";
import { safeJsonLdStringify } from "@/lib/safe-json-ld";
import { SITE_URL } from "@/lib/site-url";

const _base = constructMetadata({
  title: ULPAN_META.title,
  description: ULPAN_META.description,
  slug: "academy/ulpan",
  keywords: [...ULPAN_META.keywords],
});

export const metadata = {
  ..._base,
  alternates: {
    ..._base.alternates,
    languages: {
      "he-IL": `${SITE_URL}/academy/ulpan`,
      en: `${SITE_URL}/academy/hebrew-lessons`,
    },
  },
};

const jsonLd = buildUlpanPageSchema();

const ULPAN_FAQ_SCHEMA = [
  {
    question: "כמה עולה אולפן עברית?",
    answer: "המחיר משתנה לפי מסלול - שיעור ניסיון, מנוי חודשי או שנתי. צרו קשר או בדקו בעמוד ההזמנה.",
  },
  {
    question: "כמה זמן הקורס?",
    answer: "ניתן להתחיל ממנוי חודשי ולהאריך לפי הצורך. מנוי שנתי כולל 4 שיעורים בחודש למשך שנה.",
  },
  {
    question: "מה הרמות שמלמדים?",
    answer: "מרמת מתחילים (אלף-בית וקריאה) ועד רמה מתקדמת (שיחה, כתיבה ואוצר מילים מקצועי).",
  },
  {
    question: "האם יש שיעורים פרטיים?",
    answer: "כן. כל השיעורים הם פרטיים 1:1, מותאמים אישית לרמה, לקצב ולמטרות של כל תלמיד.",
  },
];

export default function AcademyUlpanPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLdStringify(jsonLd) }}
      />
      <FaqPageSchema items={ULPAN_FAQ_SCHEMA} />
      <AcademyUlpanPageContent />
    </>
  );
}
