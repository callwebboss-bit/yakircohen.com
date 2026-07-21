import Link from "next/link";
import CaseStudySection from "@/components/marketing/CaseStudySection";
import TestimonialCard from "@/components/marketing/TestimonialCard";
import ContextualIntroParagraph from "@/components/seo/ContextualIntroParagraph";
import HubDecisionMatrix from "@/components/seo/HubDecisionMatrix";
import PageRelatedFooter from "@/components/seo/PageRelatedFooter";
import ServiceBlogStrip from "@/components/blog/ServiceBlogStrip";
import { getBlogPostsByServiceSlug } from "@/lib/data/blog";
import TableOfContents from "@/components/ui/TableOfContents";
import { PodcastCalculatorLazy, TimeSaverRoiSliderLazy } from "@/components/calculators/lazy";
import ShowcaseVideoSection from "@/components/seo/ShowcaseVideoSection";
import PodcastSpotifySample from "@/components/seo/PodcastSpotifySample";
import PodcastBeforeAfter from "@/components/seo/PodcastBeforeAfter";
import SoundImprovementShowcase from "@/components/seo/SoundImprovementShowcase";
import PodcastLeadForm from "@/components/seo/PodcastLeadForm";
import FAQAccordion from "@/components/ui/FAQAccordion";
import ServicePageLayout from "@/components/services/ServicePageLayout";
import ServiceShowcaseSections from "@/components/services/ServiceShowcaseSections";
import { resolvePodcastFolderHero } from "@/lib/service-portfolio-hero";
import { withServicePageHeroDefaults } from "@/lib/service-page-ui";
import { PODCAST_SHOWCASE_VIDEOS } from "@/lib/data/youtube-showcases";
import { PODCAST_HUB_DECISIONS } from "@/lib/data/hub-decision-matrix";
import {
  PODCAST_HUB_AUDIENCES,
  PODCAST_HUB_CTA_BENEFITS,
  PODCAST_HUB_CTA_LABEL,
  PODCAST_HUB_FAQS,
  PODCAST_HUB_HERO_FEATURES,
  PODCAST_HUB_INCLUDED,
  PODCAST_HUB_PACKAGE_HIGHLIGHTS,
  PODCAST_HUB_PRICING_PACKAGES,
  PODCAST_HUB_SERVICE_COMPARE,
  PODCAST_HUB_STARTING_PRICE,
  PODCAST_HUB_STARTING_PRICE_NOTE,
  PODCAST_HUB_STUDIO_SPACES,
  PODCAST_HUB_TESTIMONIALS,
  PODCAST_HUB_WORKFLOW,
} from "@/lib/data/podcast-hub-page";
import {
  youtubeEmbedUrl,
  YOUTUBE_SERVICE_EMBED_IDS,
} from "@/lib/data/youtube-embeds";
import ServiceHubLinks from "@/components/services/ServiceHubLinks";
import Container from "@/components/ui/Container";
import { resolveServiceBookCta } from "@/lib/data/service-book-map";
import {
  PODCAST_HUB_TRACKS_CONTENT,
  PODCAST_HUB_TRACKS_STUDIO,
  PODCAST_HUB_TRACKS_SUPPORT,
} from "@/lib/data/podcast-hub-tracks";
import { buildServiceWhatsAppText, buildWhatsAppHref } from "@/lib/whatsapp";
import { PODCAST_HUB_SEO } from "@/lib/seo/hub-pages";
import { SKEPTICISM_CTA, TIME_CLAIMS } from "@/lib/data/conversion-copy";
import { buildPricingOffersSchema } from "@/lib/seo/page-schema";
import { absoluteUrl } from "@/lib/site-url";
import { safeJsonLdStringify } from "@/lib/safe-json-ld";
import {
  GOOGLE_RATING,
  GOOGLE_REVIEW_COUNT,
  STUDIO_GOOGLE_MAPS_URL,
} from "@/lib/constants";

const bookCta = resolveServiceBookCta("podcast");

