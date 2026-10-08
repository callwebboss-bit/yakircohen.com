import Image from "next/image";
import ContextualIntroParagraph from "@/components/seo/ContextualIntroParagraph";
import PageRelatedFooter from "@/components/seo/PageRelatedFooter";
import ServiceHubLinks from "@/components/services/ServiceHubLinks";
import Link from "next/link";
import { GoogleReviews } from "@/components/marketing/SocialProofWidgets";
import CalculatorDisclosure from "@/components/calculators/CalculatorDisclosure";
import { PodcastCalculatorLazy } from "@/components/calculators/lazy";
import ShowcaseVideoSection from "@/components/seo/ShowcaseVideoSection";
import PodcastSpotifySample from "@/components/seo/PodcastSpotifySample";
import FAQAccordion from "@/components/ui/FAQAccordion";
import ServicePageLayout from "@/components/services/ServicePageLayout";
import ServiceShowcaseSections from "@/components/services/ServiceShowcaseSections";
import { resolvePodcastFolderHero } from "@/lib/service-portfolio-hero";
import { withServicePageHeroDefaults } from "@/lib/service-page-ui";
import { PODCAST_SHOWCASE_VIDEOS } from "@/lib/data/youtube-showcases";
import {
  STUDIO_MODIIN_FAQS,
  STUDIO_MODIIN_HERO_FEATURES,
  STUDIO_MODIIN_HERO_IMAGE,
  STUDIO_MODIIN_PRICE_CARDS,
  STUDIO_MODIIN_PRICES_HEADING,
  STUDIO_MODIIN_RELATED_SERVICES,
  STUDIO_MODIIN_RENTAL,
  STUDIO_MODIIN_WHY_US,
} from "@/lib/data/podcast-studio-modiin-page";
import { mapEmojiLinkToHub } from "@/lib/data/studio-hub-mappers";
import {
  youtubeEmbedUrl,
  YOUTUBE_SERVICE_EMBED_IDS,
} from "@/lib/data/youtube-embeds";
import { buildServiceWhatsAppText, buildWhatsAppHref } from "@/lib/whatsapp";
import { TIME_CLAIMS } from "@/lib/data/conversion-copy";
import { PODCAST_STUDIO_MODIIN_EXISTS_FAQ } from "@/lib/data/faq-aeo";

const STUDIO_MODIIN_TITLE = "השכרת סטודיו לפודקאסט במודיעין";

const pageHero = resolvePodcastFolderHero(
  STUDIO_MODIIN_TITLE,
  youtubeEmbedUrl(YOUTUBE_SERVICE_EMBED_IDS["podcast-example-1"]),
);
const heroProps = withServicePageHeroDefaults(pageHero);

