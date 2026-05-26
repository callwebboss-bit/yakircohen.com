import Link from "next/link";
import ContextualIntroParagraph from "@/components/seo/ContextualIntroParagraph";
import PageRelatedFooter from "@/components/seo/PageRelatedFooter";
import TableOfContents from "@/components/ui/TableOfContents";
import { PodcastCalculatorLazy } from "@/components/calculators/lazy";
import ShowcaseVideoSection from "@/components/seo/ShowcaseVideoSection";
import AudioPlayer from "@/components/marketing/AudioPlayer";
import PodcastSpotifySample from "@/components/seo/PodcastSpotifySample";
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
  PODCAST_HUB_STARTING_PRICE,
  PODCAST_HUB_STARTING_PRICE_NOTE,
  PODCAST_HUB_STUDIO_SPACES,
  PODCAST_HUB_WORKFLOW,
} from "@/lib/data/podcast-hub-page";
import {
  youtubeEmbedUrl,
  YOUTUBE_SERVICE_EMBED_IDS,
} from "@/lib/data/youtube-embeds";
import { buildServiceWhatsAppText, buildWhatsAppHref } from "@/lib/whatsapp";

const PODCAST_HUB_TITLE = "הפקת פודקאסט מלאה";

const PODCAST_HUB_TOC = [
  { id: "all-in-one-heading", label: "הכל כלול", level: 2 as const },
  { id: "highlights-heading", label: "מה מקבלים", level: 2 as const },
  { id: "pricing-calculator-heading", label: "מחירון ומחשבון", level: 2 as const },
  { id: "samples-heading", label: "דוגמאות", level: 2 as const },
  { id: "tracks-heading", label: "שירותי פודקאסט", level: 2 as const },
];

