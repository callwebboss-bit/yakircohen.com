import Link from "next/link";
import FAQWithCtaLinks, { type FaqCtaItem } from "@/components/ui/FAQWithCtaLinks";
import AudioShowcase from "@/components/seo/AudioShowcase";
import ShowcaseVideoSection from "@/components/seo/ShowcaseVideoSection";
import JourneyStepsLink from "@/components/marketing/JourneyStepsLink";
import {
  PITCH_AUDIENCE,
  PITCH_MANUAL_METHOD,
  PITCH_PRICE_INCLUDED,
  PITCH_STUDIO_EXPERIENCE,
  PITCH_WHO_FOR,
} from "@/lib/data/online-pitch-correction-page";
import { buildWhatsAppHref } from "@/lib/whatsapp";
import { SITE_NAME } from "@/lib/constants";
import ShareButton from "@/components/ui/ShareButton";

const FAQ_ITEMS: FaqCtaItem[] = [
  {
    id: "good-singer",
    question: "האם זה הופך אותי לזמר טוב?",
    answer:
      "לא. מתקנים טעויות קטנות, לא הופכים מישהו שלא יודע לשיר לביונסה. זיופים קטנים - תוצאה מעולה. ממש לא יודע לשיר - לא נעשה נס.",
    ctaText: "שלחו דוגמה",
    whatsappMessage: "היי יקיר! יש לי שיר עם זיופים - האם אפשר לתקן?",
    utm_campaign: "pitch_faq_singer",
  },
  {
    id: "hard-pitch",
    question: "אם הזיוף שלי ממש קשה, יש לזה תקווה?",
    answer:
      'תתפלאו מה אפשר היום. "מפסלים" את הקול מחדש. כל עוד יש לב ורגש - נדאג שהסולם יהיה מדויק.',
    ctaText: "בדקו איתנו",
    whatsappMessage: "היי יקיר! יש לי זיופים חזקים בשיר - יש תקווה?",
    utm_campaign: "pitch_faq_hard",
  },
  {
    id: "robotic",
    question: "האם זה יישמע רובוטי או מלאכותי?",
    answer:
      'ממש לא. המטרה היא "שקיפות" - עריכה ידנית, שמירה על נשימות וניואנסים ו-DNA של הקול, בלי הטעויות.',
    ctaText: "בקשו לפני/אחרי",
    whatsappMessage: "היי יקיר! אשמח לדוגמת לפני ואחרי לתיקון זיופים.",
    utm_campaign: "pitch_faq_natural",
  },
  {
    id: "during-recording",
    question: "האם אתם עוזרים גם תוך כדי ההקלטה?",
    answer:
      "כן. באולפן במודיעין זו הדרכה - טיפים לנשימה והגשה כדי להגיע לחומר גלם מעולה לפני התיקון.",
    ctaText: "תיאום באולפן",
    whatsappMessage: "היי יקיר! רוצה להקליט שיר באולפן עם הדרכה ותיקון זיופים.",
    utm_campaign: "pitch_faq_studio",
  },
  {
    id: "cant-sing",
    question: "ואם אני ממש, ממש לא יודע לשיר?",
    answer:
      "בדיוק בשביל זה אנחנו כאן. טכנולוגיה + אוזן מוזיקלית. אם יש רגש ורצון - התוצאה תהיה מוזיקלית ומהנה.",
    ctaText: "שיחה קצרה",
    whatsappMessage: "היי יקיר! לא בטוח/ה ביכולת השירה - אשמח לייעוץ על תיקון זיופים.",
    utm_campaign: "pitch_faq_beginner",
  },
  {
    id: "sample",
    question: "אפשר לראות דוגמה לפני?",
    answer: 'כן! שלחו קטע 30 שניות ונחזיר "לפני ואחרי" חינם.',
    ctaText: "שלחו 30 שניות",
    whatsappMessage: "היי יקיר! שולח/ת 30 שניות לדוגמת לפני ואחרי (תיקון זיופים).",
    utm_campaign: "pitch_faq_sample",
  },
  {
    id: "combo",
    question: "אפשר לשלב עם שירותים אחרים?",
    answer:
      "כן. רוב הלקוחות משלבים תיקון זיופים + מיקס ומאסטרינג. עובד גם על הקלטות ביתיות (מומלץ גם ניקוי רעשים).",
    ctaText: "הצעת מחיר משולבת",
    whatsappMessage: "היי יקיר! רוצה תיקון זיופים + מיקס. אשמח להצעה.",
    utm_campaign: "pitch_faq_combo",
  },
];

