import Link from "next/link";
import ContextualIntroParagraph from "@/components/seo/ContextualIntroParagraph";
import PageRelatedFooter from "@/components/seo/PageRelatedFooter";
import ServiceBlogStrip from "@/components/blog/ServiceBlogStrip";
import { getBlogPostsByServiceSlug } from "@/lib/data/blog";
import LazyYouTubeEmbed from "@/components/marketing/LazyYouTubeEmbed";
import { DjEventsCalculatorLazy } from "@/components/calculators/lazy";
import FAQAccordion from "@/components/ui/FAQAccordion";
import ServicePageLayout from "@/components/services/ServicePageLayout";
import ServicePagePricingSection from "@/components/services/ServicePagePricingSection";
import ServiceShowcaseSections from "@/components/services/ServiceShowcaseSections";
import DjBookingForm from "@/components/forms/DjBookingForm";
import { resolveServicePageHeroFromEntity } from "@/lib/service-portfolio-hero";
import { withServicePageHeroDefaults } from "@/lib/service-page-ui";
import {
  DJ_CHEAP_VS_PRO,
  DJ_EQUIPMENT,
  DJ_EVENT_TYPES,
  DJ_PRICE_FACTORS,
  DJ_PROCESS_STEPS,
  DJ_RELATED_LINKS,
  DJ_VALUE_BLOCKS,
  DJ_WHY_US,
  YOUTUBE_DJ_EVENTS_PLAYLIST_EMBED,
  YOUTUBE_DJ_EVENTS_PLAYLIST_URL,
} from "@/lib/data/dj-events-page";
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

const service = getEventsService("events-dj");

const pageHero = resolveServicePageHeroFromEntity(service);
const heroProps = withServicePageHeroDefaults(pageHero);

const ENTERTAINMENT_BUSINESS_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "EntertainmentBusiness",
  "name": "יקיר כהן הפקות - ניהול מוזיקלי ו-DJ",
  "description": "שירותי תקלוט, הפקה וניהול מוזיקלי מבוסס מנגנון בפריסה ארצית.",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "עמק איילון 34",
    "addressLocality": "מודיעין",
    "addressCountry": "IL",
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": "31.9077",
    "longitude": "35.0064",
  },
  "url": "https://yakircohen.com",
  "telephone": "+972-58-7555456",
  "priceRange": "₪₪₪",
  "areaServed": [
    { "@type": "AdministrativeArea", "name": "מודיעין" },
    { "@type": "AdministrativeArea", "name": "שוהם" },
    { "@type": "AdministrativeArea", "name": "ירושלים" },
    { "@type": "AdministrativeArea", "name": "כל הארץ" },
  ],
  "offers": {
    "@type": "AggregateOffer",
    "priceCurrency": "ILS",
    "lowPrice": "5900",
    "highPrice": "9800",
  },
};

