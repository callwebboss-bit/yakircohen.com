import Link from "next/link";
import ProServiceWizard from "@/components/marketing/ProServiceWizard";
import ProServiceTopicCta from "@/components/marketing/ProServiceTopicCta";
import ProcessSteps from "@/components/marketing/ProcessSteps";
import FAQAccordion from "@/components/ui/FAQAccordion";
import ServicePageLayout from "@/components/services/ServicePageLayout";
import ContextualIntroParagraph from "@/components/seo/ContextualIntroParagraph";
import ShowcaseVideoSection from "@/components/seo/ShowcaseVideoSection";
import PageRelatedFooter from "@/components/seo/PageRelatedFooter";
import ServiceBlogStrip from "@/components/blog/ServiceBlogStrip";
import BusinessCrossLink from "@/components/marketing/BusinessCrossLink";
import DjHubCockpitTabs from "@/components/seo/DjHubCockpitTabs";
import DjProducerHubIntro from "@/components/seo/DjProducerHubIntro";
import { getBlogPostsBySlugs } from "@/lib/data/blog";
import { PRE_BUILT_SETS_CATALOG } from "@/lib/data/pre-built-sets-catalog";
import {
  getProService,
  type ProServiceId,
} from "@/lib/data/pro-services";
import { formatFromPriceDual, getExVat } from "@/lib/data/pricing-catalog";
import { SERVICE_SHOWCASE_VIDEO_ID } from "@/lib/service-portfolio-hero";

type ProServicePageContentProps = {
  serviceId: ProServiceId;
};

