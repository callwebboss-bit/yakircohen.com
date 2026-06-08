import Link from "next/link";
import ContextualIntroParagraph from "@/components/seo/ContextualIntroParagraph";
import PageRelatedFooter from "@/components/seo/PageRelatedFooter";
import { AttractionsCalculatorLazy } from "@/components/calculators/lazy";
import FAQAccordion from "@/components/ui/FAQAccordion";
import ServicePageLayout from "@/components/services/ServicePageLayout";
import ServicePagePricingSection from "@/components/services/ServicePagePricingSection";
import ServiceShowcaseSections from "@/components/services/ServiceShowcaseSections";
import { resolveServicePageHeroFromEntity } from "@/lib/service-portfolio-hero";
import { withServicePageHeroDefaults } from "@/lib/service-page-ui";
import {
  BUBBLE_CONCERNS,
  BUBBLE_HIGHLIGHTS,
  BUBBLE_ORDER_STEPS,
  BUBBLE_PACKAGE_INCLUDES,
  BUBBLE_PROCESS_STEPS,
  BUBBLE_PRODUCT_TYPES,
  BUBBLE_WHY_US,
} from "@/lib/data/bubble-machine-page";
import { getEventsService } from "@/lib/data/services";
import {
  CONTACT_PHONE_DISPLAY,
  CONTACT_PHONE_E164,
} from "@/lib/constants";
import {
  youtubeEmbedUrl,
  YOUTUBE_SERVICE_EMBED_IDS,
} from "@/lib/data/youtube-embeds";
import { buildServiceWhatsAppText, buildWhatsAppHref } from "@/lib/whatsapp";

const service = getEventsService("attractions-bubble-machine");

const pageHero = resolveServicePageHeroFromEntity(service);
const heroProps = withServicePageHeroDefaults(pageHero);