export default function OnlinePitchCorrectionPageContent() {
  const ctaHref = buildWhatsAppHref({
    text: "היי יקיר! אני מעוניין/ת בתיקון זיופים (Pitch Correction) לשיר. אשמח להצעת מחיר.",
    utm_source: "online",
    utm_campaign: "pitch_correction_cta",
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
                  שיפור קול
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li className="font-medium text-foreground" aria-current="page">
                תיקון זיופים
              </li>
            </ol>
          </nav>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-red">
            {SITE_NAME}
          </p>
          <h1 className="mt-3 font-serif text-3xl font-semibold leading-tight text-foreground sm:text-4xl">
            תפסיקו לחשוש מהזיוף - תתחילו ליהנות מהשיר
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-sm text-muted-foreground">
            כולנו מזייפים לפעמים, וזה בסדר. המשימה: לקחת את הרגש ולתת לו את
            הדיוק שמגיע לו. אתם מביאים את הלב - אנחנו מביאים את הליטוש.
          </p>
          <p className="mx-auto mt-4 max-w-xl text-sm text-muted-foreground">
            יש כמה זיופים שמפריעים? לא צריך להקליט מחדש. מתקנים בצורה טבעית
            שאף אחד לא ישים לב.
          </p>
          <a
            href={ctaHref}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex rounded-xl bg-brand-red px-7 py-3 text-sm font-semibold text-white shadow-[0_0_20px_rgba(212,43,43,0.3)] hover:bg-brand-red-light"
          >
            שלחו שיר לבדיקה ←
          </a>
        </div>
      </section>

      <section className="border-b border-border bg-surface py-12">
        <div className="mx-auto max-w-[72rem] px-4 sm:px-6 lg:px-8">
          <h2 className="mb-6 text-center text-xl font-semibold text-foreground">
            חוויית האולפן: מה מרגישים אצל יקיר?
          </h2>
          <div className="grid gap-5 sm:grid-cols-3">
            {PITCH_STUDIO_EXPERIENCE.map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-border bg-background p-5"
              >
                <h3 className="font-semibold text-foreground">{item.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{item.body}</p>
              </div>
            ))}
          </div>
          <ul className="mx-auto mt-8 max-w-xl space-y-2">
            {PITCH_WHO_FOR.map((item) => (
              <li key={item} className="text-sm text-muted-foreground">
                • {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mx-auto max-w-[72rem] px-4 py-14 sm:px-6 lg:px-8">
        <h2 className="text-xl font-semibold text-foreground">מה זה תיקון זיופים?</h2>
        <p className="mt-4 max-w-2xl text-sm text-muted-foreground">
          Pitch Correction / Auto-Tune - תיקון תווים שלא יצאו מדויקים. שימוש
          ב-Melodyne, Auto-Tune ו-AI מתקדם. הזיופים נעלמים, הקול נשאר טבעי -
          לא רובוטי.
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {PITCH_AUDIENCE.map((item) => (
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
      </section>

      {/* Before/After Audio Demo */}
      <section className="border-t border-border bg-surface py-12">
        <div className="mx-auto max-w-[72rem] px-4 sm:px-6 lg:px-8">
          <header className="mx-auto max-w-2xl text-center">
            <h2 className="text-xl font-semibold text-foreground">
              שמעו את ההבדל בעצמכם
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              אותו קטע שירה - לפני ואחרי עריכה ידנית של תיקון זיופים.
            </p>
          </header>
          <div className="mx-auto mt-8 max-w-2xl">
            <AudioShowcase
              variant="vocal"
              context="page"
              beforeSrc="/audio/pitch-raw.mp3"
              afterSrc="/audio/pitch-tuned.mp3"
            />
          </div>
        </div>
      </section>

      <section className="border-t border-border bg-surface py-12">
        <div className="mx-auto max-w-md px-4 text-center sm:px-6">
          <h2 className="text-xl font-semibold text-foreground">כמה זה עולה?</h2>
          <Link
            href="/online/online-ai-pricing"
            className="mt-2 inline-block text-sm font-medium text-brand-red hover:underline"
          >
            לצפייה במחירון המלא ←
          </Link>
          <ul className="mt-6 space-y-2 text-start text-sm text-muted-foreground">
            {PITCH_PRICE_INCLUDED.map((item) => (
              <li key={item} className="flex gap-2">
                <span className="text-brand-red">✓</span>
                {item}
              </li>
            ))}
          </ul>
          <p className="mt-4 text-xs text-muted-foreground">
            לשירים ארוכים: מעל 4 דקות - 100 ₪ נוספים
          </p>
        </div>
      </section>

      <section className="py-8">
        <JourneyStepsLink variant="online" />
      </section>

      <section className="mx-auto max-w-2xl border-t border-border px-4 py-12 sm:px-6">
        <h2 className="text-lg font-semibold text-foreground">
          למה לא Auto-Tune אוטומטי?
        </h2>
        <p className="mt-3 text-sm text-muted-foreground">
          תוכנות אוטומטיות הופכות את השיר לרובוטי. השיטה שלנו:
        </p>
        <ul className="mt-4 space-y-2">
          {PITCH_MANUAL_METHOD.map((item) => (
            <li key={item} className="flex gap-2 text-sm text-muted-foreground">
              <span className="text-brand-red">-</span>
              {item}
            </li>
          ))}
        </ul>
        <p className="mt-4 text-sm font-medium text-foreground">
          התוצאה: שיר שנשמע כאילו הוקלט מושלם מההתחלה.
        </p>
        <p className="mt-4 text-sm text-muted-foreground">
          עם Melodyne ו-Auto-Tune מתקדמים מיישרים כל תו, מדייקים סאונד ושומרים
          על הגוון הטבעי. ביצוע מושלם, נקי ומרגש.
        </p>
        <p className="mt-4 text-sm text-muted-foreground">
          גם אם אתם בטוחים שלא יודעים לשיר - אל תוותרו על השיר. אצלנו חוגגים
          יצירה, סביבה תומכת ותוצאה שתהיו גאים להשמיע.
        </p>
      </section>

      {/* Video Tutorial */}
      <div className="border-t border-border bg-background px-4 py-12 sm:px-6 lg:px-8">
        <ShowcaseVideoSection
          kicker="הדרכת וידאו"
          heading="תיקון זיופים מא׳ עד ת׳"
          subheading="צפו בתהליך השלם - מקובץ גולמי ועד גרסה מלוטשת"
          videos={[{ videoId: "aTGqFnijz0Q", title: "הדרכת תיקון זיופים - Pitch Correction" }]}
        />
      </div>

      <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <h2 className="mb-6 text-xl font-semibold text-foreground">שאלות נפוצות</h2>
        <FAQWithCtaLinks items={FAQ_ITEMS} />
      </section>

      {/* Recorded Testimonial */}
      <section className="mx-auto max-w-2xl border-t border-border px-4 py-12 sm:px-6">
        <h2 className="text-lg font-semibold text-foreground">
          שמעו מלקוח שעבר את התהליך
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          המלצה מוקלטת על שירות תיקון הזיופים.
        </p>
        <div className="mt-5 rounded-2xl border border-border bg-surface p-5">
          {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
          <audio
            controls
            preload="none"
            className="w-full"
            aria-label="המלצה מוקלטת על שירות תיקון זיופים"
          >
            <source src="/audio/AI-patch-recommendation.mp3" type="audio/mpeg" />
          </audio>
        </div>
      </section>

      <section className="border-t border-border bg-surface py-14 text-center">
        <p className="text-sm text-muted-foreground">
          עריכת תיקון זיופים היא עבודת נמלים דקדקנית - בזמן שאתם נחים, אנחנו
          עוברים הברה-הברה.
        </p>
        <a
          href={ctaHref}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-flex rounded-xl bg-brand-red px-7 py-3 text-sm font-semibold text-white hover:bg-brand-red-light"
        >
          שלחו שיר בוואטסאפ ←
        </a>
        <div className="mt-5 flex justify-center gap-4">
          <Link
            href="/studio/recording-song-modiin"
            className="text-sm text-brand-red hover:underline"
          >
            הקלטה באולפן
          </Link>
          <ShareButton title="תיקון זיופים | יקיר כהן הפקות" />
        </div>
      </section>

      <section className="mx-auto max-w-[72rem] px-4 pb-14 sm:px-6 lg:px-8">
        <Link
          href="/blog/pitch-correction-vs-autotune"
          className="flex items-start gap-4 rounded-2xl border border-border bg-surface p-5 transition-colors hover:border-brand-red/40"
        >
          <span className="mt-0.5 text-2xl" aria-hidden>📖</span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-brand-red">מאמר קשור</p>
            <p className="mt-1 font-semibold text-foreground">Pitch Correction לעומת Auto-Tune: מה ההבדל ומתי להשתמש בכל אחד</p>
            <p className="mt-1 text-sm text-muted-foreground">המדריך המלא לתיקון זיופים טבעי - לקריאה ←</p>
          </div>
        </Link>
      </section>
    </div>
  );
}
