import Link from "next/link";
import ContextualIntroParagraph from "@/components/seo/ContextualIntroParagraph";
import PageRelatedFooter from "@/components/seo/PageRelatedFooter";
import ServiceBlogStrip from "@/components/blog/ServiceBlogStrip";
import { getBlogPostsByServiceSlug } from "@/lib/data/blog";
import { AttractionsCalculatorLazy } from "@/components/calculators/lazy";
import RecordingSongExampleVideos from "@/components/seo/RecordingSongExampleVideos";
import FAQAccordion from "@/components/ui/FAQAccordion";
import ServicePageLayout from "@/components/services/ServicePageLayout";
import ServicePagePricingSection from "@/components/services/ServicePagePricingSection";
import ServiceShowcaseSections from "@/components/services/ServiceShowcaseSections";
import { resolveServicePageHeroFromEntity } from "@/lib/service-portfolio-hero";
import { withServicePageHeroDefaults } from "@/lib/service-page-ui";
import {
  CONFETTI_BENEFITS,
  CONFETTI_CANNON_TYPES,
  CONFETTI_DIY_VS_PRO,
  CONFETTI_EXAMPLE_VIDEOS,
  CONFETTI_HIGHLIGHTS,
  CONFETTI_STYLES,
  CONFETTI_SUPPLIER_CHECKLIST,
  CONFETTI_WHY_US,
} from "@/lib/data/confetti-cannon-page";
import { getEventsService } from "@/lib/data/services";
import {
  CONTACT_PHONE_DISPLAY,
  CONTACT_PHONE_E164,
} from "@/lib/constants";
import {
  youtubeEmbedUrl,
  YOUTUBE_SERVICE_EMBED_IDS,
} from "@/lib/data/youtube-embeds";
import { buildServiceWhatsAppText, buildWhatsAppHref } from "@/lib/whatsapp";

const service = getEventsService("attractions-confetti-cannon");

const pageHero = resolveServicePageHeroFromEntity(service);
const heroProps = withServicePageHeroDefaults(pageHero);