export default function DjEventsPageContent() {
  const planningWhatsapp = buildWhatsAppHref({
    text: buildServiceWhatsAppText(
      "שלום, מעוניין/ת בעזרה חינם בתכנון האירוע  -  אשמח לקבל את הטופס",
    ),
    utm_source: "website",
    utm_campaign: `${service.utmCampaign}_planning`,
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
      valueFrame="מוזיקה מקצועית - תכנון מוזיקלי מדויק לכל האירוע"
      pagePath="/events/dj-events"
      faqs={service.faqs}
      {...heroProps}
    >
      <div className="mx-auto max-w-[72rem] space-y-16 px-4 sm:px-6 lg:px-8">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ENTERTAINMENT_BUSINESS_SCHEMA) }}
        />
        <ContextualIntroParagraph pathname="/events/dj-events" className="max-w-3xl" />
        <section className="max-w-3xl" aria-labelledby="dj-intro-heading">
          <h2
            id="dj-intro-heading"
            className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
          >
            למה DJ טוב הוא קריטי להצלחת האירוע?
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
            DJ הוא לא מי ששם שירים ברקע  -  הוא קורא את האנרגיה בחדר, יודע מתי
            להעלות ומתי להוריד, מתי קלאסיקות ומתי משהו חדש. ההבדל בין DJ טוב
            לבינוני? רחבה מלאה כל הערב מול אורחים שעוזבים מוקדם. המוזיקה זורמת
            בדם מגיל 15.
          </p>
        </section>

        <section aria-labelledby="dj-method-heading">
          <h2
            id="dj-method-heading"
            className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
          >
            מנגנון הפעולה: ניהול אישי מול פיקוח מערכתי
          </h2>
          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            אנו מנטרלים את אלמנט המקריות מהאירוע. העבודה מתבצעת תחת מפרט טכני ומוזיקלי קבוע, המיושם בשני מסלולי בחירה ברורים:
          </p>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-border bg-surface p-6">
              <h3 className="font-semibold text-foreground">ניהול והפקה מלאה (ניהול אישי)</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                יקיר כהן נוכח באירוע ומנהל את הרחבה, המעברים והתזמון המוזיקלי באופן פעיל מתחילת הערב ועד סיומו. מסלול זה מיועד למי שדורש שליטה מלאה בשטח.
              </p>
            </div>
            <div className="rounded-2xl border border-border bg-surface p-6">
              <h3 className="font-semibold text-foreground">ביצוע מונחה (פיקוח מערכת)</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                תקליטן מנוסה מהצוות הקבוע של האולפן מוביל את האירוע. התוכן המוזיקלי, חלוקת הזמנים והמפרט הטכני נבנים מראש ומפוקחים ישירות על ידי יקיר כהן מרחוק.
              </p>
            </div>
          </div>
        </section>

        <ServiceShowcaseSections
          assetsFolder={service.assetsFolder}
          playlistEmbedUrl={youtubeEmbedUrl(
            YOUTUBE_SERVICE_EMBED_IDS["events-dj"],
          )}
          mediaType="video"
          galleryLabel="תקליטן לאירועים מהשטח"
          videoTitle="תקליטן לאירועים  -  רגעי שיא"
          videoHeadingId="dj-video-heading"
          videoHeading="ככה נראה סוף הלילה  -  הרחבה לא נרגעת"
          videoDescription="1:30 ברחבה עם יקיר כהן הפקות  -  וידאו נטען בלחיצה"
          footer={
            <section aria-labelledby="dj-playlist-heading">
              <h3
                id="dj-playlist-heading"
                className="text-center text-lg font-semibold text-foreground"
              >
                עוד אירועים בפלייליסט
              </h3>
              <p className="mx-auto mt-2 max-w-xl text-center text-sm text-muted-foreground">
                <a
                  href={YOUTUBE_DJ_EVENTS_PLAYLIST_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-brand-red hover:underline"
                >
                  צפייה בפלייליסט המלא ביוטיוב
                </a>
              </p>
              <div className="mx-auto mt-6 max-w-3xl">
                <LazyYouTubeEmbed
                  embedUrl={YOUTUBE_DJ_EVENTS_PLAYLIST_EMBED}
                  title="פלייליסט אירועים  -  יקיר כהן הפקות"
                />
              </div>
            </section>
          }
        />

        <section aria-labelledby="equipment-heading">
          <header className="mx-auto max-w-2xl text-center">
            <h2
              id="equipment-heading"
              className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
            >
              ציוד פרימיום
            </h2>
            <p className="mt-3 text-sm text-muted-foreground">
              הכול עובד, מגובה ומקצועי
            </p>
          </header>
          <ul className="mx-auto mt-8 grid max-w-2xl grid-cols-1 gap-2 sm:grid-cols-2">
            {DJ_EQUIPMENT.map((item) => (
              <li
                key={item}
                className="flex gap-2 rounded-lg border border-border bg-surface px-4 py-3 text-sm"
              >
                <span className="text-brand-red" aria-hidden>
                  ✓
                </span>
                {item}
              </li>
            ))}
          </ul>
        </section>

        <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {DJ_VALUE_BLOCKS.map((block) => (
            <li
              key={block.id}
              className="rounded-xl border border-border bg-surface p-5"
            >
              <h3 className="font-semibold text-foreground">{block.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {block.description}
              </p>
            </li>
          ))}
        </ul>

        <section className="max-w-3xl" aria-labelledby="crowd-heading">
          <h2
            id="crowd-heading"
            className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
          >
            הסוד: קריאת קהל
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            אם DJ רק &quot;שם שירים&quot;, ספוטיפיי היה מחליף את כולם. תקליטן
            מקצועי סורק את הרחבה: האנרגיה יורדת? הדודות התיישבו? הצעירים בשיא?
            מעבר בשנייה מפופ לקלאסיקה מזרחית או סט סוחף  -  זה מה ששומר על רחבה
            מלאה.
          </p>
        </section>

        <section aria-labelledby="process-heading">
          <header className="mx-auto max-w-2xl text-center">
            <h2
              id="process-heading"
              className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
            >
              התהליך  -  מההזמנה ועד סוף האירוע
            </h2>
          </header>
          <ol className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
            {DJ_PROCESS_STEPS.map((step) => (
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

        <section className="max-w-3xl" aria-labelledby="mixed-heading">
          <h2
            id="mixed-heading"
            className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
          >
            מומחיות באירועים מעורבים ודתיים
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            ניסיון עשיר בחיבור קהלים ועולמות מוזיקליים  -  מעברים חלקים, אווירה
            מכבדת ומרקידה. מלהיטים חסידיים ועד פופ, הכול בזרימה אחת.
          </p>
        </section>

        <section aria-labelledby="event-types-heading">
          <header className="mx-auto max-w-2xl text-center">
            <h2
              id="event-types-heading"
              className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
            >
              סוגי אירועים
            </h2>
          </header>
          <ul className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {DJ_EVENT_TYPES.map((item) => (
              <li
                key={item.id}
                className="rounded-xl border border-border bg-surface p-5"
              >
                <h3 className="font-semibold text-foreground">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {item.description}
                </p>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="compare-heading">
          <header className="mx-auto max-w-2xl text-center">
            <h2
              id="compare-heading"
              className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
            >
              איך לא ליפול על תקליטן זול לחתונה?
            </h2>
          </header>
          <div className="mt-8 overflow-x-auto">
            <table className="w-full min-w-[32rem] border-collapse text-sm">
              <thead>
                <tr className="border-b border-border text-start">
                  <th className="py-3 pe-4 font-semibold text-foreground" />
                  <th className="py-3 pe-4 font-semibold text-red-600/90">
                    DJ זול / ממוצע
                  </th>
                  <th className="py-3 font-semibold text-brand-red">
                    יקיר כהן הפקות
                  </th>
                </tr>
              </thead>
              <tbody>
                {DJ_CHEAP_VS_PRO.map((row) => (
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

        <section
          className="rounded-xl border border-border bg-surface p-6 sm:p-8"
          aria-labelledby="planning-heading"
        >
          <h2
            id="planning-heading"
            className="text-xl font-semibold text-foreground sm:text-2xl"
          >
            עזרה בתכנון האירוע  -  בחינם
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            רוצים סדר לפני שמזמינים? שלחו הודעה ונעביר טופס שיעזור לדעת מה להזמין
            ומה חסר  -  בלי שום התחייבות. טעימה מהיכולות שלנו לארגן את האירוע.
          </p>
          <a
            href={planningWhatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex rounded-md border border-brand-red px-5 py-2.5 text-sm font-semibold text-brand-red hover:bg-brand-red/5"
          >
            בקשת טופס תכנון בוואטסאפ
          </a>
        </section>

        <section aria-labelledby="calculator-heading">
          <header className="mx-auto max-w-2xl text-center">
            <h2
              id="calculator-heading"
              className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
            >
              חבילות DJ + אטרקציות
            </h2>
            <p className="mt-3 text-sm text-muted-foreground">
              בנו חבילה, קבלו מחיר ושלחו לוואטסאפ
            </p>
          </header>
          <DjEventsCalculatorLazy className="mt-8" />
        </section>

        <section aria-labelledby="why-dj-heading">
          <header className="mx-auto max-w-2xl text-center">
            <h2
              id="why-dj-heading"
              className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
            >
              למה לבחור בנו?
            </h2>
          </header>
          <ul className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {DJ_WHY_US.map((item) => (
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

        <section aria-labelledby="dj-geo-heading">
          <h2
            id="dj-geo-heading"
            className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
          >
            נגישות ופריסה גיאוגרפית
          </h2>
          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            הסטנדרט המקצועי של המערכת אינו משתנה בהתאם למיקום הגאוגרפי. אנו מספקים שירותי DJ, הגברה והפקה{" "}
            <strong className="font-semibold text-foreground">במודיעין, שוהם, ירושלים וביתר חלקי הארץ</strong>.
            המרחק הפיזי של האולם הוא נתון לוגיסטי בלבד; מערכות הסאונד, תוכנית העבודה ורמת הדיוק של התקליטן נותרות אחידות בכל נקודה.
          </p>
          <ul className="mt-6 flex flex-wrap gap-3">
            {[
              { label: "DJ בירושלים", href: "/dj-events/cities/jerusalem" },
              { label: "DJ בשוהם", href: "/dj-events/cities/shoham" },
              { label: "DJ ברחובות", href: "/dj-events/cities/rehovot" },
            ].map((city) => (
              <li key={city.href}>
                <Link
                  href={city.href}
                  className="inline-flex min-h-12 items-center rounded-xl border border-border bg-surface px-5 py-3 text-sm font-semibold text-foreground transition-colors hover:border-brand-red/30 hover:text-brand-red"
                >
                  {city.label}
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section
          className="rounded-xl border border-dashed border-border bg-surface/50 p-6 text-center"
          aria-labelledby="reel-factory-vendor-heading"
        >
          <p className="text-xs font-bold uppercase tracking-widest text-brand-red">
            לספקים ותקליטנים
          </p>
          <h2
            id="reel-factory-vendor-heading"
            className="mt-2 text-lg font-semibold text-foreground"
          >
            מפעל הרילס לספקים
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            סיימתם אירוע ב-2 בלילה? מעלים 5-10 קליפים מהרחבה ומקבלים רילס Rave ערוך
            ב-12 בצהריים - בלי לשבת על עריכה.
          </p>
          <Link
            href="/business/reel-factory"
            className="mt-4 inline-block text-sm font-semibold text-brand-red hover:underline"
          >
            The Reel Factory - פרטים וחבילות </Link>
        </section>

        <section aria-labelledby="related-heading">
          <header className="mx-auto max-w-2xl text-center">
            <h2
              id="related-heading"
              className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
            >
              שירותים נוספים
            </h2>
          </header>
          <ul className="mt-8 flex flex-wrap justify-center gap-3">
            {DJ_RELATED_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="rounded-full border border-border bg-background px-4 py-2 text-sm font-medium hover:border-brand-red/40 hover:text-brand-red"
                >
                  {link.title}
                </Link>
              </li>
            ))}
          </ul>
        </section>
        <ServicePagePricingSection
          service={service}
          heading="3 חבילות ברורות - מה כלול בכל אחת"
          subheading="כל חבילה בנויה כך שתדעו בדיוק מה אתם מקבלים - הצעת מחיר מדויקת בוואטסאפ לאחר שיתוף פרטי האירוע"
        />

        {/* בלוק שקיפות - מה משפיע על המחיר */}
        <section
          className="rounded-xl border border-border bg-surface px-6 py-8 sm:px-8"
          aria-labelledby="price-factors-heading"
        >
          <h2
            id="price-factors-heading"
            className="text-lg font-semibold text-foreground sm:text-xl"
          >
            מה משפיע על המחיר הסופי?
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            שקיפות מלאה - כדי שלא יהיו הפתעות ביום האירוע:
          </p>
          <ul className="mt-4 space-y-2 text-sm">
            {DJ_PRICE_FACTORS.map((factor) => (
              <li key={factor} className="flex items-center gap-2 text-muted-foreground">
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-border" aria-hidden />
                {factor}
              </li>
            ))}
          </ul>
          <p className="mt-5 text-xs text-muted-foreground">
            מלאו את הטופס למטה ותקבלו הצעת מחיר מדויקת תוך שעה - ללא עגלולים.
          </p>
        </section>


        {service.faqs.length > 0 ? (
          <FAQAccordion
            items={[...service.faqs]}
            title="שאלות ששואלים אותנו הרבה לפני שמזמינים"
            subtitle="לפני שסוגרים תאריך"
            className="py-0"
          />
        ) : null}

        <section aria-labelledby="dj-aeo-heading">
          <h2
            id="dj-aeo-heading"
            className="text-xl font-semibold text-foreground sm:text-2xl"
          >
            נתונים יבשים ומענה לשאלות נפוצות
          </h2>
          <div className="mt-6 max-w-3xl space-y-6">
            <div>
              <h3 className="font-semibold text-foreground">מה כולל מפרט הציוד הבסיסי באירוע?</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                עמדת תקלוט מקצועית מלאה, פלטת DJ, מיקסר, מיקרופון עמדה, מיקרופון ייעודי לברכות ומערכת גיבוי טכנולוגית למניעת הפסקות שמע.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-foreground">כיצד נקבע הסגנון המוזיקלי?</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                המוזיקה נשענת על אפיון מקדים מול הלקוח (כולל סנכרון ישיר מול רשימות השמעה קיימות), תוך התאמה בזמן אמת לגילאי הקהל ולדינמיקה ברחבה.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-foreground">האם ניתן לשלב תוכן משלים מהאולפן?</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                כן. ניתן להרחיב את חבילת הבסיס ולשלב הקלטת ברכות מוקדמת באולפן הבוטיק במודיעין או הפקת מצגות גדילה מבוססות כלי AI.
              </p>
            </div>
          </div>
        </section>

        {/* טופס הזמנה מתקדם */}
        <section aria-labelledby="dj-booking-form-heading">
          <header className="mx-auto mb-6 max-w-2xl text-center">
            <h2
              id="dj-booking-form-heading"
              className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
            >
              שריינו תאריך - קבלו הצעה תוך שעה
            </h2>
            <p className="mt-3 text-sm text-muted-foreground">
              מלאו את הפרטים ונחזור אליכם עם הצעת מחיר מדויקת.
              גם בטלפון:{" "}
              <a
                href={`tel:${CONTACT_PHONE_E164}`}
                className="font-medium text-brand-red hover:underline"
              >
                {CONTACT_PHONE_DISPLAY}
              </a>
            </p>
          </header>
          <DjBookingForm />
        </section>
              <ServiceBlogStrip posts={getBlogPostsByServiceSlug("events/dj-events")} />
              <PageRelatedFooter pathname="/events/dj-events" />

            </div>
    </ServicePageLayout>
  );
}
