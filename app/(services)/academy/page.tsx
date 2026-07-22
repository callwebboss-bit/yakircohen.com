import type { Metadata } from "next";
import Link from "next/link";
import HubPageSchema from "@/components/seo/HubPageSchema";
import ContextualIntroParagraph from "@/components/seo/ContextualIntroParagraph";
import ServiceHubLinks from "@/components/services/ServiceHubLinks";
import ServiceBlogStrip from "@/components/blog/ServiceBlogStrip";
import { getBlogPostsByServiceSlug } from "@/lib/data/blog";
import PrivateSessionPricing from "@/components/academy/PrivateSessionPricing";
import { TimeSaverRoiSliderLazy } from "@/components/calculators/lazy";
import HubDualCta from "@/components/marketing/HubDualCta";
import Testimonials from "@/components/marketing/Testimonials";
import { resolveServiceBookCta } from "@/lib/data/service-book-map";
import { academyCoursesByCategory } from "@/lib/data/academy-hub-courses";
import {
  ACADEMY_HUB_SEO,
  hubSchemaPropsFromSeo,
  metadataForHubSeo,
} from "@/lib/seo/hub-pages";
import { buildWhatsAppHref } from "@/lib/whatsapp";
import { SITE_NAME } from "@/lib/constants";

export const metadata: Metadata = metadataForHubSeo(ACADEMY_HUB_SEO);

/* ─── Data ─────────────────────────────────────────────────────────────── */

const ACADEMY_TRACKS = [
  {
    id: "sound-lab",
    icon: "🧪",
    badge: "גילאי 8-16 + הורים",
    title: "מעבדת הסאונד",
    sub: "פיתוח יצירתיות וטכנולוגיה כחוויה משותפת. נוכחות הורה חובה.",
    price: "1,500",
    priceNote: "למפגש, 60 דקות, באולפן",
    features: [
      "מפגש שבועי באולפן עם ציוד מקצועי אמיתי",
      "יצירת שיר, ביט או פודקאסט מאפס",
      "בניית שפה משותפת הורה-ילד",
      "תוצר דיגיטלי בסוף כל מפגש",
    ],
    waText:
      "היי יקיר! אני מעוניין/ת במעבדת הסאונד (גילאי 8-16). אשמח לשמוע על המסלול.",
    utm: "academy_sound_lab",
  },
  {
    id: "dj-production",
    icon: "🎧",
    badge: "גיל 18+",
    title: "DJ / הפקה / קריינות",
    sub: "מפגשים אישיים 1:1. בניית יכולת ביצועית אמיתית.",
    price: "1,470",
    priceNote: "למפגש, 90 דקות, באולפן",
    featured: true,
    features: [
      "קריאת קהל ושליטה ברחבה",
      "מיקסר וציוד DJ מקצועי (Pioneer)",
      "שליטה בקול וטכניקות קריינות",
      "עריכה ב-DAW (Ableton / Logic / FL)",
      "הפקה מוזיקלית מאפס לתוצר גמור",
    ],
    waText:
      "היי יקיר! אני מעוניין/ת במסלול DJ / הפקה / קריינות. אשמח לשמוע פרטים ולקבוע שיחת היכרות.",
    utm: "academy_dj_production",
  },
  {
    id: "nevermind",
    icon: "🧠",
    badge: "ביטחון ודיבור",
    title: "פרוטוקול NeverMind",
    sub: "שבירת חסמי דיבור וגמגום דרך עבודה מול מיקרופון.",
    price: "1,200",
    priceNote: "למפגש, 60 דקות, באולפן",
    features: [
      "אימון מנטלי מול מיקרופון",
      "שבירת חסמי דיבור",
      "בניית ביטחון ביצועי",
      "לא קלינאות תקשורת. אימון ביצועי קצה.",
    ],
    waText:
      "היי יקיר! שמעתי על פרוטוקול NeverMind. אשמח להבין יותר לפני שמחליטים.",
    utm: "academy_nevermind",
  },
] as const;

