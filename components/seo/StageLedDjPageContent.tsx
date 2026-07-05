import Link from "next/link";
import ContextualIntroParagraph from "@/components/seo/ContextualIntroParagraph";
import PageRelatedFooter from "@/components/seo/PageRelatedFooter";
import ServiceHubLinks from "@/components/services/ServiceHubLinks";
import AttractionBookPricingSection from "@/components/booking/AttractionBookPricingSection";
import RecordingSongExampleVideos from "@/components/seo/RecordingSongExampleVideos";
import FAQAccordion from "@/components/ui/FAQAccordion";
import ServicePageLayout from "@/components/services/ServicePageLayout";
import ServiceShowcaseSections from "@/components/services/ServiceShowcaseSections";
import { resolveServicePageHeroFromEntity } from "@/lib/service-portfolio-hero";
import { withServicePageHeroDefaults } from "@/lib/service-page-ui";
import {
  LED_BOOTH_COMBOS,
  LED_BOOTH_CONTENT_TYPES,
  LED_BOOTH_EXAMPLE_VIDEOS,
  LED_BOOTH_HIGHLIGHTS,
  LED_BOOTH_LED_VS_TV,
  LED_BOOTH_PROCESS,
  LED_BOOTH_TECH,
  LED_BOOTH_USE_CASES,
  LED_BOOTH_WHY_US,
} from "@/lib/data/stage-led-dj-page";
import { getEventsService } from "@/lib/data/services";
import { ledBoothPurchaseCopy } from "@/lib/data/attraction-book-pricing";
import {
  CONTACT_PHONE_DISPLAY,
  CONTACT_PHONE_E164,
} from "@/lib/constants";
import {
  youtubeEmbedUrl,
  YOUTUBE_SERVICE_EMBED_IDS,
} from "@/lib/data/youtube-embeds";
import { buildServiceWhatsAppText, buildWhatsAppHref } from "@/lib/whatsapp";

const service = getEventsService("attractions-led-booth");

const LED_SHOWCASE_VIDEO_ID = "led-showcase-video";

const pageHero = resolveServicePageHeroFromEntity(service, /עמדת|לד|dj|1024|booth/i, {
  videoSectionId: LED_SHOWCASE_VIDEO_ID,
});
const heroProps = withServicePageHeroDefaults(pageHero);

