import type { Metadata } from "next";
import Link from "next/link";
import AcademyCourseFitSections from "@/components/academy/AcademyCourseFitSections";
import HubDualCta from "@/components/marketing/HubDualCta";
import InlineServiceLink from "@/components/marketing/InlineServiceLink";
import YouTubePlaylistSection from "@/components/marketing/YouTubePlaylistSection";
import ContextualIntroParagraph from "@/components/seo/ContextualIntroParagraph";
import ShareButton from "@/components/ui/ShareButton";
import { MUSIC_PRODUCTION_FIT } from "@/lib/data/academy-course-fit";
import { SKEPTICISM_CTA } from "@/lib/data/conversion-copy";
import {
  YOUTUBE_MUSIC_PRODUCTION_SOLUTIONS_PLAYLIST_EMBED,
  YOUTUBE_MUSIC_PRODUCTION_SOLUTIONS_PLAYLIST_URL,
} from "@/lib/data/music-production-page";
import { resolveServiceBookCta } from "@/lib/data/service-book-map";
import { SITE_NAME } from "@/lib/constants";
import { constructMetadata } from "@/lib/metadata";
import { buildWhatsAppHref } from "@/lib/whatsapp";

export const metadata: Metadata = constructMetadata({
  title: "קורס יצירה מוזיקלית",
  description:
    "עריכה ב-DAW, הפקה, מיקס ומאסטרינג. קורס אישי 1:1 עם יקיר כהן באולפן מקצועי במודיעין. מהרעיון הראשון עד תוצר מוגמר.",
  slug: "academy/music-production",
  keywords: [
    "קורס הפקה מוזיקלית",
    "לימוד DAW",
    "Ableton",
    "Logic Pro",
    "FL Studio",
    "מיקס ומאסטרינג",
    "קורס מוזיקה מודיעין",
  ],
});

const MODULES = [
  {
    icon: "🎚️",
    title: "שליטה ב-DAW",
    body: "Ableton Live, Logic Pro או FL Studio. שולטים בתוכנה עד שהיא לא עומדת בדרך. הממשק, הפלואו, הקיצורים החשובים.",
  },
  {
    icon: "🥁",
    title: "בניית ביטים ומקצבים",
    body: "ממתופף וירטואלי ועד Drum Machine מלא. איך לבנות גרוב שמרגיש חי, ולא רובוטי.",
  },
  {
    icon: "🎹",
    title: "הרמוניה ומנגינה",
    body: "איך לבנות קורדים, ליצור לחן ולסדר את השכבות. לא צריך לקרוא תווים, צריך לשמוע.",
  },
  {
    icon: "🔊",
    title: "מיקס ומאסטרינג",
    body: "איך הכל נשמע יחד? EQ, Compression, Reverb, תדרים. גישה שיטתית שמפסיקה להיראות כמו קסם.",
  },
  {
    icon: "📤",
    title: "מהאולפן לעולם",
    body: "Export לספוטיפיי, סאונדקלאוד, יוטיוב. פורמטים, קצבי ביט, רשיונות. כל מה שצריך לפני שמפיצים.",
  },
  {
    icon: "🤝",
    title: "שיתופי פעולה ורמיקסים",
    body: "איך עובדים עם אמן אחר? Stems, Session Files, שיתוף פרויקטים. הכלים שמאפשרים עבודה משותפת.",
  },
] as const;

const bookCta = resolveServiceBookCta("academy/music-production");

