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
 * שירותים אחרים. הקלטה בבית נעשית באולפן הנייד (תשובת הבעלים 8.10.2026, B8),
 * ואזורי ההגעה שלו מוגדרים בעמוד האולפן הנייד ולא נמסרו לשירות הזה, ולכן
 * areaServed לא נכנס לסכמה.
 *
 * בלי offers, בכוונה, כמו בעמוד הקרוב /podcast/podcast-with-grandpa: הוא נבנה
 * על ServicePageLayout עם pagePath, כלומר buildServicePageEntitySchema
 * (page-schema.ts:187-231), שפולט Service ו-FAQPage בלי offers, והוא אינו ברשומת
 * השירותים (services.ts) שממנה נגזרים Offer. המחיר כן מוצג בטקסט, דרך הקטלוג
 * (podcast_audio), והוא גם בתשובת ה-FAQ. אם יוחלט להוסיף Offer, הוא נבנה
 * מהקטלוג כמו pricingToOffer (page-schema.ts:97), ו-audit:schema-prices בודק אותו.
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