export default function PodcastStudioModiinPageContent() {
  const whatsappHref = buildWhatsAppHref({
    text: buildServiceWhatsAppText(
      "שלום, מעוניין/ת בהשכרת סטודיו לפודקאסט במודיעין. אשמח לשמוע על זמינות ומחיר.",
    ),
    utm_source: "website",
    utm_campaign: "podcast_studio_modiin_cta",
  });

  return (
    <ServicePageLayout
      title="השכרת סטודיו לפודקאסט במודיעין"
      /* העמוד על השכרת האולפן, לא על קריינות. העובדות מתשובה 8 של הבעלים
         (תשובות הבעלים 8.10.2026): נקי, שקט, נוח, אזור נגיש, חניה בשפע */
      subtitle={`אולפן נקי, שקט ונוח, באזור נגיש עם חניה בשפע. ציוד מתקדם, ליווי טכני מלא וקביעת מקום ${TIME_CLAIMS.quoteHour}.`}
      features={STUDIO_MODIIN_HERO_FEATURES}
      whatsappText="שלום, מעוניין בהשכרת סטודיו לפודקאסט במודיעין"
      utmCampaign="podcast_studio_modiin"
      corporateShareLabel="השכרת אולפן פודקאסט במודיעין"
      bookSlug="podcast/podcast-studio-modiin"
      ctaLabel={`קביעת מקום, ${TIME_CLAIMS.quoteHour}`}
      pagePath="/podcast/podcast-studio-modiin"
      faqs={STUDIO_MODIIN_FAQS}
      aeoAnswer={{
        id: "aeo-answer-podcast-studio-modiin",
        question: PODCAST_STUDIO_MODIIN_EXISTS_FAQ.question,
        text: PODCAST_STUDIO_MODIIN_EXISTS_FAQ.answer,
        utmCampaign: "aeo_q4",
      }}
      {...heroProps}
    >
      <div className="mx-auto max-w-[72rem] space-y-16 px-4 sm:px-6 lg:px-8">
        <ContextualIntroParagraph pathname="/podcast/podcast-studio-modiin" className="max-w-3xl" />

        {/* "להשכרה" לא הופיע בעמוד. האולפן והציוד במילים של הבעלים
            (תשובות הבעלים 8.10.2026, תשובות 7 ו-8) */}
        <section aria-labelledby="studio-rental-heading" className="max-w-3xl">
          <h2
            id="studio-rental-heading"
            className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
          >
            {STUDIO_MODIIN_RENTAL.heading}
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
            {STUDIO_MODIIN_RENTAL.body}
          </p>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
            <span className="font-semibold text-foreground">
              {STUDIO_MODIIN_RENTAL.equipmentLabel}:
            </span>{" "}
            {STUDIO_MODIIN_RENTAL.equipment}
          </p>
        </section>

        <ShowcaseVideoSection
          heading="דוגמאות מהסטודיו במודיעין"
          subheading="פודקאסטים שהוקלטו אצלנו - לחצו לצפייה"
          videos={PODCAST_SHOWCASE_VIDEOS}
          initialVisible={3}
        />

        <PodcastSpotifySample />

        <section className="grid gap-8 lg:grid-cols-2 lg:items-center">
          <div className="max-w-xl">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-red">
              יקיר כהן הפקות - מודיעין
            </p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              ההקלטה המקצועית שהתוכן שלכם ראוי לה
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
              יש לכם משהו בראש, וצריך מישהו שיוציא אותו לפועל. מלווים אתכם
              מרגע יצירת הקשר ובלי התחייבות, כדי להבין יחד מה אתם רוצים ומה
              אתם באמת צריכים, ועד שההקלטה והצילום מוכנים.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              לא משנה באיזה שלב אתם: בלי רעיון, עם רעיון, או עם הכל מוכן וצריך
              רק לבצע. גם אם רק חשבתם לפתח את השיווק שלכם דרך תוכן, זה המקום
              להתחיל. האולפן נמצא במודיעין, ומגיעים אליו גם מירושלים ומתל אביב.
            </p>
            <p className="mt-3 text-sm text-muted-foreground">
              הקלטה ביתית נוחה, אבל כדי להישמע ברמת ספוטיפיי או Apple Podcasts
              צריך את התנאים הנכונים.
            </p>
          </div>
          <figure className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-border bg-surface">
            <Image
              src={STUDIO_MODIIN_HERO_IMAGE.src}
              alt={STUDIO_MODIIN_HERO_IMAGE.alt}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
              loading="lazy"
              decoding="async"
            />
            <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-4 py-3 text-xs text-white/90">
              {STUDIO_MODIIN_HERO_IMAGE.alt}
            </figcaption>
          </figure>
        </section>

        <section aria-labelledby="why-studio-heading">
          <header className="mx-auto max-w-2xl text-center">
            <h2
              id="why-studio-heading"
              className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
            >
              למה בוחרים בסטודיו שלנו?
            </h2>
          </header>
          <ul className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {STUDIO_MODIIN_WHY_US.map((item) => (
              <li
                key={item}
                className="flex gap-3 rounded-xl border border-border bg-surface px-4 py-3 text-sm leading-relaxed"
              >
                <span className="shrink-0 text-brand-red" aria-hidden>
                  ✓
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        <ServiceHubLinks
          heading="מעבר להשכרת סטודיו - שירותי הפקה מלאים"
          subheading="ההקלטה היא רק ההתחלה. כדי שהפודקאסט יגיע לקהל רחב:"
          links={STUDIO_MODIIN_RELATED_SERVICES.map(mapEmojiLinkToHub)}
          headingId="related-services-heading"
          columns={2}
        />

        <ServiceShowcaseSections
          assetsFolder="podcast"
          playlistEmbedUrl={null}
          mediaType="gallery"
          galleryLabel="תמונות מהסטודיו"
        />

        {/* המחירים גלויים לפני המחשבון: וידאו ראשון, אודיו כאפשרות, וחצי שעה
            עם מה שמקבלים (תשובות הבעלים 8.10.2026, תשובות 5 ו-6) */}
        <section aria-labelledby="studio-prices-heading">
          <header className="mx-auto max-w-2xl text-center">
            <h2
              id="studio-prices-heading"
              className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
            >
              {STUDIO_MODIIN_PRICES_HEADING}
            </h2>
          </header>
          <ul className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
            {STUDIO_MODIIN_PRICE_CARDS.map((card) => (
              <li
                key={card.id}
                data-price-id={card.id}
                className={`flex flex-col rounded-xl bg-surface p-5 ${
                  card.primary ? "border-2 border-brand-red/40" : "border border-border"
                }`}
              >
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-base font-semibold text-foreground">{card.name}</h3>
                  {card.badge ? (
                    <span className="rounded-full bg-brand-red px-2.5 py-0.5 text-xs font-bold text-white">
                      {card.badge}
                    </span>
                  ) : null}
                </div>
                <p className="mt-3 text-xl font-bold text-brand-red">{card.price.headline}</p>
                <p className="text-xs text-muted-foreground">{card.price.vatNote}</p>
                <ul className="mt-4 space-y-1.5 text-sm text-muted-foreground">
                  {card.lines.map((line) => (
                    <li key={line} className="flex gap-2">
                      <span className="shrink-0 text-brand-red" aria-hidden>
                        ✓
                      </span>
                      {line}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </section>

        <CalculatorDisclosure
          title="מחירון והשכרת סטודיו"
          description={
            <>
    המחיר משתנה לפי משך ההקלטה ושירותים נלווים. בחרו חבילה ושלחו
    סיכום בוואטסאפ, או{" "}
    <Link href="/podcast" className="font-medium text-brand-red hover:underline">
    לעמוד הפודקאסט המלא
    </Link>
    .
            </>
          }
          buttonLabel="פתחו מחשבון והמשיכו לוואטסאפ"
        >
          <PodcastCalculatorLazy className="mt-8" />
        </CalculatorDisclosure>

        <FAQAccordion
          items={[...STUDIO_MODIIN_FAQS]}
          defaultOpenId={PODCAST_STUDIO_MODIIN_EXISTS_FAQ.id}
          title="שאלות נפוצות, השכרת סטודיו לפודקאסט"
          className="py-0"
        />

        <section
          className="rounded-2xl border border-border bg-surface p-8 text-center"
          aria-labelledby="studio-cta-heading"
        >
          <h2
            id="studio-cta-heading"
            className="text-xl font-semibold text-foreground sm:text-2xl"
          >
            מוכנים להקליט? קביעת מקום, {TIME_CLAIMS.quoteHour}
          </h2>
          {/* היה "קול אנושי, לא AI-רובוטי", שלא קשור להשכרת אולפן. עכשיו עובדות
              מתשובה 8 (תשובות הבעלים 8.10.2026): שקט, נוח, מסודר, ויותר מ-20
              שנות ניסיון, לא "אולפן שקיים 20 שנה" (העסק נפתח ב-2010) */}
          <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-muted-foreground">
            אל תתנו לציוד לא מתאים או לרעשי רקע לפגוע בתוכן. אצלנו מקליטים
            באולפן שקט, נוח ומסודר.
          </p>
          <ul className="mx-auto mt-5 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
            {[
              `קביעת מקום, ${TIME_CLAIMS.quoteHour}`,
              "יותר מ-20 שנות ניסיון",
              "ליווי טכני מלא",
            ].map((item) => (
              <li key={item} className="flex items-center gap-1.5">
                <span className="font-semibold text-brand-red" aria-hidden>✓</span>
                {item}
              </li>
            ))}
          </ul>
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-7 inline-flex items-center gap-2 rounded-xl bg-brand-red px-7 py-3 text-sm font-semibold text-white hover:bg-brand-red-light"
          >
            קבע מקום עכשיו. {TIME_CLAIMS.podcastSameSecond}</a>
        </section>

        <GoogleReviews
          heading="ראו מה לקוחות אומרים עלינו"
          subheading="ביקורות Google מאומתות"
        />
              <PageRelatedFooter pathname="/podcast/podcast-studio-modiin" />

            </div>
    </ServicePageLayout>
  );
}
