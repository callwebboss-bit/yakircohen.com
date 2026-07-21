import Link from "next/link";
import ContextualIntroParagraph from "@/components/seo/ContextualIntroParagraph";
import PageRelatedFooter from "@/components/seo/PageRelatedFooter";
import ServiceHubLinks from "@/components/services/ServiceHubLinks";
import FAQAccordion from "@/components/ui/FAQAccordion";
import ServicePageLayout from "@/components/services/ServicePageLayout";
import ServiceShowcaseSections from "@/components/services/ServiceShowcaseSections";
import {
  buildStudioWhyUs,
  getNewGeoCity,
  type NewGeoCitySlug,
} from "@/lib/data/geo-cities";
import {
  GEO_STUDIO_POPULAR_SERVICES,
  GEO_STUDIO_PROCESS,
} from "@/lib/data/studio-geo-page";
import { getStudioService } from "@/lib/data/services";
import { mapGeoStudioServiceToHub } from "@/lib/data/studio-hub-mappers";
import {
  youtubeEmbedUrl,
  YOUTUBE_SERVICE_EMBED_IDS,
} from "@/lib/data/youtube-embeds";
import { resolveServicePageHeroFromEntity } from "@/lib/service-portfolio-hero";
import { withServicePageHeroDefaults } from "@/lib/service-page-ui";
import { buildServiceWhatsAppText, buildWhatsAppHref } from "@/lib/whatsapp";

export type GeoCityStudioPageContentProps = {
  citySlug: NewGeoCitySlug;
};

