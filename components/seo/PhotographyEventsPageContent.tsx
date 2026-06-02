import Link from "next/link";
import ProcessSteps from "@/components/marketing/ProcessSteps";
import ContextualIntroParagraph from "@/components/seo/ContextualIntroParagraph";
import PhotographyEventsGallery from "@/components/seo/PhotographyEventsGallery";
import ShowcaseVideoSection from "@/components/seo/ShowcaseVideoSection";
import PageRelatedFooter from "@/components/seo/PageRelatedFooter";
import FAQAccordion from "@/components/ui/FAQAccordion";
import ServicePageLayout from "@/components/services/ServicePageLayout";
import { PHOTOGRAPHY_EVENTS_DELIVERABLES } from "@/lib/data/photography-events-page";
import { getPhotographyService } from "@/lib/data/services";
import { resolveServicePageHeroFromEntity } from "@/lib/service-portfolio-hero";
import { withServicePageHeroDefaults } from "@/lib/service-page-ui";
import { PHOTOGRAPHY_EVENTS_VIDEOS } from "@/lib/data/youtube-showcases";
import { buildServiceWhatsAppText, buildWhatsAppHref } from "@/lib/whatsapp";
import { PHOTOGRAPHY_STEPS } from "@/lib/data/video-steps";

const service = getPhotographyService("photography-events");
const pageHero = resolveServicePageHeroFromEntity(service);
const heroProps = withServicePageHeroDefaults(pageHero);
const heroFeatures = service.features.slice(0, 3);

export default function PhotographyEventsPageContent() {
  const whatsappHref = buildWhatsAppHref({
    text: buildServiceWhatsAppText(service.whatsappText),
    utm_source: "website",
    utm_campaign: `${service.utmCampaign}_cta`,
  });

  return (
    <ServicePageLayout
      title={service.title}
      subtitle={service.subtitle}
      features={heroFeatures}
      whatsappText={service.whatsappText}
      utmCampaign={service.utmCampaign}
      heroGallerySectionId="photography-events-gallery"
      {...heroProps}
      heroScrollTarget={pageHero.heroImageSrc ? "gallery" : undefined}
    >
      <div className="mx-auto max-w-[72rem] space-y-16 px-4 sm:px-6 lg:px-8">
        <ContextualIntroParagraph pathname="/photography/events" className="max-w-2xl" />

        <section className="max-w-2xl">
          <h2 className="text-xl font-semibold text-foreground sm:text-2xl">
            צילום שמתאים לאופי האירוע
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
            כנס, השקה או אירוע חברה דורשים קצב אחר מחתונה - פחות פוזות ארוכות, יותר
            תיעוד דינמי של דוברים, מוצר והתרחשות בזמן אמת.
          </p>
        </section>

        <section aria-labelledby="photo-deliverables-heading">
          <h2
            id="photo-deliverables-heading"
            className="text-lg font-semibold text-foreground"
          >
            מה מקבלים
          </h2>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {PHOTOGRAPHY_EVENTS_DELIVERABLES.map((item) => (
              <li
                key={item}
                className="flex gap-2 rounded-xl border border-border bg-surface px-4 py-3 text-sm text-foreground"
              >
                <span className="text-brand-red" aria-hidden="true">
                  ✓
                </span>
                {item}
              </li>
            ))}
          </ul>
        </section>

        {PHOTOGRAPHY_EVENTS_VIDEOS.length > 0 ? (
          <ShowcaseVideoSection
            headingId="photography-events-videos"
            heading="וידאו מהשטח"
            subheading="דוגמאות קצרות מכנסים ואירועים"
            videos={PHOTOGRAPHY_EVENTS_VIDEOS}
            initialVisible={2}
          />
        ) : null}

        <PhotographyEventsGallery />

        <div className="rounded-2xl border border-border bg-background px-6 py-8 text-center">
          <p className="text-sm text-muted-foreground">
            לחתונות ואירועים פרטיים - גלריית החתונות המלאה
          </p>
          <Link
            href="/photography/wedding"
            className="mt-4 inline-flex rounded-xl bg-brand-red px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-red-light"
          >
            צילום חתונות
          </Link>
        </div>

        <ProcessSteps steps={PHOTOGRAPHY_STEPS} heading="איך הצילום עובד?" />

        {service.faqs.length > 0 ? (
          <FAQAccordion
            items={[...service.faqs]}
            title="שאלות נפוצות"
            subtitle="לפני שסוגרים תאריך"
            className="py-0"
          />
        ) : null}

        <section
          className="rounded-xl border border-brand-red/25 bg-surface px-6 py-10 text-center"
          aria-labelledby="photo-events-cta-heading"
        >
          <h2
            id="photo-events-cta-heading"
            className="text-xl font-semibold text-foreground"
          >
            הצעת מחיר לאירוע שלכם
          </h2>
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex rounded-md bg-brand-red px-6 py-3 text-sm font-semibold text-white hover:bg-brand-red-light"
          >
            שליחה בוואטסאפ
          </a>
        </section>

        <PageRelatedFooter pathname="/photography/events" />
      </div>
    </ServicePageLayout>
  );
}
