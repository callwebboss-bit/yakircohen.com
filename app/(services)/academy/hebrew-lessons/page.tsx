import type { Metadata } from "next";
import Link from "next/link";
import FAQWithCtaLinks from "@/components/ui/FAQWithCtaLinks";
import ShareButton from "@/components/ui/ShareButton";
import { buildWhatsAppHref } from "@/lib/whatsapp";
import { SITE_URL } from "@/lib/site-url";
import { SITE_ROBOTS } from "@/lib/seo-config";
import {
  HEB_LESSONS_EN_META,
  HEB_LESSONS_EN_HERO,
  HEB_LESSONS_EN_VALUE_PROPS,
  HEB_LESSONS_EN_METHOD,
  HEB_LESSONS_EN_AUDIENCE,
  HEB_LESSONS_EN_COMPARISON,
  HEB_LESSONS_EN_PRICING,
  HEB_LESSONS_EN_HOW_IT_WORKS,
  HEB_LESSONS_EN_TESTIMONIAL,
  HEB_LESSONS_EN_FAQ,
  HEB_LESSONS_EN_CTA,
} from "@/lib/data/academy-hebrew-lessons-en";

const PAGE_URL = `${SITE_URL}/academy/hebrew-lessons`;

export const metadata: Metadata = {
  title: { absolute: HEB_LESSONS_EN_META.title },
  description: HEB_LESSONS_EN_META.description,
  keywords: [...HEB_LESSONS_EN_META.keywords],
  alternates: {
    canonical: PAGE_URL,
    languages: {
      en: PAGE_URL,
      "he-IL": `${SITE_URL}/academy/ulpan`,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Yakir Cohen Productions",
    url: PAGE_URL,
    title: HEB_LESSONS_EN_META.title,
    description: HEB_LESSONS_EN_META.description,
  },
  twitter: {
    card: "summary_large_image",
    title: HEB_LESSONS_EN_META.title,
    description: HEB_LESSONS_EN_META.description,
  },
  robots: SITE_ROBOTS,
};

const pageSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": `${PAGE_URL}#webpage`,
      url: PAGE_URL,
      name: HEB_LESSONS_EN_META.title,
      description: HEB_LESSONS_EN_META.description,
      inLanguage: "en",
      isPartOf: { "@id": `${SITE_URL}/#website` },
      about: { "@id": `${PAGE_URL}#service` },
    },
    {
      "@type": "Service",
      "@id": `${PAGE_URL}#service`,
      name: "Private Hebrew Lessons - Yakir Cohen",
      description: HEB_LESSONS_EN_META.description,
      url: PAGE_URL,
      serviceType: "Private Hebrew Tutoring",
      category: "Language Education",
      inLanguage: "he",
      provider: { "@id": `${SITE_URL}/#organization` },
      areaServed: [
        { "@type": "City", name: "Modi'in-Maccabim-Re'ut" },
        { "@type": "City", name: "Shoham" },
        { "@type": "City", name: "Rishon LeZion" },
        { "@type": "AdministrativeArea", name: "Central District, Israel" },
      ],
      availableLanguage: ["en", "ru", "ar", "am", "es"],
      offers: [
        {
          "@type": "Offer",
          name: "Trial Lesson",
          price: "500",
          priceCurrency: "ILS",
          url: PAGE_URL,
          availability: "https://schema.org/LimitedAvailability",
        },
        {
          "@type": "Offer",
          name: "Monthly Plan",
          price: "3200",
          priceCurrency: "ILS",
          url: PAGE_URL,
        },
        {
          "@type": "Offer",
          name: "Annual Plan",
          price: "11520",
          priceCurrency: "ILS",
          url: PAGE_URL,
        },
      ],
      review: {
        "@type": "Review",
        author: { "@type": "Person", name: HEB_LESSONS_EN_TESTIMONIAL.author },
        reviewBody: HEB_LESSONS_EN_TESTIMONIAL.quote,
        reviewRating: { "@type": "Rating", ratingValue: "5", bestRating: "5" },
      },
    },
    {
      "@type": "FAQPage",
      "@id": `${PAGE_URL}#faq`,
      mainEntity: HEB_LESSONS_EN_FAQ.map(({ question, answer }) => ({
        "@type": "Question",
        name: question,
        acceptedAnswer: { "@type": "Answer", text: answer },
      })),
    },
  ],
};

