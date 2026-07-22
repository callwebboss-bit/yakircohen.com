import Link from "next/link";
import ServiceBlogStrip from "@/components/blog/ServiceBlogStrip";
import { getBlogPostsByServiceSlug } from "@/lib/data/blog";
import MobileStudioExampleVideos from "@/components/seo/MobileStudioExampleVideos";
import BusinessCrossLink from "@/components/marketing/BusinessCrossLink";
import FAQAccordion from "@/components/ui/FAQAccordion";
import ServicePageLayout from "@/components/services/ServicePageLayout";
import PageRelatedFooter from "@/components/seo/PageRelatedFooter";
import { resolveServicePageHeroFromEntity } from "@/lib/service-portfolio-hero";
import { withServicePageHeroDefaults } from "@/lib/service-page-ui";
import {
  MOBILE_STUDIO_AUDIENCE,
  MOBILE_STUDIO_CHECKLIST,
  MOBILE_STUDIO_CLIP_FEATURES,
  MOBILE_STUDIO_EXAMPLE_VIDEOS,
  MOBILE_STUDIO_HIGHLIGHTS,
  MOBILE_STUDIO_WHATS_INCLUDED,
} from "@/lib/data/mobile-studio-page";
import {
  calcMobileStudioExVat,
  MOBILE_GEO_FEES,
  MOBILE_STUDIO_BASE_EX_VAT,
  type MobileGeoId,
} from "@/lib/data/mobile-studio-booking";
import { PRICING_FRAMING_LINE } from "@/lib/data/conversion-copy";
import { getStudioService } from "@/lib/data/services";
import {
  CONTACT_PHONE_DISPLAY,
  CONTACT_PHONE_E164,
} from "@/lib/constants";
import { buildServiceWhatsAppText, buildWhatsAppHref } from "@/lib/whatsapp";

const service = getStudioService("studio-mobile-studio");
const pageHero = resolveServicePageHeroFromEntity(service);
const heroProps = withServicePageHeroDefaults(pageHero);

const MOBILE_STUDIO_CTA_LABEL = `אולפן נייד החל מ-${MOBILE_STUDIO_BASE_EX_VAT.toLocaleString("he-IL")} ₪`;
const MOBILE_STUDIO_VALUE_FRAME = `החל מ-${MOBILE_STUDIO_BASE_EX_VAT.toLocaleString("he-IL")} ₪ לפני מע״מ + תוספת אזור לפי מיקום`;
const MOBILE_STUDIO_STARTING_PRICE = `${MOBILE_STUDIO_BASE_EX_VAT.toLocaleString("he-IL")} ₪ לפני מע״מ`;

const MOBILE_GEO_ORDER: readonly MobileGeoId[] = [
  "center",
  "north_south",
  "eilat",
];