export default function ConfettiCannonPageContent() {
  const whatsappHref = buildWhatsAppHref({
    text: buildServiceWhatsAppText(service.whatsappText),
    utm_source: "website",
    utm_campaign: `${service.utmCampaign}_cta`,
  });

  return (
    <ServicePageLayout
      title={service.title}
      subtitle={service.subtitle}
      features={service.features}
      whatsappText={service.whatsappText}
      utmCampaign={service.utmCampaign}
      bookSlug={service.slug}
      scarcityLabel={service.scarcityLabel}
      pagePath="/events/attractions/confetti-cannon"
      faqs={service.faqs}
      {...heroProps}
    >
      <div className="mx-auto max-w-[72rem] space-y-16 px-4 sm:px-6 lg:px-8">
        <ContextualIntroParagraph pathname="/events/attractions/confetti-cannon" className="max-w-3xl" />
        <section
          className="rounded-xl border border-brand-red/30 bg-brand-red/5 p-6 sm:p-8"
          aria-labelledby="led-bubble-trend-heading"
        >
          <p className="text-xs font-bold uppercase tracking-widest text-brand-red">
            הטרנד החם 2026
          </p>
          <h2
            id="led-bubble-trend-heading"
            className="mt-2 text-xl font-semibold text-foreground sm:text-2xl"
          >
            תותח בועות LED לאירועים
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            בועות סבון עם ענן עשן ותאורת LED  -  אפקט צבעוני שמשנה את הרחבה.
          </p>
          <Link
            href="/events/attractions/bubble-machine/smoke-bubble-machine-events"
            className="mt-5 inline-flex rounded-md bg-brand-red px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-red-light"
          >
            לעמוד בועות עשן LED </Link>
        </section>

        <section className="max-w-3xl" aria-labelledby="confetti-intro-heading">
          <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
            תדמיינו  -  המוזיקה בשיא, כולם מריעים, וברגע המדויק... בום! מטר של קונפטי
            צבעוני ממלא את האוויר. זה לא עוד גימיק  -  זה רגע שכולם יזכרו, יצטלמו
            וישתפו. השכרת תותח קונפטי מקצועי היא הדרך הפשוטה להרים את האווירה
            לרמה הבאה.
          </p>
          <p className="mt-3 text-sm font-medium text-foreground">
            מעל 1,800 אירועים - שירות אישי - זמינות בכל הארץ
          </p>
        </section>

        <ul className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {CONFETTI_HIGHLIGHTS.map((item) => (
            <li
              key={item.title}
              className="rounded-xl border border-border bg-surface p-5"
            >
              <p className="text-2xl" aria-hidden>
                {item.emoji}
              </p>
              <h2 className="mt-2 text-base font-semibold text-foreground">
                {item.title}
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">{item.text}</p>
            </li>
          ))}
        </ul>

        <ServiceShowcaseSections
          assetsFolder={service.assetsFolder}
          playlistEmbedUrl={youtubeEmbedUrl(
            YOUTUBE_SERVICE_EMBED_IDS["attractions-confetti-cannon"],
          )}
          mediaType="video"
          galleryLabel="תותח קונפטי מהשטח"
          videoTitle="תותח קונפטי באירוע"
          videoHeadingId="confetti-video-heading"
          videoHeading="איך זה נראה?"
          videoDescription="הסבר על קונפטי מקצועי  -  וידאו נטען בלחיצה"
          footer={
            <RecordingSongExampleVideos videos={CONFETTI_EXAMPLE_VIDEOS} />
          }
        />

        <section aria-labelledby="styles-heading">
          <header className="mx-auto max-w-2xl text-center">
            <h2
              id="styles-heading"
              className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
            >
              לבחור את הקונפטי שלך
            </h2>
          </header>
          <ul className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {CONFETTI_STYLES.map((style) => (
              <li
                key={style.name}
                className="rounded-xl border border-border bg-surface p-5"
              >
                <h3 className="font-semibold text-foreground">{style.name}</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {style.description}
                </p>
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
              צינורות מהחנות מול תותח מקצועי
            </h2>
            <p className="mt-3 text-sm text-muted-foreground">
              ההבדל? כמו בין זיקוק קטן לבין מופע זיקוקים שלם
            </p>
          </header>
          <div className="mt-8 overflow-x-auto">
            <table className="w-full min-w-[32rem] border-collapse text-sm">
              <thead>
                <tr className="border-b border-border text-start">
                  <th className="py-3 pe-4 font-semibold text-foreground" />
                  <th className="py-3 pe-4 font-semibold text-red-600/90">
                    קונפטי ידני / חנות
                  </th>
                  <th className="py-3 font-semibold text-brand-red">
                    תותח מקצועי (שלנו)
                  </th>
                </tr>
              </thead>
              <tbody>
                {CONFETTI_DIY_VS_PRO.map((row) => (
                  <tr key={row.label} className="border-b border-border/60">
                    <th className="py-3 pe-4 font-medium text-foreground">
                      {row.label}
                    </th>
                    <td className="py-3 pe-4 text-muted-foreground">{row.bad}</td>
                    <td className="py-3 text-muted-foreground">{row.good}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section aria-labelledby="benefits-heading">
          <header className="mx-auto max-w-2xl text-center">
            <h2
              id="benefits-heading"
              className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
            >
              היתרונות שלנו
            </h2>
          </header>
          <ul className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {CONFETTI_BENEFITS.map((item) => (
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

        <section aria-labelledby="types-heading">
          <header className="mx-auto max-w-2xl text-center">
            <h2
              id="types-heading"
              className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
            >
              סוגי תותחי קונפטי
            </h2>
          </header>
          <ul className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-3">
            {CONFETTI_CANNON_TYPES.map((type) => (
              <li
                key={type.title}
                className="rounded-xl border border-border bg-surface p-6"
              >
                <h3 className="font-semibold text-foreground">{type.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {type.description}
                </p>
              </li>
            ))}
          </ul>
        </section>

        <section className="max-w-3xl" aria-labelledby="what-is-heading">
          <h2
            id="what-is-heading"
            className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
          >
            אז מה הוא קונפטי?
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            קונפטי הוא גזרי נייר מיוחדים (משי או כותנה)  -  משקלם הקל מאפשר
            להתעופף באוויר לזמן מה. אנחנו מבדילים בין קונפטי ידני מפיצוץ זעיר
            לבין תותח שמופעל ע&quot;י מפעיל מקצועי, שידאג לפתוח ברגעי השיא
            ולהעיף כל סוג נייר עד 30 מטר  -  קל לניקוי, נשאר באוויר זמן ממושך.
          </p>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            כמה קונפטי צריך? תלוי בשטח, אולם פתוח/סגור, גובה החדר ואם רוצים
            כיסוי מלא או אפקט נקודתי. אפשר גם שטרות כסף  -  500 ₪ באוויר לרגע
            מתנה שלא שוכחים.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/events/attractions/cold-fireworks"
              className="rounded-full border border-border bg-background px-4 py-2 text-sm font-medium hover:border-brand-red/40 hover:text-brand-red"
            >
              זיקוקים קרים
            </Link>
            <Link
              href="/events/attractions/wedding-smoking-machine"
              className="rounded-full border border-border bg-background px-4 py-2 text-sm font-medium hover:border-brand-red/40 hover:text-brand-red"
            >
              עשן כבד
            </Link>
            <Link
              href="/events/stage-led-dj"
              className="rounded-full border border-border bg-background px-4 py-2 text-sm font-medium hover:border-brand-red/40 hover:text-brand-red"
            >
              עמדת DJ לד
            </Link>
            <Link
              href="/events/attractions"
              className="rounded-full border border-border bg-background px-4 py-2 text-sm font-medium hover:border-brand-red/40 hover:text-brand-red"
            >
              כל האטרקציות לאירוע
            </Link>
          </div>
        </section>

        <section aria-labelledby="checklist-heading">
          <header className="mx-auto max-w-2xl text-center">
            <h2
              id="checklist-heading"
              className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
            >
              מה לבדוק לפני שבוחרים ספק?
            </h2>
          </header>
          <ul className="mx-auto mt-8 max-w-xl space-y-3">
            {CONFETTI_SUPPLIER_CHECKLIST.map((item) => (
              <li
                key={item}
                className="flex gap-3 rounded-xl border border-border bg-surface px-4 py-3 text-sm"
              >
                <span className="text-brand-red" aria-hidden>
                  ?
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <p className="mx-auto mt-6 max-w-xl text-center text-sm text-muted-foreground">
            אצלנו: מקצוענות אמיתית, ציוד גיבוי ותפעול מדויק  -  לרגע המושלם.
          </p>
        </section>

        <section aria-labelledby="why-confetti-heading">
          <header className="mx-auto max-w-2xl text-center">
            <h2
              id="why-confetti-heading"
              className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
            >
              למה לבחור ביקיר כהן הפקות?
            </h2>
          </header>
          <ul className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {CONFETTI_WHY_US.map((item) => (
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

        <section aria-labelledby="calculator-heading">
          <header className="mx-auto max-w-2xl text-center">
            <h2
              id="calculator-heading"
              className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
            >
              בנו חבילת אפקטים
            </h2>
            <p className="mt-3 text-sm text-muted-foreground">
              שלבו קונפטי עם עשן, זיקוקים ובועות
            </p>
          </header>
          <AttractionsCalculatorLazy className="mt-8" />
        </section>
        <ServicePagePricingSection service={service} />


        {service.faqs.length > 0 ? (
          <FAQAccordion
            items={[...service.faqs]}
            title="שאלות ששואלים אותנו הרבה לפני שמזמינים"
            subtitle="כל מה שרוצים לדעת על קונפטי מקצועי"
            className="py-0"
          />
        ) : null}

        <section
          className="rounded-xl border border-brand-red/25 bg-surface px-6 py-10 text-center sm:px-10"
          aria-labelledby="confetti-cta-heading"
        >
          <h2
            id="confetti-cta-heading"
            className="text-xl font-semibold text-foreground sm:text-2xl"
          >
            רוצים להוסיף קסם לאירוע? קבלו הצעה תוך 24 שעות
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-sm text-muted-foreground">
            תאריך, סוג אירוע ומיקום - נחזור עם הצעה. גם בטלפון:{" "}
            <a
              href={`tel:${CONTACT_PHONE_E164}`}
              className="font-medium text-brand-red hover:underline"
            >
              {CONTACT_PHONE_DISPLAY}
            </a>
          </p>
          <ul className="mx-auto mt-4 flex flex-wrap justify-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
            {["מפעיל מקצועי צמוד", "תזמון מדויק עם ה-DJ", "CO2 בטוח לאולמות סגורים"].map((item) => (
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
            className="mt-6 inline-flex rounded-md bg-brand-red px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-red-light"
          >
            קבלו הצעה תוך 24 שעות
          </a>
        </section>
              <ServiceBlogStrip posts={getBlogPostsByServiceSlug("events/attractions/confetti-cannon")} />
              <PageRelatedFooter pathname="/events/attractions/confetti-cannon" />

            </div>
    </ServicePageLayout>
  );
}
