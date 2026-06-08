import Link from "next/link";
import ContextualIntroParagraph from "@/components/seo/ContextualIntroParagraph";
import PageRelatedFooter from "@/components/seo/PageRelatedFooter";
import { DjEventsCalculatorLazy } from "@/components/calculators/lazy";
import FAQAccordion from "@/components/ui/FAQAccordion";
import ServicePageLayout from "@/components/services/ServicePageLayout";
import ServicePagePricingSection from "@/components/services/ServicePagePricingSection";
import ServiceShowcaseSections from "@/components/services/ServiceShowcaseSections";
import { resolveServicePageHeroFromEntity } from "@/lib/service-portfolio-hero";
import { withServicePageHeroDefaults } from "@/lib/service-page-ui";
import {
  PACKAGE_DJ_THREE_ATTRACTIONS,
  PACKAGE_FESTIVAL,
  WEDDING_PACKAGES_FAQ,
  WEDDING_PACKAGES_WHY,
} from "@/lib/data/wedding-packages-page";
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

const service = getEventsService("events-wedding-packages");

const pageHero = resolveServicePageHeroFromEntity(service);
const heroProps = withServicePageHeroDefaults(pageHero);

export default function WeddingPackagesPageContent() {
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
        <ContextualIntroParagraph pathname="/events/wedding-attractions-packages" className="max-w-3xl" />
        <section
          className="rounded-xl border border-brand-red/30 bg-brand-red/5 p-6 text-center sm:p-8"
          aria-labelledby="save-heading"
        >
          <p className="text-xs font-bold uppercase tracking-widest text-brand-red">
            חיסכון עד 30%
          </p>
          <h2
            id="save-heading"
            className="mt-2 text-xl font-semibold text-foreground sm:text-2xl"
          >
            DJ + אטרקציות + הגברה בחבילה אחת
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground">
            במקום להזמין כל שירות בנפרד  -  חבילה שלמה במחיר מוזל. חוסכים כסף,
            זמן וכאבי ראש.
          </p>
        </section>

        <section className="max-w-3xl" aria-labelledby="intro-heading">
          <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
            מתכננים אירוע ורוצים שהכול יהיה מושלם? ספק אחד ל-DJ, אפקטים,
            הגברה ותיאום  -  הכול עובד ביחד ברגע הנכון.
          </p>
        </section>

        <section aria-labelledby="why-package-heading">
          <header className="mx-auto max-w-2xl text-center">
            <h2
              id="why-package-heading"
              className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
            >
              למה כדאי לקחת חבילה?
            </h2>
          </header>
          <ul className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {WEDDING_PACKAGES_WHY.map((item) => (
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

        <section aria-labelledby="packages-heading">
          <header className="mx-auto max-w-2xl text-center">
            <h2
              id="packages-heading"
              className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
            >
              החבילות שלנו
            </h2>
          </header>

          <article className="mx-auto mt-10 max-w-3xl rounded-xl border-2 border-brand-red/40 bg-surface p-6 sm:p-8">
            <p className="text-sm font-bold text-brand-red">
              {PACKAGE_DJ_THREE_ATTRACTIONS.badge}{" "}
              {PACKAGE_DJ_THREE_ATTRACTIONS.name}
            </p>
            <h3 className="mt-4 text-lg font-semibold text-foreground">
              מה כלול?
            </h3>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li>🎧 DJ מקצועי ({PACKAGE_DJ_THREE_ATTRACTIONS.djHours})</li>
              <li>🎆 3 אטרקציות לבחירה מהרשימה:</li>
            </ul>
            <ul className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
              {PACKAGE_DJ_THREE_ATTRACTIONS.attractions.map((a) => (
                <li key={a.href}>
                  <Link
                    href={a.href}
                    className="text-sm font-medium text-brand-red hover:underline"
                  >
                    {a.label} ←
                  </Link>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-sm text-muted-foreground">
              מתאים ל: {PACKAGE_DJ_THREE_ATTRACTIONS.suitedFor}
            </p>
          </article>

          <article className="mx-auto mt-8 max-w-3xl rounded-xl border border-border bg-surface p-6 sm:p-8">
            <h3 className="text-lg font-semibold text-foreground">
              {PACKAGE_FESTIVAL.name}
            </h3>
            <p className="mt-2 text-2xl font-bold text-brand-red">
              {PACKAGE_FESTIVAL.price}
            </p>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              {PACKAGE_FESTIVAL.includes.map((line) => (
                <li key={line} className="flex gap-2">
                  <span className="text-brand-red" aria-hidden>
                    ✓
                  </span>
                  {line}
                </li>
              ))}
            </ul>
          </article>
        </section>

        <ServiceShowcaseSections
          assetsFolder={service.assetsFolder}
          playlistEmbedUrl={youtubeEmbedUrl(
            YOUTUBE_SERVICE_EMBED_IDS["events-dj"],
          )}
          mediaType="video"
          galleryLabel="חבילות אירועים בשטח"
          videoTitle="חבילות אירועים בשטח"
          videoHeadingId="video-heading"
          videoHeading="רחבה מלאה מתחילה בעיניים"
        />

        <section
          className="rounded-xl border border-border bg-surface p-6 sm:p-8"
          aria-labelledby="upsell-heading"
        >
          <h2
            id="upsell-heading"
            className="text-lg font-semibold text-foreground"
          >
            שדרוגים פופולריים בחבילות
          </h2>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              href="/events/stage-led-dj"
              className="rounded-full border border-border px-4 py-2 text-sm hover:border-brand-red/40 hover:text-brand-red"
            >
              עמדת LED
            </Link>
            <Link
              href="/events/attractions/bubble-machine/smoke-bubble-machine-events"
              className="rounded-full border border-border px-4 py-2 text-sm hover:border-brand-red/40 hover:text-brand-red"
            >
              בועות עשן
            </Link>
            <Link
              href="/events/equipment"
              className="rounded-full border border-border px-4 py-2 text-sm hover:border-brand-red/40 hover:text-brand-red"
            >
              הגברה RCF
            </Link>
            <Link
              href="/events/attractions"
              className="rounded-full border border-border px-4 py-2 text-sm hover:border-brand-red/40 hover:text-brand-red"
            >
              כל האטרקציות
            </Link>
          </div>
        </section>

        <section aria-labelledby="calculator-heading">
          <header className="mx-auto max-w-2xl text-center">
            <h2
              id="calculator-heading"
              className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
            >
              בנו את החבילה שלכם
            </h2>
            <p className="mt-3 text-sm text-muted-foreground">
              DJ, אטרקציות, חבילת פסטיבל  -  מחיר מיידי ושליחה לוואטסאפ
            </p>
          </header>
          <DjEventsCalculatorLazy className="mt-8" />
        </section>

        <FAQAccordion
          items={[...WEDDING_PACKAGES_FAQ]}
          title="שאלות על חבילות"
          className="py-0"
        />

        <section
          className="rounded-xl border border-brand-red/25 bg-surface px-6 py-10 text-center sm:px-10"
          aria-labelledby="packages-cta-heading"
        >
          <h2
            id="packages-cta-heading"
            className="text-xl font-semibold text-foreground sm:text-2xl"
          >
            מוכנים לחבילה שחוסכת אלפי שקלים?
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-sm text-muted-foreground">
            שלחו תאריך וסוג אירוע  -  נחזור תוך 24 שעות. טלפון:{" "}
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
        <ServicePagePricingSection service={service} />

              <PageRelatedFooter pathname="/events/wedding-attractions-packages" />

            </div>
    </ServicePageLayout>
  );
}
