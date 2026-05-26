import Link from "next/link";
import ContextualIntroParagraph from "@/components/seo/ContextualIntroParagraph";
import PageRelatedFooter from "@/components/seo/PageRelatedFooter";
import { PodcastCalculatorLazy } from "@/components/calculators/lazy";
import FAQAccordion from "@/components/ui/FAQAccordion";
import ServicePageLayout from "@/components/services/ServicePageLayout";
import ServiceShowcaseSections from "@/components/services/ServiceShowcaseSections";
import { resolvePodcastFolderHero } from "@/lib/service-portfolio-hero";
import { withServicePageHeroDefaults } from "@/lib/service-page-ui";
import {
  PODCAST_PRODUCTION_COMPARE,
  PODCAST_PRODUCTION_FAQS,
  PODCAST_PRODUCTION_HERO_FEATURES,
  PODCAST_PRODUCTION_INCLUDES,
  PODCAST_PRODUCTION_PHASES,
} from "@/lib/data/podcast-production-page";
import { PODCAST_STARTER_PRICE } from "@/lib/data/podcast-calculator";
import { buildServiceWhatsAppText, buildWhatsAppHref } from "@/lib/whatsapp";

const PRODUCTION_TITLE = "הפקת פודקאסט מא׳ עד ת׳";
const pageHero = resolvePodcastFolderHero(PRODUCTION_TITLE);
const heroProps = withServicePageHeroDefaults(pageHero);

export default function PodcastProductionPageContent() {
  const whatsappHref = buildWhatsAppHref({
    text: buildServiceWhatsAppText(
      "שלום, מעוניין/ת בליווי והפקת פודקאסט מא׳ עד ת׳. אשמח לשמוע על המסלול.",
    ),
    utm_source: "website",
    utm_campaign: "podcast_production_cta",
  });

  return (
    <ServicePageLayout
      title="הפקת פודקאסט מא׳ עד ת׳"
      subtitle="ליווי מקצועי מהרעיון ועד פרסום: אפיון, תסריט, מיתוג שמע, הקלטה, עריכה והפצה. מתאים ליזמים, מומחים ומותגים שרוצים פודקאסט אמיתי לטווח ארוך."
      features={PODCAST_PRODUCTION_HERO_FEATURES}
      whatsappText="שלום, מעוניין בליווי והפקת פודקאסט משלב הרעיון"
      utmCampaign="podcast_production"
      ctaLabel="שיחת אפיון בוואטסאפ"
      {...heroProps}
    >
      <div className="mx-auto max-w-[72rem] space-y-16 px-4 sm:px-6 lg:px-8">
        <ContextualIntroParagraph pathname="/podcast/podcast-production" className="max-w-3xl" />
        <section className="max-w-3xl" aria-labelledby="production-intro-heading">
          <h2
            id="production-intro-heading"
            className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
          >
            לא רק פרק אחד  -  מערך שלם
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
            הפקת פרק בודדת מושלמת לרגע ההקלטה. ליווי מא׳ עד ת׳ בונה את
            הפודקאסט כמוצר: פורמט, מיתוג, לוח שידורים וצמיחה. מתחילים בפרק
            ראשון  -  אפשר בחבילת חצי שעה ב-{PODCAST_STARTER_PRICE} ₪  -  וממשיכים
            לפי קצב שנוח לכם.
          </p>
        </section>

        <section aria-labelledby="phases-heading">
          <header className="mx-auto max-w-2xl text-center">
            <h2
              id="phases-heading"
              className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
            >
              שלבי הליווי
            </h2>
          </header>
          <ol className="mt-10 space-y-5">
            {PODCAST_PRODUCTION_PHASES.map((phase) => (
              <li
                key={phase.step}
                className="flex gap-5 rounded-2xl border border-border bg-surface p-6"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-red/10 text-sm font-bold text-brand-red">
                  {phase.step}
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{phase.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{phase.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section aria-labelledby="includes-heading">
          <h2
            id="includes-heading"
            className="text-xl font-semibold text-foreground sm:text-2xl"
          >
            מה כלול בליווי?
          </h2>
          <ul className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {PODCAST_PRODUCTION_INCLUDES.map((item) => (
              <li
                key={item}
                className="flex gap-3 rounded-xl border border-border bg-background px-4 py-3 text-sm"
              >
                <span className="text-brand-red" aria-hidden>
                  ✓
                </span>
                {item}
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="compare-heading">
          <header className="mx-auto max-w-2xl text-center">
            <h2
              id="compare-heading"
              className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
            >
              איזה מסלול מתאים לכם?
            </h2>
          </header>
          <ul className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-3">
            {PODCAST_PRODUCTION_COMPARE.map((item) => (
              <li
                key={item.href}
                className="flex flex-col rounded-xl border border-border bg-surface p-6"
              >
                <h3 className="font-semibold text-foreground">{item.title}</h3>
                <p className="mt-2 flex-1 text-sm text-muted-foreground">
                  {item.description}
                </p>
                <Link
                  href={item.href}
                  className="mt-4 text-sm font-semibold text-brand-red hover:underline"
                >
                  {item.cta} ←
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="pricing-heading">
          <header className="mx-auto max-w-2xl text-center">
            <h2
              id="pricing-heading"
              className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
            >
              חבילות והקלטה
            </h2>
            <p className="mt-3 text-sm text-muted-foreground">
              בחרו נקודת התחלה  -  ליווי ארוך טווח מתואם בנפרד
            </p>
          </header>
          <PodcastCalculatorLazy className="mt-8" />
        </section>

        <ServiceShowcaseSections
          assetsFolder="podcast"
          mediaType="gallery"
          galleryLabel="דוגמאות מהאולפן"
        />

        <FAQAccordion
          items={[...PODCAST_PRODUCTION_FAQS]}
          title="שאלות נפוצות  -  ליווי מא׳ עד ת׳"
          className="py-0"
        />

        <section
          className="rounded-2xl border border-border bg-surface p-8 text-center"
          aria-labelledby="production-cta-heading"
        >
          <h2
            id="production-cta-heading"
            className="text-xl font-semibold text-foreground"
          >
            מוכנים לבנות פודקאסט לטווח ארוך?
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-sm text-muted-foreground">
            שיחת אפיון ראשונה  -  בלי התחייבות. נבין יחד איפה אתם ולאן הולכים.
          </p>
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-7 inline-flex items-center gap-2 rounded-xl bg-brand-red px-7 py-3 text-sm font-semibold text-white hover:bg-brand-red-light"
          >
            שיחת אפיון בוואטסאפ ←
          </a>
        </section>
              <PageRelatedFooter pathname="/podcast/podcast-production" />

            </div>
    </ServicePageLayout>
  );
}
