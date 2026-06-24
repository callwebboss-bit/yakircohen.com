import Link from "next/link";
import FAQAccordion from "@/components/ui/FAQAccordion";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import type { AudienceLandingConfig } from "@/lib/data/audience-landings";
import { buildWhatsAppHref } from "@/lib/whatsapp";

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
              קבלו הצעה תוך 24 שעות
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
        </Container>
      </Section>

      {config.groups.map((group) => (
        <Section key={group.id} padding="sm" className="border-b border-border">
          <Container className="max-w-5xl">
            <h2 className="font-serif text-section-title font-semibold text-foreground">
              {group.title}
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
              {group.description}
            </p>
            <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {group.services.map((svc) => (
                <li key={svc.id}>
                  <Link
                    href={svc.href}
                    className="flex h-full flex-col rounded-2xl border border-border bg-surface p-5 transition-colors hover:border-brand-red/40"
                  >
                    <span className="text-2xl" aria-hidden>
                      {svc.icon}
                    </span>
                    <h3 className="mt-3 font-semibold text-foreground">
                      {svc.title}
                    </h3>
                    <p className="mt-2 flex-1 text-sm text-muted-foreground">
                      {svc.description}
                    </p>
                    {svc.priceHint ? (
                      <p className="mt-3 text-sm font-semibold text-brand-red">
                        {svc.priceHint}
                        <span className="font-normal text-muted-foreground">
                          {" "}
                          + מע״מ
                        </span>
                      </p>
                    ) : null}
                    {svc.audienceNote ? (
                      <p className="mt-2 text-xs text-muted-foreground">
                        {svc.audienceNote}
                      </p>
                    ) : null}
                    <span className="mt-4 text-sm font-semibold text-brand-red">
                      לפרטים ←
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
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