const PODCAST_HUB_TOC = [
  { id: "compare-heading", label: "השוואת מסלולים", level: 2 as const },
  { id: "value-prop-heading", label: "למה לבחור בנו", level: 2 as const },
  { id: "services-heading", label: "סוגי פודקאסט", level: 2 as const },
  { id: "pricing-heading", label: "מחירים וחבילות", level: 2 as const },
  { id: "post-production-heading", label: "ניקוי הקלטות", level: 2 as const },
  { id: "testimonials-heading", label: "מה אומרים לקוחות", level: 2 as const },
  { id: "faq-heading", label: "שאלות נפוצות", level: 2 as const },
];

const pageHero = resolvePodcastFolderHero(
  "אולפן פודקאסט מקצועי במודיעין",
  youtubeEmbedUrl(YOUTUBE_SERVICE_EMBED_IDS["podcast-example-1"]),
);
const heroProps = withServicePageHeroDefaults(pageHero);

/** נתוני אמינות - קבוצה נפרדת ממחירים/מפרט טכני, כדי שלא יתערבבו */
const CREDIBILITY_STATS = [
  { emoji: "🏆", value: "20+", label: "שנות ניסיון" },
  { emoji: "🎧", value: "5,000+", label: "לקוחות מרוצים" },
  { emoji: "⭐", value: `${GOOGLE_RATING} / 5`, label: "דירוג ממוצע בגוגל" },
  { emoji: "💬", value: `${GOOGLE_REVIEW_COUNT}+`, label: "ביקורות מאומתות" },
] as const;

const VALUE_PILLARS = [
  {
    emoji: "🎙️",
    title: "מפרט חומרה מוכח",
    body: "4 מתחמי הקלטה עצמאיים, מיקרופוני Shure & Rode, ממשקי UAD ובידוד אקוסטי מלא - הסאונד בטווח שידורי מקצועי, לא כמו שיחת זום.",
  },
  {
    emoji: "🤖",
    title: "ניקוי רעשים ושיפור הקלטות בבינה מלאכותית",
    body: "iZotope + UAD מנקים רעשי רקע, אקו וגמגומים בלי לפגוע בקול. עובד גם על הקלטות זום וביתיות ישנות - שולחים קובץ, מקבלים תוצאה.",
  },
  {
    emoji: "🎧",
    title: "עריכה ביום ההקלטה - מסירה תוך 4 ימים",
    body: "הקלטה ועריכה ביום אחד. פרויקטים מורכבים נמסרים תוך 4 ימים לכל היותר. אין פרויקטים פתוחים, אין עיכובים.",
  },
] as const;

