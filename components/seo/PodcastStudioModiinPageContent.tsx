import Image from "next/image";
import ContextualIntroParagraph from "@/components/seo/ContextualIntroParagraph";
import PageRelatedFooter from "@/components/seo/PageRelatedFooter";
import Link from "next/link";
import { GoogleReviews } from "@/components/marketing/SocialProofWidgets";
import { PodcastCalculatorLazy } from "@/components/calculators/lazy";
import ShowcaseVideoSection from "@/components/seo/ShowcaseVideoSection";
import PodcastSpotifySample from "@/components/seo/PodcastSpotifySample";
import FAQAccordion from "@/components/ui/FAQAccordion";
import ServicePageLayout from "@/components/services/ServicePageLayout";
import ServiceShowcaseSections from "@/components/services/ServiceShowcaseSections";
import { resolvePodcastFolderHero } from "@/lib/service-portfolio-hero";
import { withServicePageHeroDefaults } from "@/lib/service-page-ui";
import { PODCAST_SHOWCASE_VIDEOS } from "@/lib/data/youtube-showcases";
import {
  STUDIO_MODIIN_FAQS,
  STUDIO_MODIIN_HERO_FEATURES,
  STUDIO_MODIIN_HERO_IMAGE,
  STUDIO_MODIIN_RELATED_SERVICES,
  STUDIO_MODIIN_WHY_US,
} from "@/lib/data/podcast-studio-modiin-page";
import {
  youtubeEmbedUrl,
  YOUTUBE_SERVICE_EMBED_IDS,
} from "@/lib/data/youtube-embeds";
import { buildServiceWhatsAppText, buildWhatsAppHref } from "@/lib/whatsapp";

const STUDIO_MODIIN_TITLE = "השכרת סטודיו לפודקאסט במודיעין";

const pageHero = resolvePodcastFolderHero(
  STUDIO_MODIIN_TITLE,
  youtubeEmbedUrl(YOUTUBE_SERVICE_EMBED_IDS["podcast-example-1"]),
);
const heroProps = withServicePageHeroDefaults(pageHero);

