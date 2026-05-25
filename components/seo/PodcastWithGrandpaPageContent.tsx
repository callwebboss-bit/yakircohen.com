import Link from "next/link";
import ContextualIntroParagraph from "@/components/seo/ContextualIntroParagraph";
import PageRelatedFooter from "@/components/seo/PageRelatedFooter";
import { GoogleReviews } from "@/components/marketing/SocialProofWidgets";
import RecordingSongExampleVideos from "@/components/seo/RecordingSongExampleVideos";
import FAQAccordion from "@/components/ui/FAQAccordion";
import ServicePageLayout from "@/components/services/ServicePageLayout";
import ServiceShowcaseSections from "@/components/services/ServiceShowcaseSections";
import { resolvePodcastFolderHero } from "@/lib/service-portfolio-hero";
import {
  PODCAST_GRANDPA_AUDIENCES,
  PODCAST_GRANDPA_DAY_PARTS,
  PODCAST_GRANDPA_DELIVERABLES,
  PODCAST_GRANDPA_EXAMPLE_VIDEO,
  PODCAST_GRANDPA_FAQS,
  PODCAST_GRANDPA_HERO_FEATURES,
  PODCAST_GRANDPA_PRICING_ARTICLE,
  PODCAST_GRANDPA_RELATED_LINKS,
} from "@/lib/data/podcast-with-grandpa-page";
import {
  CONTACT_PHONE_DISPLAY,
  CONTACT_PHONE_E164,
} from "@/lib/constants";
import {
  youtubeEmbedUrl,
  YOUTUBE_SERVICE_EMBED_IDS,
} from "@/lib/data/youtube-embeds";
import { buildServiceWhatsAppText, buildWhatsAppHref } from "@/lib/whatsapp";

const PODCAST_GRANDPA_TITLE = "הגשמת חלום: הקלטת שיר באולפן";

const pageHero = resolvePodcastFolderHero(
  PODCAST_GRANDPA_TITLE,
  youtubeEmbedUrl(YOUTUBE_SERVICE_EMBED_IDS["podcast-with-grandpa"]),
);