export default function GeoCityStudioPageContent({
  citySlug,
}: GeoCityStudioPageContentProps) {
  const city = getNewGeoCity(citySlug);
  const serviceId =
    citySlug === "shoham" ? "studio-shoham" : "studio-rehovot";
  const service = getStudioService(serviceId);
  const pagePath = `/${city.studioPath}`;
  const isRehovot = citySlug === "rehovot";
  const whyUs = buildStudioWhyUs(city);

  const pageHero = resolveServicePageHeroFromEntity(service);
  const heroProps = withServicePageHeroDefaults(pageHero);

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
      pagePath={pagePath}
      metaDescription={service.metaDescription}
      faqs={service.faqs}
      {...heroProps}
    >
      <div className="mx-auto max-w-[72rem] space-y-16 px-4 sm:px-6 lg:px-8">
        <ContextualIntroParagraph pathname={pagePath} className="max-w-3xl" />
        <section className="max-w-3xl" aria-labelledby={`${citySlug}-intro-heading`}>
          <h2
            id={`${citySlug}-intro-heading`}
            className="font-serif text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
          >
            {isRehovot
              ? "איפה מקליטים בפועל?"
              : `אולפן הקלטות ${city.nameHePrep}, במודיעין`}
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
            {isRehovot
              ? `אין אצלנו סניף פיזי ברחובות. האולפן המלא במודיעין, כ-${city.driveMinutes} דקות (${city.driveNote}). שתי אפשרויות ברורות: להגיע לאולפן, או להזמין אולפן נייד עד אליכם.`
              : `מחפשים אולפן ${city.nameHePrep}? האולפן הפיזי במודיעין, כ-${city.driveMinutes} דקות מ${city.nameHe} (${city.driveNote}). מתאים להקלטת שירים, ברכות ודרשות לבר/בת מצווה.`}
          </p>
          {isRehovot ? (
            <div className="mt-5 flex flex-wrap gap-3">
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-12 items-center rounded-md bg-brand-red px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-red-light"
              >
                לתיאום בוואטסאפ
              </a>
              <Link
                href="/studio/recording-song-modiin"
                className="inline-flex min-h-12 items-center rounded-md border border-border bg-surface px-5 py-3 text-sm font-semibold text-foreground transition-colors hover:border-brand-red/40"
              >
                הקלטת שיר באולפן
              </Link>
              <Link
                href="/studio/mobile-studio"
                className="inline-flex min-h-12 items-center rounded-md border border-border bg-surface px-5 py-3 text-sm font-semibold text-foreground transition-colors hover:border-brand-red/40"
              >
                אולפן נייד ברחובות
              </Link>
            </div>
          ) : null}
        </section>

        {isRehovot ? (
          <section
            className="max-w-3xl rounded-xl border border-border bg-surface p-6 sm:p-8"
            aria-labelledby="rehovot-two-options-heading"
          >
            <h2
              id="rehovot-two-options-heading"
              className="font-serif text-lg font-semibold text-foreground sm:text-xl"
            >
              שתי אפשרויות לתושבי רחובות
            </h2>
            <ol className="mt-4 space-y-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
              <li>
                <strong className="text-foreground">1. מגיעים לאולפן במודיעין</strong>
                {" - "}
                חדר אקוסטי, חניה, ליווי מלא. כ-25-30 דקות נסיעה. מתאים לשיר,
                ברכה, דרשה, קריינות או פודקאסט.
              </li>
              <li>
                <strong className="text-foreground">2. אולפן נייד עד אליכם ברחובות</strong>
                {" - "}
                לא החדר במודיעין. מגיעים עם סאונד, תאורה וכל הציוד שנדרש
                לשירה, קריינות או פודקאסט - לפי השירות שהזמנתם. ההגעה כרגע
                במחיר מבצע.
              </li>
            </ol>
            <p className="mt-4 text-sm text-muted-foreground">
              פרטים ומחיר לפי שירות ומיקום -{" "}
              <Link
                href="/studio/mobile-studio"
                className="font-semibold text-brand-red hover:underline"
              >
                דף האולפן הנייד
              </Link>
              {" "}
              או בוואטסאפ.
            </p>
          </section>
        ) : null}

        <section aria-labelledby={`${citySlug}-why-heading`}>
          <header className="mx-auto max-w-2xl text-center">
            <h2
              id={`${citySlug}-why-heading`}
              className="font-serif text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
            >
              {`למה ${city.residentsLabel} בוחרים להקליט אצלנו?`}
            </h2>
          </header>
          <ul className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {whyUs.map((item) => (
              <li
                key={item}
                className="flex gap-3 rounded-xl border border-border bg-surface px-4 py-3 text-sm text-foreground"
              >
                <span className="text-brand-red" aria-hidden>
                  ✓
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby={`${citySlug}-process-heading`}>
          <header className="mx-auto max-w-2xl text-center">
            <h2
              id={`${citySlug}-process-heading`}
              className="font-serif text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
            >
              איך זה עובד?
            </h2>
          </header>
          <ol className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {GEO_STUDIO_PROCESS.map((step) => (
              <li
                key={step.step}
                className="rounded-xl border border-border bg-surface p-5 text-center"
              >
                <span className="text-xs font-bold tracking-widest text-brand-red">
                  {step.step}
                </span>
                <p className="mt-2 text-sm font-semibold text-foreground">
                  {step.title}
                </p>
              </li>
            ))}
          </ol>
        </section>

        <section className="max-w-3xl rounded-xl border border-border bg-surface p-6 sm:p-8">
          <h2 className="font-serif text-lg font-semibold text-foreground sm:text-xl">
            {`אולפן במודיעין, נגיש מ${city.nameHe}`}
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            {`האולפן במודיעין הוא היעד הקרוב ביותר ל${city.residentsLabel} שמחפשים מקום שקט, מקצועי ונגיש. בר מצווה, חתונה או מתנה מוקלטת, אותו ליווי אישי.`}
          </p>
        </section>

        <section
          className="rounded-xl border border-brand-red/20 bg-surface p-6 sm:p-8"
          aria-labelledby={`${citySlug}-partners-heading`}
        >
          <h2
            id={`${citySlug}-partners-heading`}
            className="font-serif text-lg font-semibold text-foreground sm:text-xl"
          >
            לעסקים, מורים ותקליטנים
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            מורים למוזיקה, בתי ספר, תקליטנים ויוצרי תוכן, נשמח לשיתוף פעולה
            והבאת תלמידים או לקוחות לחוויה באולפן במודיעין.
          </p>
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-block text-sm font-semibold text-brand-red hover:underline"
          >
            לתיאום שיתוף בוואטסאפ
          </a>
        </section>

        <ServiceHubLinks
          heading="מה מקליטים אצלנו?"
          subheading={`שירותים נפוצים לשיר, ברכה, חופה ובר/בת מצווה - פופולרי בקרב ${city.residentsLabel}.`}
          links={GEO_STUDIO_POPULAR_SERVICES.map(mapGeoStudioServiceToHub)}
          headingId={`${citySlug}-popular-heading`}
          columns={2}
        />

        <ServiceShowcaseSections
          assetsFolder={service.assetsFolder}
          playlistEmbedUrl={youtubeEmbedUrl(
            YOUTUBE_SERVICE_EMBED_IDS["studio-jerusalem"],
          )}
          mediaType="video"
          galleryLabel={`אולפן ל${city.nameHe}`}
          videoTitle="דוגמה מהאולפן"
          className="px-0"
        />

        <p className="text-center text-sm text-muted-foreground">
          {isRehovot ? (
            <>
              לא רוצים לנסוע?{" "}
              <Link
                href="/studio/mobile-studio"
                className="font-semibold text-brand-red hover:underline"
              >
                אולפן נייד ברחובות
              </Link>
              {" - "}
              סאונד, תאורה וציוד לפי השירות. הגעה כרגע במחיר מבצע.
            </>
          ) : (
            <>
              <Link
                href="/studio/mobile-studio"
                className="font-semibold text-brand-red hover:underline"
              >
                אולפן נייד
              </Link>{" "}
              - אפשר גם להגיע עד {city.nameHe} בתיאום מראש
            </>
          )}
        </p>

        {service.faqs.length > 0 ? (
          <FAQAccordion
            items={[...service.faqs]}
            title={`שאלות נפוצות, אולפן ${city.nameHePrep}`}
            className="py-0"
          />
        ) : null}

        <section
          className="rounded-xl border border-brand-red/25 bg-surface px-6 py-10 text-center sm:px-10"
          aria-labelledby={`${citySlug}-cta-heading`}
        >
          <h2
            id={`${citySlug}-cta-heading`}
            className="font-serif text-xl font-semibold text-foreground sm:text-2xl"
          >
            מוכנים להקליט את השיר שלכם?
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-muted-foreground">
            אל תחכו לרגע האחרון, מקומות מתמלאים בעונת האירועים. פגישת היכרות
            או הקלטה ראשונה בוואטסאפ.
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
        <PageRelatedFooter pathname={pagePath} />
      </div>
    </ServicePageLayout>
  );
}
