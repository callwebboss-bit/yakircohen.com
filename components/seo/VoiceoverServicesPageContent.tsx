import JourneyStepsLink from "@/components/marketing/JourneyStepsLink";
import ContextualIntroParagraph from "@/components/seo/ContextualIntroParagraph";
import PageRelatedFooter from "@/components/seo/PageRelatedFooter";
import ServiceBlogStrip from "@/components/blog/ServiceBlogStrip";
import { getBlogPostsByServiceSlug } from "@/lib/data/blog";
import ShowcaseVideoSection from "@/components/seo/ShowcaseVideoSection";
import ServicePageLayout from "@/components/services/ServicePageLayout";
import FAQAccordion from "@/components/ui/FAQAccordion";
import { getVoiceoverService } from "@/lib/data/services";
import { resolveServicePageHeroFromEntity } from "@/lib/service-portfolio-hero";
import { withServicePageHeroDefaults } from "@/lib/service-page-ui";
import { VOICEOVER_SERVICES_VIDEOS } from "@/lib/data/youtube-showcases";
import BusinessCrossLink from "@/components/marketing/BusinessCrossLink";

const service = getVoiceoverService("voiceover-services");
const pageHero = resolveServicePageHeroFromEntity(service);
const heroProps = withServicePageHeroDefaults(pageHero);

export default function VoiceoverServicesPageContent() {
  return (
    <ServicePageLayout
      title={service.title}
      subtitle={service.subtitle}
      features={service.features}
      whatsappText={service.whatsappText}
      utmCampaign={service.utmCampaign}
      bookSlug={service.slug}
      pagePath="/voiceover/services"
      faqs={service.faqs}
      {...heroProps}
    >
      <div className="mx-auto max-w-[72rem] space-y-14 px-4 sm:px-6 lg:px-8">
        <ContextualIntroParagraph pathname="/voiceover/services" className="max-w-3xl" />

        <p className="max-w-2xl border-r-[3px] border-brand-red/40 pr-4 text-sm italic leading-relaxed text-foreground/80 sm:text-base">
          צריך קריינות לסרטון, למצגת, ל-IVR - ואתה לא יכול להרשות לעצמך שזה
          יישמע חובבני. אתה מדמיין שתצטרך להסביר שעה מה הטון שאתה רוצה. אני
          מבין את זה - ולכן אני מחזיר לך קובץ שמדבר בדיוק בשפת הקהל שלך, בלי
          לאבד זמן.
        </p>

        <BusinessCrossLink
          title="חבילות מיתוג קולי לעסק"
          text="ג'ינגל, IVR, מוזיקת המתנה ואפקטים. מעטפת אודיו שלמה, לא רק קריינות בודדת."
          href="/business/audio-branding"
          linkLabel="מיתוג קולי"
        />
        <BusinessCrossLink
          title="הפקת ספרי שמע"
          text="הקלטה ועריכה מקצה לקצה. ACX, Spotify ואייקאסט."
          href="/business/audiobooks"
          linkLabel="ספרי שמע"
        />
        <ShowcaseVideoSection
          playlistId="voiceover-services"
          sectionId="voiceover-services-videos"
        />
        <section className="py-4">
          <JourneyStepsLink variant="studio" />
        </section>
        {service.faqs.length > 0 ? (
          <FAQAccordion items={[...service.faqs]} title="שאלות ששואלים אותנו הרבה לפני שמזמינים" className="py-0" />
        ) : null}
        <ServiceBlogStrip posts={getBlogPostsByServiceSlug("voiceover/services")} />
        <PageRelatedFooter pathname="/voiceover/services" />
      </div>
    </ServicePageLayout>
  );
}
