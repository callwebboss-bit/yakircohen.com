import {
  BOOK_OG_IMAGE_ALT,
  BOOK_OG_IMAGE_PATH,
  BOOK_PAGE_DESCRIPTION,
  BOOK_PAGE_TITLE,
} from "@/lib/seo/book-page";
import { absoluteUrl } from "@/lib/site-url";
import { SITE_NAME } from "@/lib/constants";

const BRAND_SUFFIX = ` | ${SITE_NAME}`;

const BOOK_FAQ_ITEMS = [
  {
    question: "איך מזמינים אולפן או פודקאסט באתר?",
    answer:
      "בוחרים קטגוריה בדף ההזמנה, ממלאים פרטים בשלושה שלבים, ושולחים בוואטסאפ לאישור זמינות. מחירים מוצגים לפני מע״מ.",
  },
  {
    question: "מה המחיר ההתחלתי להקלטה באולפן במודיעין?",
    answer: "חבילות אולפן מתחילות מ-990 ₪ לפני מע״מ, כולל תיקון קולי Melodyne ו-Auto-Tune לפי הצורך.",
  },
  {
    question: "האם אפשר להזמין אטרקציות לאירועים אונליין?",
    answer:
      "כן. בוחרים אטרקציות, מוסיפים פרטי אירוע, ומקבלים סיכום מחיר לפני שליחה. חבילות משולבות חוסכות מול רכישה נפרדת.",
  },
  {
    question: "כמה זמן לוקח לקבל אישור הזמנה?",
    answer: "בדרך כלל תוך שעות בימי עבודה. אפשר גם לשלוח הודעה קצרה בוואטסאפ מהדף.",
  },
] as const;

export default function BookPageSchema() {
  const pageUrl = absoluteUrl("book");
  const imageUrl = absoluteUrl(BOOK_OG_IMAGE_PATH.replace(/^\//, ""));

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${pageUrl}#webpage`,
    url: pageUrl,
    name: `${BOOK_PAGE_TITLE}${BRAND_SUFFIX}`,
    description: BOOK_PAGE_DESCRIPTION,
    inLanguage: "he-IL",
    isPartOf: { "@id": `${absoluteUrl()}#website` },
    about: { "@id": `${absoluteUrl()}#organization` },
    primaryImageOfPage: {
      "@type": "ImageObject",
      url: imageUrl,
      caption: BOOK_OG_IMAGE_ALT,
    },
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${pageUrl}#faq`,
    mainEntity: BOOK_FAQ_ITEMS.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </>
  );
}
