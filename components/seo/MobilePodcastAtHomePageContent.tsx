import Link from "next/link";
import ContextualIntroParagraph from "@/components/seo/ContextualIntroParagraph";
import PageRelatedFooter from "@/components/seo/PageRelatedFooter";
import FAQAccordion from "@/components/ui/FAQAccordion";
import ServicePageLayout from "@/components/services/ServicePageLayout";
import ServiceShowcaseSections from "@/components/services/ServiceShowcaseSections";
import { resolvePodcastFolderHero } from "@/lib/service-portfolio-hero";
import { withServicePageHeroDefaults } from "@/lib/service-page-ui";
import {
  MOBILE_PODCAST_AUDIENCES,
  MOBILE_PODCAST_FAQS,
  MOBILE_PODCAST_HERO_FEATURES,
  MOBILE_PODCAST_RELATED_LINKS,
  MOBILE_PODCAST_WORKFLOW,
} from "@/lib/data/mobile-podcast-at-home-page";
import {
  CONTACT_PHONE_DISPLAY,
  CONTACT_PHONE_E164,
} from "@/lib/constants";
import {
  youtubeEmbedUrl,
  YOUTUBE_SERVICE_EMBED_IDS,
} from "@/lib/data/youtube-embeds";
import { buildServiceWhatsAppText, buildWhatsAppHref } from "@/lib/whatsapp";

const MOBILE_PODCAST_TITLE = "פודקאסט נייד עד הבית";

const pageHero = resolvePodcastFolderHero(
  MOBILE_PODCAST_TITLE,
  youtubeEmbedUrl(YOUTUBE_SERVICE_EMBED_IDS["podcast-mobile-at-home"]),
);
const heroProps = withServicePageHeroDefaults(pageHero);

