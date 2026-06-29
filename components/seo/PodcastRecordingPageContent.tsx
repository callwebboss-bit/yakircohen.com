import Link from "next/link";
import FaqPageSchema from "@/components/seo/FaqPageSchema";
import HowToSchema from "@/components/seo/HowToSchema";
import ContextualIntroParagraph from "@/components/seo/ContextualIntroParagraph";
import PageRelatedFooter from "@/components/seo/PageRelatedFooter";
import CategoryRelatedLinks from "@/components/seo/CategoryRelatedLinks";
import ShowcaseVideoSection from "@/components/seo/ShowcaseVideoSection";
import PodcastSpotifySample from "@/components/seo/PodcastSpotifySample";
import FAQAccordion from "@/components/ui/FAQAccordion";
import ServicePageLayout from "@/components/services/ServicePageLayout";
import ServiceShowcaseSections from "@/components/services/ServiceShowcaseSections";
import { resolvePodcastFolderHero } from "@/lib/service-portfolio-hero";
import { withServicePageHeroDefaults } from "@/lib/service-page-ui";
import { PODCAST_SHOWCASE_VIDEOS } from "@/lib/data/youtube-showcases";
import {
  PODCAST_RECORDING_AUDIENCES,
  PODCAST_RECORDING_FAQS,
  PODCAST_RECORDING_HERO_FEATURES,
  PODCAST_RECORDING_INCLUDED,
  PODCAST_RECORDING_PRICE,
  PODCAST_RECORDING_PRICE_NOTE,
  PODCAST_RECORDING_STUDIO_SPACES,
  PODCAST_RECORDING_WHY_US,
  PODCAST_RECORDING_WORKFLOW,
} from "@/lib/data/podcast-recording-page";
import {
  CONTACT_PHONE_DISPLAY,
  CONTACT_PHONE_E164,
} from "@/lib/constants";
import {
  youtubeEmbedUrl,
  YOUTUBE_SERVICE_EMBED_IDS,
} from "@/lib/data/youtube-embeds";
import { buildServiceWhatsAppText, buildWhatsAppHref } from "@/lib/whatsapp";

const PODCAST_RECORDING_TITLE = "צילום והקלטת פודקאסט";

const pageHero = resolvePodcastFolderHero(
  PODCAST_RECORDING_TITLE,
  youtubeEmbedUrl(YOUTUBE_SERVICE_EMBED_IDS["podcast-example-1"]),
);
const heroProps = withServicePageHeroDefaults(pageHero);

