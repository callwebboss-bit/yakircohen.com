import Link from "next/link";
import ContextualIntroParagraph from "@/components/seo/ContextualIntroParagraph";
import PageRelatedFooter from "@/components/seo/PageRelatedFooter";
import RecordingSongExampleVideos from "@/components/seo/RecordingSongExampleVideos";
import FAQAccordion from "@/components/ui/FAQAccordion";
import ServicePageLayout from "@/components/services/ServicePageLayout";
import ServicePagePricingSection from "@/components/services/ServicePagePricingSection";
import ServiceShowcaseSections from "@/components/services/ServiceShowcaseSections";
import { resolveServicePageHeroFromEntity } from "@/lib/service-portfolio-hero";
import { withServicePageHeroDefaults } from "@/lib/service-page-ui";
import {
  SLIDESHOW_ACCEPTED_FORMATS,
  SLIDESHOW_AUDIENCES,
  SLIDESHOW_EXAMPLE_VIDEOS,
  SLIDESHOW_HERO_FEATURES,
  SLIDESHOW_INCLUDED,
  SLIDESHOW_PROCESS_STEPS,
  SLIDESHOW_SONG_MISTAKES,
  SLIDESHOW_WHY_US,
} from "@/lib/data/photo-slideshow-page";
import { getVideoService } from "@/lib/data/services";
import {
  CONTACT_PHONE_DISPLAY,
  CONTACT_PHONE_E164,
} from "@/lib/constants";
import {
  youtubeEmbedUrl,
  YOUTUBE_SERVICE_EMBED_IDS,
} from "@/lib/data/youtube-embeds";
import { buildServiceWhatsAppText, buildWhatsAppHref } from "@/lib/whatsapp";

const service = getVideoService("video-photo-slideshow");

const pageHero = resolveServicePageHeroFromEntity(service);
const heroProps = withServicePageHeroDefaults(pageHero);

