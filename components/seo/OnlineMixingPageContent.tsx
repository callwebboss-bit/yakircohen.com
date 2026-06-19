import Link from "next/link";
import LazyYouTubeEmbed from "@/components/marketing/LazyYouTubeEmbed";
import ServiceBlogStrip from "@/components/blog/ServiceBlogStrip";
import { getBlogPostsByServiceSlug } from "@/lib/data/blog";
import FAQWithCtaLinks, { type FaqCtaItem } from "@/components/ui/FAQWithCtaLinks";
import JourneyStepsLink from "@/components/marketing/JourneyStepsLink";
import AudioShowcase from "@/components/seo/AudioShowcase";
import {
  MIXING_AUDIENCE,
  MIXING_EXTRAS,
  MIXING_INCLUDES,
  MIXING_PRICE_INCLUDED,
  MIXING_PROBLEMS,
  MIXING_WHY_US,
} from "@/lib/data/online-mixing-page";
import { buildWhatsAppHref } from "@/lib/whatsapp";
import { SITE_NAME } from "@/lib/constants";
import ShareButton from "@/components/ui/ShareButton";
import { getAudioDemo, SEVERE_RESTORATION_DISCLAIMER } from "@/lib/data/audio-demos";

const FAQ_ITEMS: FaqCtaItem[] = [
  {
    id: "stems",
    question: "איך שולחים את הקטעים?",
    answer:
      "כל ערוץ בקובץ נפרד: שירה, גיטרה, בס, תופים וכו. Google Drive, WeTransfer או שירות העברה אחר.",
    ctaText: "שלחו קישור לקבצים",
    whatsappMessage:
      "היי יקיר! רוצה מיקס ומאסטרינג. אשלח קישור ל-Stems ב-[Drive/WeTransfer].",
    utm_campaign: "mixing_faq_stems",
  },
  {
    id: "one-file",
    question: "מה אם הקלטנו הכול בקובץ אחד?",
    answer:
      "סטריאו מיקס אחד - מוגבל יותר. אפשר מאסטרינג בסיסי, לא מיקס מלא.",
    ctaText: "בדקו מה אפשר",
    whatsappMessage:
      "היי יקיר! יש לי שיר בקובץ סטריאו אחד - מה אפשר לעשות?",
    utm_campaign: "mixing_faq_onefile",
  },
  {
    id: "tracks",
    question: "כמה ערוצים אפשר?",
    answer: "עד 16 ערוצים כלולים. מעל 16 - 100 ₪ נוספים.",
    ctaText: "שאלו על פרויקט",
    whatsappMessage: "היי יקיר! יש לי [X] ערוצים למיקס. מה המחיר?",
    utm_campaign: "mixing_faq_tracks",
  },
  {
    id: "time",
    question: "כמה זמן לוקח?",
    answer: "בדרך כלל 2-7 ימי עסקים. דחיפות - בתוספת תשלום.",
    ctaText: "בדקו זמינות",
    whatsappMessage: "היי יקיר! צריך מיקס בדחיפות - אפשר?",
    utm_campaign: "mixing_faq_time",
  },
  {
    id: "combo",
    question: "אפשר לשלב עם שירותים אחרים?",
    answer: "כן. נפוץ: מיקס + תיקון זיופים + ניקוי רעשים.",
    ctaText: "הצעה משולבת",
    whatsappMessage: "היי יקיר! רוצה מיקס + תיקון זיופים. אשמח להצעה.",
    utm_campaign: "mixing_faq_combo",
  },
  {
    id: "revisions",
    question: "מה אם לא מרוצים מהתוצאה?",
    answer: "סבב תיקונים אחד כלול. תגידו מה לשנות ונתקן. סבב נוסף - 100 ₪.",
    ctaText: "התחילו פרויקט",
    whatsappMessage: "היי יקיר! מעוניין/ת במיקס ומאסטרינג (500 ₪). אשמח פרטים.",
    utm_campaign: "mixing_faq_revision",
  },
];

