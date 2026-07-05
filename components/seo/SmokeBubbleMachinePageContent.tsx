import Link from "next/link";
import ContextualIntroParagraph from "@/components/seo/ContextualIntroParagraph";
import PageRelatedFooter from "@/components/seo/PageRelatedFooter";
import ServiceHubLinks from "@/components/services/ServiceHubLinks";
import { attractionHubLinksExcluding } from "@/lib/data/attraction-hub-links";
import AttractionBookPricingSection from "@/components/booking/AttractionBookPricingSection";
import FAQAccordion from "@/components/ui/FAQAccordion";
import ServicePageLayout from "@/components/services/ServicePageLayout";
import ServiceShowcaseSections from "@/components/services/ServiceShowcaseSections";
import { resolveServicePageHeroFromEntity } from "@/lib/service-portfolio-hero";
import { withServicePageHeroDefaults } from "@/lib/service-page-ui";
import {
  SMOKE_BUBBLE_ADVANTAGES,
  SMOKE_BUBBLE_COMPARE,
  SMOKE_BUBBLE_HIGHLIGHTS,
  SMOKE_BUBBLE_PROCESS,
} from "@/lib/data/smoke-bubble-machine-page";
import { getEventsService } from "@/lib/data/services";
import {
  youtubeEmbedUrl,
  YOUTUBE_SERVICE_EMBED_IDS,
} from "@/lib/data/youtube-embeds";
import { buildServiceWhatsAppText, buildWhatsAppHref } from "@/lib/whatsapp";

const service = getEventsService("attractions-smoke-bubble-machine");

const pageHero = resolveServicePageHeroFromEntity(service);
const heroProps = withServicePageHeroDefaults(pageHero);

