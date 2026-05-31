import Link from "next/link";
import ContextualIntroParagraph from "@/components/seo/ContextualIntroParagraph";
import PageRelatedFooter from "@/components/seo/PageRelatedFooter";
import ShowcaseVideoSection from "@/components/seo/ShowcaseVideoSection";
import FAQAccordion from "@/components/ui/FAQAccordion";
import ServicePageLayout from "@/components/services/ServicePageLayout";
import ServiceShowcaseSections from "@/components/services/ServiceShowcaseSections";
import { resolveServicePageHeroFromEntity } from "@/lib/service-portfolio-hero";
import { withServicePageHeroDefaults } from "@/lib/service-page-ui";
import {
  RECORDING_STUDIO_HIGHLIGHTS,
  RECORDING_STUDIO_OFFERINGS,
} from "@/lib/data/recording-studio-page";
import { RECORDING_STUDIO_VIDEOS } from "@/lib/data/youtube-showcases";
import { getStudioService } from "@/lib/data/services";
import { buildServiceWhatsAppText, buildWhatsAppHref } from "@/lib/whatsapp";

const service = getStudioService("studio-recording-studio");

const pageHero = resolveServicePageHeroFromEntity(service);
const heroProps = withServicePageHeroDefaults(pageHero);

export default function RecordingStudioPageContent() {
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
      {...heroProps}
    >
      <div className="mx-auto max-w-[72rem] space-y-16 px-4 sm:px-6 lg:px-8">
        <ContextualIntroParagraph pathname="/studio/recording-studio" className="max-w-3xl" />
        <div className="flex justify-center">
          <p className="inline-flex items-center gap-2 rounded-full border border-brand-red/30 bg-brand-red/5 px-4 py-2 text-sm font-semibold text-foreground">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 shrink-0 text-brand-red" aria-hidden="true">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
            מעל 2,000 תושבי מודיעין והסביבה כבר הקליטו אצלנו
          </p>
        </div>

        <ShowcaseVideoSection
          heading="בואו לסיור באולפן"
          subheading="צפו בסרטונים כדי להבין איך נראה סשן הקלטה באולפן שלנו במודיעין"
          videos={RECORDING_STUDIO_VIDEOS}
          initialVisible={4}
        />

        <ServiceShowcaseSections
          assetsFolder={service.assetsFolder}
          playlistEmbedUrl={null}
          mediaType="gallery"
          galleryLabel="אולפן הקלטות במודיעין"
        />

        <section aria-labelledby="offerings-heading">
          <header className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-red">
              שירותי הפקה
            </p>
            <h2
              id="offerings-heading"
              className="mt-3 font-serif text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
            >
              מה אפשר להקליט ולהפיק אצלנו?
            </h2>
          </header>
          <ul className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-2">
            {RECORDING_STUDIO_OFFERINGS.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="group flex h-full flex-col rounded-xl border border-border bg-surface p-6 transition-[border-color,box-shadow,transform] duration-normal ease-luxury hover:-translate-y-0.5 hover:border-brand-red/40 hover:shadow-md"
                >
                  <p className="text-xs font-bold uppercase tracking-widest text-brand-red">
                    {item.subtitle}
                  </p>
                  <h3 className="mt-2 text-lg font-semibold text-foreground group-hover:text-brand-red">
                    {item.title}
                  </h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                    {item.description}
                  </p>
                  <span className="mt-4 text-xs font-semibold text-brand-red">
                    לפרטים ←
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="why-here-heading">
          <header className="mx-auto max-w-2xl text-center">
            <h2
              id="why-here-heading"
              className="font-serif text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
            >
              למה דווקא כאן?
            </h2>
          </header>
          <ul className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {RECORDING_STUDIO_HIGHLIGHTS.map((item) => (
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

        <section className="max-w-3xl" aria-labelledby="revolution-heading">
          <h2
            id="revolution-heading"
            className="font-serif text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
          >
            המהפכה המוזיקלית במודיעין
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
            מודיעין מכבים רעות הפכה למוקד תרבותי  -  והצורך באולפן מקצועי גדל
            משנה לשנה. כשבוחרים אולפן, חשוב לבדוק לא רק ציוד אלא את הניסיון
            מאחורי הקונסולה.
          </p>
          <h3 className="mt-8 text-lg font-semibold text-foreground">
            20 שנים של יצירה
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            סינגל לרדיו, פודקאסט או שיר לאירוע משפחתי  -  אותה מתודולוגיה: דיוק,
            איכות ורגש.
          </p>
          <h3 className="mt-6 text-lg font-semibold text-foreground">
            העתיד כבר כאן: Cubase ו-AI
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Cubase לגמישות בעריכה, ו-Suno AI לסקיצות ורעיונות שבעבר דרשו תקציבי
            עתק  -  בלי לוותר על האמן במרכז.
          </p>
          <Link
            href="/studio/studio-jerusalem"
            className="mt-6 inline-block text-sm font-semibold text-brand-red hover:underline"
          >
            אולפן לירושלמים  -  30 דק׳ מירושלים ←
          </Link>
        </section>

        {service.faqs.length > 0 ? (
          <FAQAccordion
            items={[...service.faqs]}
            title="שאלות ותשובות"
            subtitle="לפני שמגיעים לסשן"
            className="py-0"
          />
        ) : null}

        <section className="flex flex-wrap justify-center gap-3">
          <Link
            href="/studio/pricing"
            className="rounded-full border border-border bg-surface px-4 py-2 text-sm font-medium hover:border-brand-red/40 hover:text-brand-red"
          >
            מחירון
          </Link>
          <Link
            href="/studio"
            className="rounded-full border border-border bg-surface px-4 py-2 text-sm font-medium hover:border-brand-red/40 hover:text-brand-red"
          >
            מרכז האולפן
          </Link>
          <Link
            href="/book"
            className="rounded-full bg-brand-red px-4 py-2 text-sm font-semibold text-white hover:bg-brand-red-light"
          >
            הזמנה מקוונת
          </Link>
        </section>

        <section
          className="rounded-xl border border-brand-red/25 bg-surface px-6 py-10 text-center sm:px-10"
          aria-labelledby="studio-cta-heading"
        >
          <h2
            id="studio-cta-heading"
            className="font-serif text-xl font-semibold text-foreground sm:text-2xl"
          >
            מוכנים לסשן באולפן?
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-muted-foreground">
            שלחו הודעה בוואטסאפ לתיאום סיור או הקלטה ראשונה.
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
              <PageRelatedFooter pathname="/studio/recording-studio" />

            </div>
    </ServicePageLayout>
  );
}
