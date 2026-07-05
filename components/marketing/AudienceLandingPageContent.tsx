import Link from "next/link";
import FAQAccordion from "@/components/ui/FAQAccordion";
import FaqPageSchema from "@/components/seo/FaqPageSchema";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import ServiceHubLinks from "@/components/services/ServiceHubLinks";
import type { HubLinkItem } from "@/components/services/ServiceHubLinks";
import type { AudienceLandingConfig } from "@/lib/data/audience-landings";
import { buildWhatsAppHref } from "@/lib/whatsapp";
import { TIME_PROMISE_DISCLAIMER } from "@/lib/data/conversion-copy";

function toHubLinks(
  services: AudienceLandingConfig["groups"][number]["services"],
): HubLinkItem[] {
  return services.map((svc) => ({
    href: svc.href,
    title: svc.title,
    description: svc.description,
    fromPrice: svc.priceHint ? `${svc.priceHint} + מע״מ` : undefined,
    suitedFor: svc.audienceNote,
  }));
}

type AudienceLandingPageContentProps = {
  config: AudienceLandingConfig;
};

export default function AudienceLandingPageContent({
  config,
}: AudienceLandingPageContentProps) {
  const waHref = buildWhatsAppHref({
    text: config.whatsappText,
    utm_source: "website",
    utm_campaign: config.utmCampaign,
  });

  return (
    <article>
      <FaqPageSchema
        items={config.faqs.map((faq) => ({
          question: faq.question,
          answer: typeof faq.answer === "string" ? faq.answer : "",
        }))}
      />
      <Section padding="sm" className="border-b border-border">
        <Container className="max-w-5xl">
          <p className="text-xs font-semibold text-muted-foreground">
            {config.kicker}
          </p>
          <h1 className="text-hero mt-4 font-semibold text-foreground">
            {config.h1}
          </h1>
          <p className="text-lead mt-4 text-muted-foreground">{config.lead}</p>
          {config.crossLink ? (
            <p className="mt-4 max-w-3xl text-sm leading-relaxed text-muted-foreground">
              {config.crossLink.before}
              <Link
                href={config.crossLink.href}
                className="text-brand-red hover:underline"
              >
                {config.crossLink.label}
              </Link>
              {config.crossLink.after}
            </p>
          ) : null}
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center rounded-xl bg-brand-red px-6 py-3 text-sm font-semibold text-white hover:bg-brand-red-light"
            >
              קבלו הצעה, בדרך כלל תוך 24 שעות
            </a>
            <Link
              href="/book"
              className="inline-flex min-h-11 items-center rounded-xl border border-border px-6 py-3 text-sm font-semibold text-foreground hover:border-brand-red/40"
            >
              הזמנה מקוונת
            </Link>
            <Link
              href="/packages"
              className="inline-flex min-h-11 items-center rounded-xl border border-border px-6 py-3 text-sm font-semibold text-foreground hover:border-brand-red/40"
            >
              חבילות ומחירים
            </Link>
          </div>
          <p className="mt-3 max-w-3xl text-xs text-muted-foreground">
            {TIME_PROMISE_DISCLAIMER}
          </p>
        </Container>
      </Section>

      {config.groups.map((group) => (
        <Section key={group.id} padding="sm" className="border-b border-border">
          <Container className="max-w-5xl">
            <ServiceHubLinks
              heading={group.title}
              subheading={group.description}
              links={toHubLinks(group.services)}
              headingId={`audience-${config.utmCampaign}-${group.id}`}
              columns={3}
            />
          </Container>
        </Section>
      ))}

      <Section padding="sm">
        <Container className="max-w-3xl">
          <FAQAccordion
            title="שאלות נפוצות"
            items={[...config.faqs]}
            defaultOpenId={config.faqs[0]?.id}
          />
        </Container>
      </Section>
    </article>
  );
}