export default function SmokeBubbleMachinePageContent() {
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
      scarcityLabel="היט 2026, ביקוש גבוה בעונת האירועים"
      pagePath="/events/attractions/bubble-machine/smoke-bubble-machine-events"
      faqs={service.faqs}
      {...heroProps}
    >
      <div className="mx-auto max-w-[72rem] space-y-16 px-4 sm:px-6 lg:px-8">
        <ContextualIntroParagraph pathname="/events/attractions/bubble-machine/smoke-bubble-machine-events" className="max-w-3xl" />
        <p className="text-center">
          <span className="inline-block rounded-full bg-brand-red px-4 py-1 text-xs font-bold uppercase tracking-widest text-white">
            האטרקציה היפה ביותר ב-2026
          </span>
        </p>

        <section className="max-w-3xl" aria-labelledby="smoke-bubble-intro">
          <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
            הכירו את האטרקציה שתכבוש את האורחים, מכונת בועות עשן. בועות סבון
            מבריקות עם ענן עשן עדין בתוכן, לחתונות, בר/בת מצווה, אירועי חברה
            והופעות. חוויה 3 ב-1: אנחנו מגיעים, מתקינים, מפעילים ומפרקים.
          </p>
        </section>

        <ul className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {SMOKE_BUBBLE_HIGHLIGHTS.map((item) => (
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

        <section className="max-w-3xl" aria-labelledby="effect-heading">
          <h2
            id="effect-heading"
            className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
          >
            תותחי בועות עשן, האפקט שגונב את ההצגה
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            תדמיינו בועות שבמקום להתפוצץ סתם, הן משחררות ענן עשן בנגיעה
            ברצפה. אפקט סופר מיוחד שממלא את הרחבה בגבהים שונים ויוצר תנועה
            ועניין שלא רואים עם עשן כבד קלאסי או בועות שקופות.
          </p>
        </section>

        <ServiceShowcaseSections
          assetsFolder={service.assetsFolder}
          playlistEmbedUrl={youtubeEmbedUrl(
            YOUTUBE_SERVICE_EMBED_IDS["attractions-bubble-machine"],
          )}
          mediaType="video"
          galleryLabel="בועות עשן מהשטח"
          videoTitle="איך זה נראה?"
          className="px-0"
        />

        <section aria-labelledby="compare-heading">
          <header className="mx-auto max-w-2xl text-center">
            <h2
              id="compare-heading"
              className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
            >
              השוואה: בועות עשן מול עשן כבד ובועות רגילות
            </h2>
          </header>
          <ul className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-3">
            {SMOKE_BUBBLE_COMPARE.map((item) => (
              <li
                key={item.name}
                className={`rounded-xl border p-6 ${
                  item.name.includes("היט")
                    ? "border-brand-red/40 bg-brand-red/5"
                    : "border-border bg-surface"
                }`}
              >
                <h3 className="font-semibold text-foreground">{item.name}</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {item.description}
                </p>
              </li>
            ))}
          </ul>
        </section>

        <section className="max-w-3xl" aria-labelledby="safety-heading">
          <h2
            id="safety-heading"
            className="text-xl font-semibold text-foreground"
          >
            בטיחות: נוזל Dry-Bubble (מונע החלקה)
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            בניגוד למכונות זולות שמשאירות שלוליות, המכונות שלנו משתמשות
            בנוזל בטכנולוגיית Dry-Bubble. הבועה מתפוצצת והשאריות מתנדפות כמעט
            מיד. אפקט מרהיב, רצפה בטוחה גם על עקבים.
          </p>
        </section>

        <section aria-labelledby="advantages-heading">
          <header className="mx-auto max-w-2xl text-center">
            <h2
              id="advantages-heading"
              className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
            >
              למה לבחור ביקיר כהן הפקות?
            </h2>
          </header>
          <ul className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2">
            {SMOKE_BUBBLE_ADVANTAGES.map((item) => (
              <li
                key={item.title}
                className="rounded-xl border border-border bg-surface p-6"
              >
                <h3 className="font-semibold text-foreground">{item.title}</h3>
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
              איך עובד שירות ההפעלה?
            </h2>
          </header>
          <ol className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {SMOKE_BUBBLE_PROCESS.map((step) => (
              <li
                key={step.step}
                className="rounded-xl border border-border bg-surface p-4"
              >
                <span className="text-xs font-bold text-brand-red">
                  {step.step}
                </span>
                <h3 className="mt-2 text-sm font-semibold text-foreground">
                  {step.title}
                </h3>
                <p className="mt-1 text-xs text-muted-foreground">
                  {step.description}
                </p>
              </li>
            ))}
          </ol>
        </section>

        <AttractionBookPricingSection
          itemId="event_bubbles"
          serviceTitle={service.title}
          utmCampaign={service.utmCampaign}
        />


        {service.faqs.length > 0 ? (
          <FAQAccordion
            items={[...service.faqs]}
            title="שאלות נפוצות, בועות עשן"
            className="py-0"
          />
        ) : null}

        <ServiceHubLinks
          headingId="smoke-bubble-related-heading"
          heading="אטרקציות נוספות"
          subheading="שילוב אפקטים לאירוע מושלם."
          links={[
            { href: "/events/attractions/bubble-machine", title: "כל סוגי הבועות", description: "בועות לחתונה, בר מצווה ואירועי ילדים." },
            ...attractionHubLinksExcluding("/events/attractions/bubble-machine/smoke-bubble-machine-events", 3),
          ]}
        />

        <section
          className="rounded-xl border border-brand-red/25 bg-surface px-6 py-10 text-center"
          aria-labelledby="smoke-bubble-cta"
        >
          <h2
            id="smoke-bubble-cta"
            className="text-xl font-semibold text-foreground"
          >
            מוכנים לשדרג את הרחבה?
          </h2>
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex rounded-md bg-brand-red px-6 py-3 text-sm font-semibold text-white hover:bg-brand-red-light"
          >
            הזמנה בוואטסאפ
          </a>
        </section>
              <PageRelatedFooter pathname="/events/attractions/bubble-machine/smoke-bubble-machine-events" />

            </div>
    </ServicePageLayout>
  );
}