const RETAINER_PLANS = [
  {
    id: "master",
    title: "מסלול Master",
    sub: "חודשי, התקדמות עקבית ופתרון בעיות בזמן אמת",
    price: "3,920",
    priceNote: "לחודש, 4 מפגשים של 60 דקות",
    features: [
      "4 מפגשי אולפן אישיים",
      "Direct Line: מענה טכני בוואטסאפ",
      "Feedback שבועי על סאונד / מיקסים / סטים",
      "שליטה מלאה במערכות אולפן מתקדמות",
      "כל חומרי הגלם עוברים אליך",
    ],
    waText:
      "היי יקיר! אני מעוניין/ת במסלול Master (ליווי חודשי, 4 מפגשים). אשמח לשמוע פרטים ולקבוע שיחת היכרות.",
    utm: "academy_master",
    premium: false,
  },
  {
    id: "pro-partnership",
    title: "Pro-Partnership",
    sub: "שישה חודשים, שותפות אסטרטגית לקריירה",
    price: "21,500",
    priceNote: "24 מפגשים, חלוקה גמישה. חיסכון של 2,300 שקלים.",
    features: [
      "24 מפגשי אולפן (חלוקה גמישה לאורך חצי שנה)",
      "ליווי רכש: ייעוץ ותכנון אולפן וציוד",
      "בניית זהות מוזיקלית - זיקוק הסאונד שלך",
      "עדיפות ביומן: שריון חצי שנה מראש",
      "Direct Line + Feedback שבועי",
      "כל חומרי הגלם עוברים אליך",
    ],
    waText:
      "היי יקיר! אני מעוניין/ת במסלול Pro-Partnership (6 חודשים). אשמח לקבוע שיחת היכרות.",
    utm: "academy_pro_partnership",
    premium: true,
  },
] as const;

const FOR_LIST = [
  "מוזיקאי, DJ או יוצר תוכן שרוצה לעלות רמה",
  "מי שמוכן להשקיע זמן, כסף ואנרגיה ברצינות",
  "מי שמעדיף שיעור 1:1 עם מקצוען על קורס אונליין",
  "הורה שרוצה לחשוף את ילדו לעולם היצירה",
  "מנהל / דובר שרוצה להישמע חזק יותר מול קהל",
] as const;

const NOT_FOR_LIST = [
  "מי שמחפש קורס זול ומהיר שיעשה ממנו מפיק בשבועיים",
  "מי שאין לו סבלנות לתהליך למידה אמיתי",
  "מי שמצפה שמישהו יעשה את העבודה במקומו",
  "מי שלא מוכן להגיע למודיעין למפגשים",
] as const;

const PRICING_ROWS = [
  { format: "שיעור מלא", duration: "60 דק׳", includes: "לימוד נושא + תרגול + סיכום", price: "990 ₪" },
  { format: "Pro Session", duration: "90 דק׳", includes: "צלילה לעומק + ניתוח ביצוע", price: "1,280 ₪" },
  { format: "מעבדת סאונד", duration: "60 דק׳", includes: "הורה-ילד, תוצר דיגיטלי", price: "1,500 ₪" },
  { format: "הכשרה ממוקדת", duration: "90 דק׳", includes: "DJ / הפקה / קריינות 1:1", price: "1,470 ₪" },
  { format: "Master חודשי", duration: "4×60 דק׳", includes: "Direct Line + Feedback שבועי", price: "3,920 ₪ / חודש" },
  { format: "Pro-Partnership", duration: "24 מפגשים / 6 חודשים", includes: "ליווי רכש + זהות מוזיקלית", price: "21,500 ₪" },
] as const;

const FINE_PRINT = [
  { icon: "⏰", label: "דיוק", text: "מפגש מתחיל ומסתיים בדיוק בשעה שנקבעה." },
  { icon: "↩️", label: "ביטולים", text: "ביטול פחות מ-24 שעות מראש: חיוב מלא." },
  { icon: "🎛️", label: "ציוד", text: "הלימוד על ציוד מקצועי באולפן במודיעין." },
  { icon: "📁", label: "תוצרים", text: "כל חומרי הגלם עוברים אליך בסוף כל מפגש." },
  { icon: "💳", label: "תשלום", text: "מראש בלינק מאובטח. מסלול חצי-שנתי: תשלום מלא מראש." },
  { icon: "📋", label: "מע\"מ", text: "כל המחירים הם ללא מע\"מ. יש להוסיף 18%." },
  {
    icon: "🕒",
    label: "מחירים",
    text: "המחירים המוצגים באתר הם נכון לעכשיו ועשויים להשתנות בהתאם לזמינות, עומס ותיאום עבודה.",
  },
  { icon: "👨‍👧", label: "מעבדה", text: "נוכחות הורה חובה עד גיל 16." },
] as const;