export default function PodcastStudioModiinPageContent() {
  const whatsappHref = buildWhatsAppHref({
    text: buildServiceWhatsAppText(
      "שלום, מעוניין/ת בהשכרת סטודיו לפודקאסט במודיעין. אשמח לשמוע על זמינות ומחיר.",
    ),
    utm_source: "website",
    utm_campaign: "podcast_studio_modiin_cta",
  });

  return (
    <ServicePageLayout
      title="השכרת סטודיו לפודקאסט במודיעין"
      subtitle="פודקאסט שנשמע אנושי ומקצועי - לא AI-רובוטי. קריינות אנושית, ציוד מתקדם, ליווי טכני מלא וקביעת מקום תוך 24 שעות."
      features={STUDIO_MODIIN_HERO_FEATURES}
      whatsappText="שלום, מעוניין בהשכרת סטודיו לפודקאסט במודיעין"
      utmCampaign="podcast_studio_modiin"
      corporateShareLabel="השכרת אולפן פודקאסט במודיעין"
      bookSlug="podcast/podcast-studio-modiin"
      ctaLabel="קביעת מקום תוך 24 שעות"
      {...heroProps}
    >
      <div className="mx-auto max-w-[72rem] space-y-16 px-4 sm:px-6 lg:px-8">
        <ContextualIntroParagraph pathname="/podcast/podcast-studio-modiin" className="max-w-3xl" />

        <ShowcaseVideoSection
          heading="דוגמאות מהסטודיו במודיעין"
          subheading="פודקאסטים שהוקלטו אצלנו - לחצו לצפייה"
          videos={PODCAST_SHOWCASE_VIDEOS}
          initialVisible={3}
        />

        <PodcastSpotifySample />

        <section className="grid gap-8 lg:grid-cols-2 lg:items-center">
          <div className="max-w-xl">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-red">
              יקיר כהן הפקות - מודיעין
            </p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              ההקלטה המקצועית שהתוכן שלכם ראוי לה
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
              ברוכים הבאים לסטודיו של יקיר כהן הפקות במודיעין. אנו מציעים
              השכרת סטודיו לפודקאסט במודיעין והסביבה, עם ציוד הקלטה מתקדם,
              חדר מבודד רעשים וליווי טכני מלא.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              בין אם אתם ממודיעין, ירושלים או תל אביב  -  אנחנו כאן כדי להפוך את
              הרעיון שלכם לפודקאסט מצליח.
            </p>
            <p className="mt-3 text-sm text-muted-foreground">
              הקלטה ביתית נוחה, אבל כדי להישמע ברמת ספוטיפיי או Apple Podcasts
              צריך את התנאים הנכונים.
            </p>
          </div>
          <figure className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-border bg-surface">
            <Image
              src={STUDIO_MODIIN_HERO_IMAGE.src}
              alt={STUDIO_MODIIN_HERO_IMAGE.alt}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
            <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-4 py-3 text-xs text-white/90">
              {STUDIO_MODIIN_HERO_IMAGE.alt}
            </figcaption>
          </figure>
        </section>

        <section aria-labelledby="why-studio-heading">
          <header className="mx-auto max-w-2xl text-center">
            <h2
              id="why-studio-heading"
              className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
            >
              למה בוחרים בסטודיו שלנו?
            </h2>
          </header>
          <ul className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {STUDIO_MODIIN_WHY_US.map((item) => (
              <li
                key={item}
                className="flex gap-3 rounded-xl border border-border bg-surface px-4 py-3 text-sm leading-relaxed"
              >
                <span className="shrink-0 text-brand-red" aria-hidden>
                  ✓
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="related-services-heading">
          <header className="mx-auto max-w-2xl text-center">
            <h2
              id="related-services-heading"
              className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
            >
              מעבר להשכרת סטודיו  -  שירותי הפקה מלאים
            </h2>
            <p className="mt-3 text-sm text-muted-foreground">
              ההקלטה היא רק ההתחלה. כדי שהפודקאסט יגיע לקהל רחב:
            </p>
          </header>
          <ul className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2">
            {STUDIO_MODIIN_RELATED_SERVICES.map((service) => (
              <li key={service.href}>
                <Link
                  href={service.href}
                  className="group flex h-full flex-col rounded-xl border border-border bg-background p-6 transition-[border-color,box-shadow] hover:border-brand-red/40 hover:shadow-md"
                >
                  <span className="text-2xl" aria-hidden>
                    {service.emoji}
                  </span>
                  <h3 className="mt-3 font-semibold text-foreground group-hover:text-brand-red">
                    {service.title}
                  </h3>
                  <p className="mt-2 flex-1 text-sm text-muted-foreground">
                    {service.description}
                  </p>
                  <span className="mt-4 text-xs font-semibold text-brand-red">
                    לפרטים </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <ServiceShowcaseSections
          assetsFolder="podcast"
          playlistEmbedUrl={null}
          mediaType="gallery"
          galleryLabel="תמונות מהסטודיו"
        />

        <section aria-labelledby="pricing-heading">
          <header className="mx-auto max-w-2xl text-center">
            <h2
              id="pricing-heading"
              className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
            >
              מחירון והשכרת סטודיו
            </h2>
            <p className="mt-3 text-sm text-muted-foreground">
              המחיר משתנה לפי משך ההקלטה ושירותים נלווים. בחרו חבילה ושלחו
              סיכום בוואטסאפ  -  או{" "}
              <Link href="/podcast" className="font-medium text-brand-red hover:underline">
                לעמוד הפודקאסט המלא
              </Link>
              .
            </p>
          </header>
          <PodcastCalculatorLazy className="mt-8" />
        </section>

        <FAQAccordion
          items={[...STUDIO_MODIIN_FAQS]}
          title="שאלות נפוצות  -  השכרת סטודיו לפודקאסט"
          className="py-0"
        />

        <section
          className="rounded-2xl border border-border bg-surface p-8 text-center"
          aria-labelledby="studio-cta-heading"
        >
          <h2
            id="studio-cta-heading"
            className="text-xl font-semibold text-foreground sm:text-2xl"
          >
            מוכנים להקליט? קביעת מקום תוך 24 שעות
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-muted-foreground">
            אל תתנו לציוד לא מתאים או לרעשי רקע לפגוע בתוכן. הפודקאסט שלכם
            ראוי לקול אנושי - לא AI-רובוטי.
          </p>
          <ul className="mx-auto mt-5 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
            {[
              "קביעת מקום תוך 24 שעות",
              "קריינות אנושית - ללא AI-רובוטי",
              "ליווי טכני מלא",
            ].map((item) => (
              <li key={item} className="flex items-center gap-1.5">
                <span className="font-semibold text-brand-red" aria-hidden>✓</span>
                {item}
              </li>
            ))}
          </ul>
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-7 inline-flex items-center gap-2 rounded-xl bg-brand-red px-7 py-3 text-sm font-semibold text-white hover:bg-brand-red-light"
          >
            קבע מקום עכשיו - מוכן תוך 24 שעות</a>
        </section>

        <GoogleReviews
          heading="ראו מה לקוחות אומרים עלינו"
          subheading="ביקורות Google מאומתות"
        />
              <PageRelatedFooter pathname="/podcast/podcast-studio-modiin" />

            </div>
    </ServicePageLayout>
  );
}
