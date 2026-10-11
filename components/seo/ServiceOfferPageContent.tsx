import Link from "next/link";
import FaqPageSchema from "@/components/seo/FaqPageSchema";
import RecordingSongExampleVideos from "@/components/seo/RecordingSongExampleVideos";
import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";
import FAQWithCtaLinks, { type FaqCtaItem } from "@/components/ui/FAQWithCtaLinks";
import Section from "@/components/ui/Section";
import { formatConsumerPrice } from "@/lib/data/pricing-display";
import { PRICES_VALID_UNTIL } from "@/lib/data/pricing-hub";
import {
  resolvePriceRows,
  schemaOffers,
  type ServiceOfferPage,
} from "@/lib/data/service-offers/types";
import { isLinkableFrom } from "@/lib/data/service-offers/status";
import { safeJsonLdStringify } from "@/lib/safe-json-ld";
import { buildServicePageEntitySchema } from "@/lib/seo/page-schema";
import { buildWhatsAppHref } from "@/lib/whatsapp";
import { buildPricingInquiryMessage } from "@/lib/whatsapp-closing";
import { getExVat } from "@/lib/data/pricing-catalog";

/**
 * תצוגה משותפת לעמודי השירותים החדשים (lib/data/service-offers). כותרת h1 אחת,
 * ואחריה h2 לכל סקשן: איך זה עובד, מה כלול, מחיר, סקשנים נוספים, שאלות.
 * ה-FAQPage נפלט פעם אחת, דרך FaqPageSchema, וה-Service עם ה-Offer בנפרד.
 */
