import Link from "next/link";
import ContextualIntroParagraph from "@/components/seo/ContextualIntroParagraph";
import ShowcaseVideoSection from "@/components/seo/ShowcaseVideoSection";
import PageRelatedFooter from "@/components/seo/PageRelatedFooter";
import ServiceBlogStrip from "@/components/blog/ServiceBlogStrip";
import { getBlogPostsByServiceSlug } from "@/lib/data/blog";
import FAQAccordion from "@/components/ui/FAQAccordion";
import ServicePageLayout from "@/components/services/ServicePageLayout";
import SingerBeforeAfterAudio from "@/components/singer-amplification/SingerBeforeAfterAudio";
import SingerClosingLeadSection from "@/components/singer-amplification/SingerClosingLeadSection";
import SingerEventGuideTabs from "@/components/singer-amplification/SingerEventGuideTabs";
import SingerSystemBuilderWidget from "@/components/singer-amplification/SingerSystemBuilderWidget";
import { buildBookHref } from "@/lib/book-url";
import type { SingerPackageId } from "@/lib/data/singer-amplification-page";
import {
  SERVICE_SHOWCASE_VIDEO_ID,
  resolveServicePageHeroFromEntity,
} from "@/lib/service-portfolio-hero";
import { withServicePageHeroDefaults } from "@/lib/service-page-ui";
import {
  SINGER_ADDONS,
  SINGER_FEEDBACK_PREVENTION,
  SINGER_LOCAL_SUPPORT,
  SINGER_MISTAKES,
  SINGER_PACKAGES,
  SINGER_PAGE_FAQ,
  SINGER_PAGE_HERO,
  SINGER_PROCESS,
  SINGER_STUDIO_SEAL,
  SINGER_TECH_SPECS,
  SINGER_TRAVEL_NOTE,
  SINGER_VALUE_POINTS,
  SINGER_WHY_BLOCKS,
} from "@/lib/data/singer-amplification-page";
import { getEventsService } from "@/lib/data/services";
import { SINGER_AMPLIFICATION_VIDEOS } from "@/lib/data/youtube-showcases";
import { buildServiceWhatsAppText, buildWhatsAppHref } from "@/lib/whatsapp";

const service = getEventsService("events-singer-amplification");

const pageHero = resolveServicePageHeroFromEntity(service, undefined, {
  videoSectionId: SERVICE_SHOWCASE_VIDEO_ID,
});
const heroProps = withServicePageHeroDefaults(pageHero);

const matchFitWhatsappHref = buildWhatsAppHref({
  text: buildServiceWhatsAppText(
    "שלום, מעוניין/ת בבדיקת התאמה מהירה להגברה לזמר/ה - אשמח לייעוץ קצר (תאריך, מיקום, סוג אירוע)",
  ),
  utm_source: "website",
  utm_campaign: "singer_amplification_match_fit",
});

const faqItems = [
  ...SINGER_PAGE_FAQ,
  ...service.faqs.filter(
    (f) => !SINGER_PAGE_FAQ.some((local) => local.id === f.id),
  ),
];