export default function HebrewLessonsPage() {
  const heroWhatsappHref = buildWhatsAppHref({
    text: HEB_LESSONS_EN_CTA.whatsappHero,
    utm_source: "academy",
    utm_campaign: "hebrew_lessons_en_hero",
  });
  const bottomWhatsappHref = buildWhatsAppHref({
    text: HEB_LESSONS_EN_CTA.whatsappBottom,
    utm_source: "academy",
    utm_campaign: "hebrew_lessons_en_bottom",
  });

  return (
    <div dir="ltr" lang="en" className="bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pageSchema) }}
      />

      {/* ── Hero ── */}
      <section className="relative overflow-hidden border-b border-border bg-background">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_55%_at_50%_-10%,rgba(212,43,43,0.12),transparent_55%)]"
          aria-hidden="true"
        />
        <div className="relative mx-auto max-w-3xl px-4 py-16 text-center sm:px-6 sm:py-20 lg:px-8">
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex flex-wrap items-center justify-center gap-2 text-xs text-muted-foreground">
              <li>
                <Link
                  href="/"
                  className="hover:text-brand-red focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red"
                >
                  Home
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link
                  href="/academy"
                  className="hover:text-brand-red focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red"
                >
                  Academy
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li className="font-medium text-foreground" aria-current="page">
                Hebrew Lessons
              </li>
            </ol>
          </nav>

          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-red">
            {HEB_LESSONS_EN_HERO.eyebrow}
          </p>

          <h1 className="mt-3 font-serif text-3xl font-semibold leading-tight tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            {HEB_LESSONS_EN_HERO.h1}
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            {HEB_LESSONS_EN_HERO.subtitle}
          </p>

          {HEB_LESSONS_EN_HERO.painIntro.map((line, i) => (
            <p
              key={i}
              className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground"
            >
              {line}
            </p>
          ))}

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/book"
              className="inline-flex items-center gap-2 rounded-xl bg-brand-red px-7 py-3 text-sm font-semibold text-white shadow-[0_0_20px_rgba(212,43,43,0.35)] transition-[background-color,box-shadow] hover:bg-brand-red-light hover:shadow-[0_0_32px_rgba(212,43,43,0.45)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red"
            >
              {HEB_LESSONS_EN_CTA.heroPrimary}
            </Link>
            <a
              href={heroWhatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl border border-border bg-background px-7 py-3 text-sm font-semibold text-foreground transition-colors hover:border-brand-red/40 hover:text-brand-red focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red"
              aria-label="Contact Yakir on WhatsApp about Hebrew lessons"
            >
              {HEB_LESSONS_EN_CTA.heroWhatsapp}
            </a>
          </div>

          <p className="mt-4 text-xs text-muted-foreground">
            Also available in Hebrew:{" "}
            <Link href="/academy/ulpan" className="hover:text-brand-red underline">
              שיעור פרטי עברית במודיעין
            </Link>
          </p>
        </div>
      </section>

      {/* ── Value Props ── */}
      <section className="mx-auto max-w-[72rem] px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
        <header className="mb-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-red">
            Why Private Lessons
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            What Makes This Different
          </h2>
        </header>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {HEB_LESSONS_EN_VALUE_PROPS.map((prop) => (
            <div
              key={prop.id}
              className="rounded-2xl border border-border bg-background p-6"
            >
              <h3 className="text-sm font-semibold text-foreground">{prop.title}</h3>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                {prop.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Audience ── */}
      <section className="border-t border-border bg-surface py-14 sm:py-16">
        <div className="mx-auto max-w-[72rem] px-4 sm:px-6 lg:px-8">
          <header className="mb-8 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-red">
              Who It&apos;s For
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              {HEB_LESSONS_EN_AUDIENCE.heading}
            </h2>
          </header>
          <ul className="mx-auto max-w-2xl space-y-3">
            {HEB_LESSONS_EN_AUDIENCE.items.map((item, i) => (
              <li
                key={i}
                className="flex items-start gap-3 rounded-xl border border-border bg-background px-5 py-4 text-sm text-foreground"
              >
                <span className="mt-0.5 text-brand-red" aria-hidden="true">✓</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Method ── */}
      <section className="mx-auto max-w-[72rem] px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
        <header className="mb-8 text-center sm:text-start">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-red">
            The Method
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            {HEB_LESSONS_EN_METHOD.heading}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {HEB_LESSONS_EN_METHOD.subheading}
          </p>
        </header>
        <ul className="space-y-4">
          {HEB_LESSONS_EN_METHOD.points.map((point, i) => (
            <li
              key={i}
              className="flex items-start gap-4 rounded-xl border border-border bg-background p-5"
            >
              <span
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-red/10 text-xs font-bold text-brand-red"
                aria-hidden="true"
              >
                {i + 1}
              </span>
              <p className="text-sm leading-relaxed text-foreground">{point}</p>
            </li>
          ))}
        </ul>
        <p className="mt-6 text-center text-xs text-muted-foreground">
          {HEB_LESSONS_EN_METHOD.supportLanguages}
        </p>
      </section>

      {/* ── Comparison Table ── */}
      <section className="border-t border-border bg-surface py-14 sm:py-16">
        <div className="mx-auto max-w-[72rem] px-4 sm:px-6 lg:px-8">
          <header className="mb-8 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-red">
              Comparison
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              {HEB_LESSONS_EN_COMPARISON.heading}
            </h2>
          </header>
          <div className="overflow-x-auto rounded-2xl border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-surface">
                  <th className="px-5 py-3 text-start text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Feature
                  </th>
                  <th className="px-5 py-3 text-start text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Government Ulpan
                  </th>
                  <th className="px-5 py-3 text-start text-xs font-semibold uppercase tracking-wide text-brand-red">
                    Private with Yakir
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border bg-background">
                {HEB_LESSONS_EN_COMPARISON.rows.map((row) => (
                  <tr key={row.label}>
                    <td className="px-5 py-4 font-medium text-foreground">{row.label}</td>
                    <td className="px-5 py-4 text-muted-foreground">{row.gov}</td>
                    <td className="px-5 py-4 font-medium text-foreground">{row.private}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-5 text-center text-xs leading-relaxed text-muted-foreground">
            {HEB_LESSONS_EN_COMPARISON.closing}
          </p>
        </div>
      </section>

      {/* ── Pricing ── */}
      <section className="mx-auto max-w-[72rem] px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
        <header className="mb-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-red">
            Pricing
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            {HEB_LESSONS_EN_PRICING.heading}
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground">
            {HEB_LESSONS_EN_PRICING.subheading}
          </p>
        </header>

        <div className="grid gap-5 sm:grid-cols-2">
          {/* Monthly */}
          <div className="rounded-2xl border border-border bg-background p-6">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {HEB_LESSONS_EN_PRICING.monthly.name}
            </p>
            <p className="mt-2 text-3xl font-bold text-foreground">
              {HEB_LESSONS_EN_PRICING.monthly.price}
              <span className="ml-1 text-sm font-normal text-muted-foreground">
                {HEB_LESSONS_EN_PRICING.monthly.period}
              </span>
            </p>
            <ul className="mt-5 space-y-2">
              {HEB_LESSONS_EN_PRICING.monthly.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-xs text-foreground">
                  <span className="text-brand-red" aria-hidden="true">✓</span>
                  {f}
                </li>
              ))}
            </ul>
          </div>

          {/* Annual */}
          <div className="relative rounded-2xl border-2 border-brand-red/40 bg-background p-6">
            <span className="absolute -top-3 left-5 rounded-full bg-brand-red px-3 py-1 text-xs font-semibold text-white">
              {HEB_LESSONS_EN_PRICING.annual.badge}
            </span>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {HEB_LESSONS_EN_PRICING.annual.name}
            </p>
            <p className="mt-2 text-3xl font-bold text-foreground">
              {HEB_LESSONS_EN_PRICING.annual.price}
              <span className="ml-1 text-sm font-normal text-muted-foreground">
                {HEB_LESSONS_EN_PRICING.annual.period}
              </span>
            </p>
            <p className="mt-1 text-xs text-brand-red">{HEB_LESSONS_EN_PRICING.annual.trialNote}</p>
            <ul className="mt-5 space-y-2">
              {HEB_LESSONS_EN_PRICING.annual.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-xs text-foreground">
                  <span className="text-brand-red" aria-hidden="true">✓</span>
                  {f}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Trial CTA */}
        <div className="mt-8 rounded-2xl border border-border bg-surface p-6 text-center">
          <h3 className="text-base font-semibold text-foreground">
            {HEB_LESSONS_EN_PRICING.trial.heading}
          </h3>
          <p className="mx-auto mt-2 max-w-lg text-sm text-muted-foreground">
            {HEB_LESSONS_EN_PRICING.trial.intro}
          </p>
          <p className="mt-2 text-xs text-muted-foreground">
            {HEB_LESSONS_EN_PRICING.trial.scarcity}
          </p>
          <Link
            href="/book"
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-brand-red px-7 py-3 text-sm font-semibold text-white shadow-[0_0_20px_rgba(212,43,43,0.35)] transition-[background-color,box-shadow] hover:bg-brand-red-light hover:shadow-[0_0_32px_rgba(212,43,43,0.45)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red"
          >
            Book My Trial Lesson - ₪500
          </Link>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="border-t border-border bg-surface py-14 sm:py-16">
        <div className="mx-auto max-w-[72rem] px-4 sm:px-6 lg:px-8">
          <header className="mb-8 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-red">
              Getting Started
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              How It Works
            </h2>
          </header>
          <ol className="grid gap-5 sm:grid-cols-3">
            {HEB_LESSONS_EN_HOW_IT_WORKS.map((step) => (
              <li
                key={step.step}
                className="rounded-2xl border border-border bg-background p-6"
              >
                <span className="text-3xl font-bold text-brand-red/20">{step.step}</span>
                <h3 className="mt-3 text-sm font-semibold text-foreground">{step.title}</h3>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                  {step.description}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── Testimonial ── */}
      <section className="mx-auto max-w-2xl px-4 py-14 text-center sm:px-6 sm:py-16 lg:px-8">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-red">
          Student Review
        </p>
        <blockquote className="mt-5">
          <p className="text-base leading-relaxed text-foreground before:content-['\201C'] after:content-['\201D']">
            {HEB_LESSONS_EN_TESTIMONIAL.quote}
          </p>
          <footer className="mt-4">
            <p className="text-sm font-semibold text-foreground">
              - {HEB_LESSONS_EN_TESTIMONIAL.author}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {HEB_LESSONS_EN_TESTIMONIAL.languages} · Goal: {HEB_LESSONS_EN_TESTIMONIAL.goal}
            </p>
          </footer>
        </blockquote>
      </section>

      {/* ── FAQ ── */}
      <section className="border-t border-border bg-surface py-14 sm:py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <header className="mb-8 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-red">
              FAQ
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              Frequently Asked Questions
            </h2>
          </header>
          <FAQWithCtaLinks items={HEB_LESSONS_EN_FAQ} />
        </div>
      </section>

      {/* ── Bottom CTA ── */}
      <section className="border-t border-border bg-background py-16 sm:py-20">
        <div className="mx-auto max-w-[72rem] px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
            {HEB_LESSONS_EN_CTA.bottomHeading}
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-muted-foreground">
            {HEB_LESSONS_EN_CTA.bottomSub}
          </p>
          <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href={bottomWhatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-brand-red px-7 py-3 text-sm font-semibold text-white shadow-[0_0_20px_rgba(212,43,43,0.35)] transition-[background-color,box-shadow] hover:bg-brand-red-light hover:shadow-[0_0_32px_rgba(212,43,43,0.45)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red"
              aria-label="Message Yakir on WhatsApp about Hebrew lessons"
            >
              {HEB_LESSONS_EN_CTA.bottomButton}
            </a>
            <Link
              href="/book"
              className="inline-flex items-center gap-2 rounded-xl border border-border bg-background px-7 py-3 text-sm font-semibold text-foreground transition-colors hover:border-brand-red/40 hover:text-brand-red focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red"
            >
              Book Online
            </Link>
          </div>
          <div className="mt-5 flex justify-center">
            <ShareButton title="Private Hebrew Lessons in Modiin | Yakir Cohen" />
          </div>
        </div>
      </section>
    </div>
  );
}
