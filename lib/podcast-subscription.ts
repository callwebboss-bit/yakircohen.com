import { withVat } from "@/lib/data/pricing";
import {
  PODCAST_SUBSCRIPTION_FAQ_PLACEHOLDER,
  PODCAST_SUBSCRIPTION_PATH,
  PODCAST_SUBSCRIPTION_TITLE,
  type SubscriptionFaq,
  type SubscriptionPlan,
} from "@/lib/data/podcast-subscription-page";
import { entityRef } from "@/lib/seo/entity-ids";
import { absoluteUrl } from "@/lib/site-url";
import { buildServiceWhatsAppText } from "@/lib/whatsapp";

/** "4 פרקים בחודש, עריכת אודיו ועריכת וידאו" */
export function describeSubscriptionPlan(plan: SubscriptionPlan): string {
  const episodes = plan.episodesPerMonth === 1 ? "פרק אחד בחודש" : `${plan.episodesPerMonth} פרקים בחודש`;
  const editing = [plan.audioEditing && "עריכת אודיו", plan.videoEditing && "עריכת וידאו"].filter(Boolean);
  return editing.length ? `${episodes}, ${editing.join(" ו")}` : episodes;
}

/** ההודעה שנפתחת בוואטסאפ. בלי מסלול נבחר היא כללית ולא מנחשת. */
export function buildSubscriptionWhatsAppText(plan: SubscriptionPlan | null): string {
  const subject = PODCAST_SUBSCRIPTION_TITLE;
  if (!plan) return buildServiceWhatsAppText(subject);
  return buildServiceWhatsAppText(`${subject}, מסלול ${plan.name} (${describeSubscriptionPlan(plan)})`);
}

/**
 * Service עם AggregateOffer ולתוכו Offer לכל מסלול. מחזיר null כל עוד לאחד
 * המסלולים אין מחיר: סכמה בלי מחיר אמיתי היא נתון שגוי ולא טיוטה.
 * price כולל מע״מ וה-priceSpecification לפני מע״מ עם דגל, כמו pricingToOffer.
 */
export function buildSubscriptionOffersSchema(
  plans: readonly SubscriptionPlan[],
  pageUrl: string = absoluteUrl(PODCAST_SUBSCRIPTION_PATH),
) {
  if (!plans.length) return null;
  const priced = plans.map((plan) => ({ plan, exVat: plan.priceExVat }));
  if (priced.some((p) => p.exVat == null)) return null;

  const withVatPrices = priced.map((p) => withVat(p.exVat as number));
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${pageUrl}#service`,
    name: PODCAST_SUBSCRIPTION_TITLE,
    url: pageUrl,
    serviceType: PODCAST_SUBSCRIPTION_TITLE,
    inLanguage: "he-IL",
    provider: entityRef("organization"),
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "ILS",
      lowPrice: String(Math.min(...withVatPrices)),
      highPrice: String(Math.max(...withVatPrices)),
      offerCount: plans.length,
      offers: priced.map(({ plan, exVat }) => ({
        "@type": "Offer",
        "@id": `${pageUrl}#offer-${plan.id}`,
        name: `${PODCAST_SUBSCRIPTION_TITLE}, מסלול ${plan.name}`,
        description: describeSubscriptionPlan(plan),
        url: pageUrl,
        price: String(withVat(exVat as number)),
        priceCurrency: "ILS",
        availability: "https://schema.org/InStock",
        priceSpecification: {
          "@type": "UnitPriceSpecification",
          price: exVat,
          priceCurrency: "ILS",
          valueAddedTaxIncluded: false,
          billingDuration: "P1M",
        },
      })),
    },
  };
}

/** תשובה מוצגת: הטקסט, או ההודעה שהתנאים עוד לא סוכמו. */
export function subscriptionFaqAnswer(faq: SubscriptionFaq): string {
  return faq.answer ?? PODCAST_SUBSCRIPTION_FAQ_PLACEHOLDER;
}

/** FAQPage רק כשכל התשובות אמיתיות. */
export function subscriptionFaqSchemaItems(faqs: readonly SubscriptionFaq[]) {
  if (!faqs.length || faqs.some((f) => f.answer == null)) return [];
  return faqs.map((f) => ({ question: f.question, answer: f.answer as string }));
}
