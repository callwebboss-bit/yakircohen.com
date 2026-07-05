import Link from "next/link";
import ContextualIntroParagraph from "@/components/seo/ContextualIntroParagraph";
import PageRelatedFooter from "@/components/seo/PageRelatedFooter";
import FAQAccordion from "@/components/ui/FAQAccordion";
import ServiceHubLinks from "@/components/services/ServiceHubLinks";
import ServicePageLayout from "@/components/services/ServicePageLayout";
import ServiceShowcaseSections from "@/components/services/ServiceShowcaseSections";
import { resolvePodcastFolderHero } from "@/lib/service-portfolio-hero";
import { withServicePageHeroDefaults } from "@/lib/service-page-ui";
import {
  MOBILE_PODCAST_AUDIENCES,
  MOBILE_PODCAST_EQUIPMENT_GRID,
  MOBILE_PODCAST_FAQS,
  MOBILE_PODCAST_HERO_FEATURES,
  MOBILE_PODCAST_RELATED_LINKS,
  MOBILE_PODCAST_WHEN_MOBILE_WINS,
  MOBILE_PODCAST_WORKFLOW,
  MOBILE_PODCAST_ZERO_DISRUPTION_PHASES,
} from "@/lib/data/mobile-podcast-at-home-page";
import GoogleRatingBadge from "@/components/marketing/GoogleRatingBadge";
import {
  CONTACT_PHONE_DISPLAY,
  CONTACT_PHONE_E164,
} from "@/lib/constants";
import {
  youtubeEmbedUrl,
  YOUTUBE_SERVICE_EMBED_IDS,
} from "@/lib/data/youtube-embeds";
import { buildServiceWhatsAppText, buildWhatsAppHref } from "@/lib/whatsapp";
import BusinessCrossLink from "@/components/marketing/BusinessCrossLink";

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
      subtitle="האולפן המקצועי מגיע אליכם: בית, משרד או אירוע. ציוד מתקדם, ליווי של מהנדס סאונד, ותוצאה ברמת ספוטיפיי בלי לצאת מהבית."
      features={MOBILE_PODCAST_HERO_FEATURES}
      whatsappText="שלום, מעוניין בפודקאסט נייד עד הבית"
      utmCampaign="podcast_mobile_home"
      corporateShareLabel="הקלטת פודקאסט בבית הלקוח"
      bookSlug="podcast/mobile-podcast-at-home"
      scarcityLabel="🚐 האולפן מגיע אליכם"
      ctaLabel="הזמנת הקלטה ניידת בוואטסאפ"
      pagePath="/podcast/mobile-podcast-at-home"
      faqs={MOBILE_PODCAST_FAQS}
      {...heroProps}
    >
      <div className="mx-auto max-w-[72rem] space-y-16 px-4 sm:px-6 lg:px-8">
        <ContextualIntroParagraph pathname="/podcast/mobile-podcast-at-home" className="max-w-3xl" />
        <BusinessCrossLink
          title="חברה או ארגון?"
          text="פודקאסט נייד לחדר הישיבות. אולפן זמני עם ציוד מלא, בלי שההנהלה תצטרך לנסוע."
          href="/business/on-site-studio"
          linkLabel="אולפן זמני בחברה"
        />
        <section
          className="rounded-xl border border-brand-red/30 bg-brand-red/5 p-6 sm:p-8"
          aria-label="הזמנה מהירה"
        >
          <p className="text-center text-sm font-semibold text-foreground sm:text-base">
            פודקאסט נייד עד הבית, האולפן מגיע אליכם
          </p>
          <p className="mx-auto mt-2 max-w-xl text-center text-sm text-muted-foreground">
            חולמים להקליט אבל אין זמן להגיע לאולפן? אנחנו מביאים את האולפן
            ישירות אליכם.
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
            עם השירות של יקיר כהן הפקות, אנחנו מביאים את האולפן המקצועי ישירות
            אליכם. ציוד הקלטה מתקדם, ליווי של מהנדס סאונד, ותוצאה ברמה של
            ספוטיפיי בלי לצאת מהבית.
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

        {/* Studio in a Suitcase - equipment grid */}
        <section aria-labelledby="equipment-heading">
          <header className="mx-auto max-w-2xl text-center">
            <h2
              id="equipment-heading"
              className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
            >
              אולפן במזוודה - מה מגיע אליכם
            </h2>
            <p className="mt-3 text-sm text-muted-foreground sm:text-base">
              לא חובבן עם מחשב נייד. זה הטופ של עולם הסאונד הנייד.
            </p>
          </header>
          <ul className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {MOBILE_PODCAST_EQUIPMENT_GRID.map((item) => (
              <li
                key={item.title}
                className="flex gap-4 rounded-xl border border-border bg-surface p-5"
              >
                <span
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-red/8 text-2xl"
                  aria-hidden
                >
                  {item.emoji}
                </span>
                <div>
                  <h3 className="font-semibold text-foreground">{item.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{item.description}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* Zero Disruption Timeline */}
        <section
          aria-labelledby="zero-disruption-heading"
          className="rounded-2xl border border-border bg-surface p-6 sm:p-8"
        >
          <header className="text-center">
            <p className="text-xs font-bold uppercase tracking-widest text-brand-red">
              אפס הפרעה
            </p>
            <h2
              id="zero-disruption-heading"
              className="mt-2 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
            >
              יום ההקלטה - לוח זמנים שקט
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground">
              המשרד ממשיך לעבוד בדיוק כרגיל. אנחנו מגיעים, מקליטים ונעלמים.
            </p>
          </header>

          {/* Timeline bar - desktop */}
          <div className="mt-8 hidden sm:block">
            <div dir="ltr" className="relative flex overflow-hidden rounded-xl">
              {MOBILE_PODCAST_ZERO_DISRUPTION_PHASES.map((phase) => {
                const total = 90;
                const widthPct = Math.round((phase.durationMinutes / total) * 100);
                return (
                  <div
                    key={phase.title}
                    className={`flex flex-col justify-center px-4 py-5 ${
                      phase.type === "active"
                        ? "bg-brand-red text-white"
                        : "bg-brand-red/8 text-foreground"
                    }`}
                    style={{ width: `${widthPct}%` }}
                  >
                    <p
                      className={`text-xs font-bold tabular-nums ${
                        phase.type === "active" ? "text-white/80" : "text-brand-red"
                      }`}
                    >
                      {phase.duration}
                    </p>
                    <p className="mt-0.5 text-sm font-semibold leading-tight">
                      {phase.title}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Timeline - mobile vertical */}
          <ol className="mt-6 space-y-3 sm:hidden">
            {MOBILE_PODCAST_ZERO_DISRUPTION_PHASES.map((phase, i) => (
              <li
                key={phase.title}
                className={`flex items-start gap-4 rounded-xl p-4 ${
                  phase.type === "active"
                    ? "bg-brand-red text-white"
                    : "bg-brand-red/8"
                }`}
              >
                <div
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                    phase.type === "active"
                      ? "bg-white/20 text-white"
                      : "bg-brand-red/15 text-brand-red"
                  }`}
                >
                  {i + 1}
                </div>
                <div>
                  <p
                    className={`text-xs font-bold tabular-nums ${
                      phase.type === "active" ? "text-white/80" : "text-brand-red"
                    }`}
                  >
                    {phase.duration}
                  </p>
                  <p
                    className={`font-semibold ${
                      phase.type === "active" ? "text-white" : "text-foreground"
                    }`}
                  >
                    {phase.title}
                  </p>
                  <p
                    className={`mt-1 text-sm ${
                      phase.type === "active" ? "text-white/80" : "text-muted-foreground"
                    }`}
                  >
                    {phase.description}
                  </p>
                </div>
              </li>
            ))}
          </ol>

          {/* Descriptions row - desktop only */}
          <div dir="ltr" className="mt-4 hidden sm:grid sm:grid-cols-3">
            {MOBILE_PODCAST_ZERO_DISRUPTION_PHASES.map((phase) => (
              <p key={phase.title} className="px-1 text-center text-xs text-muted-foreground">
                {phase.description}
              </p>
            ))}
          </div>

          <p className="mt-6 text-center text-sm font-medium text-foreground">
            סה"כ:{" "}
            <span className="font-bold text-brand-red">שעה וחצי</span>{" "}
            מהגעה עד עזיבה - המשרד שלכם לא מפסיק לעבוד.
          </p>
        </section>

        {/* When mobile is the right choice */}
        <section aria-labelledby="when-mobile-heading">
          <header className="mx-auto max-w-2xl text-center">
            <h2
              id="when-mobile-heading"
              className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
            >
              מתי פודקאסט נייד הוא הבחירה הנכונה?
            </h2>
            <p className="mt-3 text-sm text-muted-foreground sm:text-base">
              שישה תרחישים שבהם הגעתנו אליכם שווה יותר מנסיעה לאולפן.
            </p>
          </header>
          <ul className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {MOBILE_PODCAST_WHEN_MOBILE_WINS.map((item) => (
              <li
                key={item.title}
                className="rounded-xl border border-border bg-background p-5"
              >
                <span className="text-2xl" aria-hidden>{item.emoji}</span>
                <h3 className="mt-3 font-semibold text-foreground">{item.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{item.description}</p>
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
                    {item.link.label} </Link>
                ) : null}
              </li>
            ))}
          </ul>
        </section>

        {/* Social proof */}
        <section
          aria-labelledby="social-proof-heading"
          className="rounded-2xl border border-border bg-surface p-6 sm:p-8"
        >
          <h2
            id="social-proof-heading"
            className="text-center text-xl font-semibold text-foreground sm:text-2xl"
          >
            לקוחות שכבר בחרו בנייד
          </h2>
          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
            <blockquote className="rounded-xl border border-border bg-background p-5">
              <p className="text-sm leading-relaxed text-muted-foreground">
                "הפקת הפודקאסט שלנו קיבלה ליטוש סאונד ועריכה ברמה בינלאומית. צוות מדויק, זמינים וקשובים."
              </p>
              <footer className="mt-4 flex items-center gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-red/10 text-xs font-bold text-brand-red">
                  דג
                </div>
                <div>
                  <p className="text-xs font-semibold text-foreground">דניאל גרין</p>
                  <p className="text-xs text-muted-foreground">יזם, גרין אנד קו</p>
                </div>
              </footer>
            </blockquote>
            <blockquote className="rounded-xl border border-border bg-background p-5">
              <p className="text-sm leading-relaxed text-muted-foreground">
                "אירוע חברה עם הפקה מלאה - לוח הזמנים עמד, הציוד הוקם לפני הפתיחה, לא נרשמה תקלה אחת."
              </p>
              <footer className="mt-4 flex items-center gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-red/10 text-xs font-bold text-brand-red">
                  יכ
                </div>
                <div>
                  <p className="text-xs font-semibold text-foreground">יוסי כהן</p>
                  <p className="text-xs text-muted-foreground">מנכ"ל, חברת הייטק</p>
                </div>
              </footer>
            </blockquote>
          </div>
          <div className="mt-6 flex justify-center">
            <GoogleRatingBadge variant="compact" showReviewCta={false} />
          </div>
        </section>

        <ServiceShowcaseSections
          assetsFolder="podcast"
          playlistEmbedUrl={youtubeEmbedUrl(
            YOUTUBE_SERVICE_EMBED_IDS["podcast-mobile-at-home"],
          )}
          mediaType="video"
          galleryLabel="פודקאסט נייד בשטח"
          videoTitle="פודקאסט נייד, הקלטה בשטח"
          videoHeadingId="video-heading"
          videoHeading="דוגמה מהשטח"
        />

        <FAQAccordion
          items={[...MOBILE_PODCAST_FAQS]}
          title="שאלות נפוצות, פודקאסט נייד עד הבית"
          className="py-0"
        />

        <p className="text-center text-sm text-muted-foreground">
          <Link href="/podcast" className="font-medium text-brand-red hover:underline">
            לפרטים נוספים על מחירון פודקאסט </Link>
        </p>

        <ServiceHubLinks
          headingId="related-heading"
          heading="שירותים נוספים שיעניינו אתכם"
          subheading="מסלולים שמשלימים הקלטה ניידת בבית או במשרד."
          links={MOBILE_PODCAST_RELATED_LINKS.map((link) => ({
            href: link.href,
            title: link.label,
            description: link.description,
            icon: <span aria-hidden>{link.emoji}</span>,
          }))}
          columns={3}
        />

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
            נתאם מועד, אזור הגעה וחבילה, ונחזור עם הצעה מדויקת.
          </p>
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-7 inline-flex items-center gap-2 rounded-xl bg-brand-red px-7 py-3 text-sm font-semibold text-white hover:bg-brand-red-light"
          >
            הזמנת הקלטה ניידת בוואטסאפ </a>
        </section>
              <PageRelatedFooter pathname="/podcast/mobile-podcast-at-home" />

            </div>
    </ServicePageLayout>
  );
}
