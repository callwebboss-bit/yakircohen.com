import Link from "next/link";
import JourneyStepsLink from "@/components/marketing/JourneyStepsLink";
import ClientMaterialsLiabilityBanner from "@/components/seo/ClientMaterialsLiabilityBanner";
import ContextualIntroParagraph from "@/components/seo/ContextualIntroParagraph";
import GrowthSlideshowSection from "@/components/seo/GrowthSlideshowSection";
import PageRelatedFooter from "@/components/seo/PageRelatedFooter";
import FAQAccordion from "@/components/ui/FAQAccordion";
import ServicePageLayout from "@/components/services/ServicePageLayout";
import ServiceShowcaseSections from "@/components/services/ServiceShowcaseSections";
import { GROWTH_SLIDESHOW_FAQS } from "@/lib/data/growth-slideshow-page";
import { VIDEO_PRESENTATION_USE_CASES } from "@/lib/data/video-presentation-page";
import { getVideoService } from "@/lib/data/services";
import { resolveServicePageHeroFromEntity } from "@/lib/service-portfolio-hero";
import { withServicePageHeroDefaults } from "@/lib/service-page-ui";

const service = getVideoService("video-presentation");
const pageHero = resolveServicePageHeroFromEntity(service);
const heroProps = withServicePageHeroDefaults(pageHero);

const combinedFaqs = [...service.faqs, ...GROWTH_SLIDESHOW_FAQS];

export default function VideoPresentationPageContent() {
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
      <div className="mx-auto max-w-[72rem] space-y-14 px-4 sm:px-6 lg:px-8">
        <ContextualIntroParagraph pathname="/video/presentation" className="max-w-3xl" />

        <section className="max-w-3xl">
          <h2 className="text-2xl font-semibold text-foreground">
            מתי מצגת וידאו עובדת הכי טוב?
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
            מצגת טובה לא רק "מחליקה תמונות" - היא בונה סיפור: פתיחה שתופסת,
            קצב שמחזיק את הקהל, וסיום שמשאיר רגש. אנחנו מלווים מתסריט ועד קובץ מוכן
            להקרנה באירוע או לשיתוף דיגיטלי.
          </p>
        </section>

        <div className="grid gap-6 md:grid-cols-3">
          {VIDEO_PRESENTATION_USE_CASES.map((item) => (
            <article
              key={item.title}
              className="rounded-2xl border border-border bg-surface p-6"
            >
              <h3 className="font-semibold text-foreground">{item.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{item.body}</p>
            </article>
          ))}
        </div>

        <GrowthSlideshowSection />

        <ClientMaterialsLiabilityBanner />

        <div className="rounded-2xl border border-brand-red/25 bg-brand-red/5 p-6 text-center">
          <p className="text-sm font-semibold text-foreground">רוצים גם צילום ועריכה מלאה?</p>
          <div className="mt-4 flex flex-wrap justify-center gap-3">
            <Link
              href="/photo-slideshow"
              className="rounded-xl bg-brand-red px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-red-light"
            >
              מצגת תמונות לאירוע
            </Link>
            <Link
              href="/book"
              className="rounded-xl border border-border px-5 py-2.5 text-sm font-semibold hover:border-brand-red/40"
            >
              הזמנה מקוונת
            </Link>
          </div>
        </div>

        <section className="py-4">
          <JourneyStepsLink variant="general" />
        </section>
        <ServiceShowcaseSections
          assetsFolder={service.assetsFolder}
          playlistEmbedUrl={service.playlistEmbedUrl}
          mediaType={service.mediaType}
          galleryLabel="מצגות וידאו"
          galleryLayout="masonry"
        />

        {combinedFaqs.length > 0 ? (
          <FAQAccordion
            items={combinedFaqs}
            title="שאלות נפוצות - מצגות וידאו ומצגת גדילה"
            className="py-0"
          />
        ) : null}

        <PageRelatedFooter pathname="/video/presentation" />
      </div>
    </ServicePageLayout>
  );
}