export default function StageLedDjPageContent() {
  const whatsappHref = buildWhatsAppHref({
    text: buildServiceWhatsAppText(service.whatsappText),
    utm_source: "website",
    utm_campaign: `${service.utmCampaign}_cta`,
  });

  const saleWhatsapp = buildWhatsAppHref({
    text: buildServiceWhatsAppText(
      "שלום, מעוניין/ת ברכישת עמדת LED, אשמח לפרטים",
    ),
    utm_source: "website",
    utm_campaign: `${service.utmCampaign}_sale`,
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
      pagePath="/events/stage-led-dj"
      faqs={service.faqs}
      {...heroProps}
    >
      <div className="mx-auto max-w-[72rem] space-y-16 px-4 sm:px-6 lg:px-8">
        <ContextualIntroParagraph pathname="/events/stage-led-dj" className="max-w-3xl" />
        <section
          className="rounded-xl border border-brand-red/30 bg-brand-red/5 p-6 sm:p-8"
          aria-labelledby="led-trend-heading"
        >
          <p className="text-xs font-bold uppercase tracking-widest text-brand-red">
            הטרנד החם 2026
          </p>
          <h2
            id="led-trend-heading"
            className="mt-2 text-xl font-semibold text-foreground sm:text-2xl"
          >
            השכרת עמדת LED לתקליטן
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            הגיע הזמן להיפרד מהשולחן עם המפה השחורה. עמדת מסכים מתקדמת: מיתוג,
            ויז&apos;ואלס בועטים ומראה של מיליון דולר, לתקליטנים, אולמות, גנים
            ובתים פרטיים.
          </p>
        </section>

        <section className="max-w-3xl" aria-labelledby="led-intro-heading">
          <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
            אתם משקיעים באלפי שקלים בסאונד ותאורה, אבל במרכז הרחבה עומד שולחן
            פלסטיק עם מפה שחורה? עמדת LED היא הבמה שלכם, קנבס דיגיטלי ללוגו,
            קליפים, שמות וויז&apos;ואלס לפי הקצב. ככה הופכים תקליטן ל-Artist.
          </p>
          <p className="mt-3 text-sm font-medium text-foreground">
            מעל 1,800 אירועים - מודיעין והמרכז
          </p>
        </section>

        <ul className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {LED_BOOTH_HIGHLIGHTS.map((item) => (
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
            YOUTUBE_SERVICE_EMBED_IDS["attractions-led-booth"],
          )}
          mediaType="video"
          galleryLabel="עמדת LED מהשטח"
          videoTitle="עמדת LED, יקיר כהן הפקות"
          videoSectionId={LED_SHOWCASE_VIDEO_ID}
          videoHeadingId="led-video-heading"
          videoHeading="איך זה נראה?, ככה זה נראה כשאין פשרות"
          videoDescription="לצפייה בדוגמא, הוידאו נטען בלחיצה (לא בראש העמוד)"
          footer={
            <RecordingSongExampleVideos videos={LED_BOOTH_EXAMPLE_VIDEOS} />
          }
        />

        <section aria-labelledby="content-types-heading">
          <header className="mx-auto max-w-2xl text-center">
            <h2
              id="content-types-heading"
              className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
            >
              מה אפשר להקרין על עמדת ה-LED?
            </h2>
          </header>
          <ul className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2">
            {LED_BOOTH_CONTENT_TYPES.map((item) => (
              <li
                key={item.title}
                className="rounded-xl border border-border bg-surface p-6"
              >
                <p className="text-2xl" aria-hidden>
                  {item.emoji}
                </p>
                <h3 className="mt-2 font-semibold text-foreground">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {item.description}
                </p>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="tech-heading">
          <header className="mx-auto max-w-2xl text-center">
            <h2
              id="tech-heading"
              className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
            >
              המפרט הטכני
            </h2>
          </header>
          <ul className="mx-auto mt-8 grid max-w-xl grid-cols-1 gap-2">
            {LED_BOOTH_TECH.map((item) => (
              <li
                key={item}
                className="rounded-lg border border-border bg-surface px-4 py-3 text-sm"
              >
                {item}
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="combos-heading">
          <header className="mx-auto max-w-2xl text-center">
            <h2
              id="combos-heading"
              className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
            >
              שדרוג עם אפקטים
            </h2>
            <p className="mt-3 text-sm text-muted-foreground">
              עמדות כפולות ושילובים, חוויה שלמה
            </p>
          </header>
          <ul className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {LED_BOOTH_COMBOS.map((combo) => (
              <li
                key={combo.title}
                className="rounded-xl border border-border bg-surface p-5"
              >
                <h3 className="font-semibold text-foreground">{combo.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {combo.description}
                </p>
              </li>
            ))}
          </ul>
        </section>
        <ServiceHubLinks
          headingId="led-related-heading"
          heading="אפקטים נוספים"
          subheading="שילוב עמדת LED עם אפקטים."
          links={[
            { href: "/events/attractions/wedding-smoking-machine", title: "עשן כבד", description: "ענן לבן על רצפת הריקודים." },
            { href: "/events/attractions/cold-fireworks", title: "זיקוקים קרים", description: "ניצוצות בטוחים ללא עשן." },
            { href: "/events/attractions/bubble-machine/smoke-bubble-machine-events", title: "בועות עשן", description: "שילוב עשן ובועות סבון." },
            { href: "/events/dj-events", title: "DJ לאירועים", description: "תקליטן מקצועי לחתונה ואירועים." },
          ]}
        />

        <section aria-labelledby="use-cases-heading">
          <header className="mx-auto max-w-2xl text-center">
            <h2
              id="use-cases-heading"
              className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
            >
              למי מתאימה עמדת LED?
            </h2>
          </header>
          <ul className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {LED_BOOTH_USE_CASES.map((item) => (
              <li
                key={item.title}
                className="rounded-xl border border-border bg-surface p-5"
              >
                <p className="text-2xl" aria-hidden>
                  {item.emoji}
                </p>
                <h3 className="mt-2 font-semibold text-foreground">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {item.description}
                </p>
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
              התהליך ב-3 צעדים
            </h2>
          </header>
          <ol className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
            {LED_BOOTH_PROCESS.map((step) => (
              <li
                key={step.step}
                className="rounded-xl border border-border bg-surface p-6"
              >
                <span className="text-xs font-bold tracking-widest text-brand-red">
                  {step.step}
                </span>
                <h3 className="mt-3 font-semibold text-foreground">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {step.description}
                </p>
              </li>
            ))}
          </ol>
        </section>

        <section aria-labelledby="compare-heading">
          <header className="mx-auto max-w-2xl text-center">
            <h2
              id="compare-heading"
              className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
            >
              עמדת LED מול מסך טלוויזיה
            </h2>
          </header>
          <div className="mt-8 overflow-x-auto">
            <table className="w-full min-w-[32rem] border-collapse text-sm">
              <thead>
                <tr className="border-b border-border text-start">
                  <th className="py-3 pe-4 font-semibold text-foreground" />
                  <th className="py-3 pe-4 font-semibold text-red-600/90">
                    מסך טלוויזיה
                  </th>
                  <th className="py-3 font-semibold text-brand-red">
                    עמדת LED מקצועית
                  </th>
                </tr>
              </thead>
              <tbody>
                {LED_BOOTH_LED_VS_TV.map((row) => (
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

        <section
          className="rounded-xl border border-border bg-surface p-6 sm:p-8"
          aria-labelledby="sale-heading"
        >
          <h2
            id="sale-heading"
            className="text-xl font-semibold text-foreground sm:text-2xl"
          >
            מכירה לספקים ומפיקים
          </h2>
          <p className="mt-3 text-sm text-muted-foreground">
            {ledBoothPurchaseCopy()} השקעה שמחזירה את עצמה אחרי מספר אירועים לספק קבוע.
          </p>
          <a
            href={saleWhatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex rounded-md border border-brand-red px-5 py-2.5 text-sm font-semibold text-brand-red hover:bg-brand-red/5"
          >
            הצעת מחיר לרכישה
          </a>
          <p className="mt-4 text-sm text-muted-foreground">
            גם עריכת רילסים לספקים -{" "}
            <Link href="/business/reel-factory" className="font-semibold text-brand-red hover:underline">
              מפעל הרילס (The Reel Factory)
            </Link>
          </p>
        </section>

        <section aria-labelledby="why-led-heading">
          <header className="mx-auto max-w-2xl text-center">
            <h2
              id="why-led-heading"
              className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
            >
              למה לבחור ביקיר כהן הפקות?
            </h2>
          </header>
          <ul className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {LED_BOOTH_WHY_US.map((item) => (
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

        <AttractionBookPricingSection
          serviceTitle={service.title}
          utmCampaign={service.utmCampaign}
          heading="חבילות אטרקציות - כמו בעמוד ההזמנה"
        />


        {service.faqs.length > 0 ? (
          <FAQAccordion
            items={[...service.faqs]}
            title="שאלות ששואלים אותנו הרבה לפני שמזמינים"
            subtitle="כל מה שרציתם לדעת על עמדת LED"
            className="py-0"
          />
        ) : null}

        <section
          className="rounded-xl border border-brand-red/25 bg-surface px-6 py-10 text-center sm:px-10"
          aria-labelledby="led-cta-heading"
        >
          <h2
            id="led-cta-heading"
            className="text-xl font-semibold text-foreground sm:text-2xl"
          >
            הבמה שלכם חייבת להיראות טוב
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-sm text-muted-foreground">
            הצעת מחיר תוך שעות. טלפון:{" "}
            <a
              href={`tel:${CONTACT_PHONE_E164}`}
              className="font-medium text-brand-red hover:underline"
            >
              {CONTACT_PHONE_DISPLAY}
            </a>
          </p>
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex rounded-md bg-brand-red px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-red-light"
          >
            שליחה בוואטסאפ
          </a>
        </section>
              <PageRelatedFooter pathname="/events/stage-led-dj" />

            </div>
    </ServicePageLayout>
  );
}