export default function MobilePodcastAtHomePageContent() {
  const whatsappHref = buildWhatsAppHref({
    text: buildServiceWhatsAppText(
      "שלום, מעוניין/ת בפודקאסט נייד עד הבית. אשמח לשמוע על זמינות, אזור הגעה ומחיר.",
    ),
    utm_source: "website",
    utm_campaign: "podcast_mobile_home_cta",
  });

  return (
    <ServicePageLayout
      title="פודקאסט נייד עד הבית"
      subtitle="האולפן המקצועי מגיע אליכם  -  בית, משרד או אירוע. ציוד מתקדם, ליווי של מהנדס סאונד מקצועי - יקיר כהן, ותוצאה ברמת ספוטיפיי, בלי לצאת מהבית."
      features={MOBILE_PODCAST_HERO_FEATURES}
      whatsappText="שלום, מעוניין בפודקאסט נייד עד הבית"
      utmCampaign="podcast_mobile_home"
      corporateShareLabel="הקלטת פודקאסט בבית הלקוח"
      bookSlug="podcast/mobile-podcast-at-home"
      scarcityLabel="🚐 האולפן מגיע אליכם"
      ctaLabel="הזמנת הקלטה ניידת בוואטסאפ"
      {...heroProps}
    >
      <div className="mx-auto max-w-[72rem] space-y-16 px-4 sm:px-6 lg:px-8">
        <ContextualIntroParagraph pathname="/podcast/mobile-podcast-at-home" className="max-w-3xl" />
        <section
          className="rounded-xl border border-brand-red/30 bg-brand-red/5 p-6 sm:p-8"
          aria-label="הזמנה מהירה"
        >
          <p className="text-center text-sm font-semibold text-foreground sm:text-base">
            פודקאסט נייד עד הבית  -  האולפן המקצועי מגיע אליכם
          </p>
          <p className="mx-auto mt-2 max-w-xl text-center text-sm text-muted-foreground">
            חולמים להקליט אבל אין זמן להגיע לאולפן? אין בעיה  -  אנחנו מביאים את
            האולפן ישירות אליכם.
          </p>
          <div className="mt-6 flex flex-col items-stretch gap-3 sm:flex-row sm:justify-center">
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-red px-6 py-3.5 text-sm font-semibold text-white hover:bg-brand-red-light"
            >
              פרטים והזמנה בוואטסאפ
            </a>
            <a
              href={`tel:${CONTACT_PHONE_E164}`}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-brand-red/40 bg-background px-6 py-3.5 text-sm font-semibold text-brand-red hover:bg-brand-red/5"
            >
              {CONTACT_PHONE_DISPLAY}
            </a>
            <Link
              href="/book"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-border px-6 py-3.5 text-sm font-medium hover:border-brand-red/40 hover:text-brand-red"
            >
              טופס הזמנה
            </Link>
          </div>
        </section>

        <section className="max-w-3xl" aria-labelledby="mobile-intro-heading">
          <h2
            id="mobile-intro-heading"
            className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
          >
            הקלטת פודקאסט בבית, במשרד או בכל מקום
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
            עם השירות הייחודי של יקיר כהן הפקות, אנחנו מביאים את האולפן
              המקצועי ישירות אליכם. ציוד הקלטה מתקדם, ליווי של מהנדס סאונד מקצועי - יקיר כהן, ותוצאה
            ברמה של ספוטיפיי  -  בלי לצאת מהבית.
          </p>
        </section>

        <section aria-labelledby="workflow-heading">
          <header className="mx-auto max-w-2xl text-center">
            <h2
              id="workflow-heading"
              className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
            >
              איך עובד תהליך ההקלטה הניידת?
            </h2>
          </header>
          <ol className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {MOBILE_PODCAST_WORKFLOW.map((step, i) => (
              <li
                key={step.title}
                className="rounded-xl border border-border bg-surface p-5"
              >
                <span className="text-2xl" aria-hidden>
                  {step.emoji}
                </span>
                <p className="mt-2 text-xs font-bold text-brand-red">
                  שלב {i + 1}
                </p>
                <h3 className="mt-1 font-semibold text-foreground">{step.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{step.body}</p>
              </li>
            ))}
          </ol>
        </section>

        <section aria-labelledby="audience-heading">
          <header className="mx-auto max-w-2xl text-center">
            <h2
              id="audience-heading"
              className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
            >
              למי מתאים פודקאסט נייד עד הבית?
            </h2>
          </header>
          <ul className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2">
            {MOBILE_PODCAST_AUDIENCES.map((item) => (
              <li
                key={item.title}
                className="rounded-xl border border-border bg-background p-5"
              >
                <span className="text-3xl" aria-hidden>
                  {item.emoji}
                </span>
                <h3 className="mt-3 font-semibold text-foreground">{item.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {item.description}
                </p>
                {item.link ? (
                  <Link
                    href={item.link.href}
                    className="mt-3 inline-flex text-sm font-semibold text-brand-red hover:underline"
                  >
                    {item.link.label} ←
                  </Link>
                ) : null}
              </li>
            ))}
          </ul>
        </section>

        <ServiceShowcaseSections
          assetsFolder="podcast"
          playlistEmbedUrl={youtubeEmbedUrl(
            YOUTUBE_SERVICE_EMBED_IDS["podcast-mobile-at-home"],
          )}
          mediaType="video"
          galleryLabel="פודקאסט נייד בשטח"
          videoTitle="פודקאסט נייד  -  הקלטה בשטח"
          videoHeadingId="video-heading"
          videoHeading="דוגמה מהשטח"
        />

        <FAQAccordion
          items={[...MOBILE_PODCAST_FAQS]}
          title="שאלות נפוצות  -  פודקאסט נייד עד הבית"
          className="py-0"
        />

        <p className="text-center text-sm text-muted-foreground">
          <Link href="/podcast" className="font-medium text-brand-red hover:underline">
            לפרטים נוספים על מחירון פודקאסט ←
          </Link>
        </p>

        <section aria-labelledby="related-heading">
          <h2
            id="related-heading"
            className="text-center text-xl font-semibold text-foreground"
          >
            שירותים נוספים שיעניינו אתכם
          </h2>
          <ul className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {MOBILE_PODCAST_RELATED_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="flex items-center gap-3 rounded-xl border border-border bg-surface px-4 py-3 text-sm font-medium transition-colors hover:border-brand-red/40 hover:text-brand-red"
                >
                  <span aria-hidden>{link.emoji}</span>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section
          className="rounded-2xl border border-border bg-surface p-8 text-center"
          aria-labelledby="mobile-cta-heading"
        >
          <h2
            id="mobile-cta-heading"
            className="text-xl font-semibold text-foreground sm:text-2xl"
          >
            מוכנים שהאולפן יגיע אליכם?
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-sm text-muted-foreground">
            נתאם מועד, אזור הגעה וחבילה  -  ונחזור עם הצעה מדויקת.
          </p>
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-7 inline-flex items-center gap-2 rounded-xl bg-brand-red px-7 py-3 text-sm font-semibold text-white hover:bg-brand-red-light"
          >
            הזמנת הקלטה ניידת בוואטסאפ ←
          </a>
        </section>
              <PageRelatedFooter pathname="/podcast/mobile-podcast-at-home" />

            </div>
    </ServicePageLayout>
  );
}
