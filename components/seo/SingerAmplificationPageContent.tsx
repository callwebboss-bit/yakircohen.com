import Link from "next/link";
import ContextualIntroParagraph from "@/components/seo/ContextualIntroParagraph";
import ShowcaseVideoSection from "@/components/seo/ShowcaseVideoSection";
import PageRelatedFooter from "@/components/seo/PageRelatedFooter";
import FAQAccordion from "@/components/ui/FAQAccordion";
import ServicePageLayout from "@/components/services/ServicePageLayout";
import { buildBookHref } from "@/lib/book-url";
import type { SingerPackageId } from "@/lib/data/singer-amplification-page";
import {
  SERVICE_SHOWCASE_VIDEO_ID,
  resolveServicePageHeroFromEntity,
} from "@/lib/service-portfolio-hero";
import { withServicePageHeroDefaults } from "@/lib/service-page-ui";
import {
  SINGER_ADDONS,
  SINGER_PACKAGES,
  SINGER_PROCESS,
  SINGER_TRAVEL_NOTE,
  SINGER_VALUE_POINTS,
  SINGER_WHY_BLOCKS,
} from "@/lib/data/singer-amplification-page";
import { getEventsService } from "@/lib/data/services";
import { SINGER_AMPLIFICATION_VIDEOS } from "@/lib/data/youtube-showcases";
import {
  CONTACT_PHONE_DISPLAY,
  CONTACT_PHONE_E164,
} from "@/lib/constants";
import { buildServiceWhatsAppText, buildWhatsAppHref } from "@/lib/whatsapp";

const service = getEventsService("events-singer-amplification");

const pageHero = resolveServicePageHeroFromEntity(service, undefined, {
  videoSectionId: SERVICE_SHOWCASE_VIDEO_ID,
});
const heroProps = withServicePageHeroDefaults(pageHero);