export default function PhotoSlideshowPageContent() {
  const whatsappHref = buildWhatsAppHref({
    text: buildServiceWhatsAppText(service.whatsappText),
    utm_source: "website",
    utm_campaign: `${service.utmCampaign}_cta`,
  });

  const expressHref = buildWhatsAppHref({
    text: "הצילו! אני צריך מצגת דחוף לאירוע  -  אשמח לשמוע על שירות אקספרס (24–48 שעות).",
    utm_source: "website",
    utm_campaign: "photo_slideshow_express",
  });

  return (
    <ServicePageLayout
      title={service.title}
      subtitle={service.subtitle}
      features={SLIDESHOW_HERO_FEATURES}
      whatsappText={service.whatsappText}
      utmCampaign={service.utmCampaign}
      scarcityLabel="עריכה קולנועית · מסירה תוך 48 שעות"
      {...heroProps}
    >
      <div className="mx-auto max-w-[72rem] space-y-16 px-4 sm:px-6 lg:px-8">
        <ContextualIntroParagraph pathname="/photo-slideshow" className="max-w-3xl" />
        <section
          className="rounded-xl border border-brand-red/30 bg-brand-red/5 p-6 sm:p-8"
          aria-labelledby="slideshow-express-heading"
        >
          <p className="text-xs font-bold uppercase tracking-widest text-brand-red">
            Premium Event Solutions
          </p>
          <h2
            id="slideshow-express-heading"
            className="mt-2 text-xl font-semibold text-foreground sm:text-2xl"
          >
            נתקעתם בלי מצגת? שירות אקספרס
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            מחפשים עריכת מצגת מהיום למחר? מאות תמונות ואפס זמן? אנחנו עורכים
            סרט מרגש, מקצועי וסוחף  -  מוכן להקרנה ב-48 שעות (או פחות).
          </p>
          <a
            href={expressHref}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex rounded-md bg-brand-red px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-red-light"
          >
            הצילו! אני צריך מצגת דחוף ←
          </a>
        </section>

        <section className="max-w-3xl" aria-labelledby="slideshow-intro-heading">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-red">
            חבילות עריכת מצגות לאירועים
          </p>
          <h2
            id="slideshow-intro-heading"
            className="mt-2 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
          >
            מהזיכרונות שלכם לסרט מרגש
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
            בחרו את המסלול המתאים ביותר לחגיגה שלכם. כל המצגות כוללות כותרות
            פתיחה וסיום וליווי אישי של נציג.
          </p>
        </section>

        <section className="max-w-3xl" aria-labelledby="what-is-slideshow-heading">
          <h2
            id="what-is-slideshow-heading"
            className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
          >
            מה זה מצגת תמונות לאירוע?
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            מצגת תמונות (סלייד-שואו) זה אחד הרגעים הכי מרגשים באירוע. כולם
            יושבים, צופים בתמונות מהילדות, מהגן, מהצבא, מהחיים  -  ומתרגשים.
            אבל מצגת טובה זה לא סתם &quot;הצגת תמונות בפאוורפוינט&quot;.
          </p>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            זה סרטון מעוצב, מושקע, עם מוזיקה מרגשת, מעברים חלקים, אפקטים
            ויזואליים וטקסטים מתאימים. אנחנו לוקחים את התמונות שלכם (20, 50,
            100  -  כמה שיש) ויוצרים מצגת מקצועית שמרגשת את כולם.
          </p>
          <p className="mt-3 text-sm font-medium text-foreground">
            המטרה: להפוך את הזיכרונות לחוויית צפייה שתישאר בלב האורחים הרבה
            אחרי שהאירוע יסתיים.
          </p>
        </section>

        <section aria-labelledby="included-heading">
          <header className="mx-auto max-w-2xl text-center">
            <h2
              id="included-heading"
              className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
            >
              מה כלול בעריכה?
            </h2>
          </header>
          <ul className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {SLIDESHOW_INCLUDED.map((item) => (
              <li
                key={item.title}
                className="rounded-xl border border-border bg-surface p-5"
              >
                <h3 className="font-semibold text-foreground">{item.title}</h3>
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
              השמיים הם הגבול  -  הנה כמה רעיונות
            </p>
          </header>
          <ul className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2">
            {SLIDESHOW_AUDIENCES.map((item) => (
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

        <section aria-labelledby="process-heading">
          <header className="mx-auto max-w-2xl text-center">
            <h2
              id="process-heading"
              className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
            >
              איך זה עובד?
            </h2>
          </header>
          <ol className="mt-10 space-y-5">
            {SLIDESHOW_PROCESS_STEPS.map((step) => (
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
          assetsFolder={service.assetsFolder}
          playlistEmbedUrl={youtubeEmbedUrl(
            YOUTUBE_SERVICE_EMBED_IDS["video-photo-slideshow"],
          )}
          mediaType="video"
          galleryLabel="מצגות תמונות מהשטח"
          videoTitle="מצגת תמונות  -  דוגמה ראשית"
          videoHeadingId="portfolio-heading"
          videoHeading="דוגמאות לסרטים שערכנו"
          videoDescription="שירות מקצועי להפקת מצגות מרגשות  -  מחתונות ובר/בת מצווה ועד ימי הולדת ופרישה"
          footer={
            <RecordingSongExampleVideos videos={SLIDESHOW_EXAMPLE_VIDEOS} />
          }
        />

        <section className="max-w-3xl" aria-labelledby="diy-heading">
          <h2
            id="diy-heading"
            className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
          >
            למה לא לערוך לבד בבית?
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            המצגת היא רגע השיא של האירוע. אל תתנו לתוכנה חינמית או
            &quot;סימן מים&quot; להרוס את הרגע.
          </p>
        </section>

        <section aria-labelledby="song-mistakes-heading">
          <header className="mx-auto max-w-2xl text-center">
            <h2
              id="song-mistakes-heading"
              className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
            >
              5 טעויות נפוצות בבחירת שירים למצגת
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">ומה לעשות במקום</p>
          </header>
          <ul className="mt-10 space-y-4">
            {SLIDESHOW_SONG_MISTAKES.map((item, i) => (
              <li
                key={item.title}
                className="rounded-xl border border-border bg-surface p-5"
              >
                <p className="text-xs font-semibold text-brand-red">
                  {i + 1}. {item.title}
                </p>
                <p className="mt-2 text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">לא: </span>
                  {item.bad}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  <span className="font-medium text-brand-red">כן: </span>
                  {item.good}
                </p>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="why-us-heading">
          <header className="mx-auto max-w-2xl text-center">
            <h2
              id="why-us-heading"
              className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
            >
              למה לבחור בנו?
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              כנסו לביקורות וקראו בעצמכם  -  לקוחות חוזרים אלינו שוב ושוב
            </p>
          </header>
          <ul className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {SLIDESHOW_WHY_US.map((item) => (
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

        <section className="max-w-3xl" aria-labelledby="formats-heading">
          <h2
            id="formats-heading"
            className="text-xl font-semibold text-foreground sm:text-2xl"
          >
            אילו קבצים אפשר לשלוח?
          </h2>
          <ul className="mt-4 space-y-2">
            {SLIDESHOW_ACCEPTED_FORMATS.map((item) => (
              <li
                key={item}
                className="flex gap-2 text-sm text-muted-foreground"
              >
                <span className="text-brand-red" aria-hidden>
                  •
                </span>
                {item}
              </li>
            ))}
          </ul>
          <p className="mt-4 text-sm text-muted-foreground">
            שלחו חומרים 3 ימים לפני האירוע. אנו גם מציעים עיצוב מקצועי בתשלום
            נוסף.
          </p>
        </section>

        <section className="flex flex-wrap gap-3" aria-label="קישורים לשירותים קשורים">
          <Link
            href="/photography/wedding"
            className="rounded-full border border-border bg-background px-4 py-2 text-sm font-medium hover:border-brand-red/40 hover:text-brand-red"
          >
            צילום חתונות
          </Link>
          <Link
            href="/events/dj-events"
            className="rounded-full border border-border bg-background px-4 py-2 text-sm font-medium hover:border-brand-red/40 hover:text-brand-red"
          >
            תקליטן לאירועים
          </Link>
          <Link
            href="/video/presentation"
            className="rounded-full border border-border bg-background px-4 py-2 text-sm font-medium hover:border-brand-red/40 hover:text-brand-red"
          >
            מצגות וידאו
          </Link>
          <Link
            href="/book"
            className="rounded-full border border-border bg-background px-4 py-2 text-sm font-medium hover:border-brand-red/40 hover:text-brand-red"
          >
            הזמנה מקוונת
          </Link>
        </section>
        <ServicePagePricingSection service={service} serviceTitle="מצגת תמונות לאירוע" />


        {service.faqs.length > 0 ? (
          <FAQAccordion
            items={[...service.faqs]}
            title="שאלות נפוצות  -  מצגת תמונות לאירוע"
            className="py-0"
          />
        ) : null}

        <section
          className="rounded-2xl border border-border bg-surface p-8 text-center"
          aria-labelledby="slideshow-cta-heading"
        >
          <h2
            id="slideshow-cta-heading"
            className="text-xl font-semibold text-foreground sm:text-2xl"
          >
            מזכרת קולנועית לכל החיים
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-sm text-muted-foreground">
            ספרו לנו על האירוע  -  נחזור עם הצעה מותאמת לחבילה ולזמינות.
          </p>
          <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-brand-red px-7 py-3 text-sm font-semibold text-white hover:bg-brand-red-light"
            >
              שלחו פרטים בוואטסאפ
            </a>
            <a
              href={`tel:${CONTACT_PHONE_E164}`}
              className="text-sm font-medium text-muted-foreground hover:text-brand-red"
            >
              {CONTACT_PHONE_DISPLAY}
            </a>
          </div>
        </section>
              <PageRelatedFooter pathname="/photo-slideshow" />

            </div>
    </ServicePageLayout>
  );
}
