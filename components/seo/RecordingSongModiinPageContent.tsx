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
  RECORDING_SONG_EQUIPMENT,
  RECORDING_SONG_EXAMPLE_VIDEOS,
  RECORDING_SONG_FEATURED_VIDEO_ID,
  RECORDING_SONG_PROCESS_STEPS,
} from "@/lib/data/recording-song-modiin-page";
import { getStudioService } from "@/lib/data/services";
import {
  youtubeEmbedUrl,
  YOUTUBE_SERVICE_EMBED_IDS,
} from "@/lib/data/youtube-embeds";
import {
  CONTACT_PHONE_DISPLAY,
  CONTACT_PHONE_E164,
} from "@/lib/constants";

const service = getStudioService("recording-song-modiin");

const pageHero = resolveServicePageHeroFromEntity(service);

export default function RecordingSongModiinPageContent() {
  const featuredEmbed = youtubeEmbedUrl(
    YOUTUBE_SERVICE_EMBED_IDS["recording-song-modiin"],
  );

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
        <ContextualIntroParagraph pathname="/studio/recording-song-modiin" className="max-w-3xl" />
        <section className="max-w-3xl" aria-labelledby="audience-heading">
          <h2
            id="audience-heading"
            className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
          >
            למי זה מתאים?
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
            אם אתם רוצים להקליט שיר לאירוע מיוחד, שיר מתנה או פרויקט מוזיקלי  - 
            הגעתם למקום הנכון. לא משנה אם אתם זמרים מנוסים או מקליטים בפעם
            הראשונה  -  אנחנו מלווים אתכם מהשנייה הראשונה ועד התוצר המושלם.
          </p>
        </section>

        <section aria-labelledby="process-heading">
          <header className="mx-auto max-w-2xl text-center">
            <h2
              id="process-heading"
              className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
            >
              מה כולל התהליך?
            </h2>
          </header>
          <ol className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {RECORDING_SONG_PROCESS_STEPS.map((item) => (
              <li
                key={item.step}
                className="rounded-xl border border-border bg-surface p-6"
              >
                <span className="text-xs font-bold tracking-widest text-brand-red">
                  {item.step}
                </span>
                <h3 className="mt-3 text-base font-semibold text-foreground">
                  {item.title}
                </h3>
                {item.paragraphs.map((paragraph) => (
                  <p
                    key={paragraph}
                    className="mt-2 text-sm leading-relaxed text-muted-foreground"
                  >
                    {paragraph}
                  </p>
                ))}
              </li>
            ))}
          </ol>
        </section>

        <section aria-labelledby="equipment-heading">
          <header className="mx-auto max-w-2xl text-center">
            <h2
              id="equipment-heading"
              className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
            >
              הציוד שלנו
            </h2>
          </header>
          <ul className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2">
            {RECORDING_SONG_EQUIPMENT.map((item) => (
              <li
                key={item.title}
                className="rounded-xl border border-border bg-surface p-6"
              >
                <p className="text-2xl" aria-hidden>
                  {item.emoji}
                </p>
                <h3 className="mt-3 text-base font-semibold text-foreground">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {item.description}
                </p>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-center text-xs text-muted-foreground">
            כל המחירים כולל מע״מ. ניתן לשלם בצ׳ק, אשראי, העברה בנקאית או
            PayPal.
          </p>
        </section>

        <ServiceShowcaseSections
          assetsFolder={service.assetsFolder}
          playlistEmbedUrl={featuredEmbed}
          mediaType="video"
          galleryLabel="הקלטת שיר במודיעין"
          videoTitle="הקלטת שיר לחתונה"
          videoSectionId="examples"
          videoHeadingId="featured-video-heading"
          videoHeading="דוגמאות מהאולפן"
          videoDescription="שמעו איך זה נשמע  -  שיר לחתונה, מתנות, ברכות ועוד."
          footer={
            <RecordingSongExampleVideos
              videos={RECORDING_SONG_EXAMPLE_VIDEOS.filter(
                (v) => v.videoId !== RECORDING_SONG_FEATURED_VIDEO_ID,
              )}
            />
          }
        />

        <section
          className="rounded-xl border border-brand-red/25 bg-surface p-6 sm:p-8"
          aria-labelledby="smartphone-blessing-heading"
        >
          <p className="text-xs font-bold uppercase tracking-widest text-brand-red">
            חדש
          </p>
          <h2
            id="smartphone-blessing-heading"
            className="mt-2 text-xl font-semibold text-foreground sm:text-2xl"
          >
            הקלטת דרשה / ברכה בסמארטפון
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
            הקלטה מהבית + עריכה מקצועית + מוזיקת רקע. ברכת כלה או חתן, ברכת
            הכהנים לבר/בת מצווה, דרשה מרגשת או ברכות משפחה  -  אפשר להקליט גם
            בבית, אבל הקלטה באולפן מקצועי היא רמה אחרת: תוצאה חדה, מרגשת
            ומקצועית שתהפוך את הרגע באירוע לבלתי נשכח.
          </p>
          <ul className="mt-4 flex flex-wrap gap-2 text-xs font-medium text-muted-foreground">
            {[
              "ברכת כלה",
              "ברכת חתן",
              "דרשה",
              "ברכות משפחה",
            ].map((tag) => (
              <li
                key={tag}
                className="rounded-full border border-border bg-background px-3 py-1"
              >
                {tag}
              </li>
            ))}
          </ul>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/studio/blessings/bride-groom-blessing"
              className="rounded-full border border-border bg-background px-4 py-2 text-sm font-medium hover:border-brand-red/40 hover:text-brand-red"
            >
              ברכת חתן וכלה
            </Link>
            <Link
              href="/studio/recording-song-modiin/gifts"
              className="rounded-full border border-border bg-background px-4 py-2 text-sm font-medium hover:border-brand-red/40 hover:text-brand-red"
            >
              מתנות ושוברים מהאולפן
            </Link>
            <Link
              href="/studio/blessings/bar-mitzvah"
              className="rounded-full border border-border bg-background px-4 py-2 text-sm font-medium hover:border-brand-red/40 hover:text-brand-red"
            >
              בר מצווה
            </Link>
          </div>
        </section>

        <section
          className="rounded-xl border border-border bg-surface p-6 text-sm text-muted-foreground"
          aria-labelledby="hours-heading"
        >
          <h2 id="hours-heading" className="font-semibold text-foreground">
            שעות פעילות
          </h2>
          <ul className="mt-3 space-y-2">
            <li>
              מענה טלפוני במשרדים: א׳–ה׳ 10:00–20:00  - {" "}
              <a
                href={`tel:${CONTACT_PHONE_E164}`}
                className="font-medium text-brand-red hover:underline"
              >
                {CONTACT_PHONE_DISPLAY}
              </a>{" "}
              (גם בוואטסאפ)
            </li>
            <li>שעות האולפנים: א׳–ה׳ 10:00–22:00 | ו׳ 10:00–15:00</li>
          </ul>
        </section>

        {service.faqs.length > 0 ? (
          <FAQAccordion
            items={[...service.faqs]}
            title="שאלות ותשובות"
            subtitle="לפני שמתחילים להקליט"
            className="py-0"
          />
        ) : null}

        <section className="flex flex-wrap justify-center gap-3 pb-4">
          <Link
            href="/studio/blessings/video-clip"
            className="rounded-full border border-border bg-surface px-4 py-2 text-sm font-medium hover:border-brand-red/40 hover:text-brand-red"
          >
            שיר + קליפ באולפן
          </Link>
          <Link
            href="/voucher"
            className="rounded-full border border-border bg-surface px-4 py-2 text-sm font-medium hover:border-brand-red/40 hover:text-brand-red"
          >
            שובר מתנה
          </Link>
          <Link
            href="/book"
            className="rounded-full bg-brand-red px-4 py-2 text-sm font-semibold text-white hover:bg-brand-red-light"
          >
            הזמנה מקוונת
          </Link>
        </section>
              <PageRelatedFooter pathname="/studio/recording-song-modiin" />

            </div>
    </ServicePageLayout>
  );
}
