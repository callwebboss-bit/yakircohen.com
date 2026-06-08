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
      {...heroProps}
    >
      <div className="mx-auto max-w-[72rem] space-y-16 px-4 sm:px-6 lg:px-8">
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
              key={block.title}
              className="rounded-xl border border-border bg-surface p-5"
            >
              <p className="text-2xl" aria-hidden>
                {block.emoji}
              </p>
              <h3 className="mt-2 font-semibold text-foreground">{block.title}</h3>
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
                key={item.title}
                className="rounded-xl border border-border bg-surface p-5"
              >
                <p className="text-2xl" aria-hidden>
                  {item.emoji}
                </p>
                <h3 className="mt-2 font-semibold text-foreground">
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
          subheading="כל חבילה בנויה כך שתדעו בדיוק מה אתם מקבלים · הצעת מחיר מדויקת בוואטסאפ לאחר שיתוף פרטי האירוע"
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
          <ul className="mt-4 grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
            {[
              ["📍 מיקום האירוע", "נסיעה ולוגיסטיקה מחוץ לאזור מודיעין-מרכז"],
              ["⏱ שעות פעילות", "כל שעה מעבר ל-5 שעות הבסיס מתומחרת בנפרד"],
              ["🎙 הגברה עצמאית", "אם האולם לא מספק מערכת - מביאים ציוד מלא"],
              ["💡 תאורה מתקדמת", "Moving Heads, LED Wash ופרויקטורים - לפי הצורך"],
              ["🎊 אטרקציות", "כל אפקט (עשן, זיקוקים, קונפטי) מתומחר בנפרד"],
              ["🎤 הנחיה מקצועית", "הנחיית חופה, ריקוד ראשון, ברכה ועוגה - כלולה בפרימיום"],
              ["🕐 שעות חריגות", "פירוק לאחר חצות או הגעה לפני 14:00 - בתיאום מראש"],
              ["⭐ יקיר אישית", "בחבילת VIP בלבד - לא מהצוות"],
            ].map(([icon_label, explanation]) => (
              <li key={icon_label} className="flex gap-3">
                <span className="shrink-0 font-medium text-foreground">{icon_label}</span>
                <span className="text-muted-foreground">{explanation}</span>
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
            title="שאלות נפוצות"
            subtitle="לפני שסוגרים תאריך"
            className="py-0"
          />
        ) : null}

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