const CATEGORY_BG = [
  "bg-background",
  "bg-surface",
  "bg-background",
  "bg-surface",
] as const;

const bookCta = resolveServiceBookCta("academy");
const courseGroups = academyCoursesByCategory();

export default function AcademyPage() {
  const assessmentHref = buildWhatsAppHref({
    text: "היי יקיר! אשמח לקבוע שיחת היכרות קצרה (15 דקות, חינם). אני מתעניין/ת במסלולי הלימוד והאקדמיה.",
    utm_source: "academy",
    utm_campaign: "academy_assessment",
  });

  return (
    <>
      <HubPageSchema {...hubSchemaPropsFromSeo(ACADEMY_HUB_SEO)} />
      <div className="bg-background">
      {/* ── Hero ── */}
      <section className="relative overflow-hidden border-b border-border bg-background">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_55%_at_50%_-10%,rgba(212,43,43,0.12),transparent_55%)]"
          aria-hidden="true"
        />

        <div className="relative mx-auto max-w-3xl px-4 py-16 text-center sm:px-6 sm:py-20 lg:px-8">
          <nav aria-label="ניווט ארגוני" className="mb-6">
            <ol className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <li>
                <Link
                  href="/"
                  className="transition-colors duration-fast ease-luxury hover:text-brand-red focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red"
                >
                  בית
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li className="font-medium text-foreground" aria-current="page">
                האקדמיה
              </li>
            </ol>
          </nav>

          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-red">
            {SITE_NAME}
          </p>

          <h1 className="mt-3 font-serif text-3xl font-semibold leading-tight tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            תשכחו מכל מה שחשבתם
            <br />
            על לימודי מוזיקה
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            זה לא חוג וזה לא תיאוריה משעממת. לימוד אישי 1:1 באולפן מקצועי,
            מהרגע הראשון שאתם נוגעים בקונטרולר, ועד הרגע שאתם עומדים מול קהל
            ומרעידים את הרחבה.
          </p>

          <ContextualIntroParagraph pathname="/academy" className="mx-auto mt-4 max-w-2xl" />

          <p className="mt-3 text-sm font-medium text-muted-foreground">
            אני לא מקבל כל אחד. אני עובד עם מי שבא לעבוד.
          </p>

          <p className="mt-4 text-sm font-semibold text-brand-red">
            לומדים בקצב שלכם - עם מי שעושה את זה בשטח
          </p>

          {bookCta ? (
            <div className="mt-8 space-y-2">
              <HubDualCta
                whatsappHref={assessmentHref}
                whatsappLabel="שיחת היכרות - 15 דקות חינם"
                bookHref={bookCta.bookHref}
                bookLabel={bookCta.bookLabel}
              />
              <p className="text-xs text-muted-foreground">
                בדרך כלל תוך שעה בשעות פעילות (א-ה 9:00-20:00) |{" "}
                <Link href="/start" className="font-semibold text-brand-red hover:underline">
                  איך התהליך עובד
                </Link>
              </p>
            </div>
          ) : null}
        </div>
      </section>

      {/* ── #3 For / Not for — moved to top ── */}
      <section className="border-b border-border bg-surface py-10 sm:py-12">
        <div className="mx-auto max-w-[72rem] px-4 sm:px-6 lg:px-8">
          <h2 className="mb-6 text-center text-xl font-semibold text-foreground sm:text-2xl">
            בשבילך אם... ולא בשבילך אם...
          </h2>
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="rounded-2xl border border-border bg-background p-5">
              <h3 className="mb-3 text-sm font-semibold text-foreground">
                בשבילך אם...
              </h3>
              <ul className="space-y-2">
                {FOR_LIST.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2 text-sm text-muted-foreground"
                  >
                    <span className="mt-0.5 text-xs text-brand-red" aria-hidden="true">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-border bg-background p-5">
              <h3 className="mb-3 text-sm font-semibold text-foreground">
                לא בשבילך אם...
              </h3>
              <ul className="space-y-2">
                {NOT_FOR_LIST.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2 text-sm text-muted-foreground"
                  >
                    <span className="mt-0.5 text-xs" aria-hidden="true">✕</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── #1 Courses by category ── */}
      {courseGroups.map((group, i) => (
        <section
          key={group.category}
          className={`${CATEGORY_BG[i % CATEGORY_BG.length]} ${i > 0 ? "border-t border-border" : ""}`}
        >
          <div className="mx-auto max-w-[72rem] px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
            <ServiceHubLinks
              heading={group.heading}
              subheading={group.subheading}
              links={group.items}
              headingId={`academy-cat-${group.category}`}
              columns={group.items.length <= 2 ? 2 : group.items.length <= 3 ? 3 : 4}
            />
          </div>
        </section>
      ))}

      {/* ── #10a Prominent CTA banner ── */}
      <section className="border-y border-border bg-brand-red/5 py-10 sm:py-12">
        <div className="mx-auto max-w-2xl px-4 text-center sm:px-6 lg:px-8">
          <p className="text-base font-semibold text-foreground sm:text-lg">
            לא בטוח מה מתאים לך?
          </p>
          <a
            href={assessmentHref}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-brand-red px-8 py-3 text-base font-semibold text-white shadow-[0_0_16px_rgba(212,43,43,0.25)] transition-[background-color,box-shadow] duration-normal ease-luxury hover:bg-brand-red-light hover:shadow-[0_0_24px_rgba(212,43,43,0.4)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red"
          >
            שיחת היכרות - 15 דקות חינם
          </a>
          <p className="mt-2 text-xs text-muted-foreground">
            יקיר עונה בעצמו. בלי מחויבות.
          </p>
        </div>
      </section>

      {/* ── #4 Pricing comparison table ── */}
      <section className="mx-auto max-w-[72rem] px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
        <header className="mb-10 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-red">
            השוואת מסלולים
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            כל המסלולים במבט אחד
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">
            כל המחירים לפני מע&quot;מ (18%).
          </p>
        </header>

        <div className="overflow-x-auto rounded-2xl border border-border">
          <div className="hidden sm:grid sm:grid-cols-4 bg-surface px-5 py-3 text-xs font-semibold text-foreground">
            <span>סוג מפגש</span>
            <span>משך</span>
            <span>מה כלול</span>
            <span>מחיר</span>
          </div>
          {PRICING_ROWS.map((row, idx) => (
            <div
              key={row.format}
              className={`grid grid-cols-1 gap-1 px-5 py-4 text-sm sm:grid-cols-4 sm:items-center sm:gap-0 ${
                idx % 2 === 0 ? "bg-background" : "bg-surface"
              } ${idx > 0 ? "border-t border-border" : ""}`}
            >
              <span className="font-semibold text-foreground">
                <span className="text-xs font-normal text-muted-foreground sm:hidden">סוג: </span>
                {row.format}
              </span>
              <span className="text-muted-foreground">
                <span className="text-xs font-normal sm:hidden">משך: </span>
                {row.duration}
              </span>
              <span className="text-muted-foreground">
                <span className="text-xs font-normal sm:hidden">כלול: </span>
                {row.includes}
              </span>
              <span className="font-semibold text-brand-red">
                <span className="text-xs font-normal text-muted-foreground sm:hidden">מחיר: </span>
                {row.price}
              </span>
            </div>
          ))}
        </div>
      </section>

      <PrivateSessionPricing />

      <section className="mx-auto max-w-[72rem] px-4 py-10 sm:px-6 lg:px-8">
        <TimeSaverRoiSliderLazy variant="academy" />
      </section>

      {/* ── #7 Testimonials ── */}
      <Testimonials
        title="מה התלמידים אומרים"
        subtitle="תוצאות מדידות מתלמידי האקדמיה - DJ, הפקה, קול ודיבור."
        filterByPathPrefix="/academy"
      />

      {/* ── Academy tracks ── */}
      <section className="mx-auto max-w-[72rem] px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
        <header className="mb-10 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-red">
            האקדמיה
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            הכשרות ממוקדות באולפן
          </h2>
        </header>

        {/* #6 Audio/video demo placeholder */}
        {/* TODO: add real audio/video demos per track - use PremiumCrossfadePlayer or LazyYouTubePlayer */}

        <div className="grid gap-6 sm:grid-cols-3">
          {ACADEMY_TRACKS.map((track) => {
            const href = buildWhatsAppHref({
              text: `${track.waText} - מחיר: ${track.price} ₪ + מע\"מ`,
              utm_source: "academy",
              utm_campaign: track.utm,
            });
            return (
              <div
                key={track.id}
                className={`relative flex flex-col rounded-2xl border p-6 shadow-sm ${
                  "featured" in track && track.featured
                    ? "border-brand-red/50 bg-background shadow-[0_4px_24px_rgba(212,43,43,0.1)]"
                    : "border-border bg-background"
                }`}
              >
                {"featured" in track && track.featured ? (
                  <span className="absolute -top-3 right-5 rounded-full bg-brand-red px-3 py-0.5 text-xs font-bold text-white">
                    הכי פופולרי
                  </span>
                ) : null}

                <span className="text-2xl" aria-hidden="true">
                  {track.icon}
                </span>

                <span className="mt-3 inline-block self-start rounded-full bg-brand-red/10 px-2.5 py-1 text-xs font-semibold text-brand-red">
                  {track.badge}
                </span>

                <h3 className="mt-3 text-lg font-semibold text-foreground">
                  {track.title}
                </h3>
                <p className="mt-1 text-xs text-muted-foreground">
                  {track.sub}
                </p>

                <div className="mt-4">
                  <span className="text-2xl font-bold text-foreground">
                    {track.price} ₪
                  </span>
                  <span className="mr-1 text-xs text-muted-foreground">
                    + מע&quot;מ
                  </span>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {track.priceNote}
                  </p>
                </div>

                <ul className="mt-4 flex-1 space-y-2">
                  {track.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-xs text-muted-foreground">
                      <span className="mt-0.5 text-brand-red" aria-hidden="true">✦</span>
                      {f}
                    </li>
                  ))}
                </ul>

                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 flex min-h-12 w-full items-center justify-center gap-2 rounded-xl border border-brand-red/40 bg-brand-red/8 py-2.5 text-sm font-semibold text-foreground transition-[background-color,border-color] duration-fast ease-luxury hover:border-brand-red/60 hover:bg-brand-red/15 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red"
                >
                  קבע שיחת היכרות
                </a>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── #9 NeverMind explainer (rewritten with mechanism) ── */}
      <section className="border-t border-border bg-surface py-12 sm:py-14">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
          <h3 className="text-lg font-semibold text-foreground">
            מה זה פרוטוקול NeverMind?
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            זה לא טיפול וזה לא קלינאות תקשורת. זה אימון לביצועי קצה.
          </p>
          <p className="mt-3 text-sm font-semibold text-foreground">
            איך זה עובד?
          </p>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
            אתה מדבר לתוך מיקרופון באולפן. מקליטים, משמיעים לך בחזרה,
            ועובדים על הנקודות המדויקות שבהן הקול שלך נתקע.
            כמו אימון כושר - אבל לשרירי הדיבור.
          </p>
          <p className="mt-3 text-sm font-semibold text-foreground">
            אחרי 3-4 מפגשים - הדיבור זורם בלי לחשוב על זה.
          </p>
          <p className="mt-3 text-sm text-muted-foreground">
            מתאים ל: מנהלים שצריכים להציג, אנשים עם חסמי דיבור, כל מי שרוצה
            להישמע חזק יותר מאשר הוא מרגיש.
          </p>
        </div>
      </section>

      {/* ── #8 Retainer plans (with value explanation) ── */}
      <section className="mx-auto max-w-[72rem] px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
        <header className="mb-10 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-red">
            ליווי מקצועי
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            מסלולי Retainer לקריירה
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">
            למי שרוצה להתקדם ברצינות לאורך זמן, לא סשן בודד.
          </p>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-foreground">
            למה מסלול ולא שיעורים בודדים? שיעור בודד נותן כלי. מסלול חודשי בונה
            קריירה. ליווי שבועי, פתרון בעיות בזמן אמת, שריון יומן קבוע
            &mdash; בלי לדאוג לזמינות.
          </p>
        </header>

        <div className="grid gap-6 lg:grid-cols-2">
          {RETAINER_PLANS.map((plan) => {
            const href = buildWhatsAppHref({
              text: `${plan.waText} - מחיר: ${plan.price} ₪ + מע\"מ`,
              utm_source: "academy",
              utm_campaign: plan.utm,
            });
            return (
              <div
                key={plan.id}
                className={`relative flex flex-col rounded-2xl border p-7 shadow-sm ${
                  plan.premium
                    ? "border-brand-red/40 bg-background shadow-[0_4px_24px_rgba(212,43,43,0.08)]"
                    : "border-border bg-background"
                }`}
              >
                {plan.premium && (
                  <span className="absolute -top-3 right-5 rounded-full bg-brand-red px-3 py-0.5 text-xs font-bold text-white">
                    שותפות
                  </span>
                )}

                <h3 className="text-xl font-semibold text-foreground">
                  {plan.title}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">{plan.sub}</p>

                <div className="mt-5">
                  <span className="text-3xl font-bold text-foreground">
                    {plan.price} ₪
                  </span>
                  <span className="mr-1 text-sm text-muted-foreground">
                    + מע&quot;מ
                  </span>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {plan.priceNote}
                  </p>
                </div>

                <ul className="mt-5 flex-1 space-y-2.5">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                      <span className="mt-0.5 text-brand-red" aria-hidden="true">✦</span>
                      {f}
                    </li>
                  ))}
                </ul>

                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-brand-red py-3 text-sm font-semibold text-white shadow-[0_0_16px_rgba(212,43,43,0.25)] transition-[background-color,box-shadow] duration-normal ease-luxury hover:bg-brand-red-light hover:shadow-[0_0_24px_rgba(212,43,43,0.4)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red"
                >
                  קבע שיחת היכרות
                </a>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Assessment CTA (free, single canonical mention) ── */}
      <section className="border-t border-border bg-surface py-14 sm:py-16">
        <div className="mx-auto max-w-2xl px-4 text-center sm:px-6 lg:px-8">
          <span className="text-4xl" aria-hidden="true">🎯</span>
          <h2 className="mt-4 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            איך מתחילים? שיחת היכרות חינם
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-muted-foreground">
            15 דקות בזום או בטלפון. נבין ביחד מאיפה אתה מתחיל, לאן אתה רוצה
            להגיע, ואיזה מסלול מתאים לך. בלי מחויבות, בלי תשלום.
          </p>

          {bookCta ? (
            <HubDualCta
              className="mt-7"
              whatsappHref={assessmentHref}
              whatsappLabel="קבע שיחת היכרות - חינם"
              bookHref={bookCta.bookHref}
              bookLabel={bookCta.bookLabel}
            />
          ) : null}
        </div>
      </section>

      {/* ── Fine print (#5 — deduplicated, assessment item removed) ── */}
      <section className="border-t border-border bg-background py-12 sm:py-14">
        <div className="mx-auto max-w-[72rem] px-4 sm:px-6 lg:px-8">
          <h2 className="mb-6 text-base font-semibold text-foreground">
            האותיות הקטנות (והחשובות)
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {FINE_PRINT.map((item) => (
              <div
                key={item.label}
                className="flex items-start gap-3 rounded-xl border border-border bg-surface p-4"
              >
                <span className="text-lg shrink-0" aria-hidden="true">
                  {item.icon}
                </span>
                <div>
                  <p className="text-xs font-semibold text-foreground">
                    {item.label}
                  </p>
                  <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                    {item.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Related Articles ── */}
      <div className="mx-auto max-w-[72rem] px-4 sm:px-6 lg:px-8">
        <ServiceBlogStrip posts={getBlogPostsByServiceSlug("academy")} heading="מדריכים לפני שמתחילים" />
      </div>

      {/* ── #10b Bottom CTA (strengthened) ── */}
      <section className="border-t border-border bg-surface py-16 sm:py-20">
        <div className="mx-auto max-w-[72rem] px-4 text-center sm:px-6 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-red">
            מוכנים להתחיל?
          </p>
          <h2 className="mt-3 text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
            הצעד הראשון הוא שיחת היכרות. בלי לחץ.
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-muted-foreground">
            אין כאן בוטים. יקיר מגיב בעצמו.
          </p>

          {bookCta ? (
            <HubDualCta
              className="mt-7"
              whatsappHref={assessmentHref}
              whatsappLabel="שלח הודעה - יקיר עונה בעצמו"
              bookHref={bookCta.bookHref}
              bookLabel={bookCta.bookLabel}
            />
          ) : null}
        </div>
      </section>
    </div>
    </>
  );
}