export default function BubbleMachinePageContent() {
  const whatsappHref = buildWhatsAppHref({
    text: buildServiceWhatsAppText(service.whatsappText),
    utm_source: "website",
    utm_campaign: `${service.utmCampaign}_cta`,
  });

  const hasVideo = Boolean(
    youtubeEmbedUrl(YOUTUBE_SERVICE_EMBED_IDS["attractions-bubble-machine"]),
  );

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
      <div className="mx-auto max-w-[72rem] space-y-16 px-4 sm:px-6 lg:px-8">
        <ContextualIntroParagraph pathname="/events/attractions/bubble-machine" className="max-w-3xl" />
        <section
          className="rounded-xl border border-brand-red/30 bg-brand-red/5 p-6 sm:p-8"
          aria-labelledby="smoke-bubble-hit-heading"
        >
          <p className="text-xs font-bold uppercase tracking-widest text-brand-red">
            היט 2026
          </p>
          <h2
            id="smoke-bubble-hit-heading"
            className="mt-2 text-xl font-semibold text-foreground sm:text-2xl"
          >
            מכונת בועות סבון עשן
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            בועות עם ענן עשן בתוכן  -  האטרקציה שמשנה את הרחבה. מצטלם מדהים,
            בטוח לשמלות ולא מחליק.
          </p>
          <Link
            href="/events/attractions/bubble-machine/smoke-bubble-machine-events"
            className="mt-5 inline-flex rounded-md bg-brand-red px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-red-light"
          >
            לעמוד בועות עשן ←
          </Link>
        </section>

        <section className="max-w-3xl" aria-labelledby="bubble-intro-heading">
          <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
            מחפשים בועות סבון ברגע מסוים בתוכנית? אנחנו מביאים מכונות, מפעיל
            ומפעילים בדיוק לפי התזמון שלכם  -  כולל בועות עשן, LED והפעלה מקצועית.
          </p>
          <p className="mt-3 text-xs text-muted-foreground">
            * בהזמנת אטרקציה בודדת המחיר עשוי להשתנות לפי תאריך, אזור ומשך.
          </p>
        </section>

        <ul className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {BUBBLE_HIGHLIGHTS.map((item) => (
            <li
              key={item.title}
              className="rounded-xl border border-border bg-surface p-5"
            >
              <p className="text-2xl" aria-hidden>
                {item.emoji}
              </p>
              <h2 className="mt-2 text-base font-semibold text-foreground">
                {item.title}
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">{item.text}</p>
            </li>
          ))}
        </ul>

        <section aria-labelledby="bubble-types-heading">
          <header className="mx-auto max-w-2xl text-center">
            <h2
              id="bubble-types-heading"
              className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
            >
              סוגי בועות שאנחנו מביאים
            </h2>
          </header>
          <ul className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-3">
            {BUBBLE_PRODUCT_TYPES.map((type) => (
              <li
                key={type.title}
                className="rounded-xl border border-border bg-surface p-6 text-center"
              >
                <p className="text-3xl" aria-hidden>
                  {type.emoji}
                </p>
                <h3 className="mt-3 font-semibold text-foreground">
                  {type.title}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {type.description}
                </p>
              </li>
            ))}
          </ul>
        </section>

        <section className="max-w-3xl" aria-labelledby="chuppah-heading">
          <h2
            id="chuppah-heading"
            className="text-xl font-semibold text-foreground sm:text-2xl"
          >
            בועות לכניסה לחופה ולסלואו
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            הכניסה לחופה היא רגע השיא  -  בועות מוסיפות נופך הוליוודי. האורחים
            מרותקים, המצלמות עובדות, ואתם נהנים מ&quot;וואו&quot;. מתאים
            לגנים, חופות, בריכות ואולמות עם תאורה דרמטית.
          </p>
        </section>

        {hasVideo ? (
          <ServiceShowcaseSections
            assetsFolder={service.assetsFolder}
            playlistEmbedUrl={youtubeEmbedUrl(
              YOUTUBE_SERVICE_EMBED_IDS["attractions-bubble-machine"],
            )}
            mediaType="video"
            galleryLabel="בועות סבון באירוע"
            videoTitle="בועות סבון באירוע"
            className="px-0"
          />
        ) : null}

        <section aria-labelledby="how-it-works-heading">
          <header className="mx-auto max-w-2xl text-center">
            <h2
              id="how-it-works-heading"
              className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
            >
              איך זה עובד ביום האירוע?
            </h2>
          </header>
          <ol className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {BUBBLE_PROCESS_STEPS.map((step) => (
              <li
                key={step.step}
                className="rounded-xl border border-border bg-surface p-5"
              >
                <span className="text-xs font-bold text-brand-red">
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

        <section
          className="rounded-xl border border-border bg-surface p-6 sm:p-8"
          aria-labelledby="package-heading"
        >
          <h2
            id="package-heading"
            className="text-lg font-semibold text-foreground sm:text-xl"
          >
            חבילת הפעלה מלאה  -  מה כלול?
          </h2>
          <ul className="mt-4 grid grid-cols-1 gap-2 text-sm text-muted-foreground sm:grid-cols-2">
            {BUBBLE_PACKAGE_INCLUDES.map((item) => (
              <li key={item.label} className="flex gap-2">
                <span className="text-brand-red" aria-hidden>
                  ✓
                </span>
                <span>{item.label}</span>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="order-heading">
          <header className="mx-auto max-w-2xl text-center">
            <h2
              id="order-heading"
              className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
            >
              תהליך הזמנה ב-3 צעדים
            </h2>
          </header>
          <ol className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
            {BUBBLE_ORDER_STEPS.map((step) => (
              <li
                key={step.step}
                className="rounded-xl border border-border bg-surface p-6"
              >
                <span className="text-xs font-bold tracking-widest text-brand-red">
                  {step.step}
                </span>
                <h3 className="mt-3 font-semibold text-foreground">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {step.description}
                </p>
              </li>
            ))}
          </ol>
        </section>

        <section aria-labelledby="concerns-heading">
          <header className="mx-auto max-w-2xl text-center">
            <h2
              id="concerns-heading"
              className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
            >
              10 חששות נפוצים  -  והפתרונות שלנו
            </h2>
          </header>
          <ul className="mt-8 space-y-3">
            {BUBBLE_CONCERNS.map((item) => (
              <li
                key={item.concern}
                className="rounded-lg border border-border bg-surface px-4 py-3 text-sm"
              >
                <span className="font-semibold text-foreground">
                  {item.concern}:
                </span>{" "}
                <span className="text-muted-foreground">{item.solution}</span>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="why-bubble-heading">
          <header className="mx-auto max-w-2xl text-center">
            <h2
              id="why-bubble-heading"
              className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
            >
              למה לבחור ביקיר כהן הפקות?
            </h2>
          </header>
          <ul className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {BUBBLE_WHY_US.map((item) => (
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

        <section
          className="rounded-xl border border-brand-red/15 bg-surface p-6"
          aria-labelledby="led-booth-heading"
        >
          <h2
            id="led-booth-heading"
            className="text-lg font-semibold text-foreground"
          >
            עמדת DJ לד לאירועים
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            רוצים גם תאורת במה מרהיבה? עמדת LED עם אפקטים ויזואליים  -  מושלם
            לתקליטנים, אולמות ואירועים גדולים.
          </p>
          <Link
            href="/events/stage-led-dj"
            className="mt-4 inline-block text-sm font-semibold text-brand-red hover:underline"
          >
            עמדת לד יוקרתית ←
          </Link>
        </section>

        <section
          className="rounded-xl border border-dashed border-border bg-surface/50 p-6 text-center"
          aria-labelledby="buy-machine-heading"
        >
          <p className="text-xs font-bold uppercase tracking-widest text-brand-red">
            הזדמנות לספקים
          </p>
          <h2
            id="buy-machine-heading"
            className="mt-2 text-lg font-semibold text-foreground"
          >
            רוצים לרכוש מכונה?
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            DJs, ספקים ובעלי אולמות  -  מכירת מכונות בועות עשן מקצועיות, הדרכה,
            תמיכה ואספקת נוזלים.
          </p>
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-block text-sm font-semibold text-brand-red hover:underline"
          >
            לפרטים בוואטסאפ
          </a>
        </section>

        <section aria-labelledby="calculator-heading">
          <header className="mx-auto max-w-2xl text-center">
            <h2
              id="calculator-heading"
              className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
            >
              שלבו עם אפקטים נוספים
            </h2>
          </header>
          <AttractionsCalculatorLazy className="mt-8" />
        </section>
        <ServicePagePricingSection service={service} />


        {service.faqs.length > 0 ? (
          <FAQAccordion
            items={[...service.faqs]}
            title="שאלות נפוצות על בועות סבון"
            className="py-0"
          />
        ) : null}

        <section className="flex flex-wrap justify-center gap-3">
          <Link
            href="/events/attractions/wedding-smoking-machine"
            className="rounded-full border border-border bg-surface px-4 py-2 text-sm font-medium hover:border-brand-red/40 hover:text-brand-red"
          >
            עשן כבד
          </Link>
          <Link
            href="/events/attractions/confetti-cannon"
            className="rounded-full border border-border bg-surface px-4 py-2 text-sm font-medium hover:border-brand-red/40 hover:text-brand-red"
          >
            קונפטי
          </Link>
          <Link
            href="/events/attractions"
            className="rounded-full border border-border bg-surface px-4 py-2 text-sm font-medium hover:border-brand-red/40 hover:text-brand-red"
          >
            כל האטרקציות
          </Link>
        </section>

        <section
          className="rounded-xl border border-brand-red/25 bg-surface px-6 py-10 text-center sm:px-10"
          aria-labelledby="bubble-cta-heading"
        >
          <h2
            id="bubble-cta-heading"
            className="text-xl font-semibold text-foreground sm:text-2xl"
          >
            בואו נגרום לאירוע להיות קסום
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-sm text-muted-foreground">
            {CONTACT_PHONE_DISPLAY} · וואטסאפ · הצעת מחיר מהירה
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex rounded-md bg-brand-red px-6 py-3 text-sm font-semibold text-white hover:bg-brand-red-light"
            >
              שליחה בוואטסאפ
            </a>
            <a
              href={`tel:${CONTACT_PHONE_E164}`}
              className="inline-flex rounded-md border border-border px-6 py-3 text-sm font-semibold hover:border-brand-red/40"
            >
              התקשרו
            </a>
          </div>
        </section>
              <PageRelatedFooter pathname="/events/attractions/bubble-machine" />

            </div>
    </ServicePageLayout>
  );
}