export default function MobileStudioPageContent() {
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
      pagePath="/studio/mobile-studio"
      faqs={service.faqs}
      {...heroProps}
      ctaLabel={MOBILE_STUDIO_CTA_LABEL}
      valueFrame={MOBILE_STUDIO_VALUE_FRAME}
      startingPrice={MOBILE_STUDIO_STARTING_PRICE}
    >
      <div className="mx-auto max-w-[72rem] space-y-16 px-4 sm:px-6 lg:px-8">
        <section
          className="rounded-xl border border-brand-red/25 bg-surface p-6 sm:p-8"
          aria-labelledby="mobile-studio-pricing-heading"
        >
          <h2
            id="mobile-studio-pricing-heading"
            className="font-serif text-lg font-semibold text-foreground sm:text-xl"
          >
            מחיר אולפן נייד
          </h2>
          <p className="mt-3 text-base font-semibold text-foreground">
            בסיס: {MOBILE_STUDIO_BASE_EX_VAT.toLocaleString("he-IL")} ₪ לפני מע״מ
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            {PRICING_FRAMING_LINE}
          </p>
          <ul className="mt-5 space-y-2 text-sm text-muted-foreground">
            {MOBILE_GEO_ORDER.map((geoId) => {
              const geo = MOBILE_GEO_FEES[geoId];
              const total = calcMobileStudioExVat(geoId);
              return (
                <li key={geoId} className="flex flex-wrap gap-x-2 gap-y-1">
                  <span className="font-medium text-foreground">{geo.label}</span>
                  <span>
                    {geo.fee === 0
                      ? `ללא תוספת הגעה - ${total.toLocaleString("he-IL")} ₪ לפני מע״מ`
                      : `+${geo.fee.toLocaleString("he-IL")} ₪ תוספת הגעה - סה״כ ${total.toLocaleString("he-IL")} ₪ לפני מע״מ`}
                  </span>
                  <span className="text-muted-foreground/80">({geo.detail})</span>
                </li>
              );
            })}
          </ul>
        </section>

        <BusinessCrossLink
          title="צריכים אולפן בחדר ישיבות?"
          text="לחברות: אולפן נייד עם 2 מצלמות ומיקרופונים. יום צילום במשרד, בלי שהצוות ינסע."
          href="/business/on-site-studio"
          linkLabel="אולפן זמני בחברה"
        />

        <ul className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {MOBILE_STUDIO_HIGHLIGHTS.map((item) => (
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

        <section aria-labelledby="mobile-studio-video-heading">
          <header className="mx-auto max-w-2xl text-center">
            <h2
              id="mobile-studio-video-heading"
              className="font-serif text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
            >
              דוגמאות מהשטח
            </h2>
          </header>
          <MobileStudioExampleVideos videos={MOBILE_STUDIO_EXAMPLE_VIDEOS} />
        </section>

        <section className="max-w-3xl" aria-labelledby="acoustics-heading">
          <h2
            id="acoustics-heading"
            className="font-serif text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
          >
            איך זה עובד? הסוד הוא באקוסטיקה
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
            רבים שואלים: &quot;איך החדר שלי יהפוך לאולפן?&quot; התשובה טמונה
            בציוד. אנחנו מגיעים עם פנלים אקוסטיים ניידים, מסכי בידוד למיקרופונים
            (Shields) וציוד קצה - כרטיסי קול ומיקרופונים מהשורה הראשונה.
          </p>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
            תוך פחות מ-30 דקות, כל חלל שקט הופך לסביבת הקלטה מקצועית עם מינימום
            רעשי רקע ומקסימום דיוק מוזיקלי.
          </p>
        </section>

        <section aria-labelledby="checklist-heading">
          <header className="mx-auto max-w-2xl text-center">
            <h2
              id="checklist-heading"
              className="font-serif text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
            >
              צ׳ק-ליסט: מה להכין?
            </h2>
          </header>
          <ul className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2">
            {MOBILE_STUDIO_CHECKLIST.map((item) => (
              <li
                key={item.title}
                className="rounded-xl border border-border bg-surface p-6"
              >
                <h3 className="text-base font-semibold text-foreground">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {item.description}
                </p>
              </li>
            ))}
          </ul>
        </section>

        <section className="max-w-3xl" aria-labelledby="mobile-intro-heading">
          <h2
            id="mobile-intro-heading"
            className="font-serif text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
          >
            אולפן נייד: הפקה שמגיעה עד לפתח הבית
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
            אין צורך לבזבז שעות בדרכים לאולפן. שירות האולפן הנייד נולד למי
            שרוצה להקליט שיר או קליפ בסביבה הטבעית - בבית, במשרד, בבית הספר או
            במרכז קהילתי. אנחנו מביאים את הטכנולוגיה והניסיון של האולפן
            המקצועי אליכם, בלי להתפשר על איכות הסאונד.
          </p>
        </section>

        <section aria-labelledby="audience-heading">
          <header className="mx-auto max-w-2xl text-center">
            <h2
              id="audience-heading"
              className="font-serif text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
            >
              למי מתאים שירות האולפן הנייד?
            </h2>
          </header>
          <ul className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-3">
            {MOBILE_STUDIO_AUDIENCE.map((item) => (
              <li
                key={item.title}
                className="rounded-xl border border-border bg-surface p-6"
              >
                <h3 className="text-base font-semibold text-foreground">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {item.description}
                </p>
              </li>
            ))}
          </ul>
        </section>

        <section
          className="rounded-xl border border-border bg-surface p-6 sm:p-8"
          aria-labelledby="included-heading"
        >
          <h2
            id="included-heading"
            className="font-serif text-lg font-semibold text-foreground sm:text-xl"
          >
            מה מגיע איתנו?
          </h2>
          <ul className="mt-4 grid grid-cols-1 gap-2 text-sm text-muted-foreground sm:grid-cols-2">
            {MOBILE_STUDIO_WHATS_INCLUDED.map((item) => (
              <li key={item} className="flex gap-2">
                <span className="text-brand-red" aria-hidden>
                  •
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        <section
          className="rounded-xl border border-brand-red/20 bg-surface p-6 sm:p-8"
          aria-labelledby="clip-addon-heading"
        >
          <h2
            id="clip-addon-heading"
            className="font-serif text-lg font-semibold text-foreground sm:text-xl"
          >
            רוצים גם קליפ? אפשרי
          </h2>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            {MOBILE_STUDIO_CLIP_FEATURES.map((item) => (
              <li key={item} className="flex gap-2">
                <span className="text-brand-red" aria-hidden>
                  •
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <Link
            href="/studio/blessings/video-clip"
            className="mt-5 inline-block text-sm font-semibold text-brand-red hover:underline"
          >
            שיר + קליפ באולפן </Link>
        </section>

        <section
          className="rounded-xl border border-border bg-surface p-6 sm:p-8"
          aria-labelledby="smartphone-clip-heading"
        >
          <h2
            id="smartphone-clip-heading"
            className="font-serif text-lg font-semibold text-foreground sm:text-xl"
          >
            פתרון נוסף: קליפ מסמארטפון
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            לא מסתדר שנגיע? אתם מצלמים ומקליטים בעצמכם - ואנחנו עורכים הכול
            לקליפ מקצועי. מתאים למשפחות, כיתות וקבוצות חברים.
          </p>
          <Link
            href="/studio/blessings#home-recording"
            className="mt-4 inline-block text-sm font-semibold text-brand-red hover:underline"
          >
            ברכות והקלטה מהבית </Link>
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
              מענה טלפוני במשרדים: א׳-ה׳ 10:00-20:00 -{" "}
              <a
                href={`tel:${CONTACT_PHONE_E164}`}
                className="font-medium text-brand-red hover:underline"
              >
                {CONTACT_PHONE_DISPLAY}
              </a>{" "}
              (גם בוואטסאפ)
            </li>
            <li>שעות האולפנים: א׳-ה׳ 10:00-22:00 | ו׳ 10:00-15:00</li>
          </ul>
        </section>

        {service.faqs.length > 0 ? (
          <FAQAccordion
            items={[...service.faqs]}
            title="שאלות ותשובות"
            subtitle="לפני שמזמינים אולפן נייד"
            className="py-0"
          />
        ) : null}

        <section className="flex flex-wrap justify-center gap-3">
          <Link
            href="/studio/recording-song-modiin"
            className="rounded-full border border-border bg-surface px-4 py-2 text-sm font-medium hover:border-brand-red/40 hover:text-brand-red"
          >
            הקלטה במודיעין
          </Link>
          <Link
            href="/studio/blessings"
            className="rounded-full border border-border bg-surface px-4 py-2 text-sm font-medium hover:border-brand-red/40 hover:text-brand-red"
          >
            ברכות מוקלטות
          </Link>
          <Link
            href="/book"
            className="rounded-full border border-border bg-surface px-4 py-2 text-sm font-medium hover:border-brand-red/40 hover:text-brand-red"
          >
            הזמנה מקוונת
          </Link>
        </section>

        <section
          className="rounded-xl border border-brand-red/25 bg-surface px-6 py-10 text-center sm:px-10"
          aria-labelledby="mobile-cta-heading"
        >
          <h2
            id="mobile-cta-heading"
            className="font-serif text-xl font-semibold text-foreground sm:text-2xl"
          >
            בדקו זמינות לאולפן נייד
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-muted-foreground">
            שלחו מיקום ותאריך בוואטסאפ - נחזור עם זמינות לפי האזור שלכם.
          </p>
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex min-h-12 items-center justify-center rounded-md bg-brand-red px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-red-light"
          >
            {MOBILE_STUDIO_CTA_LABEL}
          </a>
        </section>
        <PageRelatedFooter pathname="/studio/mobile-studio" className="mt-10" />
        <ServiceBlogStrip posts={getBlogPostsByServiceSlug("studio/mobile-studio")} />
      </div>
    </ServicePageLayout>
  );
}
