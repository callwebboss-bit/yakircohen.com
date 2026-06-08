import Link from "next/link";
import ContextualIntroParagraph from "@/components/seo/ContextualIntroParagraph";
import PageRelatedFooter from "@/components/seo/PageRelatedFooter";
import { AttractionsCalculatorLazy } from "@/components/calculators/lazy";
import RecordingSongExampleVideos from "@/components/seo/RecordingSongExampleVideos";
import FAQAccordion from "@/components/ui/FAQAccordion";
import ServicePageLayout from "@/components/services/ServicePageLayout";
import ServicePagePricingSection from "@/components/services/ServicePagePricingSection";
import ServiceShowcaseSections from "@/components/services/ServiceShowcaseSections";
import { resolveServicePageHeroFromEntity } from "@/lib/service-portfolio-hero";
import { withServicePageHeroDefaults } from "@/lib/service-page-ui";
import {
  HEAVY_SMOKE_EVENT_TYPES,
  HEAVY_SMOKE_INCLUDES,
  HEAVY_SMOKE_MACHINE_WINS,
  HEAVY_SMOKE_SAFETY,
  HEAVY_SMOKE_SLOGAN_LINES,
  HEAVY_SMOKE_WHY_US,
} from "@/lib/data/heavy-smoke-large-page";
import { HEAVY_SMOKE_EXAMPLE_VIDEOS } from "@/lib/data/wedding-smoke-page";
import { getEventsService } from "@/lib/data/services";
import {
  CONTACT_PHONE_DISPLAY,
  CONTACT_PHONE_E164,
} from "@/lib/constants";
import { buildServiceWhatsAppText, buildWhatsAppHref } from "@/lib/whatsapp";

const service = getEventsService("attractions-heavy-smoke-large");

const pageHero = resolveServicePageHeroFromEntity(service);
const heroProps = withServicePageHeroDefaults(pageHero);

export default function HeavySmokeLargeEventsPageContent() {
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
      {...heroProps}
    >
      <div className="mx-auto max-w-[72rem] space-y-16 px-4 sm:px-6 lg:px-8">
        <ContextualIntroParagraph pathname="/events/attractions/wedding-smoking-machine/heavy-smoke-large-events" className="max-w-3xl" />
        <p className="text-center">
          <Link
            href="/events/attractions/wedding-smoking-machine"
            className="text-sm font-medium text-brand-red hover:underline"
          >
            ← עשן כבד לחתונה וסלואו (חבילות סטנדרט)
          </Link>
        </p>

        <ul className="mx-auto grid max-w-3xl grid-cols-1 gap-2 sm:grid-cols-2">
          {HEAVY_SMOKE_SLOGAN_LINES.map((line) => (
            <li
              key={line}
              className="flex gap-2 rounded-lg border border-border bg-surface px-4 py-2.5 text-sm"
            >
              <span className="text-brand-red" aria-hidden>
                ✓
              </span>
              {line}
            </li>
          ))}
        </ul>

        <section className="max-w-3xl" aria-labelledby="heavy-intro-heading">
          <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
            תארו לעצמכם כניסה לאולם מוקפת בענן רך וקסום  -  צמר גפן שקוף שמותר
            לדרוך עליו. רבים חושבים שעשן זה &quot;ערפל&quot;, אבל כדי להגיע ל-9.9
            מתוך 10 נדרש דיוק הנדסי. ביקיר כהן הפקות לא מתפשרים על פחות.
          </p>
        </section>

        <ServiceShowcaseSections
          assetsFolder={service.assetsFolder}
          playlistEmbedUrl={service.playlistEmbedUrl}
          mediaType="video"
          galleryLabel="עשן כבד לאירועים גדולים"
          videoTitle="עשן כבד גדול  -  אירועים גדולים"
          videoHeadingId="video-heading"
          videoHeading="אפקט קולנועי  -  עשן כבד לאירועים גדולים"
          videoDescription="מילוי רחבה פתוחה תוך שניות  -  וידאו נטען בלחיצה"
          footer={
            <RecordingSongExampleVideos videos={HEAVY_SMOKE_EXAMPLE_VIDEOS} />
          }
        />

        <section aria-labelledby="wins-heading">
          <header className="mx-auto max-w-2xl text-center">
            <h2
              id="wins-heading"
              className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
            >
              למה המכונות שלנו מנצחות?
            </h2>
          </header>
          <ul className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {HEAVY_SMOKE_MACHINE_WINS.map((item) => (
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

        <section aria-labelledby="safety-heading">
          <header className="mx-auto max-w-2xl text-center">
            <h2
              id="safety-heading"
              className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
            >
              בטיחות מעל הכל
            </h2>
          </header>
          <ul className="mx-auto mt-8 max-w-xl space-y-2">
            {HEAVY_SMOKE_SAFETY.map((item) => (
              <li
                key={item}
                className="flex gap-3 rounded-xl border border-border bg-surface px-4 py-3 text-sm"
              >
                <span className="text-brand-red" aria-hidden>
                  ✓
                </span>
                {item}
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="event-types-heading">
          <header className="mx-auto max-w-2xl text-center">
            <h2
              id="event-types-heading"
              className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
            >
              התאמה אישית לכל סוג אירוע
            </h2>
          </header>
          <ul className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-3">
            {HEAVY_SMOKE_EVENT_TYPES.map((item) => (
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
                {item.href ? (
                  <Link
                    href={item.href}
                    className="mt-3 inline-block text-sm font-medium text-brand-red hover:underline"
                  >
                    לפרטים ←
                  </Link>
                ) : null}
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="includes-heading">
          <h2
            id="includes-heading"
            className="text-center text-xl font-semibold text-foreground"
          >
            מה כלול בהשכרה
          </h2>
          <ul className="mx-auto mt-6 max-w-xl space-y-2">
            {HEAVY_SMOKE_INCLUDES.map((item) => (
              <li
                key={item}
                className="flex gap-2 text-sm text-muted-foreground"
              >
                <span className="text-brand-red">✓</span>
                {item}
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="why-heading">
          <header className="mx-auto max-w-2xl text-center">
            <h2
              id="why-heading"
              className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
            >
              למה לבחור ביקיר כהן הפקות?
            </h2>
          </header>
          <ul className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {HEAVY_SMOKE_WHY_US.map((item) => (
              <li
                key={item}
                className="rounded-xl border border-border bg-surface px-4 py-3 text-sm"
              >
                {item}
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
              שלבו עם אטרקציות נוספות
            </h2>
          </header>
          <AttractionsCalculatorLazy className="mt-8" />
        </section>
        <ServicePagePricingSection service={service} />


        {service.faqs.length > 0 ? (
          <FAQAccordion
            items={[...service.faqs]}
            title="שאלות נפוצות"
            subtitle="השכרת עשן כבד לאירועים גדולים"
            className="py-0"
          />
        ) : null}

        <section
          className="rounded-xl border border-brand-red/25 bg-surface px-6 py-10 text-center sm:px-10"
          aria-labelledby="heavy-cta-heading"
        >
          <h2
            id="heavy-cta-heading"
            className="text-xl font-semibold text-foreground sm:text-2xl"
          >
            מוכנים להפוך את האירוע לחלום?
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-sm text-muted-foreground">
            אל תשאירו את האווירה למזל. ייעוץ והצעת מחיר  -  גם בטלפון:{" "}
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
            הצעת מחיר בוואטסאפ
          </a>
        </section>
              <PageRelatedFooter pathname="/events/attractions/wedding-smoking-machine/heavy-smoke-large-events" />

            </div>
    </ServicePageLayout>
  );
}
