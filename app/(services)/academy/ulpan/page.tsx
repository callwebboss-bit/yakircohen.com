import AcademyUlpanPageContent from "@/components/seo/AcademyUlpanPageContent";
import { constructMetadata } from "@/lib/metadata";
import { absoluteUrl } from "@/lib/site-url";
import { CONTACT_PHONE_E164, SITE_NAME } from "@/lib/constants";

export const metadata = constructMetadata({
  title: "לימוד עברית פרונטלי פעם בשבוע עם יקיר כהן",
  description:
    "שיעורי עברית פרונטליים למבוגרים, פעם בשבוע. עברית מדוברת, ביטחון בשפה, אולפן עברית אישי. תוכנית גמישה ללא התחייבות ארוכה — שיעור ניסיון ב-500 ש\"ח.",
  slug: "academy/ulpan",
  keywords: [
    "לימוד עברית",
    "עברית למבוגרים",
    "שיעורי עברית פרונטליים",
    "עברית מדוברת",
    "אולפן עברית",
    "יקיר כהן",
    "שיעור עברית",
    "לימוד עברית פרונטלי",
  ],
});

const pageUrl = absoluteUrl("academy/ulpan");

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": `${pageUrl}#webpage`,
      url: pageUrl,
      name: "לימוד עברית פרונטלי עם יקיר כהן",
      description:
        "שיעורי עברית למבוגרים — פעם בשבוע, פרונטלי, בקצב שלך",
      inLanguage: "he-IL",
      isPartOf: { "@id": `${absoluteUrl()}/#website` },
    },
    {
      "@type": "Course",
      "@id": `${pageUrl}#course`,
      name: "לימוד עברית פרונטלי — יקיר כהן",
      description:
        "תוכנית לימוד עברית מדוברת למבוגרים. פגישה פרונטלית אחת בשבוע, התאמה אישית, ללא התחייבות ארוכה.",
      url: pageUrl,
      inLanguage: "he-IL",
      provider: {
        "@type": "Person",
        name: "יקיר כהן",
        worksFor: {
          "@type": "Organization",
          name: SITE_NAME,
          url: absoluteUrl(),
          telephone: CONTACT_PHONE_E164,
        },
      },
      teaches: "עברית מדוברת, דיבור, הבנה, ביטחון בשפה",
      educationalLevel: "מתחיל עד מתקדם",
      courseMode: "פרונטלי",
      availableLanguage: ["עברית", "ערבית", "אנגלית"],
      offers: [
        {
          "@type": "Offer",
          name: "שיעור ניסיון",
          price: "500",
          priceCurrency: "ILS",
          description: "שיעור היכרות ראשוני — אבחון רמה וקביעת מטרות",
          availability: "https://schema.org/LimitedAvailability",
        },
        {
          "@type": "Offer",
          name: "מסלול חודשי",
          price: "3200",
          priceCurrency: "ILS",
          description: "שיעור פרונטלי אחד בשבוע, גמישות מלאה",
          priceSpecification: {
            "@type": "UnitPriceSpecification",
            price: "3200",
            priceCurrency: "ILS",
            referenceQuantity: {
              "@type": "QuantitativeValue",
              value: "1",
              unitCode: "MON",
            },
          },
        },
        {
          "@type": "Offer",
          name: "מסלול שנתי",
          price: "11520",
          priceCurrency: "ILS",
          description: "36 שיעורים לשנה עם הטבת שיעור ניסיון",
        },
      ],
      review: {
        "@type": "Review",
        author: { "@type": "Person", name: "שוואקת אוויסט" },
        reviewBody:
          "למדתי אצל יקיר כהן כבר שנה 6 ברצף והעברית שלי השתפרה פלאים.",
        reviewRating: {
          "@type": "Rating",
          ratingValue: "5",
          bestRating: "5",
        },
      },
    },
  ],
};

export default function AcademyUlpanPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AcademyUlpanPageContent />
    </>
  );
}