export default function ProServicePageContent({
  serviceId,
}: ProServicePageContentProps) {
  const service = getProService(serviceId);
  const startingPrice = formatFromPriceDual(getExVat(service.pricingId));
  const hasShowcase = Boolean(service.showcasePlaylistId);
  const relatedPosts = service.relatedBlogSlugs?.length
    ? getBlogPostsBySlugs(service.relatedBlogSlugs)
    : [];

  return (
    <ServicePageLayout
      title={service.title}
      subtitle={service.subtitle}
      features={service.features}
      utmCampaign={service.utmCampaign}
      bookSlug={service.slug}
      pagePath={service.path}
      faqs={service.faqs}
      category={service.department}
      scarcityLabel={service.scarcityLabel ?? "שירות מקצועי - זמינות לפי יומן"}
      heroScrollTarget={hasShowcase ? "video" : undefined}
      heroVideoSectionId={SERVICE_SHOWCASE_VIDEO_ID}
      showHeroScrollLink={hasShowcase}
    >
      <div className="mx-auto max-w-[72rem] space-y-16 px-4 sm:px-6 lg:px-8">
        <ContextualIntroParagraph pathname={service.path} className="max-w-3xl" />

        {serviceId === "mashup-fixer" ? <DjProducerHubIntro /> : null}

        {serviceId === "mashup-fixer" && service.seoParagraphs.length > 0 ? (
          <section aria-labelledby="about-mashup-fixer">
            <h2 id="about-mashup-fixer" className="text-2xl font-semibold text-foreground">
              {service.aboutHeading ?? "על השירות"}
            </h2>
            <div className="mt-4 max-w-3xl space-y-4 text-sm leading-relaxed text-muted-foreground">
              {service.seoParagraphs.map((p) => (
                <p key={p.slice(0, 40)}>{p}</p>
              ))}
            </div>
          </section>
        ) : null}

        {serviceId === "mashup-fixer" ? <DjHubCockpitTabs service={service} /> : null}

        {serviceId !== "mashup-fixer" && service.seoParagraphs.length > 0 ? (
          <section aria-labelledby={`about-${service.id}`}>
            <h2
              id={`about-${service.id}`}
              className="text-2xl font-semibold text-foreground"
            >
              {service.aboutHeading ?? "על השירות"}
            </h2>
            <div className="mt-4 max-w-3xl space-y-4 text-sm leading-relaxed text-muted-foreground">
              {service.seoParagraphs.map((p) => (
                <p key={p.slice(0, 40)}>{p}</p>
              ))}
            </div>
          </section>
        ) : null}

        {service.showcasePlaylistId ? (
          <ShowcaseVideoSection playlistId={service.showcasePlaylistId} />
        ) : null}

        {service.crossLinks?.length ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {service.crossLinks.map((link) => (
              <BusinessCrossLink
                key={link.href}
                title={link.title}
                text={link.text}
                href={link.href}
                linkLabel={link.linkLabel}
              />
            ))}
          </div>
        ) : null}

        {service.canonicalNote ? (
          <p className="max-w-2xl text-sm text-muted-foreground">{service.canonicalNote}</p>
        ) : null}

        <ProcessSteps steps={[...service.processSteps]} />

        {serviceId === "pre-built-sets" ? (
          <section aria-labelledby="sets-catalog-heading">
            <h2
              id="sets-catalog-heading"
              className="text-2xl font-semibold text-foreground"
            >
              קטלוג סטים 2026
            </h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {PRE_BUILT_SETS_CATALOG.map((set) => (
                <article
                  key={set.id}
                  className="rounded-xl border border-border bg-surface p-5"
                >
                  <h3 className="font-semibold text-foreground">{set.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{set.description}</p>
                  <p className="mt-3 text-xs text-muted-foreground">
                    {set.durationMinutes} דקות - {set.trackCount} שירים - קצב {set.bpmRange}
                  </p>
                  <p className="mt-2 text-sm font-semibold text-brand-red">
                    {set.priceExVat.toLocaleString("he-IL")} ₪ + מע״מ
                  </p>
                </article>
              ))}
            </div>
          </section>
        ) : null}

        {service.simpleCta ? (
          <>
            <ProServiceTopicCta service={service} config={service.simpleCta} />
            <details className="group rounded-2xl border border-border bg-surface">
              <summary className="cursor-pointer list-none px-6 py-4 text-sm font-medium text-muted-foreground marker:content-none [&::-webkit-details-marker]:hidden">
                <span className="group-open:hidden">
                  {service.simpleCta.calculatorSummary ?? "רוצים הערכת מחיר מדויקת?"}
                </span>
                <span className="hidden group-open:inline">הסתרת מחשבון המחיר</span>
              </summary>
              <div className="border-t border-border px-2 pb-2 pt-0">
                <ProServiceWizard service={service} />
              </div>
            </details>
          </>
        ) : serviceId !== "mashup-fixer" ? (
          <ProServiceWizard service={service} />
        ) : null}

        <section
          className="rounded-2xl border border-border bg-surface px-6 py-8 text-center"
          aria-labelledby="pro-pricing-heading"
        >
          <h2 id="pro-pricing-heading" className="text-xl font-semibold text-foreground">
            מחיר התחלתי
          </h2>
          <p className="mt-2 text-lg font-semibold text-brand-red">{startingPrice}</p>
          <p className="mt-2 text-sm text-muted-foreground">
            {service.simpleCta
              ? "הצעה סופית אחרי שיחה קצרה או מחשבון מפורט"
              : "הצעה סופית לאחר ויזארד או שיחה קצרה"}
          </p>
        </section>

        <FAQAccordion
          items={service.faqs.map((f, i) => ({
            id: `faq-${service.id}-${i}`,
            question: f.question,
            answer: f.answer,
          }))}
        />

        {relatedPosts.length > 0 ? (
          <ServiceBlogStrip
            posts={relatedPosts}
            heading="מאמרים שקשורים לנושא"
          />
        ) : null}

        <PageRelatedFooter pathname={service.path} />

        <p className="text-center text-sm text-muted-foreground">
          <Link href="/pro" className="font-medium text-brand-red hover:underline">
            חזרה למרכז השירותים המקצועיים
          </Link>
        </p>
      </div>
    </ServicePageLayout>
  );
}