export default function SingerAmplificationPageContent() {
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
        <ContextualIntroParagraph pathname="/events/equipment/singer-amplification" className="max-w-3xl" />

        <ShowcaseVideoSection
          sectionId={SERVICE_SHOWCASE_VIDEO_ID}
          heading="הגברה לזמרים בשטח"
          subheading="דוגמה מהאירוע - ציוד מקצועי והקמה מהירה. הוידאו נטען בלחיצה."
          videos={SINGER_AMPLIFICATION_VIDEOS}
        />

        <section className="max-w-3xl" aria-labelledby="singer-intro-heading">
          <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
            בטן, לחץ, מחשבות על המיקרופון  -  אם הסאונד לא טוב, כל החזרות יורדות
            לטמיון. אנחנו כאן לראש שקט: תשמעו את עצמכם מצוין, הציוד יעבוד,
            ותתרכזו רק בהופעה.
          </p>
        </section>

        <section aria-labelledby="why-singer-heading">
          <header className="mx-auto max-w-2xl text-center">
            <h2
              id="why-singer-heading"
              className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
            >
              למה זמרים בוחרים בנו?
            </h2>
          </header>
          <ul className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
            {SINGER_WHY_BLOCKS.map((block) => (
              <li
                key={block.title}
                className="rounded-xl border border-border bg-surface p-6"
              >
                <p className="text-2xl" aria-hidden>
                  {block.emoji}
                </p>
                <h3 className="mt-2 font-semibold text-foreground">
                  {block.title}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {block.description}
                </p>
                {block.bullets ? (
                  <ul className="mt-3 space-y-1 text-sm text-muted-foreground">
                    {block.bullets.map((b) => (
                      <li key={b}>• {b}</li>
                    ))}
                  </ul>
                ) : null}
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="packages-detail-heading">
          <header className="mx-auto max-w-2xl text-center">
            <h2
              id="packages-detail-heading"
              className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
            >
              החבילות  -  בחרו מה שמתאים
            </h2>
            <p className="mt-3 text-sm text-muted-foreground">
              מחירים גלויים · שינויים אפשריים במעמד העסקה
            </p>
          </header>
          <ul className="mt-10 space-y-8">
            {SINGER_PACKAGES.map((pkg) => {
              const packageLabel = `${pkg.name} (${pkg.price})`;
              const packageWhatsappHref = buildWhatsAppHref({
                text: buildServiceWhatsAppText(
                  `${service.whatsappText} - ${packageLabel}`,
                ),
                utm_source: "website",
                utm_campaign: `${service.utmCampaign}_pkg_${pkg.id}`,
              });

              return (
              <li
                key={pkg.id}
                className={`flex flex-col rounded-xl border bg-surface p-6 sm:p-8 ${
                  pkg.badge
                    ? "border-2 border-brand-red/40"
                    : "border-border"
                }`}
              >
                <div className="flex flex-wrap items-center gap-3">
                  <h3 className="text-lg font-semibold text-foreground">
                    {pkg.name}
                  </h3>
                  {pkg.badge ? (
                    <span className="rounded-full bg-brand-red px-2.5 py-0.5 text-xs font-bold text-white">
                      {pkg.badge}
                    </span>
                  ) : null}
                  <span className="text-xl font-bold text-brand-red">
                    {pkg.price}
                  </span>
                </div>
                <ul className="mt-4 flex-1 space-y-1.5 text-sm text-muted-foreground">
                  {pkg.includes.map((line) => (
                    <li key={line} className="flex gap-2">
                      <span className="text-brand-red" aria-hidden>
                        ✓
                      </span>
                      {line}
                    </li>
                  ))}
                </ul>
                <p className="mt-4 text-sm font-medium text-foreground">
                  מתאים ל: {pkg.suitedFor}
                </p>
                <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                  <a
                    href={packageWhatsappHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex w-full items-center justify-center rounded-md bg-brand-red px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-red-light focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red sm:w-auto"
                    aria-label={`הזמנת ${pkg.name} בוואטסאפ`}
                  >
                    הזמנה בוואטסאפ
                  </a>
                  <Link
                    href={buildBookHref("singer", pkg.id as SingerPackageId)}
                    className="inline-flex w-full items-center justify-center rounded-md border border-border bg-background px-4 py-2.5 text-sm font-semibold text-foreground transition-colors hover:border-brand-red/40 hover:text-brand-red focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red sm:w-auto"
                    aria-label={`הזמנה מקוונת - ${pkg.name}`}
                  >
                    הזמנה מקוונת
                  </Link>
                </div>
              </li>
              );
            })}
          </ul>
        </section>

        <section aria-labelledby="addons-heading">
          <header className="mx-auto max-w-2xl text-center">
            <h2
              id="addons-heading"
              className="text-xl font-semibold text-foreground"
            >
              תוספות
            </h2>
          </header>
          <ul className="mx-auto mt-6 grid max-w-lg grid-cols-1 gap-2">
            {SINGER_ADDONS.map((addon) => (
              <li
                key={addon.name}
                className="flex justify-between rounded-lg border border-border bg-surface px-4 py-2.5 text-sm"
              >
                <span>{addon.name}</span>
                <span className="font-semibold text-brand-red">
                  {addon.price}
                </span>
              </li>
            ))}
          </ul>
        </section>

        <section className="max-w-3xl" aria-labelledby="value-heading">
          <h2
            id="value-heading"
            className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
          >
            למה המחיר שווה כל שקל?
          </h2>
          <p className="mt-4 text-sm text-muted-foreground">
            לא משלמים רק על רמקולים  -  משלמים על ביטוח להופעה:
          </p>
          <ul className="mt-4 space-y-2">
            {SINGER_VALUE_POINTS.map((point) => (
              <li
                key={point}
                className="flex gap-2 text-sm text-muted-foreground"
              >
                <span className="text-brand-red" aria-hidden>
                  ✓
                </span>
                {point}
              </li>
            ))}
          </ul>
          <p className="mt-6 text-sm italic text-muted-foreground">
            השאלה לא &quot;כמה זה עולה&quot;  -  אלא כמה מפסידים אם הסאונד לא
            עובד.
          </p>
        </section>

        <section aria-labelledby="process-heading">
          <header className="mx-auto max-w-2xl text-center">
            <h2
              id="process-heading"
              className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
            >
              איך זה עובד?
            </h2>
          </header>
          <ol className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {SINGER_PROCESS.map((step) => (
              <li
                key={step.step}
                className="rounded-xl border border-border bg-surface p-5"
              >
                <span className="text-xs font-bold tracking-widest text-brand-red">
                  {step.step}
                </span>
                <h3 className="mt-2 font-semibold text-foreground">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {step.description}
                </p>
              </li>
            ))}
          </ol>
        </section>

        <section className="max-w-3xl text-center" aria-labelledby="trust-heading">
          <h2
            id="trust-heading"
            className="text-xl font-semibold text-foreground"
          >
            מי אנחנו?
          </h2>
          <p className="mt-3 text-sm text-muted-foreground">
            אולפן הקלטות עם 20 שנות ניסיון  -  מבינים סאונד, ווקאל והפקה. לא
            &quot;מפעילים ציוד&quot;  -  יוצרים סאונד. אמנים, להקות ואירועים
            גדולים.
          </p>
          <p className="mt-2 text-xs text-muted-foreground">{SINGER_TRAVEL_NOTE}</p>
        </section>

        <p className="text-center text-sm">
          <Link
            href="/events/equipment"
            className="font-medium text-brand-red hover:underline"
          >
            ← חזרה להשכרת הגברה לאירועים
          </Link>
          {" · "}
          <Link
            href="/studio"
            className="font-medium text-brand-red hover:underline"
          >
            אולפן הקלטות
          </Link>
        </p>
        {service.faqs.length > 0 ? (
          <FAQAccordion
            items={[...service.faqs]}
            title="שאלות נפוצות"
            className="py-0"
          />
        ) : null}

        <section
          className="rounded-xl border border-brand-red/25 bg-surface px-6 py-10 text-center sm:px-10"
          aria-labelledby="singer-cta-heading"
        >
          <h2
            id="singer-cta-heading"
            className="text-xl font-semibold text-foreground sm:text-2xl"
          >
            מוכנים להופעה הבאה?
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-sm text-muted-foreground">
            הופעה טובה מתחילה בסאונד טוב. טלפון:{" "}
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
            הצעת מחיר בוואטסאפ
          </a>
        </section>
              <PageRelatedFooter pathname="/events/equipment/singer-amplification" />

            </div>
    </ServicePageLayout>
  );
}
