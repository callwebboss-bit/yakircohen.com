import {
  LEGACY_FAQS,
  LEGACY_RECORDING_DESCRIPTION,
  LEGACY_RECORDING_PATH,
  LEGACY_RECORDING_SLUG,
  LEGACY_RECORDING_TITLE,
} from "@/lib/data/legacy-recording";
import { ENTITY_IDS } from "@/lib/seo/entity-ids";
import {
  buildFaqSchema,
  realDateModified,
  SPEAKABLE,
} from "@/lib/seo/page-schema";
import { absoluteUrl } from "@/lib/site-url";

/**
 * Service + FAQPage בגרף אחד לדף /studio/legacy-recording.
 *
 * למה לא buildServicePageEntitySchema: הוא תמיד מוסיף areaServed של מעגל
 * 50 ק"מ סביב האולפן (lib/seo/page-schema.ts:36-44). זה אזור ההגעה של
 * שירותים אחרים. אזור ההגעה להקלטה בבית עוד לא נמסר (LEGACY_OWNER_FACTS.homeVisit),
 * ולכן הוא לא נכנס לסכמה. כשיוחלט, להוסיף areaServed כאן.
 *
 * בלי offers, בכוונה. Offer בלי מחיר הוא צומת שבור (page-schema.ts:124-132),
 * ולהמציא מספר אסור. כשהבעלים יחליט על מחיר: להכניס אותו ל-pricing-catalog.ts
 * ולבנות את ה-Offer משם, כמו ב-pricingToOffer.
 *
 * בצומת ה-Service אין inLanguage, dateModified ו-speakable. הקומיט 62c6ecf2
 * הסיר inLanguage מצמתי Service אחרי ש-validator.schema.org הזהיר שהוא אינו
 * מאפיין שלהם, ושלושתם שייכים ל-CreativeWork ו-WebPage ולא ל-Service. הם
 * נשארים על צומת ה-FAQPage, שהוא WebPage. (לא הורץ validator.schema.org
 * על הדף הזה: צריך את הכתובת החיה.)
 */
export function buildLegacyRecordingSchema() {
  const pageUrl = absoluteUrl(LEGACY_RECORDING_SLUG);
  const dateModified = realDateModified(LEGACY_RECORDING_PATH);
  const faq = buildFaqSchema(
    LEGACY_FAQS.map(({ question, answer }) => ({ question, answer })),
  );

  const graph: Record<string, unknown>[] = [
    {
      "@type": "Service",
      "@id": `${pageUrl}#service`,
      name: LEGACY_RECORDING_TITLE,
      description: LEGACY_RECORDING_DESCRIPTION,
      url: pageUrl,
      serviceType: LEGACY_RECORDING_TITLE,
      provider: { "@id": ENTITY_IDS.organization },
    },
  ];

  if (faq) {
    graph.push({
      "@type": "FAQPage",
      "@id": `${pageUrl}#faq`,
      url: pageUrl,
      inLanguage: "he-IL",
      ...(dateModified ? { dateModified } : {}),
      speakable: SPEAKABLE,
      mainEntity: faq.mainEntity,
    });
  }

  return {
    "@context": "https://schema.org",
    "@graph": graph,
  };
}
