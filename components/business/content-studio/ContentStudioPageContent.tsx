import Link from "next/link";
import FaqPageSchema from "@/components/seo/FaqPageSchema";
import ServicePageLayout from "@/components/services/ServicePageLayout";
import Container from "@/components/ui/Container";
import FAQAccordion from "@/components/ui/FAQAccordion";
import BookPriceDual from "@/components/booking/BookPriceDual";
import {
  ABOUT_PARAGRAPHS,
  CONTENT_STUDIO_BRAND,
  CONTENT_STUDIO_TAGLINE,
  CONTENT_STUDIO_TERMS,
  CONTENT_STUDIO_TIERS,
  FAQ_ITEMS,
  HUB_WHATSAPP_TEXT,
  PAGE_FEATURES,
  PROCESS_STEPS,
} from "@/lib/data/content-studio";
import { buildWhatsAppHref } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

function tierWhatsApp(tier: (typeof CONTENT_STUDIO_TIERS)[number]) {
  return buildWhatsAppHref({
    text: `${HUB_WHATSAPP_TEXT}\nמעוניין/ת ב: ${tier.name}`,
    utm_source: "website",
    utm_campaign: tier.utmCampaign,
  });
}

export default function ContentStudioPageContent() {
  return (
    <ServicePageLayout
      title={`${CONTENT_STUDIO_BRAND} | ${CONTENT_STUDIO_TAGLINE}`}
      subtitle="2 שעות באולפן, חודש של רילז ושורטס. צילום מרוכז וכתוביות צבעוניות. לעסקים במודיעין, ירושלים והמרכז."
      features={PAGE_FEATURES}
      scarcityLabel="🔥 ריטיינר חודשי, מקומות מוגבלים"
      whatsappText={HUB_WHATSAPP_TEXT}
      utmCampaign="content_studio_hub"
      ctaLabel="דברו איתנו על סושיאל דאמפ"
    >
      <FaqPageSchema
        items={FAQ_ITEMS.map((f) => ({ question: f.question, answer: f.answer as string }))}
      />
      <Container className="space-y-14 py-12 sm:py-16">
        <section aria-labelledby="process-heading">
          <h2
            id="process-heading"
            className="font-serif text-section-title font-semibold text-foreground"
          >
            איך זה עובד
          </h2>
          <ol className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {PROCESS_STEPS.map((step) => (
              <li
                key={step.step}
                className="rounded-2xl border border-border bg-surface p-5"
              >
                <span className="text-xs font-bold text-brand-red">
                  שלב {step.step}
                </span>
                <h3 className="mt-2 font-semibold text-foreground">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">{step.body}</p>
              </li>
            ))}
          </ol>
        </section>

        <section aria-labelledby="pricing-heading">
          <h2
            id="pricing-heading"
            className="font-serif text-section-title font-semibold text-foreground"
          >
            חבילות ומחירים
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {CONTENT_STUDIO_TERMS.vatNote}
          </p>
          <ul className="mt-8 grid gap-6 lg:grid-cols-3">
            {CONTENT_STUDIO_TIERS.map((tier) => (
              <li
                key={tier.id}
                className={cn(
                  "flex flex-col rounded-2xl border p-6",
                  tier.badge === "הנבחרת"
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
                <p className="mt-2 text-2xl font-bold text-foreground">
                  {tier.priceLabel}
                </p>
                {tier.priceNote ? (
                  <p className="text-xs text-muted-foreground">{tier.priceNote}</p>
                ) : null}
                <BookPriceDual exVat={tier.priceNis} className="mt-1" />
                <p className="mt-3 text-sm text-muted-foreground">
                  {tier.description}
                </p>
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
                  href={tierWhatsApp(tier)}
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

        <section aria-labelledby="about-heading">
          <h2 id="about-heading" className="sr-only">
            אודות {CONTENT_STUDIO_BRAND}
          </h2>
          <div className="mx-auto max-w-3xl space-y-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
            {ABOUT_PARAGRAPHS.map((p) => (
              <p key={p.slice(0, 40)}>{p}</p>
            ))}
          </div>
        </section>

        <section
          className="rounded-xl border border-border bg-muted/30 p-6"
          aria-label="הבחנה בין שירותים"
        >
          <h2 className="text-sm font-semibold text-foreground">
            לא בטוחים מה מתאים?
          </h2>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li>
              <strong className="text-foreground">צילום בעסק + ניהול עמודים:</strong>{" "}
              <Link href="/business/social-media" className="text-brand-red hover:underline">
                ניהול סושיאל
              </Link>
            </li>
            <li>
              <strong className="text-foreground">עריכת חומר מאירוע (DJ/צלם):</strong>{" "}
              <Link href="/business/reel-factory" className="text-brand-red hover:underline">
                מפעל הרילס לספקים
              </Link>
            </li>
            <li>
              <strong className="text-foreground">פרק פודקאסט ארוך:</strong>{" "}
              <Link href="/podcast" className="text-brand-red hover:underline">
                מרכז הפודקאסט
              </Link>
            </li>
          </ul>
        </section>

        <FAQAccordion
          title={`שאלות נפוצות, ${CONTENT_STUDIO_BRAND}`}
          items={FAQ_ITEMS}
          defaultOpenId="vs-social-media"
        />

        <nav aria-label="קישורים קשורים" className="border-t border-border pt-8">
          <h2 className="text-sm font-semibold text-foreground">שירותים קשורים</h2>
          <ul className="mt-3 flex flex-wrap gap-3 text-sm">
            <li>
              <Link href="/business" className="text-brand-red hover:underline">
                מרכז לעסקים
              </Link>
            </li>
            <li>
              <Link href="/business/social-media" className="text-brand-red hover:underline">
                ניהול סושיאל
              </Link>
            </li>
            <li>
              <Link href="/video/corporate-video" className="text-brand-red hover:underline">
                סרט תדמית
              </Link>
            </li>
            <li>
              <Link href="/pricing" className="text-brand-red hover:underline">
                מחירון
              </Link>
            </li>
          </ul>
        </nav>
      </Container>
    </ServicePageLayout>
  );
}