export default function ServiceOfferPageContent({ page }: { page: ServiceOfferPage }) {
  const rows = resolvePriceRows(page.prices);
  /* עמוד שפורסם לא מקשר לעמוד חדש שעדיין טיוטה */
  const related = page.related.filter((link) => isLinkableFrom(page.draft, link.href));
  const alternatives = (page.alternatives?.items ?? []).filter((item) => isLinkableFrom(page.draft, item.href));
  const whatsappText = buildPricingInquiryMessage({
    packageLabel: page.whatsapp.packageLabel,
    priceExVat: getExVat(page.whatsapp.priceId),
    source: page.path,
    closerServiceId: page.whatsapp.priceId,
  });
  const whatsappHref = buildWhatsAppHref({
    text: whatsappText,
    utm_source: "website",
    utm_campaign: page.whatsapp.utmCampaign,
  });

  const serviceSchema = buildServicePageEntitySchema({
    pagePath: page.path,
    title: page.h1,
    description: page.metaDescription,
    offers: schemaOffers(page),
    priceValidUntil: PRICES_VALID_UNTIL,
  });

  const faqItems: FaqCtaItem[] = page.faqs.map((faq) => ({
    id: faq.id,
    question: faq.question,
    answer: faq.answer,
    ctaText: "שאלו בוואטסאפ",
    whatsappMessage: `היי יקיר, שאלה על ${page.whatsapp.packageLabel}: ${faq.question}`,
    utm_campaign: page.whatsapp.utmCampaign,
  }));

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLdStringify(serviceSchema) }}
      />
      <FaqPageSchema items={page.faqs.map(({ question, answer }) => ({ question, answer }))} />

      <Section className="border-b border-border bg-background" ariaLabelledby="offer-title" padding="sm">
        <Container className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-red">{page.eyebrow}</p>
          <h1
            id="offer-title"
            className="mx-auto mt-3 max-w-3xl font-serif text-3xl font-semibold leading-tight text-foreground sm:text-4xl"
          >
            {page.h1}
          </h1>
          <p
            data-speakable
            className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base"
          >
            {page.intro}
          </p>
          {page.highlight ? (
            <p className="mx-auto mt-3 max-w-2xl text-sm font-semibold text-foreground">{page.highlight}</p>
          ) : null}
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button as="a" href={whatsappHref} target="_blank" rel="noopener noreferrer" className="min-w-[14rem]">
              שלחו הודעה בוואטסאפ
            </Button>
            <Button as="a" href="#offer-price" variant="secondary" className="min-w-[14rem]">
              כמה זה עולה
            </Button>
          </div>
        </Container>
      </Section>

      {page.audience ? (
        <Section className="bg-surface" ariaLabelledby="offer-audience-title" padding="sm">
          <Container className="max-w-3xl">
            <header className="mx-auto max-w-2xl text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-red">למי זה מתאים</p>
              <h2 id="offer-audience-title" className="mt-3 font-serif text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                {page.audience.title}
              </h2>
            </header>
            <ul className="mt-8 grid gap-3 sm:grid-cols-2">
              {page.audience.items.map((item) => (
                <li
                  key={item}
                  className="rounded-xl border border-border bg-background px-4 py-3 text-sm leading-relaxed text-foreground"
                >
                  {item}
                </li>
              ))}
            </ul>
          </Container>
        </Section>
      ) : null}

      <Section className="bg-background" ariaLabelledby="offer-how-title" padding="sm">
        <Container>
          <header className="mx-auto max-w-2xl text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-red">איך זה עובד</p>
              <h2 id="offer-how-title" className="mt-3 font-serif text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                צעד אחרי צעד
              </h2>
            </header>
          <ol role="list" className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {page.steps.map((step, index) => (
              <li key={step.title} className="rounded-2xl border border-border bg-background p-5 text-center">
                <span className="text-xs font-bold tracking-widest text-brand-red">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-2 text-sm font-semibold text-foreground">{step.title}</h3>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground sm:text-sm">{step.description}</p>
              </li>
            ))}
          </ol>
        </Container>
      </Section>

      <Section className="bg-background" ariaLabelledby="offer-includes-title" padding="sm">
        <Container className="max-w-3xl">
          <header className="mx-auto max-w-2xl text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-red">מה כלול</p>
              <h2 id="offer-includes-title" className="mt-3 font-serif text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                {page.includesTitle}
              </h2>
            </header>
          <ul className="mt-8 grid gap-3 sm:grid-cols-2">
            {page.includes.map((item) => (
              <li
                key={item}
                className="rounded-xl border border-border bg-surface px-4 py-3 text-sm font-medium text-foreground"
              >
                {item}
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      <Section id="offer-price" className="border-t border-border bg-surface" ariaLabelledby="offer-price-title" padding="sm">
        <Container className="max-w-3xl">
          <header className="mx-auto max-w-2xl text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-red">מחיר</p>
              <h2 id="offer-price-title" className="mt-3 font-serif text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                {page.priceTitle}
              </h2>
            </header>
          <ul className="mt-8 divide-y divide-border rounded-2xl border border-border bg-background">
            {rows.map((row) => {
              const price = formatConsumerPrice(row.exVat);
              return (
                <li key={`${row.id}-${row.label}`} className="flex flex-col gap-1 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-semibold text-foreground">{row.label}</p>
                    {row.note ? <p className="mt-1 text-xs text-muted-foreground">{row.note}</p> : null}
                  </div>
                  <div className="text-start sm:text-end">
                    <p className="text-base font-bold text-foreground">
                      {row.addon ? "+" : row.from ? "מ-" : ""}
                      {price.totalLabel}
                    </p>
                    <p className="text-xs text-muted-foreground">{price.exVatNote}</p>
                  </div>
                </li>
              );
            })}
          </ul>
          {page.priceNote ? (
            <p className="mt-4 text-center text-sm leading-relaxed text-muted-foreground">{page.priceNote}</p>
          ) : null}
          <div className="mt-6 flex justify-center">
            <Button as="a" href={whatsappHref} target="_blank" rel="noopener noreferrer" className="min-w-[14rem]">
              שלחו הודעה בוואטסאפ
            </Button>
          </div>
        </Container>
      </Section>

      {page.extraSections?.map((section) => (
        <Section key={section.id} className="bg-background" ariaLabelledby={`${section.id}-title`} padding="sm">
          <Container className="max-w-3xl">
            <header className="mx-auto max-w-2xl text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-red">{section.eyebrow}</p>
              <h2 id={`${section.id}-title`} className="mt-3 font-serif text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                {section.title}
              </h2>
              {section.description ? (
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">{section.description}</p>
              ) : null}
            </header>
            <ul className="mt-8 grid gap-3 sm:grid-cols-2">
              {section.items.map((item) => (
                <li key={item.title} className="rounded-xl border border-border bg-surface px-4 py-4">
                  <h3 className="text-sm font-semibold text-foreground">{item.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{item.body}</p>
                </li>
              ))}
            </ul>
          </Container>
        </Section>
      ))}

      {page.videos?.items.length ? (
        <Section className="border-t border-border bg-surface" ariaLabelledby="offer-videos-title" padding="sm">
          <Container>
            <header className="mx-auto max-w-2xl text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-red">דוגמאות</p>
              <h2 id="offer-videos-title" className="mt-3 font-serif text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                {page.videos.title}
              </h2>
              {page.videos.description ? (
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">{page.videos.description}</p>
              ) : null}
            </header>
            <RecordingSongExampleVideos videos={page.videos.items} className="mt-8" />
          </Container>
        </Section>
      ) : null}

      {page.alternatives && alternatives.length ? (
        <Section className="bg-background" ariaLabelledby="offer-alternatives-title" padding="sm">
          <Container className="max-w-3xl">
            <header className="mx-auto max-w-2xl text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-red">מה מתאים לכם</p>
              <h2 id="offer-alternatives-title" className="mt-3 font-serif text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                {page.alternatives.title}
              </h2>
            </header>
            <ul className="mt-8 grid gap-3">
              {alternatives.map((item) => (
                <li key={item.href} className="rounded-xl border border-border bg-surface px-4 py-4">
                  <Link href={item.href} className="text-sm font-semibold text-brand-red hover:underline">
                    {item.label}
                  </Link>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{item.body}</p>
                </li>
              ))}
            </ul>
          </Container>
        </Section>
      ) : null}

      <Section className="border-t border-border bg-surface" ariaLabelledby="offer-faq-title" padding="sm">
        <Container className="max-w-3xl">
          <header className="mx-auto max-w-2xl text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-red">שאלות</p>
              <h2 id="offer-faq-title" className="mt-3 font-serif text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                שאלות נפוצות
              </h2>
            </header>
          <div className="mt-8">
            <FAQWithCtaLinks items={faqItems} />
          </div>
          {related.length ? (
            <nav aria-label="שירותים קשורים" className="mt-10 text-center">
              <p className="text-sm font-semibold text-foreground">עוד שירותים שקשורים לזה</p>
              <ul className="mt-3 flex flex-wrap justify-center gap-x-5 gap-y-2 text-sm">
                {related.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="font-semibold text-brand-red hover:underline">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ) : null}
        </Container>
      </Section>
    </>
  );
}
