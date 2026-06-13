import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { constructMetadata } from "@/lib/metadata";
import { buildWhatsAppHref } from "@/lib/whatsapp";
import { SITE_NAME } from "@/lib/constants";
import FAQWithCtaLinks, {
  type FaqCtaItem,
} from "@/components/ui/FAQWithCtaLinks";
import FaqPageSchema from "@/components/seo/FaqPageSchema";
import ShareButton from "@/components/ui/ShareButton";
import YouTubePlaylistSection from "@/components/marketing/YouTubePlaylistSection";
import {
  DJ_COURSE_CURRICULUM_STAGES,
  DJ_COURSE_PROGRAM,
  DJ_COURSE_WHY_US,
  YOUTUBE_DJ_COURSE_FREE_PLAYLIST_EMBED,
  YOUTUBE_DJ_COURSE_FREE_PLAYLIST_URL,
} from "@/lib/data/academy-dj-course-page";

export const metadata: Metadata = constructMetadata({
  title: "קורס DJ מקצועי",
  description:
    "קורס תקליטנות 1:1 באולפן במודיעין - Rekordbox, Traktor, Pioneer, ביטמצ'ינג, FX ומיתוג. מהחלום לרחבה. צפייה חינם בפלייליסט YouTube.",
  slug: "academy/dj-course",
  keywords: [
    "קורס DJ",
    "לימוד תקליטנות",
    "Pioneer",
    "Rekordbox",
    "ביטמצ'ינג",
    "קורס תקליטן מודיעין",
  ],
});

const FAQ_ITEMS: FaqCtaItem[] = [
  {
    id: "equipment",
    question: "האם אני חייב לקנות ציוד לפני הקורס?",
    answer:
      "ממש לא. בשיעורים הראשונים משתמשים בציוד המתקדם שיש באולפן. רק אחרי שתבין את הכיוון, ממליצים על ציוד שמתאים לתקציב שלך לאימון בבית.",
    ctaText: "שאל על ציוד מומלץ לפני שקונים",
    whatsappMessage:
      "היי יקיר! מתעניין בקורס DJ ורוצה להבין מה ציוד כדאי לקנות לתרגול בבית. יש לך המלצות לתקציב של [הוסף תקציב]?",
    utm_campaign: "dj_course_faq_equipment",
  },
  {
    id: "timeline",
    question: "תוך כמה זמן אוכל לנגן במסיבה?",
    answer:
      "תלוי בכמות האימונים שלך בבית. תלמידים רציניים שלוקחים את המסלול המלא מצליחים להרים סט של שעה אחרי 5-6 מפגשים.",
    ctaText: "שלח לי לוח זמנים אישי",
    whatsappMessage:
      "היי יקיר! כמה מפגשים לפי הערכתך עד שאוכל להרים סט של שעה? אני מתכוון להתאמן [X פעמים בשבוע] בבית.",
    utm_campaign: "dj_course_faq_timeline",
  },
  {
    id: "youth",
    question: "האם הקורס מתאים לנוער?",
    answer:
      "בהחלט. יש מסלול מיוחד לנוער ולבר-מצווה. זה הגיל המושלם להתחיל לפתח שמיעה מוזיקלית וביטחון עצמי.",
    ctaText: "שאל על המסלול לנוער",
    whatsappMessage:
      "היי יקיר! יש לנו ילד/בן בגיל [הוסף גיל] שרוצה ללמוד DJ. יש לכם מסלול מתאים? אשמח לשמוע פרטים.",
    utm_campaign: "dj_course_faq_youth",
  },
];

const DJ_COURSE_HERO_IMAGE_FILENAME = "ידידיה קורס דיגיי גיל 50.webp";
const DJ_COURSE_HERO_IMAGE_SRC = `/images/services/dj-course/${encodeURIComponent(
  DJ_COURSE_HERO_IMAGE_FILENAME,
)}`;

