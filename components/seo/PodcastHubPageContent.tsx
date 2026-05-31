import Link from "next/link";
import ContextualIntroParagraph from "@/components/seo/ContextualIntroParagraph";
import PageRelatedFooter from "@/components/seo/PageRelatedFooter";
import TableOfContents from "@/components/ui/TableOfContents";
import { PodcastCalculatorLazy } from "@/components/calculators/lazy";
import ShowcaseVideoSection from "@/components/seo/ShowcaseVideoSection";
import AudioPlayer from "@/components/marketing/AudioPlayer";
import PodcastSpotifySample from "@/components/seo/PodcastSpotifySample";
import PodcastBeforeAfter from "@/components/seo/PodcastBeforeAfter";
import PodcastLeadForm from "@/components/seo/PodcastLeadForm";
import FAQAccordion from "@/components/ui/FAQAccordion";
import ServicePageLayout from "@/components/services/ServicePageLayout";
import ServiceShowcaseSections from "@/components/services/ServiceShowcaseSections";
import { resolvePodcastFolderHero } from "@/lib/service-portfolio-hero";
import { withServicePageHeroDefaults } from "@/lib/service-page-ui";
import { PODCAST_SAMPLE_TRACKS } from "@/lib/data/podcast-samples";
import { PODCAST_SHOWCASE_VIDEOS } from "@/lib/data/youtube-showcases";
import {
  PODCAST_HUB_AUDIENCES,
  PODCAST_HUB_CTA_BENEFITS,
  PODCAST_HUB_FAQS,
  PODCAST_HUB_HERO_FEATURES,
  PODCAST_HUB_INCLUDED,
  PODCAST_HUB_PACKAGE_HIGHLIGHTS,
  PODCAST_HUB_PRICING_PACKAGES,
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
import { buildServiceWhatsAppText, buildWhatsAppHref } from "@/lib/whatsapp";

const PODCAST_HUB_TOC = [
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

const PODCAST_TRACKS = [
  {
    href: "/podcast/podcast-with-grandpa",
    title: "פודקאסט עם סבא וסבתא",
    description: "חוויה משפחתית  -  פודקאסט + הקלטת שיר, מזכרת לנצח.",
  },
  {
    href: "/podcast/podcast-recording",
    title: "צילום והקלטת פודקאסט",
    description: "הפקה מלאה  -  פרק מוכן תוך 24 שעות, החל מ-2,500 ₪.",
  },
  {
    href: "/podcast/podcast-production",
    title: "הפקת פודקאסט מא׳ עד ת׳",
    description: "ליווי ארוך טווח  -  תכנון, מיתוג והפצה.",
  },
  {
    href: "/podcast/podcast-studio-modiin",
    title: "השכרת סטודיו / אולפן במודיעין",
    description: "הקלטה שקטה, חדר מבודד וליווי טכני - מ-750 ₪.",
  },
  {
    href: "/podcast/mobile-podcast-at-home",
    title: "פודקאסט נייד עד הבית",
    description: "האולפן מגיע אליכם  -  בית, משרד או אירוע.",
  },
  {
    href: "/podcast/podcast-editing",
    title: "עריכת פודקאסט מלאה",
    description: "ניקוי, שיפור קול וחיתוך  -  פרק מוכן לפרסום.",
  },
  {
    href: "/podcast/faq",
    title: "שאלות ותשובות",
    description: "מחירים, הכנה להקלטה וזמני סטודיו.",
  },
] as const;

const FAQ_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: PODCAST_HUB_FAQS.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.answer,
    },
  })),
};

const VALUE_PILLARS = [
  {
    emoji: "🎙️",
    title: "ציוד מקצועי ברמה גבוהה",
    body: "מיקרופונים Shure & Rode, בידוד אקוסטי מלא, ו-3 חללי הקלטה לבחירה — הסאונד שלכם יישמע כמו רדיו, לא כמו שיחת זום.",
  },
  {
    emoji: "🤖",
    title: "ניקוי רעשים ושיפור הקלטות בבינה מלאכותית",
    body: "כלי AI מתקדמים מנקים רעשי רקע, אקו וגמגומים מבלי לפגוע בקול. עובד גם על הקלטות זום וביתיות ישנות.",
  },
  {
    emoji: "🎧",
    title: "ניסיון שטח מוכח",
    body: "עשרות שנות עבודה על אודיו, מוזיקה ווידאו. לא רק \"עורכי פודקאסטים\" — אנשי מקצוע עם אוזן מאומנת שיודעים מתי משהו נשמע טוב.",
  },
] as const;