const pageHero = resolvePodcastFolderHero(
  PODCAST_HUB_TITLE,
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

export default function PodcastHubPageContent() {
  const whatsappHref = buildWhatsAppHref({
    text: buildServiceWhatsAppText(
      "שלום, מעוניין/ת בהפקת פודקאסט מלאה באולפן  -  אשמח לשמוע על חבילות וזמינות.",
    ),
    utm_source: "website",
    utm_campaign: "podcast_hub_cta",
  });

  return (
    <ServicePageLayout
      title="הפקת פודקאסט מלאה"
      subtitle="אתם מגיעים, בוחרים חלל, מדברים  -  ויוצאים עם פרק מוכן להעלאה לספוטיפיי ויוטיוב. צילום 4K, הקלטה אולפנית ועריכה מקצועית  -  בלי להתעסק עם שום דבר טכני."
      features={PODCAST_HUB_HERO_FEATURES}
      whatsappText="שלום, אשמח לשמוע על הפקת פודקאסט מלאה באולפן"
      utmCampaign="podcast_hub"
      scarcityLabel="פרק מוכן תוך 24 שעות"
      ctaLabel="קבעו הקלטה בוואטסאפ"
      {...heroProps}
    >
      <div className="mx-auto max-w-[72rem] space-y-16 px-4 sm:px-6 lg:px-8">
        <ContextualIntroParagraph pathname="/podcast" className="max-w-3xl" />

        <ShowcaseVideoSection
          heading="דוגמאות לפודקאסטים מהאולפן"
          subheading="הסרטון הראשון נטען מיד - שאר הדוגמאות בלחיצה"
          videos={PODCAST_SHOWCASE_VIDEOS}
          initialVisible={4}
        />

        <PodcastSpotifySample />

        <TableOfContents entries={PODCAST_HUB_TOC} className="max-w-xs" />
        <section
          className="rounded-xl border border-brand-red/30 bg-brand-red/5 p-6 sm:p-8"
          aria-labelledby="all-in-one-heading"
        >
          <h2
            id="all-in-one-heading"
            className="text-xl font-semibold text-foreground sm:text-2xl"
          >
            הכל כלול בהפקה אחת
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
            מגיעים לאולפן, מדברים, ויוצאים עם פרק מוכן  -  בלי להתעסק עם שום דבר
            טכני. חבילות וליווי מותאמים לפי סוג התוכן שלכם.
          </p>
        </section>

        <section aria-labelledby="highlights-heading">
          <header className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-red">
              שירותי הסטודיו
            </p>
            <h2
              id="highlights-heading"
              className="mt-2 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
            >
              מה מקבלים בפודקאסט מלא?
            </h2>
          </header>
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
        </section>

        <section aria-labelledby="audience-heading">
          <header className="mx-auto max-w-2xl text-center">
            <h2
              id="audience-heading"
              className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
            >
              למי זה מתאים?
            </h2>
            <p className="mt-3 text-sm text-muted-foreground">
              לכל מי שרוצה פודקאסט מקצועי  -  בלי כאב הראש
            </p>
          </header>
          <ul className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2">
            {PODCAST_HUB_AUDIENCES.map((item) => (
              <li
                key={item.title}
                className="flex gap-4 rounded-xl border border-border bg-background p-5"
              >
                <span className="text-3xl" aria-hidden>
                  {item.emoji}
                </span>
                <div>
                  <h3 className="font-semibold text-foreground">{item.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="spaces-heading">
          <header className="mx-auto max-w-2xl text-center">
            <h2
              id="spaces-heading"
              className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
            >
              בחרו את החלל שלכם
            </h2>
          </header>
          <ul className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-3">
            {PODCAST_HUB_STUDIO_SPACES.map((space) => (
              <li
                key={space.title}
                className="rounded-2xl border border-border bg-surface p-6 text-center"
              >
                <span className="text-4xl" aria-hidden>
                  {space.emoji}
                </span>
                <h3 className="mt-4 font-semibold text-foreground">
                  {space.title}
                </h3>
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
              השכרת סטודיו במודיעין ←
            </Link>
          </p>
        </section>

        <section aria-labelledby="included-heading">
          <header className="mx-auto max-w-2xl text-center">
            <h2
              id="included-heading"
              className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
            >
              מה כלול בהפקה המלאה?
            </h2>
          </header>
          <ul className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {PODCAST_HUB_INCLUDED.map((item) => (
              <li
                key={item.title}
                className="rounded-xl border border-border bg-background p-5"
              >
                <h3 className="font-semibold text-foreground">{item.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {item.description}
                </p>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="workflow-heading">
          <header className="mx-auto max-w-2xl text-center">
            <h2
              id="workflow-heading"
              className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
            >
              איך זה עובד?
            </h2>
            <p className="mt-3 text-sm text-muted-foreground">
              5 שלבים פשוטים  -  מהרעיון לפרק מוכן
            </p>
          </header>
          <ol className="mt-10 space-y-5">
            {PODCAST_HUB_WORKFLOW.map((step) => (
              <li
                key={step.step}
                className="flex gap-5 rounded-2xl border border-border bg-surface p-6"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-red/10 text-sm font-bold text-brand-red">
                  {step.step}
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{step.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{step.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <ServiceShowcaseSections
          assetsFolder="podcast"
          playlistEmbedUrl={null}
          mediaType="gallery"
          galleryLabel="תמונות מהאולפן"
        />

        <section aria-labelledby="pricing-calculator-heading">
          <header className="mx-auto max-w-2xl text-center">
            <h2
              id="pricing-calculator-heading"
              className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
            >
              חבילות והקלטה
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              בחרו חבילה, הוסיפו זמן אם צריך ושלחו לנו את הסיכום בוואטסאפ.
            </p>
            <p className="mt-2 text-sm font-medium text-foreground">
              החל מ-{PODCAST_HUB_STARTING_PRICE} ₪ לפרק ·{" "}
              {PODCAST_HUB_STARTING_PRICE_NOTE}
            </p>
          </header>
          <PodcastCalculatorLazy className="mt-8" />
        </section>

        <section aria-labelledby="samples-heading">
          <header className="mx-auto max-w-2xl text-center">
            <h2
              id="samples-heading"
              className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
            >
              האזינו לדוגמאות
            </h2>
            <p className="mt-3 text-sm text-muted-foreground">
              טעימה מהאולפן  -  פתיחת פודקאסט וקול אחרי עריכה.
            </p>
          </header>
          <div className="mx-auto mt-8 max-w-xl">
            <AudioPlayer tracks={PODCAST_SAMPLE_TRACKS} />
          </div>
        </section>

        <FAQAccordion
          items={[...PODCAST_HUB_FAQS]}
          title="שאלות נפוצות  -  הפקת פודקאסט"
          className="py-0"
        />

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
            תפסיקו לחשוב על זה ותתחילו לעשות. פודקאסט מקצועי קרוב יותר ממה
            שאתם חושבים.
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
            בואו נתחיל בוואטסאפ ←
          </a>
        </section>

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

        <section className="flex flex-wrap justify-center gap-3" aria-label="עמודי פודקאסט">
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
  );
}
