import Link from "next/link";
import ContextualIntroParagraph from "@/components/seo/ContextualIntroParagraph";
import PageRelatedFooter from "@/components/seo/PageRelatedFooter";
import ServiceBlogStrip from "@/components/blog/ServiceBlogStrip";
import { getBlogPostsByServiceSlug } from "@/lib/data/blog";
import { AttractionsCalculatorLazy } from "@/components/calculators/lazy";
import RecordingSongExampleVideos from "@/components/seo/RecordingSongExampleVideos";
import FAQAccordion from "@/components/ui/FAQAccordion";
import ServicePageLayout from "@/components/services/ServicePageLayout";
import ServicePagePricingSection from "@/components/services/ServicePagePricingSection";
import ServiceShowcaseSections from "@/components/services/ServiceShowcaseSections";
import { resolveServicePageHeroFromEntity } from "@/lib/service-portfolio-hero";
import { withServicePageHeroDefaults } from "@/lib/service-page-ui";
import {
  WEDDING_SMOKE_COMPARE,
  WEDDING_SMOKE_EXAMPLE_VIDEOS,
  WEDDING_SMOKE_LARGE_VIDEO,
  WEDDING_SMOKE_ORDER_STEPS,
  WEDDING_SMOKE_USE_CASES,
  WEDDING_SMOKE_WHY_US,
} from "@/lib/data/wedding-smoke-page";
import { getEventsService } from "@/lib/data/services";
import {
  CONTACT_PHONE_DISPLAY,
  CONTACT_PHONE_E164,
} from "@/lib/constants";
import { buildServiceWhatsAppText, buildWhatsAppHref } from "@/lib/whatsapp";

const service = getEventsService("attractions-wedding-smoke");

const pageHero = resolveServicePageHeroFromEntity(service);
const heroProps = withServicePageHeroDefaults(pageHero);