export default function SingerAmplificationPageContent() {
  return (
    <ServicePageLayout
      title={SINGER_PAGE_HERO.title}
      subtitle={SINGER_PAGE_HERO.subtitle}
      features={SINGER_PAGE_HERO.features}
      whatsappText={service.whatsappText}
      utmCampaign={service.utmCampaign}
      bookSlug={service.slug}
      ctaLabel={SINGER_PAGE_HERO.ctaLabel}
      maxHeroFeatures={3}
      {...heroProps}
    >
      <div className="mx-auto max-w-[72rem] space-y-16 px-4 sm:px-6 lg:px-8">
        <ContextualIntroParagraph
          pathname="/events/equipment/singer-amplification"
          className="max-w-3xl"
        />

        {/* 5 mistakes - anxiety mapping */}
        <section aria-labelledby="mistakes-heading">
          <header className="mx-auto max-w-2xl text-center">
            <h2
              id="mistakes-heading"
              className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
            >
              5 טעויות נפוצות שגורמות גם לזמרים מעולים להישמע רע על הבמה
            </h2>
            <p className="mt-3 text-sm text-muted-foreground">
              מערכת הגברה לזמרים לא מתחילה ברשימת ציוד - היא מתחילה בהבנה מה
              הורס הופעה חיה
            </p>
          </header>
          <ul className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {SINGER_MISTAKES.map((item, index) => (
              <li
                key={item.title}
                className="rounded-xl border border-border bg-surface p-6"
              >
                <span className="text-xs font-bold tracking-widest text-brand-red">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-2 font-semibold text-foreground">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {item.description}
                </p>
              </li>
            ))}
          </ul>
        </section>

        <SingerEventGuideTabs />

        <SingerSystemBuilderWidget />

        <SingerBeforeAfterAudio />

        {/* Anti-feedback / RTA */}
        <section
          className="rounded-2xl border border-brand-red/20 bg-brand-red/[0.03] p-6 sm:p-8"
          aria-labelledby="feedback-heading"
        >
          <h2
            id="feedback-heading"
            className="text-xl font-semibold text-foreground sm:text-2xl"
          >
            {SINGER_FEEDBACK_PREVENTION.heading}
          </h2>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground">
            {SINGER_FEEDBACK_PREVENTION.body}
          </p>
          <ul className="mt-5 grid gap-2 sm:grid-cols-2">
            {SINGER_FEEDBACK_PREVENTION.bullets.map((b) => (
              <li key={b} className="flex gap-2 text-sm text-muted-foreground">
                <span className="text-brand-red" aria-hidden>
                  ✓
                </span>
                {b}
              </li>
            ))}
          </ul>
        </section>

        {/* Studio seal + local support */}
        <div className="grid gap-6 lg:grid-cols-2">
          <section
            className="rounded-xl border border-border bg-surface p-6"
            aria-labelledby="studio-seal-heading"
          >
            <span className="inline-flex rounded-full bg-brand-red/10 px-3 py-1 text-xs font-bold text-brand-red">
              חותם האולפן
            </span>
            <h2
              id="studio-seal-heading"
              className="mt-3 text-lg font-semibold text-foreground"
            >
              {SINGER_STUDIO_SEAL.heading}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              {SINGER_STUDIO_SEAL.body}
            </p>
          </section>

          <section
            className="rounded-xl border border-border bg-surface p-6"
            aria-labelledby="local-support-heading"
          >
            <h2
              id="local-support-heading"
              className="text-lg font-semibold text-foreground"
            >
              {SINGER_LOCAL_SUPPORT.heading}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              {SINGER_LOCAL_SUPPORT.body}
            </p>
            <p className="mt-4 flex flex-wrap gap-2">
              {SINGER_LOCAL_SUPPORT.areas.map((area) => (
                <span
                  key={area}
                  className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground"
                >
                  {area}
                </span>
              ))}
            </p>
            <p className="mt-4 text-xs text-muted-foreground">{SINGER_TRAVEL_NOTE}</p>
          </section>
        </div>

        <ShowcaseVideoSection
          sectionId={SERVICE_SHOWCASE_VIDEO_ID}
          heading="הגברה לזמר בשטח - דוגמה מהאירוע"
          subheading="ציוד מקצועי, כיוון נכון והקמה מהירה. הוידאו נטען בלחיצה."
          videos={SINGER_AMPLIFICATION_VIDEOS}
        />

        {/* Why us - retained value blocks */}
        <section aria-labelledby="why-singer-heading">
          <header className="mx-auto max-w-2xl text-center">
            <h2
              id="why-singer-heading"
              className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
            >
              למה זמרים והרכבים בוחרים בנו?
            </h2>
          </header>
          <ul className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
            {SINGER_WHY_BLOCKS.map((block) => (
              <li
                key={block.title}
                className="rounded-xl border border-border bg-surface p-6"
              >
                <p className="text-2xl" aria-hidden>
                  {block.emoji}
                </p>
                <h3 className="mt-2 font-semibold text-foreground">{block.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{block.description}</p>
                {block.bullets ? (
                  <ul className="mt-3 space-y-1 text-sm text-muted-foreground">
                    {block.bullets.map((b) => (
                      <li key={b}>• {b}</li>
                    ))}
                  </ul>
                ) : null}
              </li>
            ))}
          </ul>
        </section>

        {/* Technical specs - moved down */}
        <section aria-labelledby="tech-specs-heading">
          <header className="mx-auto max-w-2xl text-center">
            <h2
              id="tech-specs-heading"
              className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
            >
              {SINGER_TECH_SPECS.heading}
            </h2>
            <blockquote className="mt-4 border-s-4 border-brand-red/40 ps-4 text-sm italic text-muted-foreground">
              {SINGER_TECH_SPECS.note}
            </blockquote>
            <p className="mt-3 text-sm text-muted-foreground">
              השכרת הגברה לזמר - חבילות מוכנות עם מחירים גלויים
            </p>
          </header>

          <ul className="mt-10 space-y-8">
            {SINGER_PACKAGES.map((pkg) => {
              const packageLabel = `${pkg.name} (${pkg.price})`;
              const packageWhatsappHref = buildWhatsAppHref({
                text: buildServiceWhatsAppText(
                  `${service.whatsappText} - ${packageLabel}`,
                ),
                utm_source: "website",
                utm_campaign: `${service.utmCampaign}_pkg_${pkg.id}`,
              });

              return (
                <li
                  key={pkg.id}
                  className={`flex flex-col rounded-xl border bg-surface p-6 sm:p-8 ${
                    pkg.badge ? "border-2 border-brand-red/40" : "border-border"
                  }`}
                >
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="text-lg font-semibold text-foreground">{pkg.name}</h3>
                    {pkg.badge ? (
                      <span className="rounded-full bg-brand-red px-2.5 py-0.5 text-xs font-bold text-white">
                        {pkg.badge}
                      </span>
                    ) : null}
                    <span className="text-xl font-bold text-brand-red">{pkg.price}</span>
                  </div>
                  <ul className="mt-4 flex-1 space-y-1.5 text-sm text-muted-foreground">
                    {pkg.includes.map((line) => (
                      <li key={line} className="flex gap-2">
                        <span className="text-brand-red" aria-hidden>
                          ✓
                        </span>
                        {line}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-4 text-sm font-medium text-foreground">
                    מתאים ל: {pkg.suitedFor}
                  </p>
                  <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                    <a
                      href={packageWhatsappHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex w-full items-center justify-center rounded-md bg-brand-red px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-red-light focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red sm:w-auto"
                      aria-label={`הזמנת ${pkg.name} בוואטסאפ`}
                    >
                      הזמנה בוואטסאפ
                    </a>
                    <Link
                      href={buildBookHref("singer", pkg.id as SingerPackageId)}
                      className="inline-flex w-full items-center justify-center rounded-md border border-border bg-background px-4 py-2.5 text-sm font-semibold text-foreground transition-colors hover:border-brand-red/40 hover:text-brand-red focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red sm:w-auto"
                      aria-label={`הזמנה מקוונת - ${pkg.name}`}
                    >
                      הזמנה מקוונת
                    </Link>
                  </div>
                </li>
              );
            })}
          </ul>
        </section>

        <section aria-labelledby="addons-heading">
          <header className="mx-auto max-w-2xl text-center">
            <h2 id="addons-heading" className="text-xl font-semibold text-foreground">
              תוספות לציוד הגברה לזמרים
            </h2>
          </header>
          <ul className="mx-auto mt-6 grid max-w-lg grid-cols-1 gap-2">
            {SINGER_ADDONS.map((addon) => (
              <li
                key={addon.name}
                className="flex justify-between rounded-lg border border-border bg-surface px-4 py-2.5 text-sm"
              >
                <span>{addon.name}</span>
                <span className="font-semibold text-brand-red">{addon.price}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="max-w-3xl" aria-labelledby="value-heading">
          <h2
            id="value-heading"
            className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
          >
            למה המחיר שווה כל שקל?
          </h2>
          <p className="mt-4 text-sm text-muted-foreground">
            לא משלמים רק על רמקולים - משלמים על ביטוח להופעה:
          </p>
          <ul className="mt-4 space-y-2">
            {SINGER_VALUE_POINTS.map((point) => (
              <li key={point} className="flex gap-2 text-sm text-muted-foreground">
                <span className="text-brand-red" aria-hidden>
                  ✓
                </span>
                {point}
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="process-heading">
          <header className="mx-auto max-w-2xl text-center">
            <h2
              id="process-heading"
              className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
            >
              איך זה עובד?
            </h2>
          </header>
          <ol className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {SINGER_PROCESS.map((step) => (
              <li
                key={step.step}
                className="rounded-xl border border-border bg-surface p-5"
              >
                <span className="text-xs font-bold tracking-widest text-brand-red">
                  {step.step}
                </span>
                <h3 className="mt-2 font-semibold text-foreground">{step.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{step.description}</p>
              </li>
            ))}
          </ol>
        </section>

        {faqItems.length > 0 ? (
          <FAQAccordion items={faqItems} title="שאלות נפוצות - הגברה מקצועית במודיעין" className="py-0" />
        ) : null}

        <SingerClosingLeadSection whatsappHref={matchFitWhatsappHref} />

        <p className="text-center text-sm">
          <Link
            href="/events/equipment"
            className="font-medium text-brand-red hover:underline"
          >
            ← חזרה להשכרת הגברה לאירועים
          </Link>
          {" · "}
          <Link href="/studio" className="font-medium text-brand-red hover:underline">
            אולפן הקלטות
          </Link>
          {" · "}
          <Link href="/book?service=singer" className="font-medium text-brand-red hover:underline">
            הזמנה מקוונת
          </Link>
        </p>

        <ServiceBlogStrip posts={getBlogPostsByServiceSlug("events/equipment/singer-amplification")} />
        <PageRelatedFooter pathname="/events/equipment/singer-amplification" />
      </div>
    </ServicePageLayout>
  );
}
