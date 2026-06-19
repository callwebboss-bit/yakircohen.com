import Link from "next/link";
import ContextualIntroParagraph from "@/components/seo/ContextualIntroParagraph";
import PageRelatedFooter from "@/components/seo/PageRelatedFooter";
import { AttractionsCalculatorLazy } from "@/components/calculators/lazy";
import RecordingSongExampleVideos from "@/components/seo/RecordingSongExampleVideos";
import FAQAccordion from "@/components/ui/FAQAccordion";
import ServicePageLayout from "@/components/services/ServicePageLayout";
import ServicePagePricingSection from "@/components/services/ServicePagePricingSection";
import ServiceShowcaseSections from "@/components/services/ServiceShowcaseSections";
import { resolveServicePageHeroFromEntity } from "@/lib/service-portfolio-hero";
import { withServicePageHeroDefaults } from "@/lib/service-page-ui";
import {
  COLD_FIREWORKS_BENEFITS,
  COLD_FIREWORKS_EXAMPLE_VIDEOS,
  COLD_FIREWORKS_HIGHLIGHTS,
  COLD_FIREWORKS_USE_CASES,
  COLD_FIREWORKS_WHY_US,
} from "@/lib/data/cold-fireworks-page";
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

const service = getEventsService("attractions-cold-fireworks");

const pageHero = resolveServicePageHeroFromEntity(service);
const heroProps = withServicePageHeroDefaults(pageHero);

const COLD_VS_TRADITIONAL = [
  { label: "להבות", bad: "אש אמיתית בטמפרטורה גבוהה", good: "ניצוצות ללא להבות (~40°)" },
  { label: "עשן", bad: "עשן וריח", good: "ללא עשן, ריח או אפר" },
  { label: "אולם סגור", bad: "אסור ברוב האולמות", good: "מאושר בכל אולם בישראל" },
  { label: "רישוי", bad: "דורש רישיון מיוחד", good: "ללא רישיון  -  הפעלה מקצועית" },
] as const;