export default function WeddingSmokePageContent() {
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
      scarcityLabel="מומלץ לעונת החתונות  -  תיאום מוקדם"
      {...heroProps}
    >
      <div className="mx-auto max-w-[72rem] space-y-16 px-4 sm:px-6 lg:px-8">
        <ContextualIntroParagraph pathname="/events/attractions/wedding-smoking-machine" className="max-w-3xl" />
        <section
          className="rounded-xl border border-brand-red/30 bg-brand-red/5 p-6 sm:p-8"
          aria-labelledby="large-smoke-upsell-heading"
        >
          <p className="text-xs font-bold uppercase tracking-widest text-brand-red">
            למי שרוצה להשקיע
          </p>
          <h2
            id="large-smoke-upsell-heading"
            className="mt-2 text-xl font-semibold text-foreground sm:text-2xl"
          >
            עשן כבד לאירועים גדולים
          </h2>
          <p className="mt-3 text-sm text-muted-foreground">
            מכונות עם 2 צינורות  -  כיסוי אולמות ענקיים ורחבות פתוחות. אפקט
            קולנועי ברמה אחרת.
          </p>
          <Link
            href="/events/attractions/wedding-smoking-machine/heavy-smoke-large-events"
            className="mt-5 inline-flex rounded-md bg-brand-red px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-red-light"
          >
            לעמוד עשן כבד לאירועים גדולים ←
          </Link>
        </section>

        <section className="max-w-3xl" aria-labelledby="smoke-intro-heading">
          <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
            הסוד של צלמים מקצועיים: עשן שצמוד לרצפה, לא עולה לפנים, ומשלים את
            התמונות במקום להרוס אותן. חוויית סלואו על ענן  -  100% עשן כבד איכותי
            מתחת לברך.
          </p>
          <p className="mt-3 text-sm font-medium text-foreground">
            מעל 1,800 אירועים · שיתוף פעולה עם צלמי חתונות מובילים · כל הארץ
          </p>
        </section>

        <ServiceShowcaseSections
          assetsFolder={service.assetsFolder}
          playlistEmbedUrl={service.playlistEmbedUrl}
          mediaType="video"
          galleryLabel="עשן כבד לחתונה"
          videoTitle="עשן כבד בסלואו חתונה"
          videoHeadingId="smoke-video-heading"
          videoHeading="איך הופכים סלואו לסצנה מהוליווד?"
          videoDescription="וידאו נטען בלחיצה  -  לא מאט את הדף"
          footer={
            <>
              <section aria-labelledby="large-smoke-video-heading">
                <h3
                  id="large-smoke-video-heading"
                  className="text-center text-lg font-semibold text-foreground sm:text-xl"
                >
                  עשן כבד גדול לאירועים גדולים
                </h3>
                <p className="mx-auto mt-2 max-w-xl text-center text-sm text-muted-foreground">
                  איך נראה עשן כבד בעוצמה כפולה  -  מילוי רחבה פתוחה תוך שניות
                </p>
                <div className="mx-auto mt-6 max-w-3xl">
                  <RecordingSongExampleVideos
                    videos={[WEDDING_SMOKE_LARGE_VIDEO]}
                  />
                </div>
              </section>
              <RecordingSongExampleVideos videos={WEDDING_SMOKE_EXAMPLE_VIDEOS} />
            </>
          }
        />

        <section aria-labelledby="use-cases-heading">
          <header className="mx-auto max-w-2xl text-center">
            <h2
              id="use-cases-heading"
              className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
            >
              למי מתאים עשן כבד?
            </h2>
          </header>
          <ul className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2">
            {WEDDING_SMOKE_USE_CASES.map((item) => (
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

        <section aria-labelledby="order-heading">
          <header className="mx-auto max-w-2xl text-center">
            <h2
              id="order-heading"
              className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
            >
              תהליך הזמנה ב-3 צעדים
            </h2>
            <p className="mt-3 text-sm text-muted-foreground">
              עשן שלא מחליק ולא מפעיל גלאים  -  הבטיחות שלכם היא הסטנדרט
            </p>
          </header>
          <ol className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
            {WEDDING_SMOKE_ORDER_STEPS.map((step) => (
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

        <section aria-labelledby="why-smoke-heading">
          <header className="mx-auto max-w-2xl text-center">
            <h2
              id="why-smoke-heading"
              className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
            >
              למה לבחור בעשן הכבד שלנו?
            </h2>
          </header>
          <ul className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {WEDDING_SMOKE_WHY_US.map((item) => (
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
          className="rounded-xl border border-border bg-surface p-6 italic sm:p-8"
          aria-labelledby="quote-heading"
        >
          <h2 id="quote-heading" className="sr-only">
            המלצת צלם
          </h2>
          <blockquote className="text-sm leading-relaxed text-muted-foreground sm:text-base">
            &quot;כשזוג לוקח מכונה זולה, העשן עולה ומטשטש את הפוקוס. עם קרח
            יבש אמיתי, העשן נשאר למטה כמו שטיח לבן, והתמונות יוצאות כמו
            במגזין.&quot;
          </blockquote>
          <p className="mt-4 text-sm font-semibold text-foreground">
             -  אלי ברטון, צלם חתונות (15 שנות ניסיון)
          </p>
        </section>

        <section className="max-w-3xl" aria-labelledby="tech-heading">
          <h2
            id="tech-heading"
            className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
          >
            טכנולוגיית קרח יבש (מינוס 78°)
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            ב&quot;יקיר כהן הפקות&quot; לא משתמשים בעשן נוזלי זול שחונק את
            האולם. ענן לבן, סמיך וכבד שנצמד לרצפה  -  אתם נראים כאילו רוקדים על
            ענן, האוויר נשאר נקי והצילום חד ומרגש. מכונות גיבוי וסנכרון מדויק
            עם ה-DJ  -  אין מקום לשגיאות ברגע הכי חשוב.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/events/attractions/cold-fireworks"
              className="rounded-full border border-border bg-background px-4 py-2 text-sm font-medium hover:border-brand-red/40 hover:text-brand-red"
            >
              זיקוקים קרים
            </Link>
            <Link
              href="/events/attractions/confetti-cannon"
              className="rounded-full border border-border bg-background px-4 py-2 text-sm font-medium hover:border-brand-red/40 hover:text-brand-red"
            >
              תותח קונפטי
            </Link>
            <Link
              href="/events/attractions"
              className="rounded-full border border-border bg-background px-4 py-2 text-sm font-medium hover:border-brand-red/40 hover:text-brand-red"
            >
              כל האטרקציות
            </Link>
          </div>
        </section>

        <section aria-labelledby="compare-heading">
          <header className="mx-auto max-w-2xl text-center">
            <h2
              id="compare-heading"
              className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
            >
              להתפשר על עשן כבד  -  או לא?
            </h2>
          </header>
          <div className="mt-8 overflow-x-auto">
            <table className="w-full min-w-[32rem] border-collapse text-sm">
              <thead>
                <tr className="border-b border-border text-start">
                  <th className="py-3 pe-4 font-semibold text-foreground" />
                  <th className="py-3 pe-4 font-semibold text-red-600/90">
                    עשן נוזלי זול
                  </th>
                  <th className="py-3 font-semibold text-brand-red">
                    עשן כבד (הסטנדרט שלנו)
                  </th>
                </tr>
              </thead>
              <tbody>
                {WEDDING_SMOKE_COMPARE.map((row) => (
                  <tr key={row.label} className="border-b border-border/60">
                    <th className="py-3 pe-4 font-medium text-foreground">
                      {row.label}
                    </th>
                    <td className="py-3 pe-4 text-muted-foreground">{row.bad}</td>
                    <td className="py-3 text-muted-foreground">{row.good}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section aria-labelledby="calculator-heading">
          <header className="mx-auto max-w-2xl text-center">
            <h2
              id="calculator-heading"
              className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
            >
              בנו חבילת אפקטים
            </h2>
            <p className="mt-3 text-sm text-muted-foreground">
              שלבו עשן כבד עם קונפטי, זיקוקים ועוד  -  ושלחו סיכום בוואטסאפ
            </p>
          </header>
          <AttractionsCalculatorLazy className="mt-8" />
        </section>
        <ServicePagePricingSection service={service} />


        {service.faqs.length > 0 ? (
          <FAQAccordion
            items={[...service.faqs]}
            title="שאלות ששואלים אותנו הרבה לפני שמזמינים"
            subtitle="כל מה שרציתם לדעת על עשן כבד"
            className="py-0"
          />
        ) : null}

        <section
          className="rounded-xl border border-brand-red/25 bg-surface px-6 py-10 text-center sm:px-10"
          aria-labelledby="smoke-cta-heading"
        >
          <h2
            id="smoke-cta-heading"
            className="text-xl font-semibold text-foreground sm:text-2xl"
          >
            ליצירת הרגע המושלם
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-sm text-muted-foreground">
            תאריך, סוג אירוע ומיקום  -  נחזור עם הצעה מדויקת. גם בטלפון:{" "}
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
              <ServiceBlogStrip posts={getBlogPostsByServiceSlug("events/attractions/wedding-smoking-machine")} />
              <PageRelatedFooter pathname="/events/attractions/wedding-smoking-machine" />

            </div>
    </ServicePageLayout>
  );
}
