import Link from "next/link";
import ProcessSteps from "@/components/marketing/ProcessSteps";
import ContextualIntroParagraph from "@/components/seo/ContextualIntroParagraph";
import PageRelatedFooter from "@/components/seo/PageRelatedFooter";
import ShowcaseVideoSection from "@/components/seo/ShowcaseVideoSection";
import WeddingPhotoGalleries from "@/components/seo/WeddingPhotoGalleries";
import WeddingPhotoTestimonials from "@/components/seo/WeddingPhotoTestimonials";
import FAQAccordion from "@/components/ui/FAQAccordion";
import ServicePageLayout from "@/components/services/ServicePageLayout";
import ServicePricingBlock from "@/components/services/ServicePricingBlock";
import { resolveServicePageHeroFromEntity } from "@/lib/service-portfolio-hero";
import { withServicePageHeroDefaults } from "@/lib/service-page-ui";
import {
  WEDDING_PHOTO_EXAMPLE_VIDEOS,
  WEDDING_PHOTO_HERO,
  WEDDING_PHOTO_HERO_HIGHLIGHTS,
  WEDDING_PHOTO_RELATED,
  WEDDING_PHOTO_WHY_US,
} from "@/lib/data/wedding-photography-page";
import { getPhotographyService } from "@/lib/data/services";
import {
  CONTACT_PHONE_DISPLAY,
  CONTACT_PHONE_E164,
} from "@/lib/constants";
import { buildServiceWhatsAppText, buildWhatsAppHref } from "@/lib/whatsapp";
import { PHOTOGRAPHY_STEPS } from "@/lib/data/video-steps";

const service = getPhotographyService("photography-wedding");

const pageHero = resolveServicePageHeroFromEntity(service);
const heroProps = withServicePageHeroDefaults(pageHero);

export default function WeddingPhotographyPageContent() {
  const whatsappHref = buildWhatsAppHref({
    text: buildServiceWhatsAppText(service.whatsappText),
    utm_source: "website",
    utm_campaign: `${service.utmCampaign}_cta`,
  });

  return (
    <ServicePageLayout
      title={WEDDING_PHOTO_HERO.title}
      subtitle={WEDDING_PHOTO_HERO.subtitle}
      features={WEDDING_PHOTO_HERO_HIGHLIGHTS}
      whatsappText={service.whatsappText}
      utmCampaign={service.utmCampaign}
      ctaLabel={WEDDING_PHOTO_HERO.ctaLabel}
      heroGallerySectionId="wedding-gallery-best"
      {...heroProps}
      heroScrollTarget={pageHero.heroImageSrc ? "gallery" : undefined}
    >
      <div className="mx-auto max-w-[72rem] space-y-20 px-4 sm:px-6 lg:px-8">
        <ContextualIntroParagraph pathname="/photography/wedding" className="max-w-2xl" />

        <section
          className="max-w-2xl rounded-2xl border border-border bg-surface px-6 py-8 sm:px-8"
          aria-labelledby="photo-intro-heading"
        >
          <h2
            id="photo-intro-heading"
            className="text-lg font-semibold text-foreground sm:text-xl"
          >
            צילום שמכבד את הרגע
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
            חתונה קטנה לא אומרת להתפשר על הזיכרונות. אתם פשוט תהיו אתם - והמצלמה
            תתפוס את הסיפור האמיתי, בלי פוזות כבדות.
          </p>
          <Link
            href="/photography/events"
            className="mt-4 inline-flex text-sm font-medium text-brand-red hover:underline"
          >
            גם צילום כנסים ואירועים עסקיים ←
          </Link>
        </section>

        <section aria-labelledby="why-photo-heading">
          <header className="mx-auto max-w-2xl text-center">
            <h2
              id="why-photo-heading"
              className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
            >
              למה לבחור בנו?
            </h2>
          </header>
          <ul className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
            {WEDDING_PHOTO_WHY_US.map((item) => (
              <li
                key={item}
                className="rounded-xl border border-border bg-background p-5 text-center text-sm leading-relaxed text-foreground"
              >
                <span className="mb-2 block text-xl text-brand-red" aria-hidden>
                  ✓
                </span>
                {item}
              </li>
            ))}
          </ul>
        </section>

        {WEDDING_PHOTO_EXAMPLE_VIDEOS.length > 0 ? (
          <ShowcaseVideoSection
            heading="רגעים בתנועה"
            subheading="קליפ קצר מהשטח - הסרטון הראשון נטען מיד"
            videos={WEDDING_PHOTO_EXAMPLE_VIDEOS}
            initialVisible={2}
            sectionId="wedding-video-samples"
          />
        ) : null}

        <WeddingPhotoGalleries />

        {service.pricing && service.pricing.length > 0 ? (
          <section
            className="scroll-mt-24 rounded-2xl border border-border bg-surface px-4 py-10 sm:px-8"
            aria-labelledby="pricing-block-heading"
          >
            <header className="mx-auto mb-8 max-w-2xl text-center">
              <h2
                id="pricing-block-heading"
                className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
              >
                מחירון שקוף
              </h2>
              <p className="mt-3 text-sm text-muted-foreground">
                כולל מע״מ ועריכה בסיסית · בלי תוספות נסתרות · הצעה מותאמת בוואטסאפ
              </p>
            </header>
            <ServicePricingBlock
              tiers={service.pricing}
              serviceTitle={service.title}
              utmCampaignPrefix={service.utmCampaign}
              embedded
            />
          </section>
        ) : null}

        <section className="rounded-2xl border border-border bg-background px-4 py-12 sm:px-8">
          <WeddingPhotoTestimonials />
          <div className="mt-10 text-center">
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex rounded-xl bg-brand-red px-7 py-3 text-sm font-semibold text-white hover:bg-brand-red-light"
            >
              רוצים כזה גם? דברו איתנו בוואטסאפ
            </a>
          </div>
        </section>

        <section aria-labelledby="related-heading">
          <header className="mx-auto max-w-2xl text-center">
            <h2
              id="related-heading"
              className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl"
            >
              שירותים משלימים
            </h2>
          </header>
          <ul className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {WEDDING_PHOTO_RELATED.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="block h-full rounded-xl border border-border bg-surface p-5 transition-colors hover:border-brand-red/40"
                >
                  <h3 className="font-semibold text-foreground">{item.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                    {item.description}
                  </p>
                  <span className="mt-3 inline-block text-sm font-medium text-brand-red">
                    לפרטים ←
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

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
          className="rounded-xl border border-brand-red/25 bg-surface px-6 py-10 text-center sm:px-10"
          aria-labelledby="photo-cta-heading"
        >
          <h2
            id="photo-cta-heading"
            className="text-xl font-semibold text-foreground sm:text-2xl"
          >
            בואו נדבר על התאריך שלכם
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-sm text-muted-foreground">
            הצעת מחיר אישית בוואטסאפ או בטלפון{" "}
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

        <PageRelatedFooter pathname="/photography/wedding" />
      </div>
    </ServicePageLayout>
  );
}