export default function PodcastHubPageContent() {
  const whatsappHref = buildWhatsAppHref({
    text: buildServiceWhatsAppText(
      "שלום, מעוניין/ת בהקלטת פודקאסט מקצועית באולפן  -  אשמח לשמוע על חבילות וזמינות.",
    ),
    utm_source: "website",
    utm_campaign: "podcast_hub_cta",
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_JSON_LD) }}
      />
      <ServicePageLayout
        {...heroProps}
        title="אולפן פודקאסט מקצועי במודיעין"
        subtitle="סאונד מושלם. אפס מאמץ טכני. — אתם מגיעים לאולפן, בוחרים חלל, מדברים, ויוצאים עם פרק הקלטת פודקאסט מוכן לספוטיפיי ויוטיוב."
        features={PODCAST_HUB_HERO_FEATURES}
        whatsappText="שלום, מעוניין/ת בהקלטת פודקאסט באולפן מקצועי במודיעין  -  אשמח לשמוע על חבילות וזמינות."
        utmCampaign="podcast_hub"
        scarcityLabel="פרק מוכן תוך 24 שעות"
        ctaLabel="קבעו הקלטה בוואטסאפ"
      >
        <div className="mx-auto max-w-[72rem] space-y-16 px-4 sm:px-6 lg:px-8">
          <ContextualIntroParagraph pathname="/podcast" className="max-w-3xl" />

          {/* ── B: MOBILE STUDIO BANNER ────────────────────────── */}
          <aside
            className="rounded-xl border border-brand-red/30 bg-brand-red/5 p-5 sm:p-6"
            role="note"
            aria-label="שירות אולפן פודקאסט נייד ארצי"
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-foreground">
                  📍 האולפן במודיעין — אבל השירות ארצי
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  לא מגיעים למודיעין? אולפן הפודקאסט הנייד מגיע אליכם לכל
                  מקום — בית, משרד, אירוע, בכל רחבי הארץ.
                </p>
              </div>
              <Link
                href="/podcast/mobile-podcast-at-home"
                className="shrink-0 text-sm font-semibold text-brand-red hover:underline"
              >
                אולפן פודקאסט נייד ←
              </Link>
            </div>
          </aside>

          <TableOfContents entries={PODCAST_HUB_TOC} className="max-w-xs" />

          {/* ── C: VALUE PROPOSITION ───────────────────────────── */}
          <section aria-labelledby="value-prop-heading">
            <header className="mx-auto max-w-2xl text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-red">
                למה לבחור באולפן הפודקאסט שלנו
              </p>
              <h2
                id="value-prop-heading"
                className="mt-2 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
              >
                שיפור הקלטות ברמה אולפנית — בלי מאמץ
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
                אולפן הפודקאסט שלנו במודיעין משלב ציוד Shure &amp; Rode
                מקצועי, בידוד אקוסטי מלא, ושיפור הקלטות בבינה מלאכותית —
                כדי שכל פרק יצא מושלם, בלי שתצטרכו לדאוג לשום דבר טכני.
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

            {/* Workflow */}
            <div className="mt-12">
              <h3 className="text-center text-xl font-semibold text-foreground">
                תהליך הקלטת הפודקאסט — 5 שלבים פשוטים
              </h3>
              <ol className="mt-6 space-y-5">
                {PODCAST_HUB_WORKFLOW.map((step) => (
                  <li
                    key={step.step}
                    className="flex gap-5 rounded-2xl border border-border bg-surface p-6"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-red/10 text-sm font-bold text-brand-red">
                      {step.step}
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">
                        {step.title}
                      </h4>
                      <p className="mt-2 text-sm text-muted-foreground">
                        {step.body}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </section>

          {/* ── D: SERVICES DETAILED ───────────────────────────── */}
          <section aria-labelledby="services-heading">
            <header className="mx-auto max-w-2xl text-center">
              <h2
                id="services-heading"
                className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
              >
                סוגי הקלטת פודקאסט
              </h2>
              <p className="mt-3 text-sm text-muted-foreground">
                בוחרים את המסלול המתאים — ואנחנו מתאימים את ההפקה
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
                דיגיטלית ברמה גבוהה — בלי צוות הפקה פנימי. הקלטת פודקאסט עם
                צילום 4K, עריכה מקצועית ומסירה תוך 24 שעות.
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
                מראיינים קרובי משפחה, או מתעדים זיכרונות — ויוצאים עם תוצר
                שלא יסולא בפז. מתאים גם לאירועים מיוחדים כמו חתונות ובני
                מצווה.
              </p>
              <div className="mt-5">
                <Link
                  href="/podcast/podcast-with-grandpa"
                  className="text-sm font-semibold text-brand-red hover:underline"
                >
                  פודקאסט עם סבא וסבתא — פרטים נוספים ←
                </Link>
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
                  השכרת אולפן פודקאסט במודיעין ←
                </Link>
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
                className="mt-2 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
              >
                חבילות הפקת פודקאסט — מחיר שקוף
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                אולפן פודקאסט במודיעין. לפני מע״מ (+18%). ללא הפתעות.
              </p>
            </header>

            <ul className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-3">
              {PODCAST_HUB_PRICING_PACKAGES.map((pkg) => {
                const pkgWhatsapp = buildWhatsAppHref({
                  text: pkg.whatsappText,
                  utm_source: "website",
                  utm_campaign: `podcast_pricing_${pkg.id}`,
                });
                return (
                  <li
                    key={pkg.id}
                    className={
                      pkg.highlighted
                        ? "relative rounded-2xl border-2 border-brand-red bg-surface p-7 shadow-[0_0_30px_rgba(212,43,43,0.12)]"
                        : "relative rounded-2xl border border-border bg-surface p-7"
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
                          ? "mt-7 block rounded-xl bg-brand-red px-4 py-3 text-center text-sm font-semibold text-white hover:bg-brand-red-light"
                          : "mt-7 block rounded-xl border border-brand-red/40 px-4 py-3 text-center text-sm font-semibold text-brand-red hover:bg-brand-red/5"
                      }
                    >
                      {pkg.ctaLabel} ←
                    </a>
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
                {PODCAST_HUB_STARTING_PRICE} ₪ ·{" "}
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
                className="mt-2 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
              >
                הקלטה ביתית? אנחנו מנקים אותה
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
                גם אם הקלטתם בזום, בחדר רועש, או בטלפון — כלי שיפור הקלטות
                בבינה מלאכותית שלנו מסירים רעשי רקע, אקו ותהודה בלי לפגוע
                בקול. שולחים קובץ ומקבלים גרסה מושלמת תוך 24 שעות.
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
                לשירות עריכת פודקאסט מלאה ←
              </Link>
            </p>
          </section>

          {/* ── VIDEO & AUDIO SHOWCASE ─────────────────────────── */}
          <ShowcaseVideoSection
            heading="דוגמאות להקלטות פודקאסט מהאולפן"
            subheading="הסרטון הראשון נטען מיד - שאר הדוגמאות בלחיצה"
            videos={PODCAST_SHOWCASE_VIDEOS}
            initialVisible={4}
          />

          <PodcastSpotifySample />

          <section aria-labelledby="samples-heading">
            <header className="mx-auto max-w-2xl text-center">
              <h2
                id="samples-heading"
                className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
              >
                האזינו לדוגמאות — שיפור הקלטות בפעולה
              </h2>
              <p className="mt-3 text-sm text-muted-foreground">
                פתיחת פודקאסט וקול אחרי עריכה ושיפור סאונד בבינה מלאכותית.
              </p>
            </header>
            <div className="mx-auto mt-8 max-w-xl">
              <AudioPlayer tracks={PODCAST_SAMPLE_TRACKS} />
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
                className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
              >
                מה אומרים מי שכבר הקליטו
              </h2>
              <p className="mt-3 text-sm text-muted-foreground">
                לקוחות שהגיעו לאולפן הפודקאסט במודיעין
              </p>
            </header>
            <ul className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {PODCAST_HUB_TESTIMONIALS.map((t) => (
                <li
                  key={t.name}
                  className="rounded-xl border border-border bg-surface p-6"
                >
                  <div
                    className="flex gap-0.5 text-brand-red"
                    aria-label="דירוג 5 כוכבים"
                  >
                    {Array.from({ length: 5 }).map((_, i) => (
                      <svg
                        key={i}
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className="h-4 w-4"
                        aria-hidden
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <blockquote className="mt-4 text-sm leading-relaxed text-foreground">
                    &ldquo;{t.quote}&rdquo;
                  </blockquote>
                  <footer className="mt-4">
                    <p className="text-xs font-semibold text-foreground">
                      {t.name}
                    </p>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                  </footer>
                </li>
              ))}
            </ul>
          </section>

          {/* ── G: FAQ ─────────────────────────────────────────── */}
          <section id="faq-heading" aria-label="שאלות נפוצות">
            <FAQAccordion
              items={[...PODCAST_HUB_FAQS]}
              title="שאלות נפוצות — הקלטת פודקאסט מודיעין"
              className="py-0"
            />
          </section>

          {/* ── H: MICRO-CONVERSION LEAD FORM ──────────────────── */}
          <PodcastLeadForm />

          {/* ── I: FINAL CTA ───────────────────────────────────── */}
          <section
            className="rounded-2xl border border-border bg-surface p-8 text-center sm:p-10"
            aria-labelledby="podcast-cta-heading"
          >
            <h2
              id="podcast-cta-heading"
              className="text-xl font-semibold text-foreground sm:text-2xl"
            >
              מוכנים להתחיל את הפודקאסט שלכם?
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-muted-foreground">
              אולפן הפודקאסט המקצועי במודיעין זמין לכם. תפסיקו לחשוב על זה —
              תתחילו לדבר.
            </p>
            <ul className="mx-auto mt-6 flex max-w-md flex-wrap justify-center gap-2">
              {PODCAST_HUB_CTA_BENEFITS.map((benefit) => (
                <li
                  key={benefit}
                  className="rounded-full border border-brand-red/25 bg-brand-red/5 px-3 py-1 text-xs font-medium text-foreground"
                >
                  {benefit} ✓
                </li>
              ))}
            </ul>
            <p className="mt-6 text-lg font-semibold text-brand-red">
              החל מ-{PODCAST_HUB_STARTING_PRICE} ₪ לפרק של חצי שעה
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              {PODCAST_HUB_STARTING_PRICE_NOTE}
            </p>
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-7 inline-flex items-center gap-2 rounded-xl bg-brand-red px-7 py-3 text-sm font-semibold text-white hover:bg-brand-red-light"
            >
              קבעו הקלטה בוואטסאפ ←
            </a>
          </section>

          {/* ── RELATED TRACKS ─────────────────────────────────── */}
          <section aria-labelledby="tracks-heading">
            <header className="mx-auto max-w-2xl text-center">
              <h2
                id="tracks-heading"
                className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
              >
                מסלולים נוספים
              </h2>
              <p className="mt-3 text-sm text-muted-foreground">
                לפי השלב שבו אתם  -  או שלבו כמה שירותים לחבילה אחת.
              </p>
            </header>
            <ul className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2">
              {PODCAST_TRACKS.map((track) => (
                <li key={track.href}>
                  <Link
                    href={track.href}
                    className="group flex h-full flex-col rounded-xl border border-border bg-surface p-6 transition-[border-color,box-shadow,transform] duration-normal ease-luxury hover:-translate-y-0.5 hover:border-brand-red/40 hover:shadow-md"
                  >
                    <h3 className="text-lg font-semibold text-foreground transition-colors group-hover:text-brand-red">
                      {track.title}
                    </h3>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                      {track.description}
                    </p>
                    <span className="mt-4 text-xs font-semibold text-brand-red">
                      לפרטים ←
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>

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

          <PageRelatedFooter pathname="/podcast" />
        </div>
      </ServicePageLayout>
    </>
  );
}
