import Link from "next/link";
import AcademyTrialForm from "@/components/forms/AcademyTrialForm";
import RecordingSongExampleVideos from "@/components/seo/RecordingSongExampleVideos";
import FAQWithCtaLinks from "@/components/ui/FAQWithCtaLinks";
import ShareButton from "@/components/ui/ShareButton";
import {
  ULPAN_AUDIENCE,
  ULPAN_AUTHORITY,
  ULPAN_BLOG_LINKS,
  ULPAN_CHOOSE_GUIDE,
  ULPAN_COMPARISON,
  ULPAN_CTA,
  ULPAN_FAQ,
  ULPAN_HERO,
  ULPAN_HOW_IT_WORKS,
  ULPAN_METHOD,
  ULPAN_PRICING,
  ULPAN_SERVICE_AREAS,
  ULPAN_SHOWCASE_VIDEOS,
  ULPAN_STREET_HEBREW,
  ULPAN_TESTIMONIAL,
  ULPAN_VALUE_PROPS,
  ULPAN_VIDEOS_SECTION,
} from "@/lib/data/academy-ulpan-page";
import { buildWhatsAppHref } from "@/lib/whatsapp";

const HERO_WHATSAPP_HREF = buildWhatsAppHref({
  text: ULPAN_CTA.whatsappHero,
  utm_source: "academy",
  utm_campaign: "academy_ulpan_hero",
});

const BOTTOM_WHATSAPP_HREF = buildWhatsAppHref({
  text: ULPAN_CTA.whatsappBottom,
  utm_source: "academy",
  utm_campaign: "academy_ulpan_cta",
});

