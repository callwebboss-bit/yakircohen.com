import Link from "next/link";
import { notFound } from "next/navigation";
import CallbackLeadForm from "@/components/forms/CallbackLeadForm";
import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import LazyYouTubePlayer from "@/components/marketing/LazyYouTubePlayer";
import JourneyStepsLink from "@/components/marketing/JourneyStepsLink";
import ServiceHubLinks from "@/components/services/ServiceHubLinks";
import SoundImprovementShowcase from "@/components/seo/SoundImprovementShowcase";
import FAQAccordion from "@/components/ui/FAQAccordion";
import FaqPageSchema from "@/components/seo/FaqPageSchema";
import {
  getOnlineCategoryBySlug,
  ONLINE_SERVICE_CATEGORIES,
  ONLINE_WHY_US,
} from "@/lib/data/online-page";
import { getOnlineCategoryEnrichment } from "@/lib/data/online-category-enrichment";
import { mapOnlineServiceToHub } from "@/lib/data/online-hub-mappers";
import { buildWhatsAppHref } from "@/lib/whatsapp";

type OnlineCategoryPageContentProps = {
  slug: string;
};

export default function OnlineCategoryPageContent({ slug }: OnlineCategoryPageContentProps) {
  const category = getOnlineCategoryBySlug(slug);
  const enrichment = getOnlineCategoryEnrichment(slug);
  if (!category || !enrichment) notFound();

  const ctaHref = buildWhatsAppHref({
    text: enrichment.ctaWhatsAppText,
    utm_source: "online",
    utm_campaign: `online_category_${category.slug}`,
  });

  const relatedCategories = enrichment.relatedCategorySlugs
    .map((relatedSlug) => ONLINE_SERVICE_CATEGORIES.find((c) => c.slug === relatedSlug))
    .filter((c): c is NonNullable<typeof c> => Boolean(c));

  const faqItems = enrichment.faqs.map((item) => ({
    id: item.id,
    question: item.question,
    answer: item.answer,
  }));

  const chipClass =
    "inline-flex min-h-11 items-center rounded-full border border-border bg-background px-4 text-sm font-medium text-muted-foreground transition-colors hover:border-brand-red/40 hover:text-brand-red focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red";

  const linkClass =
    "inline-flex min-h-11 items-center text-sm font-semibold text-brand-red hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red";

  return (
    <div className="bg-background">
      <FaqPageSchema
        items={faqItems.map((item) => ({
          question: item.question,
          answer: item.answer,
        }))}
      />
      <Section padding="none" className="relative overflow-hidden border-b border-border bg-background">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_55%_at_50%_-10%,rgba(212,43,43,0.12),transparent_55%)]"
          aria-hidden
        />
        <Container className="relative max-w-4xl py-16 text-center sm:py-20">
          <nav aria-label="ניווט" className="mb-6">
            <ol className="flex flex-wrap items-center justify-center gap-2 text-xs text-muted-foreground">
              <li>
                <Link href="/" className="hover:text-brand-red">
                  ראשי
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li>
                <Link href="/online" className="hover:text-brand-red">
                  שירותי אונליין
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li className="font-medium text-foreground" aria-current="page">
                {category.title}
              </li>
            </ol>
          </nav>
          <h1 className="text-hero font-serif font-semibold text-foreground">
            {category.title} - שירותי AI אונליין
          </h1>
          <p className="text-lead mx-auto mt-4 max-w-2xl text-muted-foreground">
            {category.description} אנחנו מבצעים את כל העבודה מקצה לקצה ומחזירים תוצר
            מוכן לפרסום או שימוש מיידי.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button
              as="a"
              href={ctaHref}
              target="_blank"
              rel="noopener noreferrer"
              className="shadow-[0_0_20px_rgba(212,43,43,0.3)]"
            >
              {enrichment.ctaPrimaryLabel} </Button>
            <Button as="link" href="#quick-quote" variant="secondary">
              השאירו פרטים להצעת מחיר
            </Button>
          </div>
        </Container>
      </Section>

      <Section padding="sm">
        <Container>
        <ServiceHubLinks
          heading="שירותים בקטגוריה"
          subheading={category.description}
          links={category.services.map((service) =>
            mapOnlineServiceToHub(service, ctaHref),
          )}
          headingId={`online-category-${category.slug}-services`}
          columns={3}
        />
        </Container>
      </Section>

      <Section padding="sm" className="border-y border-border bg-surface">
        <Container>
          <h2 className="mb-2 font-serif text-section-title font-semibold text-foreground">מה כלול וזמני אספקה</h2>
          <p className="mb-8 max-w-2xl text-sm text-muted-foreground">
            מחיר סופי לפי אורך החומר ומורכבות - אלה מסלולי עבודה אופייניים. הצעה מדויקת
            אחרי בדיקת הקובץ, ללא התחייבות.
          </p>
          <div className="grid gap-5 md:grid-cols-3">
            {enrichment.deliveryTiers.map((tier) => (
              <article
                key={`${category.slug}-${tier.name}`}
                className={`rounded-2xl border bg-background p-6 ${
                  tier.featured ? "border-brand-red/40 shadow-sm" : "border-border"
                }`}
              >
                {tier.featured ? (
                  <span className="text-xs font-semibold uppercase tracking-wide text-brand-red">
                    הכי נפוץ
                  </span>
                ) : null}
                <h3 className="mt-1 text-lg font-semibold text-foreground">{tier.name}</h3>
                <p className="mt-2 text-sm font-medium text-foreground">{tier.turnaround}</p>
                <p className="mt-3 text-sm text-muted-foreground">{tier.includes}</p>
                {tier.note ? (
                  <p className="mt-2 text-xs text-muted-foreground">{tier.note}</p>
                ) : null}
              </article>
            ))}
          </div>
        </Container>
      </Section>

      <Section padding="sm">
        <Container>
        <header className="mx-auto max-w-2xl text-center">
          <h2 className="font-serif text-section-title font-semibold text-foreground">{enrichment.proof.headline}</h2>
          <p className="mt-2 text-sm text-muted-foreground">{enrichment.proof.description}</p>
        </header>
        {enrichment.proof.demoId ? (
          <div className="mx-auto mt-8 max-w-2xl space-y-8">
            <SoundImprovementShowcase
              demoId={enrichment.proof.demoId}
              variant={enrichment.proof.demoVariant}
              context="compact"
              showDisclaimer={enrichment.proof.demoVariant === "restoration"}
            />
            {enrichment.proof.youtubeVideoId ? (
              <LazyYouTubePlayer
                videoId={enrichment.proof.youtubeVideoId}
                title={enrichment.proof.youtubeTitle ?? "דוגמת פודקאסט"}
                withSchema
              />
            ) : null}
          </div>
        ) : enrichment.proof.bullets ? (
          <ul className="mx-auto mt-8 grid max-w-2xl gap-3 sm:grid-cols-2">
            {enrichment.proof.bullets.map((bullet) => (
              <li
                key={`${category.slug}-${bullet}`}
                className="flex gap-2 rounded-xl border border-border bg-background px-4 py-3 text-sm text-muted-foreground"
              >
                <span className="text-brand-red" aria-hidden>
                  ✓
                </span>
                {bullet}
              </li>
            ))}
          </ul>
        ) : null}
        </Container>
      </Section>

      <Section padding="none" className="py-8">
        <JourneyStepsLink variant="online" />
      </Section>

      {relatedCategories.length > 0 ? (
        <Section padding="sm">
          <Container>
          <ServiceHubLinks
            headingId={`online-${slug}-related`}
            heading="קטגוריות קשורות"
            subheading="שירותי אונליין נוספים."
            links={[
              ...relatedCategories.map((related) => ({
                href: `/online/${related.slug}`,
                title: related.title,
                description: related.description,
              })),
              { href: "/online", title: "כל שירותי האונליין", description: "מרכז שירותי אונליין מקצועיים." },
            ]}
          />
          </Container>
        </Section>
      ) : null}

      <Section padding="sm">
        <Container className="max-w-3xl">
        <h2 className="font-serif text-section-title font-semibold text-foreground">למה לבחור בנו?</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {ONLINE_WHY_US.map((item) => (
            <article
              key={`${category.slug}-${item.title}`}
              className="rounded-2xl border border-border bg-background p-5 shadow-sm"
            >
              <h3 className="flex items-center gap-2 text-base font-semibold text-foreground">
                <span aria-hidden>{item.icon}</span>
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {item.detail}
              </p>
            </article>
          ))}
        </div>
        </Container>
      </Section>

      <Section padding="sm">
        <Container className="max-w-3xl">
        <FAQAccordion
          items={faqItems}
          title="שאלות ששואלים אותנו הרבה לפני שמזמינים"
          subtitle={`תשובות על שירותי ${category.title} מרחוק`}
        />
        </Container>
      </Section>

      <Section padding="sm" id="quick-quote" className="border-t border-border">
        <Container>
        <div className="grid gap-8 lg:grid-cols-[1.15fr_1fr] lg:items-start">
          <div className="rounded-2xl border border-border bg-surface p-8">
            <h2 className="font-serif text-section-title font-semibold text-foreground">רוצים שנתחיל?</h2>
            <p className="mt-3 text-sm text-muted-foreground">
              {enrichment.leadDescription}
            </p>
            <Button
              as="a"
              href={ctaHref}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6"
            >
              {enrichment.ctaPrimaryLabel} </Button>
            <div className="mt-5">
              <Link href="/online" className={linkClass}>
                חזרה למרכז שירותי אונליין
              </Link>
            </div>
          </div>
          <CallbackLeadForm
            heading={enrichment.leadHeading}
            description="נחזור אליכם מהר עם התאמה נכונה לפרויקט."
            utmCampaign={`online_${category.slug}_lead`}
            serviceOptions={[category.title, "התאמה אישית", "לא בטוח/ה עדיין"]}
            formLabel={`טופס לידים לקטגוריה ${category.title}`}
          />
        </div>
        </Container>
      </Section>
    </div>
  );
}