export default function OnlineMixingPageContent() {
  const mixingDemo = getAudioDemo("weber-restoration");

  const ctaHref = buildWhatsAppHref({
    text: "היי יקיר! יש לי שיר להקלטה ביתית שצריך מיקס ומאסטרינג. אשמח לבדיקה והצעת מחיר.",
    utm_source: "online",
    utm_campaign: "mixing_cta",
  });

  const sampleHref = buildWhatsAppHref({
    text: "היי יקיר! רוצה לשלוח קובץ/קטעים לבדיקה לפני מיקס ומאסטרינג.",
    utm_source: "online",
    utm_campaign: "mixing_sample",
  });

  return (
    <div className="bg-background">
      <section className="relative overflow-hidden border-b border-border">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_55%_at_50%_-10%,rgba(212,43,43,0.12),transparent_55%)]"
          aria-hidden
        />
        <div className="relative mx-auto max-w-3xl px-4 py-16 text-center sm:px-6 sm:py-20 lg:px-8">
          <nav aria-label="ניווט" className="mb-6">
            <ol className="flex flex-wrap items-center justify-center gap-2 text-xs text-muted-foreground">
              <li>
                <Link href="/" className="hover:text-brand-red">
                  ראשי
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li>
                <Link href="/online" className="hover:text-brand-red">
                  Online
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li>
                <Link href="/online/vocal-fix" className="hover:text-brand-red">
                  שירותים דיגיטליים
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li className="font-medium text-foreground" aria-current="page">
                מיקס ומאסטרינג
              </li>
            </ol>
          </nav>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-red">
            {SITE_NAME}
          </p>
          <h1 className="mt-3 font-serif text-3xl font-semibold leading-tight text-foreground sm:text-4xl">
            מיקס ומאסטרינג מרחוק
          </h1>
          <p className="mx-auto mt-4 text-base font-medium text-foreground">
            הקלטתם בבית, נשמעים כמו באולפן
          </p>
          <p className="mx-auto mt-5 max-w-2xl text-sm text-muted-foreground">
            השקעתם שעות בהקלטות, כתבתם והלחנתם. אל תתנו לסאונד חובבני לעצור את
            השיר מלהצליח - מיקס ומאסטרינג שמעיף את השיר למעלה.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href={ctaHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex rounded-xl bg-brand-red px-7 py-3 text-sm font-semibold text-white shadow-[0_0_20px_rgba(212,43,43,0.3)] hover:bg-brand-red-light"
            >
              שלחו קטעים לוואטסאפ </a>
            <a
              href={sampleHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex rounded-xl border border-border bg-background px-7 py-3 text-sm font-semibold text-foreground hover:border-brand-red/40 hover:text-brand-red"
            >
              שלח קובץ לבדיקה
            </a>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-2xl px-4 py-12 sm:px-6 lg:px-8">
        <h2 className="text-xl font-semibold text-foreground">
          מה זה מיקס ומאסטרינג?
        </h2>
        <p className="mt-4 text-sm text-muted-foreground">
          <strong className="text-foreground">מיקס (Mixing):</strong> שילוב כל
          הערוצים (שירה, כלים, רקע), איזון, אפקטים ותיקון פגמים.
        </p>
        <p className="mt-3 text-sm text-muted-foreground">
          <strong className="text-foreground">מאסטרינג (Mastering):</strong>{" "}
          ליטוש סופי - עוצמה תקנית, סאונד טוב בכל מערכת השמעה.
        </p>
        <p className="mt-4 text-sm font-medium text-foreground">
          התוצאה: שיר מקצועי, עוצמתי ומלוטש - ממש כמו באולפן.
        </p>
      </section>

      <section className="border-t border-border bg-surface py-12">
        <div className="mx-auto max-w-[72rem] px-4 sm:px-6 lg:px-8">
          <h2 className="text-lg font-semibold text-foreground">
            למה זה לא נשמע כמו שדמיינתם?
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            יש שירה, כלים ופלייבק - אבל בלחיצה על Play הכל מרגיש &quot;ליד&quot;:
          </p>
          <ul className="mt-4 grid gap-2 sm:grid-cols-2">
            {MIXING_PROBLEMS.map((item) => (
              <li
                key={item}
                className="rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-muted-foreground"
              >
                • {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mx-auto max-w-[72rem] px-4 py-14 sm:px-6 lg:px-8">
        <h2 className="mb-8 text-xl font-semibold text-foreground">
          מה כלול בשירות?
        </h2>
        <div className="grid gap-6 sm:grid-cols-2">
          {MIXING_INCLUDES.map((block) => (
            <div
              key={block.title}
              className="rounded-2xl border border-border bg-background p-6"
            >
              <span className="text-2xl" aria-hidden>
                {block.icon}
              </span>
              <h3 className="mt-2 font-semibold text-foreground">{block.title}</h3>
              <ul className="mt-3 space-y-1.5">
                {block.items.map((item) => (
                  <li key={item} className="text-sm text-muted-foreground">
                    - {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-border bg-surface py-12">
        <div className="mx-auto max-w-[72rem] px-4 sm:px-6 lg:px-8">
          <h2 className="mb-6 text-lg font-semibold text-foreground">למי זה מתאים?</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {MIXING_AUDIENCE.map((item) => (
              <div
                key={item.title}
                className="rounded-xl border border-border bg-background p-5"
              >
                <span className="text-xl" aria-hidden>
                  {item.icon}
                </span>
                <h3 className="mt-2 font-semibold text-foreground">{item.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-border bg-background py-12">
        <div className="mx-auto max-w-[72rem] px-4 sm:px-6 lg:px-8">
          <header className="mx-auto max-w-2xl text-center">
            <h2 className="text-xl font-semibold text-foreground">
              ניקוי רעשים - דוגמה לפני/אחרי
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              לפני המיקס: הקלטות ישנות, רועשות או פגומות - שחזור קשה ותלוי במקור.
            </p>
          </header>
          <div className="mx-auto mt-8 max-w-2xl">
            <div
              className="mb-4 rounded-xl border border-amber-200/80 bg-amber-50/80 px-4 py-3 text-sm leading-relaxed text-foreground dark:border-amber-900/50 dark:bg-amber-950/30"
              role="note"
            >
              <p className="font-medium text-amber-900 dark:text-amber-100">
                חשוב לדעת לפני שמאזינים
              </p>
              <p className="mt-1 text-muted-foreground">
                {SEVERE_RESTORATION_DISCLAIMER}
              </p>
            </div>
            <AudioShowcase
              variant="restoration"
              context="page"
              beforeSrc={mixingDemo.beforeSrc}
              afterSrc={mixingDemo.afterSrc}
              beforeLabel={mixingDemo.beforeLabel}
              afterLabel={mixingDemo.afterLabel}
              storageKey={mixingDemo.storageKey}
              beforeNote={mixingDemo.beforeNote}
              afterNote={mixingDemo.afterNote}
            />
          </div>
        </div>
      </section>

      <section className="border-t border-border bg-background py-12">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
          <header className="mb-6 text-center">
            <h2 className="text-xl font-semibold text-foreground">
              MP3 לעומת WAV - ההבדל שחייבים להכיר
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              מה אנחנו מוסרים ולמה WAV הוא הארכיב שלכם
            </p>
          </header>
          <LazyYouTubeEmbed
            embedUrl="https://www.youtube.com/embed/TTEVMjQt8mU"
            title="MP3 לעומת WAV - ההבדל שחייבים להכיר | יקיר כהן הפקות"
          />
        </div>
      </section>

      <section className="mx-auto max-w-md px-4 py-14 sm:px-6">
        <div className="rounded-2xl border border-brand-red/30 bg-background p-8 text-center shadow-sm">
          <h2 className="text-xl font-semibold text-foreground">כמה זה עולה?</h2>
          <p className="mt-4 text-4xl font-bold text-foreground">500 ₪</p>
          <p className="text-sm text-muted-foreground">לשיר + מע&quot;מ</p>
          <ul className="mt-6 space-y-2 text-start text-sm text-muted-foreground">
            {MIXING_PRICE_INCLUDED.map((item) => (
              <li key={item} className="flex gap-2">
                <span className="text-brand-red">✓</span>
                {item}
              </li>
            ))}
          </ul>
          <h3 className="mt-6 text-start text-sm font-semibold text-foreground">
            תוספות אפשריות
          </h3>
          <ul className="mt-2 space-y-1 text-start text-xs text-muted-foreground">
            {MIXING_EXTRAS.map((item) => (
              <li key={item}>• {item}</li>
            ))}
          </ul>
          <div className="mt-6 flex flex-col gap-2 text-sm">
            <Link
              href="/online/vocal-fix/pitch-correction"
              className="font-medium text-brand-red hover:underline"
            >
              תיקון זיופים מלא </Link>
            <Link
              href="/online/vocal-fix"
              className="font-medium text-brand-red hover:underline"
            >
              שיפור קול / ניקוי רעשים </Link>
          </div>
        </div>
      </section>

      <section className="py-8">
        <JourneyStepsLink variant="online" />
      </section>

      <section className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
        <h2 className="text-lg font-semibold text-foreground">למה לבחור בנו?</h2>
        <ul className="mt-6 space-y-3">
          {MIXING_WHY_US.map((item) => (
            <li key={item} className="flex gap-2 text-sm text-muted-foreground">
              <span className="text-brand-red">⭐</span>
              {item}
            </li>
          ))}
        </ul>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <h2 className="mb-6 text-xl font-semibold text-foreground">שאלות נפוצות</h2>
        <FAQWithCtaLinks items={FAQ_ITEMS} />
      </section>

      <section className="border-t border-border bg-surface py-14 text-center">
        <h2 className="text-xl font-semibold text-foreground">
          מוכנים להפוך את השיר למקצועי?
        </h2>
        <p className="mx-auto mt-3 max-w-lg text-sm text-muted-foreground">
          מיקס ומאסטרינג טוב - ההבדל בין &quot;שיר ביתי&quot; ל&quot;שיר
          מקצועי&quot;. בואו נעשה את זה נכון.
        </p>
        <a
          href={ctaHref}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-7 inline-flex rounded-xl bg-brand-red px-7 py-3 text-sm font-semibold text-white hover:bg-brand-red-light"
        >
          התחילו בוואטסאפ </a>
        <div className="mt-5 flex flex-wrap justify-center gap-4">
          <Link href="/studio/recording-song-modiin" className="text-sm text-brand-red hover:underline">
            הקלטה באולפן
          </Link>
          <ShareButton title="מיקס ומאסטרינג מרחוק | יקיר כהן הפקות" />
        </div>
      </section>
      <div className="mx-auto max-w-[72rem] px-4 sm:px-6 lg:px-8">
        <ServiceBlogStrip posts={getBlogPostsByServiceSlug("online/vocal-fix/mixing")} />
      </div>
    </div>
  );
}