export default function PodcastRecordingPageContent() {
  const whatsappHref = buildWhatsAppHref({
    text: buildServiceWhatsAppText(
      "שלום, מעוניין/ת בהפקת פודקאסט מלאה  -  צילום, הקלטה ועריכה. אשמח לפרטים ולתיאום.",
    ),
    utm_source: "website",
    utm_campaign: "podcast_recording_cta",
  });

  const whatsappTopHref = buildWhatsAppHref({
    text: buildServiceWhatsAppText("הזמנת הפקת פודקאסט מלאה"),
    utm_source: "website",
    utm_campaign: "podcast_recording_top",
  });

  return (
    <>
      <FaqPageSchema
        items={PODCAST_RECORDING_FAQS.map((faq) => ({
          question: faq.question,
          answer: faq.answer,
        }))}
      />
      <HowToSchema
        name="איך להקליט פודקאסט באולפן"
        description="תהליך הקלטת פודקאסט מלא באולפן במודיעין - מתיאום ועד פרק מוכן."
        totalTime="P1D"
        steps={PODCAST_RECORDING_WORKFLOW.map((step) => ({
          name: step.title,
          text: step.body,
        }))}
      />
      <ServicePageLayout
      title="צילום והקלטת פודקאסט"
      subtitle="הפתרון המלא  -  נכנסתם, דיברתם, יצאתם עם פרק מוכן. צילום 4K, סאונד אולפני, עריכה מלאה וקבצים מוכנים להעלאה."
      features={PODCAST_RECORDING_HERO_FEATURES}
      whatsappText="שלום, מעוניין בהפקת פודקאסט מלאה  -  צילום, הקלטה ועריכה"
      utmCampaign="podcast_recording"
      corporateShareLabel="הקלטת פודקאסט באולפן"
      bookSlug="podcast/podcast-recording"
      scarcityLabel={`החל מ-${PODCAST_RECORDING_PRICE} ₪ לפרק - מוכן תוך 24 שעות`}
      ctaLabel="הזמנת הפקה מלאה בוואטסאפ"
      {...heroProps}
    >
      <div className="mx-auto max-w-[72rem] space-y-16 px-4 sm:px-6 lg:px-8">
        <ContextualIntroParagraph pathname="/podcast/podcast-recording" className="max-w-3xl" />

        <p className="max-w-2xl border-r-[3px] border-brand-red/40 pr-4 text-sm italic leading-relaxed text-foreground/80 sm:text-base">
          אתה רוצה להוציא פודקאסט, אבל כל פעם שאתה מנסה להקליט בבית - יוצא
          רעשים, הד, ואיכות שמביישת אותך לשתף. הפרק נשאר ב&quot;בקרוב&quot;.
          אני מבין את זה - פעם אחת שתבוא לאולפן, תבין למה אנשים חוזרים.
        </p>

        <ShowcaseVideoSection
          heading="דוגמאות מהאולפן"
          subheading="הפקות פודקאסט מלאות - הסרטון הראשון נטען מיד"
          videos={PODCAST_SHOWCASE_VIDEOS}
          initialVisible={3}
        />

        <PodcastSpotifySample />

        <section
          className="rounded-2xl border-2 border-brand-red/40 bg-brand-red/8 p-6 text-center shadow-[0_0_32px_rgba(212,43,43,0.12)] sm:p-8"
          aria-label="הזמנה מהירה"
        >
          <p className="text-sm font-semibold text-foreground sm:text-base">
            הפתרון המלא  -  אתם מגיעים, מדברים, ויוצאים עם פרק מוכן
          </p>
          <p className="mt-2 text-xs text-muted-foreground sm:text-sm">
            כולל צילום 4K, סאונד אולפני, עריכה מלאה וקבצים מוכנים להעלאה
          </p>
          <div className="mt-6 flex flex-col items-stretch gap-3 sm:flex-row sm:justify-center">
            <a
              href={`tel:${CONTACT_PHONE_E164}`}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-red px-6 py-3.5 text-sm font-semibold text-white shadow-[0_0_20px_rgba(212,43,43,0.35)] hover:bg-brand-red-light"
            >
              הזמינו הפקת פודקאסט: {CONTACT_PHONE_DISPLAY}
            </a>
            <a
              href={whatsappTopHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-brand-red/50 bg-background px-6 py-3.5 text-sm font-semibold text-brand-red hover:bg-brand-red/5"
            >
              פרטים והזמנה בוואטסאפ
            </a>
          </div>
        </section>

        <section className="max-w-3xl" aria-labelledby="full-production-heading">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-red">
            הפקת פודקאסט מלאה
          </p>
          <h2
            id="full-production-heading"
            className="mt-2 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
          >
            צילום + הקלטה + עריכה = פרק מוכן תוך 24 שעות
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
            רוצים פודקאסט מקצועי אבל לא רוצים להתעסק עם ציוד, הקלטה ועריכה?
            זה בדיוק מה שהשירות הזה עושה. אתם מגיעים, בוחרים חלל, מדברים  - 
            ויוצאים עם פרק מוכן להעלאה.
          </p>
          <p className="mt-4 text-sm text-muted-foreground">
            מתאים למי שרוצה להתמקד בתוכן ולתת לנו לדאוג לכל השאר.
          </p>
          <p className="mt-6 text-2xl font-bold text-brand-red">
            החל מ-{PODCAST_RECORDING_PRICE} ₪ {PODCAST_RECORDING_PRICE_NOTE}
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
            {PODCAST_RECORDING_AUDIENCES.map((item) => (
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
                </div>
              </li>
            ))}
          </ul>
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
          <div className="mt-10 space-y-8">
            <div className="rounded-xl border border-border bg-surface p-6">
              <h3 className="font-semibold text-foreground">חללי הקלטה</h3>
              <ul className="mt-4 space-y-3">
                {PODCAST_RECORDING_STUDIO_SPACES.map((space) => (
                  <li key={space.title} className="text-sm text-muted-foreground">
                    <span className="font-medium text-foreground">
                      {space.title}
                    </span>
                    {"  -  "}
                    {space.description}
                  </li>
                ))}
              </ul>
            </div>
            {PODCAST_RECORDING_INCLUDED.map((group) => (
              <div
                key={group.title}
                className="rounded-xl border border-border bg-background p-6"
              >
                <h3 className="font-semibold text-foreground">{group.title}</h3>
                <ul className="mt-4 space-y-2">
                  {group.items.map((item) => (
                    <li
                      key={item}
                      className="flex gap-2 text-sm text-muted-foreground"
                    >
                      <span className="text-brand-red" aria-hidden>
                        ✓
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section aria-labelledby="workflow-heading">
          <header className="mx-auto max-w-2xl text-center">
            <h2
              id="workflow-heading"
              className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
            >
              איך זה עובד?
            </h2>
          </header>
          <ol className="mt-10 space-y-5">
            {PODCAST_RECORDING_WORKFLOW.map((step) => (
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

        <section aria-labelledby="why-heading">
          <header className="mx-auto max-w-2xl text-center">
            <h2
              id="why-heading"
              className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
            >
              למה לבחור בהפקה המלאה שלנו?
            </h2>
          </header>
          <ul className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {PODCAST_RECORDING_WHY_US.map((item) => (
              <li
                key={item}
                className="flex gap-3 rounded-xl border border-border bg-surface px-4 py-3 text-sm"
              >
                <span className="text-brand-red" aria-hidden>
                  ✓
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        <FAQAccordion
          items={[...PODCAST_RECORDING_FAQS]}
          title="שאלות נפוצות  -  הפקת פודקאסט מלאה"
          className="py-0"
        />

        <section
          className="rounded-2xl border-2 border-brand-red/40 bg-brand-red/8 p-8 text-center sm:p-10"
          aria-labelledby="recording-cta-heading"
        >
          <h2
            id="recording-cta-heading"
            className="text-xl font-semibold text-foreground sm:text-2xl"
          >
            מוכנים להתחיל את הפודקאסט שלכם?
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-muted-foreground">
            תפסיקו לחשוב על זה ותתחילו לעשות. פודקאסט מקצועי קרוב יותר ממה
            שאתם חושבים.
          </p>
          <p className="mt-4 text-lg font-bold text-brand-red">
            החל מ-{PODCAST_RECORDING_PRICE} ₪ לפרק
          </p>
          <div className="mt-7 flex flex-col items-stretch gap-3 sm:flex-row sm:justify-center">
            <a
              href={`tel:${CONTACT_PHONE_E164}`}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-red px-7 py-3.5 text-sm font-semibold text-white hover:bg-brand-red-light"
            >
              הזמינו הפקה מלאה: {CONTACT_PHONE_DISPLAY}
            </a>
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-brand-red/50 bg-background px-7 py-3.5 text-sm font-semibold text-brand-red hover:bg-brand-red/5"
            >
              פרטים בוואטסאפ </a>
          </div>
        </section>

        <PageRelatedFooter pathname="/podcast/podcast-recording" />
      </div>
    </ServicePageLayout>
    </>
  );
}