export default function PodcastWithGrandpaPageContent() {
  const whatsappHref = buildWhatsAppHref({
    text: buildServiceWhatsAppText(
      "שלום, מעוניין/ת בחוויית פודקאסט עם סבא/סבתא + הקלטת שיר באולפן. אשמח לפרטים.",
    ),
    utm_source: "website",
    utm_campaign: "podcast_grandpa_cta",
  });

  return (
    <ServicePageLayout
      title="הגשמת חלום: הקלטת שיר באולפן"
      subtitle="מתנה מקורית ומרגשת לסבא? חוויה משפחתית בלתי נשכחת  -  פודקאסט, הקלטת שיר באולפן, ומזכרת לכל החיים. זו לא סתם הקלטה. זו מורשת."
      features={PODCAST_GRANDPA_HERO_FEATURES}
      whatsappText="שלום, מעוניין בחוויית פודקאסט עם סבא/סבתא באולפן"
      utmCampaign="podcast_grandpa"
      scarcityLabel="🎙️👴👵 חוויה משפחתית במודיעין"
      ctaLabel="תיאום החוויה בוואטסאפ"
      {...pageHero}
    >
      <div className="mx-auto max-w-[72rem] space-y-16 px-4 sm:px-6 lg:px-8">
        <ContextualIntroParagraph pathname="/podcast/podcast-with-grandpa" className="max-w-3xl" />
        <section className="max-w-3xl" aria-labelledby="intro-heading">
          <h2
            id="intro-heading"
            className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
          >
            איך שומרים את הסיפורים לפני שהם נעלמים?
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
            יש מתנות שקונים בחנות, ויש חוויות שנשארות לנצח. ביקיר כהן הפקות
            יוצרים חוויה משפחתית שתזכרו לנצח  -  שילוב מרגש של תיעוד סיפורי חיים
            והגשמת חלום בהקלטת שיר באולפן מקצועי.
          </p>
        </section>

        <section aria-labelledby="day-heading">
          <header className="mx-auto max-w-2xl text-center">
            <h2
              id="day-heading"
              className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
            >
              מה קורה ביום הזה באולפן?
            </h2>
          </header>
          <ul className="mt-10 space-y-6">
            {PODCAST_GRANDPA_DAY_PARTS.map((part) => (
              <li
                key={part.title}
                className="rounded-2xl border border-border bg-surface p-6"
              >
                <span className="text-3xl" aria-hidden>
                  {part.emoji}
                </span>
                <h3 className="mt-3 text-lg font-semibold text-foreground">
                  {part.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {part.description}
                </p>
                {part.link ? (
                  <Link
                    href={part.link.href}
                    className="mt-4 inline-flex text-sm font-semibold text-brand-red hover:underline"
                  >
                    {part.link.label} ←
                  </Link>
                ) : null}
              </li>
            ))}
          </ul>
        </section>

        <section
          className="rounded-xl border border-border bg-surface p-6 sm:p-8"
          aria-labelledby="pricing-article-heading"
        >
          <p className="text-xs font-semibold uppercase tracking-widest text-brand-red">
            מחירון ותמחור
          </p>
          <h2
            id="pricing-article-heading"
            className="mt-2 text-lg font-semibold text-foreground sm:text-xl"
          >
            <Link href={PODCAST_GRANDPA_PRICING_ARTICLE.href} className="hover:text-brand-red">
              {PODCAST_GRANDPA_PRICING_ARTICLE.title}
            </Link>
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {PODCAST_GRANDPA_PRICING_ARTICLE.subtitle}
          </p>
          <Link
            href={PODCAST_GRANDPA_PRICING_ARTICLE.href}
            className="mt-4 inline-flex text-sm font-semibold text-brand-red hover:underline"
          >
            לצפייה במחירון המלא ←
          </Link>
        </section>

        <section aria-labelledby="deliverables-heading">
          <header className="mx-auto max-w-2xl text-center">
            <h2
              id="deliverables-heading"
              className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
            >
              מה אתם מקבלים בסוף החוויה?
            </h2>
            <p className="mt-3 text-sm text-muted-foreground">
              חבילה שלמה  -  לא נגמר ב&quot;תודה ולהתראות&quot;
            </p>
          </header>
          <ul className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {PODCAST_GRANDPA_DELIVERABLES.map((item) => (
              <li
                key={item.title}
                className="rounded-xl border border-border bg-background p-5"
              >
                <div className="flex gap-2">
                  <span className="text-brand-red" aria-hidden>
                    ✓
                  </span>
                  <div>
                    <h3 className="font-semibold text-foreground">{item.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {item.description}
                    </p>
                    {item.link ? (
                      <Link
                        href={item.link.href}
                        className="mt-2 inline-flex text-xs font-semibold text-brand-red hover:underline"
                      >
                        {item.link.label} ←
                      </Link>
                    ) : null}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className="max-w-3xl" aria-labelledby="legacy-heading">
          <h2
            id="legacy-heading"
            className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
          >
            למה זה באמת משנה?
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            בעוד כמה שנים, כשהדור הבא ישאל &quot;איך היה סבא שלנו?&quot;  - 
            תוכלו להראות לא רק תמונות. להאזין לקול, לצחוק מהסיפורים, ולשמוע
            אותו שר. זו לא מתנה. זו מורשת משפחתית.
          </p>
          <p className="mt-4">
            <Link
              href="/podcast/podcast-studio-modiin"
              className="text-sm font-semibold text-brand-red hover:underline"
            >
              למידע נוסף על האולפן במודיעין ←
            </Link>
          </p>
        </section>

        <section aria-labelledby="audience-heading">
          <header className="mx-auto max-w-2xl text-center">
            <h2
              id="audience-heading"
              className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
            >
              למי זה מתאים?
            </h2>
          </header>
          <ul className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2">
            {PODCAST_GRANDPA_AUDIENCES.map((item) => (
              <li
                key={item.title}
                className="flex gap-4 rounded-xl border border-border bg-surface p-5"
              >
                <span className="text-3xl" aria-hidden>
                  {item.emoji}
                </span>
                <div>
                  <h3 className="font-semibold text-foreground">{item.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {item.description}
                  </p>
                  {item.link ? (
                    <Link
                      href={item.link.href}
                      className="mt-2 inline-flex text-xs font-semibold text-brand-red hover:underline"
                    >
                      {item.link.label} ←
                    </Link>
                  ) : null}
                </div>
              </li>
            ))}
          </ul>
        </section>

        <ServiceShowcaseSections
          assetsFolder="podcast"
          playlistEmbedUrl={youtubeEmbedUrl(
            YOUTUBE_SERVICE_EMBED_IDS["podcast-with-grandpa"],
          )}
          mediaType="video"
          galleryLabel="פודקאסט עם סבא וסבתא"
          videoTitle={PODCAST_GRANDPA_EXAMPLE_VIDEO.title}
          videoHeadingId="example-heading"
          videoHeading="דוגמה מהאולפן"
          footer={
            <RecordingSongExampleVideos videos={[PODCAST_GRANDPA_EXAMPLE_VIDEO]} />
          }
        />

        <FAQAccordion
          items={[...PODCAST_GRANDPA_FAQS]}
          title="שאלות נפוצות  -  פודקאסט עם סבא וסבתא"
          className="py-0"
        />

        <section aria-labelledby="related-heading">
          <h2
            id="related-heading"
            className="text-center text-xl font-semibold text-foreground"
          >
            שירותים נוספים שיעניינו אתכם
          </h2>
          <ul className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {PODCAST_GRANDPA_RELATED_LINKS.map((link) => (
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
          className="rounded-2xl border border-brand-red/30 bg-brand-red/5 p-8 text-center"
          aria-labelledby="grandpa-cta-heading"
        >
          <h2
            id="grandpa-cta-heading"
            className="text-xl font-semibold text-foreground sm:text-2xl"
          >
            מוכנים ליצור מורשת משפחתית?
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-sm text-muted-foreground">
            מתנה לסבא, לסבתא, או לכל המשפחה  -  נשמח לתאם את החוויה.
          </p>
          <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-brand-red px-7 py-3 text-sm font-semibold text-white hover:bg-brand-red-light"
            >
              תיאום בוואטסאפ ←
            </a>
            <a
              href={`tel:${CONTACT_PHONE_E164}`}
              className="text-sm font-medium text-muted-foreground hover:text-brand-red"
            >
              {CONTACT_PHONE_DISPLAY}
            </a>
          </div>
        </section>

        <GoogleReviews
          heading="ביקורות לקוחות"
          subheading="מה משפחות אחרות אומרות עלינו"
        />
              <PageRelatedFooter pathname="/podcast/podcast-with-grandpa" />

            </div>
    </ServicePageLayout>
  );
}
