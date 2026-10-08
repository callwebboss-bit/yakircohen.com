import FaqPageSchema from "@/components/seo/FaqPageSchema";
import PodcastSubscriptionTable from "@/components/seo/PodcastSubscriptionTable";
import FAQAccordion from "@/components/ui/FAQAccordion";
import {
  PODCAST_SUBSCRIPTION_FAQS,
  PODCAST_SUBSCRIPTION_IS_DRAFT,
  PODCAST_SUBSCRIPTION_PLANS,
  PODCAST_SUBSCRIPTION_TITLE,
} from "@/lib/data/podcast-subscription-page";
import {
  buildSubscriptionOffersSchema,
  subscriptionFaqAnswer,
  subscriptionFaqSchemaItems,
} from "@/lib/podcast-subscription";
import { safeJsonLdStringify } from "@/lib/safe-json-ld";

export default function PodcastSubscriptionPageContent() {
  /* בטיוטה אין סכמה: מחיר שלא נקבע ותנאים שלא סוכמו אינם עובדה. הבונים עצמם
     מחזירים null/[] כשחסר נתון, והדגל כאן הוא חגורה שנייה. */
  const offersSchema = PODCAST_SUBSCRIPTION_IS_DRAFT
    ? null
    : buildSubscriptionOffersSchema(PODCAST_SUBSCRIPTION_PLANS);
  const faqSchemaItems = PODCAST_SUBSCRIPTION_IS_DRAFT ? [] : subscriptionFaqSchemaItems(PODCAST_SUBSCRIPTION_FAQS);

  return (
    <div className="mx-auto max-w-[72rem] space-y-12 px-4 py-10 sm:px-6 lg:px-8">
      {offersSchema ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: safeJsonLdStringify(offersSchema) }}
        />
      ) : null}
      <FaqPageSchema items={faqSchemaItems} />

      <header className="max-w-3xl">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          {PODCAST_SUBSCRIPTION_TITLE}
        </h1>
        <p className="mt-4 text-base leading-relaxed text-muted-foreground">
          מספר קבוע של פרקים בכל חודש, כולל עריכה, עם או בלי עריכת וידאו. בוחרים מסלול ומדברים על הפרטים.
        </p>
        {PODCAST_SUBSCRIPTION_IS_DRAFT ? (
          <p
            role="note"
            className="mt-4 rounded-lg border border-brand-red/40 bg-brand-red/8 px-4 py-3 text-sm text-foreground"
          >
            טיוטה: המסלולים והמחירים כאן הם הצעה שעוד לא אושרה, והדף לא באינדקס של גוגל.
          </p>
        ) : null}
      </header>

      <section aria-labelledby="subscription-compare-heading">
        <h2
          id="subscription-compare-heading"
          className="mb-6 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
        >
          שלושה מסלולים, טבלה אחת
        </h2>
        <PodcastSubscriptionTable plans={PODCAST_SUBSCRIPTION_PLANS} />
      </section>

      <FAQAccordion
        title="התחייבות וביטול"
        subtitle="מה חשוב לדעת לפני שמצטרפים למנוי"
        items={PODCAST_SUBSCRIPTION_FAQS.map((faq, index) => ({
          id: `subscription-faq-${index + 1}`,
          question: faq.question,
          answer: subscriptionFaqAnswer(faq),
        }))}
      />
    </div>
  );
}