export default function PodcastHubPageContent() {
  const whatsappHref = buildWhatsAppHref({
    text: buildServiceWhatsAppText(
      "שלום, מעוניין/ת בהקלטת פודקאסט מקצועית באולפן, אשמח לשמוע על חבילות וזמינות.",
    ),
    utm_source: "website",
    utm_campaign: "podcast_hub_cta",
  });

  const pageUrl = absoluteUrl("podcast");
  const pricingOffersSchema = buildPricingOffersSchema(
    pageUrl,
    PODCAST_HUB_PRICING_PACKAGES.map((pkg) => ({
      id: pkg.id,
      name: pkg.title,
      description: pkg.subtitle,
      priceExVat: pkg.priceFrom,
    })),
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLdStringify(pricingOffersSchema) }}
      />
      <ServicePageLayout
        {...heroProps}
        category="podcast"
        title="אולפן פודקאסט במודיעין"
        subtitle="הקלטת פודקאסט באולפן במודיעין. פרק מוכן להעלאה בדרך כלל תוך 24 שעות - מ-750 ₪ לפני מע״מ."
        features={PODCAST_HUB_HERO_FEATURES}
        whatsappText="שלום, מעוניין/ת בהקלטת פודקאסט באולפן מקצועי במודיעין, אשמח לשמוע על חבילות וזמינות."
        utmCampaign="podcast_hub"
        corporateShareLabel="שירות הפקת הפודקאסטים"
        valueFrame={TIME_CLAIMS.podcastValueFrame}
        scarcityLabel="🔥 פנויים השבוע ל-3 פרויקטים בלבד"
        ctaLabel={PODCAST_HUB_CTA_LABEL}
        startingPrice={`${PODCAST_HUB_STARTING_PRICE} ₪ לפני מע״מ`}
        showBookCtaInHero={Boolean(bookCta)}
        bookHref={bookCta?.bookHref}
        bookLabel={bookCta?.bookLabel}
        pagePath="/podcast"
        metaDescription={PODCAST_HUB_SEO.description}
        faqs={PODCAST_HUB_FAQS}
      >
        <Container className="space-y-16 py-12 sm:py-16">
          <ContextualIntroParagraph pathname="/podcast" className="max-w-3xl" />

          <HubDecisionMatrix rows={PODCAST_HUB_DECISIONS} />

          {/* ── B: MOBILE STUDIO BANNER ────────────────────────── */}
          <aside
            className="rounded-xl border border-brand-red/30 bg-brand-red/5 p-5 sm:p-6"
            role="note"
            aria-label="שירות אולפן פודקאסט נייד ארצי"
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-foreground">
                  📍 האולפן במודיעין - אבל השירות ארצי
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  לא מגיעים למודיעין? אולפן הפודקאסט הנייד מגיע אליכם לכל
                  מקום - בית, משרד, אירוע, בכל רחבי הארץ.
                </p>
              </div>
              <Link
                href="/podcast/mobile-podcast-at-home"
                className="inline-flex min-h-11 shrink-0 items-center text-sm font-semibold text-brand-red hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red"
              >
                אולפן פודקאסט נייד </Link>
            </div>
          </aside>

          {/* ── TRUST: credibility numbers only - service numbers (price/duration) live in their own sections below ── */}
          <ul
            className="grid grid-cols-2 gap-3 sm:grid-cols-4"
            aria-label="נתוני אמינות"
          >
            {CREDIBILITY_STATS.map((stat) => (
              <li
                key={stat.label}
                className="rounded-xl border border-border bg-surface px-4 py-5 text-center"
              >
                <span className="text-2xl" aria-hidden>
                  {stat.emoji}
                </span>
                <p className="mt-2 text-2xl font-bold text-foreground">
                  {stat.value}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {stat.label}
                </p>
              </li>
            ))}
          </ul>

          <TableOfContents entries={PODCAST_HUB_TOC} className="max-w-xs" />

          {/* ── COMPARE: recording / video / editing ───────────── */}
          <section aria-labelledby="compare-heading">
            <header className="mx-auto max-w-2xl text-center">
              <h2
                id="compare-heading"
                className="font-serif text-section-title font-semibold text-foreground"
              >
                הקלטה, וידאו או עריכה - מה מתאים?
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                שלושה מסלולים נפוצים. המחיר לפני מע״מ. בוחרים לפי מה שכבר יש
                לכם ומה שרוצים לקבל בסוף.
              </p>
            </header>
            <ul className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
              {PODCAST_HUB_SERVICE_COMPARE.map((item) => (
                <li
                  key={item.id}
                  className="flex h-full flex-col rounded-xl border border-border bg-surface p-5"
                >
                  <h3 className="text-base font-semibold text-foreground">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-2xl font-bold text-foreground">
                    <span className="text-sm font-normal text-muted-foreground">
                      מ-
                    </span>
                    {item.priceFrom.toLocaleString("he-IL")} ₪
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {item.outcome}
                  </p>
                  <p className="mt-2 text-xs text-muted-foreground">
                    מתאים ל: {item.bestFor}
                  </p>
                  <Link
                    href={item.href}
                    className="mt-auto pt-5 text-sm font-semibold text-brand-red hover:underline"
                  >
                    {item.linkLabel}
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          {/* ── PROCESS: how a recording session actually runs ─── */}
          <section aria-labelledby="process-heading" className="border-y border-border bg-surface py-10">
            <h2
              id="process-heading"
              className="text-center font-serif text-section-title font-semibold text-foreground"
            >
              מה קורה בפועל, שלב אחר שלב
            </h2>
            <ol className="mx-auto mt-8 grid max-w-4xl grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
              {PODCAST_HUB_WORKFLOW.map((step) => (
                <li key={step.step} className="text-center">
                  <div
                    className="mx-auto flex h-9 w-9 items-center justify-center rounded-full bg-foreground text-sm font-bold text-brand-red ring-1 ring-brand-red/40"
                    aria-hidden="true"
                  >
                    {step.step}
                  </div>
                  <p className="mt-3 text-sm font-semibold text-foreground">
                    {step.title}
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                    {step.body}
                  </p>
                </li>
              ))}
            </ol>
          </section>

          {/* ── C: VALUE PROPOSITION ───────────────────────────── */}
          <section aria-labelledby="value-prop-heading">
            <header className="mx-auto max-w-2xl text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-red">
                למה לבחור באולפן הפודקאסט שלנו
              </p>
              <h2
                id="value-prop-heading"
                className="mt-2 font-serif text-section-title font-semibold text-foreground"
              >
                שיפור הקלטות ברמה אולפנית - בלי מאמץ
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
                בידוד אקוסטי מלא, שיפור סאונד בבינה מלאכותית, קובץ RSS מוכן - פרק מוכן תוך 24
                שעות.
              </p>
              <p className="mt-4 text-sm font-semibold text-brand-red">
                {SKEPTICISM_CTA}
              </p>
            </header>

            {/* 3 Benefit Pillars */}
            <ul className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-3">
              {VALUE_PILLARS.map((p) => (
                <li
                  key={p.title}
                  className="rounded-xl border border-border bg-surface p-6 text-center"
                >
                  <span className="text-3xl" aria-hidden>
                    {p.emoji}
                  </span>
                  <h3 className="mt-4 font-semibold text-foreground">
                    {p.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {p.body}
                  </p>
                </li>
              ))}
            </ul>

            {/* Package highlights */}
            <ul className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {PODCAST_HUB_PACKAGE_HIGHLIGHTS.map((item) => (
                <li
                  key={item.title}
                  className="rounded-xl border border-border bg-surface p-5"
                >
                  <span className="text-2xl" aria-hidden>
                    {item.emoji}
                  </span>
                  <h3 className="mt-3 font-semibold text-foreground">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {item.description}
                  </p>
                </li>
              ))}
            </ul>

            {/* Included checklist */}
            <div className="mt-12">
              <h3 className="text-center text-xl font-semibold text-foreground">
                מה כלול בהקלטת פודקאסט מלאה?
              </h3>
              <ul className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {PODCAST_HUB_INCLUDED.map((item) => (
                  <li
                    key={item.title}
                    className="rounded-xl border border-border bg-background p-5"
                  >
                    <h4 className="font-semibold text-foreground">
                      {item.title}
                    </h4>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {item.description}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* ── D: SERVICES DETAILED ───────────────────────────── */}
          <section aria-labelledby="services-heading">
            <header className="mx-auto max-w-2xl text-center">
              <h2
                id="services-heading"
                className="font-serif text-section-title font-semibold text-foreground"
              >
                סוגי הקלטת פודקאסט
              </h2>
              <p className="mt-3 text-sm text-muted-foreground">
                בוחרים את המסלול המתאים - ואנחנו מתאימים את ההפקה
              </p>
            </header>

            {/* Pillar 1: Business / Creators */}
            <article
              aria-labelledby="business-podcast-heading"
              className="mt-10 rounded-2xl border border-border bg-surface p-8"
            >
              <h3
                id="business-podcast-heading"
                className="text-xl font-semibold text-foreground"
              >
                🏢 פודקאסט עסקי וליוצרי תוכן
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                לחברות, מומחים, יועצים ויוצרי תוכן שרוצים לבנות נוכחות
                דיגיטלית ברמה גבוהה - בלי צוות הפקה פנימי. הקלטת פודקאסט עם
                צילום 4K, עריכה מקצועית ומסירה {TIME_CLAIMS.quote24h}.
              </p>
              <ul className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {PODCAST_HUB_AUDIENCES.map((item) => (
                  <li
                    key={item.title}
                    className="flex gap-3 rounded-lg border border-border bg-background p-4"
                  >
                    <span className="text-xl" aria-hidden>
                      {item.emoji}
                    </span>
                    <div>
                      <h4 className="font-semibold text-foreground">
                        {item.title}
                      </h4>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {item.description}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </article>

            {/* Pillar 2: Family / Emotional / Events */}
            <article
              aria-labelledby="family-podcast-heading"
              className="mt-6 rounded-2xl border border-border bg-surface p-8"
            >
              <h3
                id="family-podcast-heading"
                className="text-xl font-semibold text-foreground"
              >
                ❤️ פודקאסט משפחתי ואירועים אישיים
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                פודקאסט משפחתי הוא מזכרת שמלווה לדורות. מקליטים שיחה עם סבא,
                מראיינים קרובי משפחה, או מתעדים זיכרונות - ויוצאים עם תוצר
                שלא יסולא בפז. מתאים גם לאירועים מיוחדים כמו חתונות ובני
                מצווה.
              </p>
              <div className="mt-5">
                <Link
                  href="/podcast/podcast-with-grandpa"
                  className="text-sm font-semibold text-brand-red hover:underline"
                >
                  פודקאסט עם סבא וסבתא - פרטים נוספים </Link>
              </div>
            </article>

            {/* Studio Spaces */}
            <div className="mt-10">
              <header className="mx-auto max-w-2xl text-center">
                <h3 className="text-xl font-semibold text-foreground">
                  בחרו את חלל ההקלטה שלכם
                </h3>
              </header>
              <ul className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-3">
                {PODCAST_HUB_STUDIO_SPACES.map((space) => (
                  <li
                    key={space.title}
                    className="rounded-2xl border border-border bg-background p-6 text-center"
                  >
                    <span className="text-4xl" aria-hidden>
                      {space.emoji}
                    </span>
                    <h4 className="mt-4 font-semibold text-foreground">
                      {space.title}
                    </h4>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {space.description}
                    </p>
                  </li>
                ))}
              </ul>
              <p className="mt-6 text-center text-sm text-muted-foreground">
                <Link
                  href="/podcast/podcast-studio-modiin"
                  className="font-medium text-brand-red hover:underline"
                >
                  השכרת אולפן פודקאסט במודיעין </Link>
              </p>
            </div>
          </section>

          {/* ── PRICING CARDS ──────────────────────────────────── */}
          <section aria-labelledby="pricing-heading">
            <header className="mx-auto max-w-2xl text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-red">
                הקלטת פודקאסט מחיר
              </p>
              <h2
                id="pricing-heading"
                className="mt-2 font-serif text-section-title font-semibold text-foreground"
              >
                חבילות הפקת פודקאסט - מחיר שקוף
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                אולפן פודקאסט במודיעין. לפני מע״מ (+18%). ללא הפתעות.
              </p>
            </header>

            {/* Comparison table - one glance, no scrolling back and forth */}
            <div className="mt-8 overflow-x-auto rounded-2xl border border-border">
              <table className="w-full min-w-[560px] border-collapse text-sm">
                <thead>
                  <tr className="bg-surface text-foreground">
                    <th className="p-4 text-start font-semibold">סוג שירות</th>
                    <th className="p-4 text-start font-semibold">מה כלול</th>
                    <th className="p-4 text-start font-semibold">זמן הקלטה</th>
                    <th className="p-4 text-start font-semibold">מחיר</th>
                  </tr>
                </thead>
                <tbody>
                  {PODCAST_HUB_PRICING_PACKAGES.map((pkg, i) => (
                    <tr
                      key={pkg.id}
                      className={i % 2 === 0 ? "bg-background" : "bg-surface/50"}
                    >
                      <td className="p-4 font-semibold text-foreground">{pkg.title}</td>
                      <td className="p-4 text-muted-foreground">{pkg.subtitle}</td>
                      <td className="p-4 text-muted-foreground">
                        {pkg.id === "recording-only" ? "עד 30 דקות" : "עד שעה"}
                      </td>
                      <td className="p-4 font-semibold text-foreground">
                        החל מ-{pkg.priceFrom.toLocaleString("he-IL")} ₪
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <ul className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-3">
              {PODCAST_HUB_PRICING_PACKAGES.map((pkg) => {
                const pkgWhatsapp = buildWhatsAppHref({
                  text: pkg.whatsappText,
                  utm_source: "website",
                  utm_campaign: `podcast_pricing_${pkg.id}`,
                });
                return (
                  <li key={pkg.id}>
                    <article
                      data-billing-type="one-time"
                      data-package-id={pkg.id}
                      itemScope
                      itemType="https://schema.org/Offer"
                      className={
                        pkg.highlighted
                          ? "relative h-full rounded-2xl border-2 border-brand-red bg-surface p-7 shadow-[0_0_30px_rgba(212,43,43,0.12)]"
                          : "relative h-full rounded-2xl border border-border bg-surface p-7"
                      }
                    >
                    {pkg.badge ? (
                      <span className="absolute -top-3 right-5 inline-flex items-center rounded-full bg-brand-red px-3 py-0.5 text-xs font-bold text-white">
                        {pkg.badge}
                      </span>
                    ) : null}

                    <h3 className="text-lg font-semibold text-foreground">
                      {pkg.title}
                    </h3>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {pkg.subtitle}
                    </p>

                    <p className="mt-5 text-3xl font-bold text-foreground">
                      <span className="text-sm font-normal text-muted-foreground">
                        החל מ-
                      </span>
                      {pkg.priceFrom.toLocaleString("he-IL")} ₪
                    </p>

                    <ul className="mt-5 space-y-2.5">
                      {pkg.features.map((f) => (
                        <li
                          key={f}
                          className="flex items-start gap-2 text-sm text-muted-foreground"
                        >
                          <span
                            className="mt-0.5 shrink-0 text-brand-red"
                            aria-hidden
                          >
                            {f.startsWith("✓") ? "" : "✓"}
                          </span>
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>

                    <a
                      href={pkgWhatsapp}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={
                        pkg.highlighted
                          ? "touch-press mt-7 block rounded-xl bg-brand-red px-4 py-3 text-center text-sm font-semibold text-white hover:bg-brand-red-light active:bg-brand-red-dark"
                          : "touch-press mt-7 block rounded-xl border border-brand-red/40 px-4 py-3 text-center text-sm font-semibold text-brand-red hover:bg-brand-red/5 active:bg-brand-red/10"
                      }
                    >
                      {pkg.ctaLabel} </a>
                    </article>
                  </li>
                );
              })}
            </ul>

            {/* Calculator for fine-tuning */}
            <div className="mt-12">
              <h3
                id="pricing-calculator-heading"
                className="text-center text-lg font-semibold text-foreground"
              >
                רוצים לחשב מחיר מדויק לפרק שלכם?
              </h3>
              <p className="mt-2 text-center text-sm text-muted-foreground">
                {PODCAST_HUB_STARTING_PRICE} ₪ -{" "}
                {PODCAST_HUB_STARTING_PRICE_NOTE}
              </p>
              <PodcastCalculatorLazy className="mt-6" />
            </div>
          </section>

          {/* ── E: AUDIO POST-PRODUCTION ───────────────────────── */}
          <section aria-labelledby="post-production-heading">
            <header className="mx-auto max-w-2xl text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-red">
                שיפור הקלטת זום | ניקוי רעשים
              </p>
              <h2
                id="post-production-heading"
                className="mt-2 font-serif text-section-title font-semibold text-foreground"
              >
                הקלטה ביתית? אנחנו מנקים אותה
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
                גם אם הקלטתם בזום, בחדר רועש, בטלפון - או שיש לכם פודקאסט ישן,
                הרצאה או קלטת ארכיון שרוצים לשפר: שיפור ושחזור סאונד ב-AI + עריכה
                ידנית. שולחים קובץ ומקבלים גרסה משופרת תוך 24-48 שעות.
              </p>
            </header>
            <div className="mt-8">
              <PodcastBeforeAfter />
            </div>

            {/* Related editing services */}
            <p className="mt-6 text-center text-sm text-muted-foreground">
              <Link
                href="/podcast/podcast-editing"
                className="font-medium text-brand-red hover:underline"
              >
                לשירות עריכת פודקאסט מלאה </Link>
            </p>
          </section>

          {/* ── VIDEO & AUDIO SHOWCASE ─────────────────────────── */}
          <ShowcaseVideoSection playlistId="podcast-hub" />

          <PodcastSpotifySample />

          <section aria-labelledby="samples-heading">
            <header className="mx-auto max-w-2xl text-center">
              <h2
                id="samples-heading"
                className="font-serif text-section-title font-semibold text-foreground"
              >
                שיפור סאונד פודקאסט - לפני ואחרי
              </h2>
              <p className="mt-3 text-sm text-muted-foreground">
                הקלטת זום או חדר ביתי לפני הניקוי, מול אותו קטע אחרי שיפור סאונד
                ב-AI ועריכה ידנית.
              </p>
            </header>
            <div className="mx-auto mt-8 max-w-2xl">
              <SoundImprovementShowcase
                demoId="podcast-zoom-cleanup"
                variant="remote"
                context="compact"
              />
            </div>
          </section>

          <ServiceShowcaseSections
            assetsFolder="podcast"
            playlistEmbedUrl={null}
            mediaType="gallery"
            galleryLabel="תמונות מאולפן הפודקאסט במודיעין"
          />

          {/* ── F: SOCIAL PROOF / TESTIMONIALS ────────────────── */}
          <section aria-labelledby="testimonials-heading">
            <header className="mx-auto max-w-2xl text-center">
              <h2
                id="testimonials-heading"
                className="font-serif text-section-title font-semibold text-foreground"
              >
                מה אומרים מי שכבר הקליטו
              </h2>
              <p className="mt-3 text-sm text-muted-foreground">
                המלצות מלקוחות פודקאסט, עם קישור להקשר המלא לכל אחת.
              </p>
              <Link
                href={STUDIO_GOOGLE_MAPS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-brand-red hover:underline"
              >
                צפו ב-{GOOGLE_REVIEW_COUNT}+ ביקורות מאומתות ב-Google Maps ↗
              </Link>
            </header>
            <ul className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {PODCAST_HUB_TESTIMONIALS.map((item) => (
                <li key={item.id}>
                  <TestimonialCard item={item} />
                </li>
              ))}
            </ul>
          </section>

          {/* ── G: FAQ ─────────────────────────────────────────── */}
          <section id="faq-heading" aria-label="שאלות נפוצות">
            <FAQAccordion
              items={[...PODCAST_HUB_FAQS]}
              title="שאלות נפוצות - הקלטת פודקאסט מודיעין"
              className="py-0"
            />
          </section>

          {/* ── H: MICRO-CONVERSION LEAD FORM ──────────────────── */}
          <PodcastLeadForm />

          {/* ── I: FINAL CTA - deliberately the only dark section on the page, so the button reads as "the" action ── */}
          <section
            className="rounded-2xl bg-foreground p-8 text-center text-background sm:p-10"
            aria-labelledby="podcast-cta-heading"
          >
            <h2
              id="podcast-cta-heading"
              className="text-xl font-semibold sm:text-2xl"
            >
              מוכנים לפרק מוכן להעלאה?
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-background/70">
              אולפן במודיעין. מקליטים, עורכים, ומקבלים קובץ מוכן לספוטיפיי או
              יוטיוב. {TIME_CLAIMS.podcastDelivery24h}.
            </p>
            <ul className="mx-auto mt-6 flex max-w-md flex-wrap justify-center gap-2">
              {PODCAST_HUB_CTA_BENEFITS.map((benefit) => (
                <li
                  key={benefit}
                  className="rounded-full border border-background/25 bg-background/10 px-3 py-1 text-xs font-medium"
                >
                  {benefit} ✓
                </li>
              ))}
            </ul>
            <p className="mt-6 text-lg font-semibold text-brand-red-light">
              החל מ-{PODCAST_HUB_STARTING_PRICE} ₪ לפרק של חצי שעה
            </p>
            <p className="mt-1 text-sm text-background/70">
              {PODCAST_HUB_STARTING_PRICE_NOTE}
            </p>
            <div className="mt-8">
              <TimeSaverRoiSliderLazy variant="podcast" />
            </div>
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex min-h-14 items-center justify-center gap-2 rounded-xl bg-brand-red px-8 py-4 text-base font-bold text-white shadow-[0_0_30px_rgba(212,43,43,0.4)] hover:bg-brand-red-light"
            >
              {PODCAST_HUB_CTA_LABEL}
            </a>
            {bookCta ? (
              <div className="mt-4">
                <Link
                  href={bookCta.bookHref}
                  className="text-sm font-semibold text-background underline underline-offset-4 hover:text-background/80"
                >
                  {bookCta.bookLabel}
                </Link>
              </div>
            ) : null}
          </section>

          <div className="space-y-10" aria-label="מסלולים נוספים - לפי השלב שבו אתם">
            <ServiceHubLinks
              heading="הפקת תוכן מוכן"
              subheading="פרקים גמורים - מהקלטה ועד קובץ מוכן להעלאה."
              links={PODCAST_HUB_TRACKS_CONTENT}
              headingId="tracks-content-heading"
              columns={3}
            />

            <ServiceHubLinks
              heading="אולפן וחלל הקלטה"
              subheading="בוחרים איפה מקליטים - במודיעין או שהאולפן מגיע אליכם."
              links={PODCAST_HUB_TRACKS_STUDIO}
              headingId="tracks-studio-heading"
              columns={2}
            />

            <ServiceHubLinks
              heading="עריכה ותמיכה"
              subheading="כבר יש לכם הקלטה? כאן משפרים ועונים על שאלות."
              links={PODCAST_HUB_TRACKS_SUPPORT}
              headingId="tracks-support-heading"
              columns={2}
            />
          </div>

          <CaseStudySection hub="podcast" />

          <section
            className="flex flex-wrap justify-center gap-3"
            aria-label="עמודי פודקאסט"
          >
            <Link
              href="/podcast/podcast-editing"
              className="rounded-full border border-border px-4 py-2 text-sm font-medium hover:border-brand-red/40 hover:text-brand-red"
            >
              עריכת פודקאסט
            </Link>
            <Link
              href="/podcast/podcast-production"
              className="rounded-full border border-border px-4 py-2 text-sm font-medium hover:border-brand-red/40 hover:text-brand-red"
            >
              ליווי מא׳ עד ת׳
            </Link>
            <Link
              href="/podcast/faq"
              className="rounded-full border border-border px-4 py-2 text-sm font-medium hover:border-brand-red/40 hover:text-brand-red"
            >
              שאלות נפוצות
            </Link>
            <Link
              href="/blog/prepare-voice-podcast-studio"
              className="rounded-full border border-border px-4 py-2 text-sm font-medium hover:border-brand-red/40 hover:text-brand-red"
            >
              מדריך: הכנת קול
            </Link>
          </section>

          <div className="rounded-xl border border-border bg-surface p-5">
            <p className="font-semibold text-foreground">יש לכם פרק ישן או הקלטה פגומה?</p>
            <p className="mt-2 text-sm text-muted-foreground">
              שחזור סאונד בעזרת AI - מנקה רעשים, מחזיר צלילות ומשמיד הד.{" "}
              <Link href="/online/vocal-fix" className="font-semibold text-brand-red hover:underline">
                שחזור סאונד ב-AI </Link>
            </p>
          </div>

          <ServiceBlogStrip posts={getBlogPostsByServiceSlug("podcast")} />
          <PageRelatedFooter pathname="/podcast" />
        </Container>
      </ServicePageLayout>
    </>
  );
}