export default function AcademyUlpanPageContent() {
  return (
    <article>
      {/* Hero */}
      <header className="border-b border-border bg-gradient-to-b from-brand-red/[0.04] to-transparent px-4 py-16 sm:py-24">
        <div className="mx-auto max-w-5xl">
          <nav aria-label="breadcrumb" className="text-xs text-muted-foreground">
            <ol className="flex flex-wrap items-center gap-1.5">
              <li>
                <Link href="/" className="hover:text-brand-red">
                  ראשי
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link href="/academy" className="hover:text-brand-red">
                  האקדמיה
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li className="font-medium text-foreground">לימוד עברית</li>
            </ol>
          </nav>

          <p className="mt-6 text-xs font-semibold uppercase tracking-widest text-brand-red">
            {ULPAN_HERO.eyebrow}
          </p>
          <h1 className="mt-4 text-2xl font-semibold leading-tight tracking-tight text-foreground sm:text-4xl sm:leading-snug lg:text-5xl">
            {ULPAN_HERO.h1}
          </h1>
          <p className="mt-4 text-base font-medium text-foreground sm:text-lg">
            {ULPAN_HERO.subtitle}
          </p>
          <div className="mt-6 max-w-2xl space-y-3 text-base leading-relaxed text-muted-foreground">
            {ULPAN_HERO.painIntro.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
            <a
              href="#trial-heading"
              className="inline-flex justify-center rounded-md bg-brand-red px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-red-light focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red"
            >
              {ULPAN_CTA.heroPrimary}
            </a>
            <a
              href={HERO_WHATSAPP_HREF}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex justify-center rounded-md border border-border bg-surface px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:border-brand-red/40 hover:text-brand-red"
            >
              {ULPAN_CTA.heroWhatsapp}
            </a>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-5xl space-y-20 px-4 py-16 sm:px-6 lg:px-8">
        {/* Value propositions */}
        <section aria-labelledby="value-heading">
          <h2
            id="value-heading"
            className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
          >
            למה שיעור עברית פרטי עם יקיר כהן?
          </h2>
          <ul className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2">
            {ULPAN_VALUE_PROPS.map((item) => (
              <li
                key={item.id}
                className="rounded-2xl border border-border bg-surface p-6"
              >
                <h3 className="font-semibold text-foreground">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {item.description}
                </p>
              </li>
            ))}
          </ul>
        </section>

        {/* Method */}
        <section
          aria-labelledby="method-heading"
          className="rounded-2xl border border-border bg-surface p-6 sm:p-8"
        >
          <h2
            id="method-heading"
            className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
          >
            {ULPAN_METHOD.heading}
          </h2>
          <h3 className="mt-4 text-lg font-semibold text-foreground">
            {ULPAN_METHOD.subheading}
          </h3>
          <ul className="mt-6 space-y-3">
            {ULPAN_METHOD.points.map((point) => (
              <li key={point} className="flex gap-3 text-sm leading-relaxed text-muted-foreground">
                <span className="shrink-0 text-brand-red" aria-hidden="true">
                  ✓
                </span>
                {point}
              </li>
            ))}
          </ul>
          <p className="mt-6 text-xs font-medium text-muted-foreground">
            {ULPAN_METHOD.supportLanguages}
          </p>
        </section>

        {/* YouTube showcase */}
        <section aria-labelledby="videos-heading" id="free-lessons">
          <h2
            id="videos-heading"
            className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
          >
            {ULPAN_VIDEOS_SECTION.heading}
          </h2>
          <div className="mt-4 max-w-2xl space-y-2 text-sm leading-relaxed text-muted-foreground">
            {ULPAN_VIDEOS_SECTION.intro.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
          <RecordingSongExampleVideos
            className="mt-10"
            videos={ULPAN_SHOWCASE_VIDEOS}
            initialVisible={2}
          />
          <p className="mt-8 text-center">
            <a
              href="#trial-heading"
              className="text-sm font-semibold text-brand-red hover:underline"
            >
              {ULPAN_VIDEOS_SECTION.ctaText} → שיעור ניסיון
            </a>
          </p>
        </section>

        {/* Audience */}
        <section aria-labelledby="audience-heading">
          <h2
            id="audience-heading"
            className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
          >
            {ULPAN_AUDIENCE.heading}
          </h2>
          <ul className="mt-8 space-y-3">
            {ULPAN_AUDIENCE.items.map((item) => (
              <li
                key={item}
                className="flex gap-3 rounded-xl border border-border bg-surface px-4 py-3 text-sm text-muted-foreground"
              >
                <span className="shrink-0 text-brand-red" aria-hidden="true">
                  →
                </span>
                {item}
              </li>
            ))}
          </ul>
        </section>

        {/* Service areas */}
        <section aria-labelledby="areas-heading">
          <h2
            id="areas-heading"
            className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
          >
            {ULPAN_SERVICE_AREAS.heading}
          </h2>
          <ul className="mt-6 flex flex-wrap gap-2">
            {ULPAN_SERVICE_AREAS.cities.map((city) => (
              <li
                key={city}
                className="rounded-full border border-border bg-surface px-4 py-1.5 text-sm text-foreground"
              >
                {city}
              </li>
            ))}
            <li className="rounded-full border border-brand-red/30 bg-brand-red/5 px-4 py-1.5 text-sm font-medium text-brand-red">
              + זום לכל הארץ
            </li>
          </ul>
          <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
            {ULPAN_SERVICE_AREAS.zoomNote}
          </p>
        </section>

        {/* Comparison */}
        <section aria-labelledby="compare-heading">
          <h2
            id="compare-heading"
            className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
          >
            {ULPAN_COMPARISON.heading}
          </h2>
          <div className="mt-8 overflow-x-auto rounded-2xl border border-border">
            <table className="w-full min-w-[320px] text-sm">
              <thead>
                <tr className="border-b border-border bg-muted-foreground/5">
                  <th className="px-4 py-3 text-start font-semibold text-foreground">
                    &nbsp;
                  </th>
                  <th className="px-4 py-3 text-start font-semibold text-muted-foreground">
                    אולפן ממשלתי
                  </th>
                  <th className="px-4 py-3 text-start font-semibold text-brand-red">
                    שיעור פרטי
                  </th>
                </tr>
              </thead>
              <tbody>
                {ULPAN_COMPARISON.rows.map((row) => (
                  <tr key={row.label} className="border-b border-border last:border-0">
                    <td className="px-4 py-3 font-medium text-foreground">{row.label}</td>
                    <td className="px-4 py-3 text-muted-foreground">{row.gov}</td>
                    <td className="px-4 py-3 text-foreground">{row.private}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
            {ULPAN_COMPARISON.closing}
          </p>
        </section>

        {/* Choose guide */}
        <section
          aria-labelledby="choose-heading"
          className="rounded-2xl border border-border bg-surface p-6 sm:p-8"
        >
          <h2
            id="choose-heading"
            className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
          >
            {ULPAN_CHOOSE_GUIDE.heading}
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            {ULPAN_CHOOSE_GUIDE.intro}
          </p>
          <ul className="mt-8 space-y-6">
            {ULPAN_CHOOSE_GUIDE.tips.map((tip) => (
              <li key={tip.id}>
                <h3 className="font-semibold text-foreground">{tip.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {tip.body}
                </p>
              </li>
            ))}
          </ul>
          <div className="mt-8 rounded-xl border border-brand-red/20 bg-brand-red/[0.04] p-4">
            <h3 className="text-sm font-semibold text-foreground">
              {ULPAN_CHOOSE_GUIDE.warning.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {ULPAN_CHOOSE_GUIDE.warning.body}
            </p>
          </div>
          <p className="mt-6 text-sm leading-relaxed text-foreground">
            {ULPAN_CHOOSE_GUIDE.closingQuestion}
          </p>
        </section>

        {/* Street Hebrew */}
        <section aria-labelledby="street-heading">
          <h2
            id="street-heading"
            className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
          >
            {ULPAN_STREET_HEBREW.heading}
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            {ULPAN_STREET_HEBREW.intro}
          </p>
          <ul className="mt-6 space-y-2">
            {ULPAN_STREET_HEBREW.situations.map((item) => (
              <li
                key={item}
                className="flex gap-3 text-sm text-muted-foreground"
              >
                <span className="shrink-0 text-brand-red" aria-hidden="true">
                  →
                </span>
                {item}
              </li>
            ))}
          </ul>
          <h3 className="mt-10 text-lg font-semibold text-foreground">
            {ULPAN_STREET_HEBREW.phrasesHeading}
          </h3>
          <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {ULPAN_STREET_HEBREW.phrases.map((item) => (
              <li
                key={item.text}
                className="rounded-xl border border-border bg-surface px-4 py-3"
              >
                <p className="font-semibold text-foreground">{item.text}</p>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                  {item.meaning}
                </p>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
            {ULPAN_STREET_HEBREW.closing}
          </p>
          <p className="mt-4">
            <a
              href="#free-lessons"
              className="text-sm font-semibold text-brand-red hover:underline"
            >
              ראו גם בסרטונים — למשל איך ומתי אומרים &quot;תודה&quot;
            </a>
          </p>
        </section>

        {/* Authority */}
        <section
          aria-labelledby="authority-heading"
          className="rounded-2xl border border-brand-red/20 bg-brand-red/[0.03] p-6 sm:p-8"
        >
          <h2
            id="authority-heading"
            className="text-xl font-semibold text-foreground sm:text-2xl"
          >
            {ULPAN_AUTHORITY.heading}
          </h2>
          <div className="mt-4 space-y-4">
            {ULPAN_AUTHORITY.paragraphs.map((p) => (
              <p key={p} className="text-sm leading-relaxed text-muted-foreground">
                {p}
              </p>
            ))}
          </div>
        </section>

        {/* Pricing */}
        <section aria-labelledby="pricing-heading">
          <header>
            <h2
              id="pricing-heading"
              className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
            >
              {ULPAN_PRICING.heading}
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">{ULPAN_PRICING.subheading}</p>
          </header>
          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div className="rounded-2xl border border-border bg-surface p-6">
              <h3 className="font-semibold text-foreground">{ULPAN_PRICING.monthly.name}</h3>
              <p className="mt-4">
                <span className="text-3xl font-semibold text-foreground">
                  {ULPAN_PRICING.monthly.price}
                </span>
                <span className="me-1 text-sm text-muted-foreground">
                  {" "}
                  {ULPAN_PRICING.monthly.period}
                </span>
              </p>
              <ul className="mt-6 space-y-3">
                {ULPAN_PRICING.monthly.features.map((f) => (
                  <li key={f} className="flex gap-3 text-sm text-muted-foreground">
                    <span className="shrink-0 text-brand-red" aria-hidden="true">
                      ✓
                    </span>
                    {f}
                  </li>
                ))}
              </ul>
            </div>

            <div className="relative rounded-2xl border border-brand-red/40 bg-brand-red/5 p-6 ring-1 ring-brand-red/20">
              <span className="absolute start-4 top-4 rounded-full bg-brand-red px-2.5 py-0.5 text-[0.65rem] font-bold text-white">
                {ULPAN_PRICING.annual.badge}
              </span>
              <h3 className="mt-1 font-semibold text-foreground">{ULPAN_PRICING.annual.name}</h3>
              <p className="mt-4">
                <span className="text-3xl font-semibold text-foreground">
                  {ULPAN_PRICING.annual.price}
                </span>
                <span className="me-1 text-sm text-muted-foreground">
                  {" "}
                  {ULPAN_PRICING.annual.period}
                </span>
              </p>
              <p className="mt-1 text-xs text-muted-foreground">{ULPAN_PRICING.annual.trialNote}</p>
              <ul className="mt-6 space-y-3">
                {ULPAN_PRICING.annual.features.map((f) => (
                  <li key={f} className="flex gap-3 text-sm text-muted-foreground">
                    <span className="shrink-0 text-brand-red" aria-hidden="true">
                      ✓
                    </span>
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Trial form */}
        <section
          id="trial-heading"
          aria-labelledby="trial-form-heading"
          className="scroll-mt-24 rounded-2xl border-2 border-brand-red/35 bg-surface p-6 sm:p-8"
        >
          <header>
            <h2
              id="trial-form-heading"
              className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
            >
              {ULPAN_PRICING.trial.heading}
            </h2>
            <p className="mt-3 text-sm text-muted-foreground">{ULPAN_PRICING.trial.intro}</p>
            <p className="mt-1.5 text-xs font-medium text-brand-red">
              {ULPAN_PRICING.trial.scarcity}
            </p>
          </header>
          <div className="mt-8">
            <AcademyTrialForm />
          </div>
        </section>

        {/* How it works */}
        <section aria-labelledby="how-heading">
          <h2
            id="how-heading"
            className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
          >
            איך זה עובד
          </h2>
          <ol className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-3">
            {ULPAN_HOW_IT_WORKS.map((item) => (
              <li
                key={item.step}
                className="rounded-2xl border border-border bg-surface p-6"
              >
                <p className="text-xs font-bold tracking-widest text-brand-red">{item.step}</p>
                <h3 className="mt-2 font-semibold text-foreground">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {item.description}
                </p>
              </li>
            ))}
          </ol>
        </section>

        {/* Testimonial */}
        <section aria-labelledby="testimonial-heading">
          <h2
            id="testimonial-heading"
            className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
          >
            מה תלמידים אומרים
          </h2>
          <figure className="mt-8 rounded-2xl border border-border bg-surface p-6 sm:p-8">
            <blockquote className="text-sm leading-relaxed text-muted-foreground">
              <p>{ULPAN_TESTIMONIAL.quote}</p>
            </blockquote>
            <figcaption className="mt-6 border-t border-border pt-4">
              <p className="text-sm font-semibold text-foreground">{ULPAN_TESTIMONIAL.author}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                שפות: {ULPAN_TESTIMONIAL.languages}
              </p>
              <p className="mt-2 text-xs text-muted-foreground">מטרה: {ULPAN_TESTIMONIAL.goal}</p>
            </figcaption>
          </figure>
        </section>

        {/* Blog guides */}
        <nav aria-labelledby="blog-guides-heading" className="rounded-2xl border border-border bg-surface p-6 sm:p-8">
          <h2
            id="blog-guides-heading"
            className="text-lg font-semibold text-foreground sm:text-xl"
          >
            מדריכים בבלוג — לפני שקובעים שיעור
          </h2>
          <ul className="mt-4 space-y-2">
            {ULPAN_BLOG_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm font-medium text-brand-red hover:underline"
                >
                  {link.title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* FAQ */}
        <section aria-labelledby="faq-heading">
          <h2
            id="faq-heading"
            className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
          >
            שאלות נפוצות על שיעורי עברית פרטיים
          </h2>
          <FAQWithCtaLinks items={ULPAN_FAQ} className="mt-10" />
        </section>

        {/* Bottom CTA */}
        <section
          aria-labelledby="cta-heading"
          className="rounded-2xl border border-brand-red/25 bg-surface px-6 py-12 text-center sm:px-10"
        >
          <h2 id="cta-heading" className="text-xl font-semibold text-foreground sm:text-2xl">
            {ULPAN_CTA.bottomHeading}
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm text-muted-foreground">
            {ULPAN_CTA.bottomSub}
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href="#trial-heading"
              className="inline-flex rounded-md bg-brand-red px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-red-light"
            >
              {ULPAN_CTA.heroPrimary}
            </a>
            <a
              href={BOTTOM_WHATSAPP_HREF}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex rounded-md border border-border px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:border-brand-red/40 hover:text-brand-red"
              aria-label="שלחו הודעה בוואטסאפ לגבי שיעורי עברית פרטיים"
            >
              {ULPAN_CTA.bottomButton}
            </a>
          </div>
        </section>

        <div className="flex justify-center pt-4">
          <ShareButton
            title="שיעור פרטי עברית במודיעין — יקיר כהן"
            text="שיעורים פרטיים לעברית מדוברת במודיעין והמרכז"
          />
        </div>
      </div>
    </article>
  );
}
