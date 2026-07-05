import Link from "next/link";
import ContextualIntroParagraph from "@/components/seo/ContextualIntroParagraph";
import FaqPageSchema from "@/components/seo/FaqPageSchema";
import ServiceHubLinks from "@/components/services/ServiceHubLinks";
import type { HubLinkItem } from "@/components/services/ServiceHubLinks";
import ServicePageLayout from "@/components/services/ServicePageLayout";
import Container from "@/components/ui/Container";
import FAQAccordion from "@/components/ui/FAQAccordion";
import BookPriceDual from "@/components/booking/BookPriceDual";
import type { BusinessPageConfig } from "@/lib/data/business-tier-types";
import { buildWhatsAppHref } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

function tierWhatsApp(config: BusinessPageConfig, tier: BusinessPageConfig["tiers"][number]) {
  return buildWhatsAppHref({
    text: `${config.hubWhatsappText}\nמעוניין/ת ב: ${tier.name}`,
    utm_source: "website",
    utm_campaign: tier.utmCampaign,
  });
}

type Props = {
  config: BusinessPageConfig;
  pagePath: string;
};

function buildRelatedHubLinks(config: BusinessPageConfig): HubLinkItem[] {
  return [
    {
      href: "/business",
      title: "מרכז לעסקים",
      description: "כל שירותי התוכן וההפקה לעסקים.",
    },
    ...(config.relatedLinks ?? []).map((link) => ({
      href: link.href,
      title: link.label,
      description: link.label,
    })),
    {
      href: "/pricing",
      title: "מחירון",
      description: "מחירים לפני ואחרי מע״מ לכל השירותים באתר.",
    },
  ];
}

export default function BusinessTierPageContent({ config, pagePath }: Props) {
  const title = config.tagline
    ? `${config.brand} | ${config.tagline}`
    : config.pageTitle;

  return (
    <ServicePageLayout
        title={title}
        subtitle={config.subtitle}
        features={config.pageFeatures}
        scarcityLabel={config.scarcityLabel}
        whatsappText={config.hubWhatsappText}
        utmCampaign={config.utmCampaign}
        ctaLabel={config.ctaLabel ?? "דברו איתנו בוואטסאפ"}
      >
      {config.faqs.length > 0 ? (
        <FaqPageSchema
          items={config.faqs.map((f) => ({ question: f.question, answer: f.answer as string }))}
        />
      ) : null}
      <Container className="space-y-14 py-12 sm:py-16">
        <ContextualIntroParagraph pathname={pagePath} />
        {config.processSteps && config.processSteps.length > 0 ? (
          <section aria-labelledby="process-heading">
            <h2
              id="process-heading"
              className="font-serif text-section-title font-semibold text-foreground"
            >
              איך זה עובד
            </h2>
            <ol className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {config.processSteps.map((step) => (
                <li
                  key={step.step}
                  className="rounded-2xl border border-border bg-surface p-5"
                >
                  <span className="text-xs font-bold text-brand-red">
                    שלב {step.step}
                  </span>
                  <h3 className="mt-2 font-semibold text-foreground">{step.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{step.body}</p>
                </li>
              ))}
            </ol>
          </section>
        ) : null}

        <section aria-labelledby="pricing-heading">
          <h2
            id="pricing-heading"
            className="font-serif text-section-title font-semibold text-foreground"
          >
            חבילות ומחירים
          </h2>
          {config.termsVatNote ? (
            <p className="mt-2 text-sm text-muted-foreground">{config.termsVatNote}</p>
          ) : (
            <p className="mt-2 text-sm text-muted-foreground">המחירים לפני מע״מ</p>
          )}
          <ul
            className={cn(
              "mt-8 grid gap-6",
              config.tiers.length === 2 && "lg:grid-cols-2",
              config.tiers.length === 3 && "lg:grid-cols-3",
              config.tiers.length >= 4 && "sm:grid-cols-2 lg:grid-cols-2",
            )}
          >
            {config.tiers.map((tier) => (
              <li
                key={tier.id}
                className={cn(
                  "flex flex-col rounded-2xl border p-6",
                  tier.badge === "הנבחרת" || tier.badge === "הכי משתלם"
                    ? "border-brand-red/50 bg-brand-red/5"
                    : "border-border bg-surface",
                )}
              >
                {tier.badge ? (
                  <span className="mb-3 inline-flex w-fit rounded-full bg-brand-red/10 px-3 py-1 text-xs font-semibold text-brand-red">
                    {tier.badge}
                  </span>
                ) : null}
                <h3 className="font-semibold text-foreground">{tier.name}</h3>
                <p className="mt-2 text-2xl font-bold text-foreground">{tier.priceLabel}</p>
                {tier.priceNote ? (
                  <p className="text-xs text-muted-foreground">{tier.priceNote}</p>
                ) : null}
                <BookPriceDual exVat={tier.priceNis} className="mt-1" />
                <p className="mt-3 text-sm text-muted-foreground">{tier.description}</p>
                <ul className="mt-4 flex-1 space-y-2 text-sm text-muted-foreground">
                  {tier.deliverables.map((d) => (
                    <li key={d} className="flex gap-2">
                      <span className="text-brand-red" aria-hidden>
                        ✓
                      </span>
                      {d}
                    </li>
                  ))}
                </ul>
                <a
                  href={tierWhatsApp(config, tier)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 inline-flex min-h-11 items-center justify-center rounded-xl bg-brand-red px-4 py-3 text-sm font-semibold text-white hover:bg-brand-red-light"
                >
                  הזמנה בוואטסאפ
                </a>
              </li>
            ))}
          </ul>
        </section>

        {config.aboutParagraphs.length > 0 ? (
          <section aria-labelledby="about-heading">
            <h2 id="about-heading" className="sr-only">
              אודות {config.brand}
            </h2>
            <div className="mx-auto max-w-3xl space-y-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
              {config.aboutParagraphs.map((p) => (
                <p key={p.slice(0, 40)}>{p}</p>
              ))}
            </div>
          </section>
        ) : null}

        {config.differentiation && config.differentiation.length > 0 ? (
          <section
            className="rounded-xl border border-border bg-muted/30 p-6"
            aria-label="הבחנה בין שירותים"
          >
            <h2 className="text-sm font-semibold text-foreground">לא בטוחים מה מתאים?</h2>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              {config.differentiation.map((item) => (
                <li key={item.href}>
                  <strong className="text-foreground">{item.label}</strong> →{" "}
                  <Link href={item.href} className="text-brand-red hover:underline">
                    {item.note}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        <FAQAccordion title={`שאלות נפוצות, ${config.brand}`} items={config.faqs} />

        <ServiceHubLinks
          headingId="business-related-heading"
          heading="שירותים קשורים"
          subheading="מסלולים נוספים באתר שמשלימים את השירות."
          links={buildRelatedHubLinks(config)}
          columns={3}
        />
      </Container>
    </ServicePageLayout>
  );
}
