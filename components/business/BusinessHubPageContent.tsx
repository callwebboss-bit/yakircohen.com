import FaqPageSchema from "@/components/seo/FaqPageSchema";
import FAQAccordion from "@/components/ui/FAQAccordion";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import Link from "next/link";
import ServiceHubLinks from "@/components/services/ServiceHubLinks";
import type { HubLinkItem } from "@/components/services/ServiceHubLinks";
import {
  BUSINESS_HUB_FAQS,
  BUSINESS_HUB_GROUPS,
  BUSINESS_HUB_WHATSAPP,
} from "@/lib/data/business-hub-page";
import { buildWhatsAppHref } from "@/lib/whatsapp";
import { TIME_PROMISE_DISCLAIMER } from "@/lib/data/conversion-copy";

function toHubLinks(
  services: (typeof BUSINESS_HUB_GROUPS)[number]["services"],
): HubLinkItem[] {
  return services.map((svc) => ({
    href: svc.href,
    title: svc.title,
    description: svc.description,
    fromPrice: svc.priceHint ? `${svc.priceHint} + מע״מ` : undefined,
    suitedFor: svc.audienceNote,
  }));
}

export default function BusinessHubPageContent() {
  const waHref = buildWhatsAppHref({
    text: BUSINESS_HUB_WHATSAPP,
    utm_source: "website",
    utm_campaign: "business_hub_cta",
  });

  return (
    <article>
      <FaqPageSchema
        items={BUSINESS_HUB_FAQS.map((f) => ({ question: f.question, answer: f.answer as string }))}
      />
      <Section padding="sm" className="border-b border-border">
        <Container className="max-w-5xl">
          <p className="text-xs font-semibold text-muted-foreground">
            לעסקים וארגונים
          </p>
          <h1 className="text-hero mt-4 font-semibold text-foreground">
            הפקת תוכן לעסקים - עם חשבונית מס
          </h1>
          <p className="text-lead mt-4 text-muted-foreground">
            רילז, קריינות מקצועית, פודקאסט לעסק וסרט תדמית. הפקה מלאה עם
            חשבונית מס - תגובה, בדרך כלל תוך 24 שעות. מודיעין, פתח תקווה וכל אזור המרכז.
          </p>
          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-muted-foreground">
            מחפשים שיר במתנה או DJ לחתונה?{" "}
            <Link href="/studio" className="text-brand-red hover:underline">
              אולפן לאירועים משפחתיים
            </Link>{" "}
            ·{" "}
            <Link href="/events" className="text-brand-red hover:underline">
              אירועים
            </Link>
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center rounded-xl bg-brand-red px-6 py-3 text-sm font-semibold text-white hover:bg-brand-red-light"
            >
              ייעוץ עסקי - תגובה, בדרך כלל תוך 24 שעות
            </a>
            <Link
              href="/pricing"
              className="inline-flex min-h-11 items-center rounded-xl border border-border px-6 py-3 text-sm font-semibold text-foreground hover:border-brand-red/40"
            >
              מחירון מלא
            </Link>
          </div>
          <p className="mt-3 max-w-3xl text-xs text-muted-foreground">
            {TIME_PROMISE_DISCLAIMER}
          </p>
        </Container>
      </Section>

      {BUSINESS_HUB_GROUPS.map((group) => (
        <Section key={group.id} padding="sm" className="border-b border-border">
          <Container className="max-w-5xl">
            <ServiceHubLinks
              heading={group.title}
              subheading={group.description}
              links={toHubLinks(group.services)}
              headingId={`business-hub-${group.id}`}
              columns={3}
            />
          </Container>
        </Section>
      ))}

      <Section padding="sm">
        <Container className="max-w-3xl">
          <FAQAccordion
            title="שאלות נפוצות, שירותים לעסקים"
            items={BUSINESS_HUB_FAQS}
            defaultOpenId="b2c-vs-b2b"
          />
        </Container>
      </Section>
    </article>
  );
}