export default function ColdFireworksPageContent() {
  const whatsappHref = buildWhatsAppHref({
    text: buildServiceWhatsAppText(service.whatsappText),
    utm_source: "website",
    utm_campaign: `${service.utmCampaign}_cta`,
  });

  const resaleWhatsapp = buildWhatsAppHref({
    text: buildServiceWhatsAppText(
      "שלום, מעוניין/ת ברכישת מערכת זיקוקים קרים  -  אשמח לפרטים",
    ),
    utm_source: "website",
    utm_campaign: `${service.utmCampaign}_resale`,
  });

  return (
    <ServicePageLayout
      title={service.title}
      subtitle={service.subtitle}
      features={service.features}
      whatsappText={service.whatsappText}
      utmCampaign={service.utmCampaign}
      bookSlug={service.slug}
      scarcityLabel={service.scarcityLabel}
      pagePath="/events/attractions/cold-fireworks"
      faqs={service.faqs}
      {...heroProps}
    >
      <div className="mx-auto max-w-[72rem] space-y-16 px-4 sm:px-6 lg:px-8">
        <ContextualIntroParagraph pathname="/events/attractions/cold-fireworks" className="max-w-3xl" />
        <section className="max-w-3xl" aria-labelledby="cold-intro-heading">
          <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
            מחפשים זיקוקים קרים לחתונה או לבר מצווה עם אפקט דרמטי בלי סיכונים?
            Cold Sparklers מייצרים אש קרה  -  ניצוצות זהובות ללא להבות, ללא עשן,
            ולא מפעילים גלאי עשן. מראה קסום ובטוח לחלוטין באולמות סגורים.
          </p>
          <p className="mt-3 text-sm font-medium text-foreground">
            מעל 1,800 אירועים - 280+ המלצות - כל הארץ
          </p>
        </section>

        <ul className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {COLD_FIREWORKS_HIGHLIGHTS.map((item) => (
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

        <ServiceShowcaseSections
          assetsFolder={service.assetsFolder}
          playlistEmbedUrl={youtubeEmbedUrl(
            YOUTUBE_SERVICE_EMBED_IDS["attractions-cold-fireworks"],
          )}
          mediaType="video"
          galleryLabel="זיקוקים קרים מהשטח"
          videoTitle="זיקוקים קרים בכניסה לאירוע"
          videoHeadingId="cold-video-heading"
          videoHeading="איך זה נראה?"
          videoDescription="4 זיקוקים קרים בכניסה - וידאו נטען בלחיצה"
          footer={
            <RecordingSongExampleVideos videos={COLD_FIREWORKS_EXAMPLE_VIDEOS} />
          }
        />

        <section aria-labelledby="use-cases-heading">
          <header className="mx-auto max-w-2xl text-center">
            <h2
              id="use-cases-heading"
              className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
            >
              למי מתאימה השכרת זיקוקים קרים?
            </h2>
          </header>
          <ul className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2">
            {COLD_FIREWORKS_USE_CASES.map((item) => (
              <li
                key={item.title}
                className="rounded-xl border border-border bg-surface p-6"
              >
                <p className="text-2xl" aria-hidden>
                  {item.emoji}
                </p>
                <h3 className="mt-2 text-base font-semibold text-foreground">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {item.description}
                </p>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="benefits-heading">
          <header className="mx-auto max-w-2xl text-center">
            <h2
              id="benefits-heading"
              className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
            >
              יתרונות 4 זיקוקים קרים בחבילה
            </h2>
          </header>
          <ul className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {COLD_FIREWORKS_BENEFITS.map((item) => (
              <li
                key={item.title}
                className="rounded-xl border border-border bg-surface p-5"
              >
                <h3 className="font-semibold text-foreground">{item.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {item.description}
                </p>
              </li>
            ))}
          </ul>
        </section>

        <section className="max-w-3xl" aria-labelledby="tech-heading">
          <h2
            id="tech-heading"
            className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
          >
            מה זה זיקוקים קרים ואיך זה עובד?
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            מכונות שמשגרות ניצוצות זהובות  -  ללא להבות. גרגרי מתכת מיוחדים
            מתלהטים בטמפרטורה נמוכה (~40°) ויוצרים אפקט דרמטי ובטוח. טכנולוגיה
            אלחוטית, ללא חום או עשן  -  מתאימה לכל אולם, גן או במה.
          </p>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            השירות כולל התקנה מקצועית, תזמון מושלם עם DJ וצלם, ומפעיל צמוד.
            מתאים גם להצעות נישואין.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/events/attractions/wedding-smoking-machine"
              className="rounded-full border border-border bg-background px-4 py-2 text-sm font-medium hover:border-brand-red/40 hover:text-brand-red"
            >
              עשן כבד לחתונה
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
              זיקוקים קרים מול מסורתיים
            </h2>
          </header>
          <div className="mt-8 overflow-x-auto">
            <table className="w-full min-w-[32rem] border-collapse text-sm">
              <thead>
                <tr className="border-b border-border text-start">
                  <th className="py-3 pe-4 font-semibold text-foreground" />
                  <th className="py-3 pe-4 font-semibold text-red-600/90">
                    זיקוקים מסורתיים
                  </th>
                  <th className="py-3 font-semibold text-brand-red">
                    זיקוקים קרים (שלנו)
                  </th>
                </tr>
              </thead>
              <tbody>
                {COLD_VS_TRADITIONAL.map((row) => (
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

        <section aria-labelledby="why-cold-heading">
          <header className="mx-auto max-w-2xl text-center">
            <h2
              id="why-cold-heading"
              className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
            >
              למה לבחור ביקיר כהן הפקות?
            </h2>
          </header>
          <ul className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {COLD_FIREWORKS_WHY_US.map((item) => (
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
          className="rounded-xl border border-border bg-surface p-6 sm:p-8"
          aria-labelledby="resale-heading"
        >
          <h2
            id="resale-heading"
            className="text-xl font-semibold text-foreground sm:text-2xl"
          >
            זיקוקים קרים למכירה / השכרה במודיעין
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            מפיקים, DJs ובעלי אולמות  -  משווקים מורשים של מערכות זיקוקים קרים
            לאירועים ובמה. רכישת ציוד חדש עם אחריות, הדרכה, קייסים מוגנים
            ושירות תיקונים. הזמנה מרוכזת לבמות והופעות.
          </p>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li>ערכת זיקוקים קרה כולל שלט ותוכנה</li>
            <li>ציוד באריזה מקורית עם הדרכה מלאה</li>
            <li>אחריות מלאה ושירות תיקונים</li>
          </ul>
          <a
            href={resaleWhatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex rounded-md border border-brand-red px-5 py-2.5 text-sm font-semibold text-brand-red hover:bg-brand-red/5"
          >
            הצעת מחיר לרכישה בוואטסאפ
          </a>
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
              שלבו זיקוקים קרים עם עשן, קונפטי ועוד
            </p>
          </header>
          <AttractionsCalculatorLazy className="mt-8" />
        </section>
        <ServicePagePricingSection service={service} />


        {service.faqs.length > 0 ? (
          <FAQAccordion
            items={[...service.faqs]}
            title="שאלות ששואלים אותנו הרבה לפני שמזמינים"
            subtitle="הכל על זיקוקים קרים ובטיחות"
            className="py-0"
          />
        ) : null}

        <section
          className="rounded-xl border border-brand-red/25 bg-surface px-6 py-10 text-center sm:px-10"
          aria-labelledby="cold-cta-heading"
        >
          <h2
            id="cold-cta-heading"
            className="text-xl font-semibold text-foreground sm:text-2xl"
          >
            תיאמו עכשיו  -  רגעי השיא מתחילים כאן
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-sm text-muted-foreground">
            המחירים גלויים, השירות מקצועי והחוויה מובטחת. גם בטלפון:{" "}
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
              <PageRelatedFooter pathname="/events/attractions/cold-fireworks" />

            </div>
    </ServicePageLayout>
  );
}
