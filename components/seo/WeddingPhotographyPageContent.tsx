import Link from "next/link";
import ContextualIntroParagraph from "@/components/seo/ContextualIntroParagraph";
import PageRelatedFooter from "@/components/seo/PageRelatedFooter";
import RecordingSongExampleVideos from "@/components/seo/RecordingSongExampleVideos";
import FAQAccordion from "@/components/ui/FAQAccordion";
import ServicePageLayout from "@/components/services/ServicePageLayout";
import ServiceShowcaseSections from "@/components/services/ServiceShowcaseSections";
import ServicePricingBlock from "@/components/services/ServicePricingBlock";
import { resolveServicePageHeroFromEntity } from "@/lib/service-portfolio-hero";
import {
  WEDDING_PHOTO_EXAMPLE_VIDEOS,
  WEDDING_PHOTO_RELATED,
  WEDDING_PHOTO_WHY_US,
} from "@/lib/data/wedding-photography-page";
import { getPhotographyService } from "@/lib/data/services";
import {
  CONTACT_PHONE_DISPLAY,
  CONTACT_PHONE_E164,
} from "@/lib/constants";
import {
  youtubeEmbedUrl,
  YOUTUBE_SERVICE_EMBED_IDS,
} from "@/lib/data/youtube-embeds";
import { buildServiceWhatsAppText, buildWhatsAppHref } from "@/lib/whatsapp";

const service = getPhotographyService("photography-wedding");

const pageHero = resolveServicePageHeroFromEntity(service);

export default function WeddingPhotographyPageContent() {
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
      {...pageHero}
    >
      {service.pricing && service.pricing.length > 0 ? (
        <ServicePricingBlock
          tiers={service.pricing}
          serviceTitle={service.title}
          utmCampaignPrefix={service.utmCampaign}
        />
      ) : null}

      <div className="mx-auto max-w-[72rem] space-y-16 px-4 sm:px-6 lg:px-8">
        <ContextualIntroParagraph pathname="/photography/wedding" className="max-w-3xl" />
        <section className="max-w-3xl" aria-labelledby="photo-intro-heading">
          <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
            מחפשים צלם חתונות דתי ומקצועי? יקיר כהן מתמחה בצילום לאירועים
            קטנים  -  חתונה קטנה לא אומרת להתפשר על הזיכרונות. אתם פשוט תהיו
            אתם, והצלם ידאג שהתמונות יספרו את הסיפור האמיתי שלכם.
          </p>
        </section>

        <section aria-labelledby="why-photo-heading">
          <header className="mx-auto max-w-2xl text-center">
            <h2
              id="why-photo-heading"
              className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
            >
              למה לבחור צלם אירועים מאיתנו?
            </h2>
          </header>
          <ul className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {WEDDING_PHOTO_WHY_US.map((item) => (
              <li
                key={item}
                className="flex gap-3 rounded-xl border border-border bg-surface px-4 py-3 text-sm"
              >
                <span className="text-brand-red" aria-hidden>
                  ✓
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="max-w-3xl" aria-labelledby="pricing-note-heading">
          <h2
            id="pricing-note-heading"
            className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
          >
            כמה עולה צלם אירועים  -  מחירון שקוף
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            אני מאמין בשקיפות מלאה. אין מחירונים מבלבלים או תוספות נסתרות  -  מה
            שאתם רואים זה מה שמשלמים. כל המחירים כוללים מע״מ ועריכה בסיסית.
          </p>
          <p className="mt-3 text-sm text-muted-foreground">
            יש לכם אירוע מיוחד? נשמח להתאים חבילה אישית לפי תקציב וצרכים.
          </p>
        </section>

        <ServiceShowcaseSections
          assetsFolder={service.assetsFolder}
          playlistEmbedUrl={youtubeEmbedUrl(
            YOUTUBE_SERVICE_EMBED_IDS["photography-wedding"],
          )}
          mediaType="video"
          galleryLabel="צילום חתונות מהשטח"
          videoTitle="צילום חתונות ואירועים קטנים"
          videoHeadingId="portfolio-heading"
          videoHeading="תיק עבודות  -  הזמנת צלם + עריכה"
          videoDescription="וידאו וגלריית תמונות  -  נטען בלחיצה"
          footer={
            <RecordingSongExampleVideos videos={WEDDING_PHOTO_EXAMPLE_VIDEOS} />
          }
        />

        <section aria-labelledby="related-heading">
          <header className="mx-auto max-w-2xl text-center">
            <h2
              id="related-heading"
              className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
            >
              שירותים נוספים שאהבתם
            </h2>
          </header>
          <ul className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {WEDDING_PHOTO_RELATED.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="block h-full rounded-xl border border-border bg-surface p-5 transition-colors hover:border-brand-red/40"
                >
                  <h3 className="font-semibold text-foreground">{item.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {item.description}
                  </p>
                  <span className="mt-3 inline-block text-sm font-medium text-brand-red">
                    למידע נוסף ←
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        {service.faqs.length > 0 ? (
          <FAQAccordion
            items={[...service.faqs]}
            title="שאלות נפוצות על צילום חתונות"
            subtitle="הכל לפני שסוגרים תאריך"
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
            צרו קשר עכשיו לתיאום פגישה
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-sm text-muted-foreground">
            חייגו או שלחו בוואטסאפ  -  הצעת מחיר אישית תוך זמן קצר. טלפון:{" "}
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