export default function MusicProductionPage() {
  const ctaHref = buildWhatsAppHref({
    text: "היי יקיר! אני מעוניין/ת בקורס יצירה מוזיקלית והפקה. אשמח לשמוע פרטים ולקבוע מפגש אפיון.",
    utm_source: "academy",
    utm_campaign: "music_production_cta",
  });

  return (
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
                <Link href="/" className="transition-colors duration-fast ease-luxury hover:text-brand-red focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red">
                  ראשי
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link href="/academy" className="transition-colors duration-fast ease-luxury hover:text-brand-red focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red">
                  האקדמיה
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li className="font-medium text-foreground" aria-current="page">
                יצירה מוזיקלית
              </li>
            </ol>
          </nav>

          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-red">
            {SITE_NAME}
          </p>

          <h1 className="mt-3 font-serif text-3xl font-semibold leading-tight tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            קורס יצירה מוזיקלית
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            עריכה ב-DAW, בניית ביטים, הרמוניה, מיקס ומאסטרינג. מהרעיון הראשון
            עד תוצר מוגמר שמוכן לשחרור.
          </p>

          <ContextualIntroParagraph
            pathname="/academy/music-production"
            className="mx-auto mt-4 max-w-xl text-center"
          />

          {bookCta ? (
            <div className="mt-8 space-y-2">
              <HubDualCta
                whatsappHref={ctaHref}
                whatsappLabel="קבעו מפגש אפיון"
                bookHref={bookCta.bookHref}
                bookLabel={bookCta.bookLabel}
                className="[&_a]:min-h-12"
              />
            </div>
          ) : (
            <a
              href={ctaHref}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex min-h-12 items-center gap-2 rounded-xl bg-brand-red px-7 py-3 text-sm font-semibold text-white shadow-[0_0_20px_rgba(212,43,43,0.3)] transition-[background-color,box-shadow] duration-normal ease-luxury hover:bg-brand-red-light hover:shadow-[0_0_32px_rgba(212,43,43,0.45)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red"
            >
              קבעו מפגש אפיון
            </a>
          )}
        </div>
      </section>

      {/* ── Fit: audience / outcome / process ── */}
      <section className="mx-auto max-w-[72rem] px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
        <AcademyCourseFitSections
          fit={MUSIC_PRODUCTION_FIT}
          idPrefix="music-production"
        />
        <p className="mx-auto mt-8 max-w-2xl text-center text-sm text-muted-foreground">
          רוצים שיופק לכם שיר ולא ללמוד לבד? ראו{" "}
          <InlineServiceLink href="/studio/recording-song-modiin">
            הקלטת שיר באולפן
          </InlineServiceLink>
          . לקורס DJ לצד ההפקה -{" "}
          <InlineServiceLink href="/academy/dj-course">קורס DJ</InlineServiceLink>
          . לשיעור בודד -{" "}
          <InlineServiceLink href="/academy/private-lessons">
            שיעור פרטי
          </InlineServiceLink>
          .
        </p>
        <p className="mx-auto mt-4 max-w-xl text-center text-xs text-muted-foreground">
          {SKEPTICISM_CTA}
        </p>
      </section>

      {/* ── Modules ── */}
      <section className="mx-auto max-w-[72rem] px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
        <h2 className="mb-8 text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
          מה לומדים?
        </h2>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {MODULES.map((m) => (
            <div
              key={m.title}
              className="rounded-2xl border border-border bg-background p-6"
            >
              <span className="text-2xl" aria-hidden="true">
                {m.icon}
              </span>
              <h3 className="mt-3 font-semibold text-foreground">{m.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                {m.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Production & sound solutions playlist ── */}
      <section className="mx-auto max-w-[72rem] px-4 pb-14 sm:px-6 sm:pb-16 lg:px-8">
        <YouTubePlaylistSection
          headingId="music-production-playlist-heading"
          title="פתרונות מוזיקה לעולם ההפקה והסאונד"
          description="סרטוני הסבר, טיפים וכלים מעשיים  -  DAW, מיקס, מאסטרינג ועבודה באולפן. צפייה חופשית לפני שמתחילים את המסלול."
          playlistUrl={YOUTUBE_MUSIC_PRODUCTION_SOLUTIONS_PLAYLIST_URL}
          playlistEmbedUrl={YOUTUBE_MUSIC_PRODUCTION_SOLUTIONS_PLAYLIST_EMBED}
          iframeTitle="פתרונות מוזיקה לעולם ההפקה והסאונד | יקיר כהן הפקות"
        />
      </section>

      {/* ── CTA ── */}
      <section className="border-t border-border bg-surface py-16 sm:py-20">
        <div className="mx-auto max-w-[72rem] px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
            מוכנים להפיק?
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-muted-foreground">
            מפגש אפיון של 30 דקות - מבינים מה הכיוון ובאיזה DAW כדאי להתחיל.
          </p>
          {bookCta ? (
            <HubDualCta
              className="mt-7 [&_a]:min-h-12"
              whatsappHref={ctaHref}
              whatsappLabel="דברו בוואטסאפ על המסלול"
              bookHref={bookCta.bookHref}
              bookLabel={bookCta.bookLabel}
              whatsappAriaLabel="קביעת מפגש אפיון לקורס יצירה מוזיקלית בוואטסאפ"
            />
          ) : (
            <a
              href={ctaHref}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-7 inline-flex min-h-12 items-center gap-2 rounded-xl bg-brand-red px-7 py-3 text-sm font-semibold text-white shadow-[0_0_20px_rgba(212,43,43,0.3)] transition-[background-color,box-shadow] duration-normal ease-luxury hover:bg-brand-red-light hover:shadow-[0_0_32px_rgba(212,43,43,0.45)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red"
              aria-label="קביעת מפגש אפיון לקורס יצירה מוזיקלית בוואטסאפ"
            >
              דברו בוואטסאפ על המסלול
            </a>
          )}
          <div className="mt-5 flex justify-center">
            <ShareButton title="קורס יצירה מוזיקלית | יקיר כהן הפקות" />
          </div>
        </div>
      </section>
    </div>
  );
}
