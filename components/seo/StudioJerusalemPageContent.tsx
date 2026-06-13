import Link from "next/link";
import ContextualIntroParagraph from "@/components/seo/ContextualIntroParagraph";
import PageRelatedFooter from "@/components/seo/PageRelatedFooter";
import FAQAccordion from "@/components/ui/FAQAccordion";
import ServicePageLayout from "@/components/services/ServicePageLayout";
import ServiceShowcaseSections from "@/components/services/ServiceShowcaseSections";
import { resolveServicePageHeroFromEntity } from "@/lib/service-portfolio-hero";
import { withServicePageHeroDefaults } from "@/lib/service-page-ui";
import {
  JERUSALEM_POPULAR_SERVICES,
  JERUSALEM_PROCESS,
  JERUSALEM_WHY_US,
} from "@/lib/data/studio-jerusalem-page";
import { getStudioService } from "@/lib/data/services";
import {
  youtubeEmbedUrl,
  YOUTUBE_SERVICE_EMBED_IDS,
} from "@/lib/data/youtube-embeds";
import { buildServiceWhatsAppText, buildWhatsAppHref } from "@/lib/whatsapp";

const service = getStudioService("studio-jerusalem");

const pageHero = resolveServicePageHeroFromEntity(service);
const heroProps = withServicePageHeroDefaults(pageHero);

export default function StudioJerusalemPageContent() {
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
      {...heroProps}
    >
      <div className="mx-auto max-w-[72rem] space-y-16 px-4 sm:px-6 lg:px-8">
        <ContextualIntroParagraph pathname="/studio/studio-jerusalem" className="max-w-3xl" />
        <section className="max-w-3xl" aria-labelledby="jerusalem-intro-heading">
          <h2
            id="jerusalem-intro-heading"
            className="font-serif text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
          >
            אולפן הקלטות בירושלים  -  חוויה בלתי נשכחת
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
            מחפשים אולפן בירושלים? יקיר כהן הפקות מציע אולפן מקצועי במודיעין  - 
            כ-30 דקות מירושלים. מתאים לקהל דתי, הקלטת שירים, ברכות וקליפים.
            ירושלמי במקור, עם יחס אישי וחם.
          </p>
        </section>

        <section aria-labelledby="jerusalem-why-heading">
          <header className="mx-auto max-w-2xl text-center">
            <h2
              id="jerusalem-why-heading"
              className="font-serif text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
            >
              למה ירושלמים בוחרים להקליט אצלנו?
            </h2>
          </header>
          <ul className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {JERUSALEM_WHY_US.map((item) => (
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

        <section aria-labelledby="jerusalem-process-heading">
          <header className="mx-auto max-w-2xl text-center">
            <h2
              id="jerusalem-process-heading"
              className="font-serif text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
            >
              איך זה עובד?
            </h2>
          </header>
          <ol className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {JERUSALEM_PROCESS.map((step) => (
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
            ירושלמי במקור  -  מבין את הנשמה שלכם
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            האולפן במודיעין הוא השלוחה המוזיקלית לתושבי ירושלים שמחפשים מקום
            שקט, מקצועי ונגיש. בר מצווה, חתונה או חלום ישן  -  אנחנו מדברים את
            השפה שלכם.
          </p>
        </section>

        <section
          className="rounded-xl border border-brand-red/20 bg-surface p-6 sm:p-8"
          aria-labelledby="partners-heading"
        >
          <h2
            id="partners-heading"
            className="font-serif text-lg font-semibold text-foreground sm:text-xl"
          >
            לעסקים, מורים ותקליטנים
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            מורים למוזיקה, בתי ספר, תקליטנים ויוצרי תוכן  -  נשמח לשיתוף פעולה
            והבאת תלמידים או לקוחות לחוויה באולפן במודיעין.
          </p>
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-block text-sm font-semibold text-brand-red hover:underline"
          >
            לתיאום שיתוף בוואטסאפ </a>
        </section>

        <section aria-labelledby="popular-services-heading">
          <header className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-red">
              פופולרי בקרב ירושלמים
            </p>
            <h2
              id="popular-services-heading"
              className="mt-3 font-serif text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
            >
              מה מקליטים אצלנו?
            </h2>
            <p className="mt-3 text-sm text-muted-foreground">
              השירותים הפופולריים ביותר לקהל ירושלמי ודתי
            </p>
          </header>
          <ul className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2">
            {JERUSALEM_POPULAR_SERVICES.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="group flex h-full flex-col rounded-xl border border-border bg-surface p-6 transition-[border-color,box-shadow,transform] duration-normal ease-luxury hover:-translate-y-0.5 hover:border-brand-red/40 hover:shadow-md"
                >
                  <p className="text-2xl" aria-hidden>
                    {item.emoji}
                  </p>
                  <h3 className="mt-3 font-semibold text-foreground group-hover:text-brand-red">
                    {item.title}
                  </h3>
                  <p className="mt-2 flex-1 text-sm text-muted-foreground">
                    {item.description}
                  </p>
                  <span className="mt-4 text-xs font-semibold text-brand-red">
                    לפרטים </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <ServiceShowcaseSections
          assetsFolder={service.assetsFolder}
          playlistEmbedUrl={youtubeEmbedUrl(
            YOUTUBE_SERVICE_EMBED_IDS["studio-jerusalem"],
          )}
          mediaType="video"
          galleryLabel="אולפן לירושלמים"
          videoTitle="דוגמה מהאולפן"
          className="px-0"
        />

        <p className="text-center text-sm text-muted-foreground">
          <Link
            href="/studio/mobile-studio"
            className="font-semibold text-brand-red hover:underline"
          >
            אולפן נייד
          </Link>{" "}
           -  אפשר גם להגיע עד ירושלים בתיאום מראש
        </p>

        {service.faqs.length > 0 ? (
          <FAQAccordion
            items={[...service.faqs]}
            title="שאלות נפוצות  -  אולפן לירושלמים"
            className="py-0"
          />
        ) : null}

        <section
          className="rounded-xl border border-brand-red/25 bg-surface px-6 py-10 text-center sm:px-10"
          aria-labelledby="jerusalem-cta-heading"
        >
          <h2
            id="jerusalem-cta-heading"
            className="font-serif text-xl font-semibold text-foreground sm:text-2xl"
          >
            מוכנים להקליט את השיר שלכם?
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-muted-foreground">
            אל תחכו לרגע האחרון  -  מקומות מתמלאים בעונת האירועים. פגישת היכרות
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
              <PageRelatedFooter pathname="/studio/studio-jerusalem" />

            </div>
    </ServicePageLayout>
  );
}