export default function DjCoursePage() {
  const ctaHref = buildWhatsAppHref({
    text: "היי יקיר! אני מעוניין/ת בקורס DJ. אשמח לקבוע מפגש אפיון ולשמוע פרטים.",
    utm_source: "academy",
    utm_campaign: "dj_course_cta",
  });

  return (
    <>
      <FaqPageSchema
        items={FAQ_ITEMS.map((item) => ({
          question: item.question,
          answer: item.answer,
        }))}
      />
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
                קורס DJ
              </li>
            </ol>
          </nav>

          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-red">
            {SITE_NAME}
          </p>

          <h1 className="mt-3 font-serif text-3xl font-semibold leading-tight tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            קורס DJ מקצועי
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            להפוך את התשוקה למוזיקה לקריירה על הבמות. תמיד חלמתם לשלוט ברחבה?
            להרגיש את האנרגיה של הקהל בידיים שלכם?
          </p>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            קורס DJ אצל יקיר כהן הוא לא עוד חוג - כרטיס הכניסה לעולם המוזיקה
            והאירועים. בלי תיאוריות יבשות: נכנסים לאולפן, עומדים מול TRAKTOR
            / Pioneer ומתחילים למקסס. לימוד אישי 1:1, בקצב שלכם - מהתחביב
            למקצוען שיודע לקרוא קהל ולהחזיק רחבה.
          </p>

          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <a
              href={ctaHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-brand-red px-7 py-3 text-sm font-semibold text-white shadow-[0_0_20px_rgba(212,43,43,0.3)] transition-[background-color,box-shadow] duration-normal ease-luxury hover:bg-brand-red-light hover:shadow-[0_0_32px_rgba(212,43,43,0.45)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red"
            >
              קבע מפגש אפיון ←
            </a>
            <Link
              href="/academy"
              className="text-sm font-medium text-muted-foreground underline-offset-4 hover:text-brand-red hover:underline transition-colors duration-fast"
            >
              לכל מסלולי האקדמיה
            </Link>
          </div>

          <div className="mt-8 w-full">
            <figure className="mx-auto max-w-2xl overflow-hidden rounded-2xl border border-border bg-surface shadow-sm">
              <div className="relative aspect-[16/10]">
                <Image
                  src={DJ_COURSE_HERO_IMAGE_SRC}
                  alt="קורס DJ"
                  fill
                  className="object-cover object-top"
                  sizes="(max-width: 768px) 100vw, 48rem"
                  priority
                  fetchPriority="high"
                  loading="eager"
                  decoding="async"
                />
              </div>
            </figure>
          </div>
        </div>
      </section>

      {/* ── Program outcomes ── */}
      <section className="border-b border-border bg-surface py-12 sm:py-14">
        <div className="mx-auto max-w-[72rem] px-4 sm:px-6 lg:px-8">
          <header className="mb-8 text-center">
            <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              התוכנית המלאה: מאפס ועד לנגן במועדון
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm text-muted-foreground">
              לא מורחים זמן. כל שיעור מוקדש לטכניקה שתקדם אותך לשלב הבא.
            </p>
          </header>
          <ul className="mx-auto grid max-w-3xl gap-3 sm:grid-cols-2">
            {DJ_COURSE_PROGRAM.map((item) => (
              <li
                key={item.title}
                className="rounded-xl border border-border bg-background px-4 py-3"
              >
                <h3 className="text-sm font-semibold text-foreground">
                  {item.title}
                </h3>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                  {item.body}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Curriculum stages ── */}
      <section className="mx-auto max-w-[72rem] px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
        <header className="mb-10 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-red">
            מסלול הלימוד
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            איך זה בנוי בפועל
          </h2>
        </header>

        <div className="space-y-5">
          {DJ_COURSE_CURRICULUM_STAGES.map((item, i) => (
            <div
              key={item.stage}
              className="flex gap-5 rounded-2xl border border-border bg-background p-6"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-red/10 text-sm font-bold text-brand-red">
                {i + 1}
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-xs font-semibold uppercase tracking-widest text-brand-red">
                    {item.stage}
                  </p>
                  {"sub" in item && item.sub && (
                    <span className="rounded-full bg-brand-red/10 px-2 py-0.5 text-xs font-medium text-brand-red">
                      {item.sub}
                    </span>
                  )}
                </div>
                <h3 className="mt-1 text-base font-semibold text-foreground">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {item.body}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Free preview playlist ── */}
      <section className="mx-auto max-w-[72rem] px-4 pb-14 sm:px-6 sm:pb-16 lg:px-8">
        <YouTubePlaylistSection
          headingId="dj-course-free-playlist-heading"
          title="צפייה חינם  -  תוכן מהקורס"
          description="סרטוני היכרות וטיפים מעשיים לפני שמתחילים. הפלייליסט מתעדכן עם תכנים חדשים מהאקדמיה."
          playlistUrl={YOUTUBE_DJ_COURSE_FREE_PLAYLIST_URL}
          playlistEmbedUrl={YOUTUBE_DJ_COURSE_FREE_PLAYLIST_EMBED}
          iframeTitle="קורס DJ  -  פלייליסט לצפייה חינם | יקיר כהן הפקות"
        />
      </section>

      {/* ── Why Yakir ── */}
      <section className="border-t border-border bg-surface py-14 sm:py-16">
        <div className="mx-auto max-w-[72rem] px-4 sm:px-6 lg:px-8">
          <header className="mb-8 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-red">
              למה ללמוד דווקא כאן
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              בתחום הזה, זול עולה יוקר
            </h2>
          </header>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {DJ_COURSE_WHY_US.map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-border bg-background p-5"
              >
                <h3 className="text-sm font-semibold text-foreground">
                  {item.title}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="mx-auto max-w-3xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
        <h2 className="mb-8 text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
          שאלות נפוצות על קורס DJ
        </h2>
        <FAQWithCtaLinks items={FAQ_ITEMS} />
      </section>

      {/* ── Bottom CTA ── */}
      <section className="border-t border-border bg-surface py-16 sm:py-20">
        <div className="mx-auto max-w-[72rem] px-4 text-center sm:px-6 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-red">
            מוכנים לעלות לעמדה? 🎧
          </p>
          <h2 className="mt-3 text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
            אל תשאירו את החלום במגירה
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-muted-foreground">
            המקומות מוגבלים כדי לשמור על יחס אישי לכל תלמיד. שיחת ייעוץ קצרה
            (חינם) תעשה לכם סדר בראש - ואז מפגש אפיון לפני שמתחילים.
          </p>

          <a
            href={ctaHref}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-7 inline-flex items-center justify-center gap-2 rounded-xl bg-brand-red px-7 py-3 text-sm font-semibold text-white shadow-[0_0_20px_rgba(212,43,43,0.3)] transition-[background-color,box-shadow] duration-normal ease-luxury hover:bg-brand-red-light hover:shadow-[0_0_32px_rgba(212,43,43,0.45)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red"
            aria-label="קביעת מפגש אפיון לקורס DJ בוואטסאפ"
          >
            <svg
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-4 w-4 shrink-0"
              aria-hidden="true"
            >
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            קבע מפגש אפיון בוואטסאפ
          </a>

          <div className="mt-5 flex justify-center">
            <ShareButton title="קורס DJ מקצועי | יקיר כהן הפקות" />
          </div>
        </div>
      </section>
    </div>
    </>
  );
}
