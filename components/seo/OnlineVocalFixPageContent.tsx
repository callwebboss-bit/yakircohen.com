import Link from "next/link";
import SoundImprovementShowcase from "@/components/seo/SoundImprovementShowcase";
import FAQWithCtaLinks, { type FaqCtaItem } from "@/components/ui/FAQWithCtaLinks";
import JourneyStepsLink from "@/components/marketing/JourneyStepsLink";
import {
  VOCAL_FIX_AUDIENCE,
  VOCAL_FIX_PROCESSING,
} from "@/lib/data/online-vocal-fix-page";
import { buildWhatsAppHref } from "@/lib/whatsapp";
import { SITE_NAME } from "@/lib/constants";
import ShareButton from "@/components/ui/ShareButton";
import BusinessCrossLink from "@/components/marketing/BusinessCrossLink";
import { buildFaqSchema } from "@/lib/seo/page-schema";
import AudioDamageSolver from "@/components/seo/AudioDamageSolver";
import SuccessRateEstimator from "@/components/seo/SuccessRateEstimator";
import VocalFixPricingBlock from "@/components/seo/VocalFixPricingBlock";

const FAQ_ITEMS: FaqCtaItem[] = [
  {
    id: "unhappy",
    question: "מה אם אני לא מרוצה מהתוצאה?",
    answer:
      'מומלץ לשלוח סקיצה (30 שניות) לפני ההזמנה המלאה. נחזיר "לפני ואחרי" חינם - כדי שתדעו מה לצפות.',
    ctaText: "בקשו סקיצה חינם",
    whatsappMessage:
      "היי יקיר! אשמח לשלוח קטע 30 שניות לסקיצה לפני ואחרי (שיפור קול).",
    utm_campaign: "vocal_fix_faq_sample",
  },
  {
    id: "formats",
    question: "יש הגבלה על סוגי קבצים?",
    answer: "תומכים ב-MP3, WAV, M4A, AAC ועוד. פורמט אחר? צרו קשר.",
    ctaText: "שאלו על פורמט",
    whatsappMessage: "היי יקיר! יש לי קובץ בפורמט [הוסף] - האם אתם תומכים?",
    utm_campaign: "vocal_fix_faq_format",
  },
  {
    id: "time",
    question: "כמה זמן לוקח?",
    answer:
      "בדרך כלל 1-3 ימי עסקים. במקרי דחיפות - אפשר להזדרז (בתשלום נוסף).",
    ctaText: "בדקו זמינות",
    whatsappMessage: "היי יקיר! צריך שיפור קול בדחיפות. מה אפשר?",
    utm_campaign: "vocal_fix_faq_time",
  },
  {
    id: "diff",
    question: "מה ההבדל בין השירות שלכם לשירותים אחרים?",
    answer:
      "20 שנות ניסיון באולפן, ציוד מקצועי וגישה אישית לכל קובץ - לא עיבוד אוטומטי בלבד.",
    ctaText: "שלחו קובץ",
    whatsappMessage: "היי יקיר! מעוניין/ת בשירות שיפור קול מהנייד.",
    utm_campaign: "vocal_fix_faq_diff",
  },
];

export default function OnlineVocalFixPageContent() {
  const ctaHref = buildWhatsAppHref({
    text: "היי יקיר! אני מעוניין/ת בשירות שיפור קול מהנייד (250 ₪ עד 5 דק). אשמח לשלוח קובץ.",
    utm_source: "online",
    utm_campaign: "vocal_fix_cta",
  });

  const faqSchema = buildFaqSchema(FAQ_ITEMS.map(({ question, answer }) => ({ question, answer })));

  return (
    <div className="bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
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
              <li className="font-medium text-foreground" aria-current="page">
                שיפור קול
              </li>
            </ol>
          </nav>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-red">
            {SITE_NAME}
          </p>
          <h1 className="mt-3 font-serif text-3xl font-semibold leading-tight text-foreground sm:text-4xl">
            שיפור קול מהנייד
          </h1>
          <p className="mx-auto mt-4 text-base font-medium text-foreground">
            הפכו הקלטה ביתית לאיכות אולפן
          </p>
          <p className="mx-auto mt-5 max-w-2xl text-sm text-muted-foreground">
            הקלטתם בטלפון או בבית ואיכות הסאונד נמוכה? התוכן מדהים, המסר חשוב -
            אבל רעשי רקע, הד, קול שטוח או חלש גורמים לאנשים לעזוב אחרי 10
            שניות. שולחים אלינו - מקבלים קובץ מקצועי.
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/online/vocal-fix/send-file"
              className="inline-flex rounded-xl bg-brand-red px-7 py-3 text-sm font-semibold text-white shadow-[0_0_20px_rgba(212,43,43,0.3)] hover:bg-brand-red-light"
            >
              אישור תנאים ושליחה </Link>
            <a
              href={ctaHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex rounded-xl border border-border bg-background px-7 py-3 text-sm font-semibold text-foreground hover:border-brand-red/40 hover:text-brand-red"
            >
              הזמינו בוואטסאפ
            </a>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        <p className="border-r-[3px] border-brand-red/40 pr-4 text-sm italic leading-relaxed text-foreground/80 sm:text-base">
          הקלטת בבית - ויצאת עם קובץ שמלא ברעשים, הד, או סאונד שלא מייצג
          אותך. עכשיו אתה מסתכל על הקובץ ולא יודע אם בכלל שווה לשלוח לאנשים.
          אני מבין את זה - לא צריך ציוד יקר ולא צריך להקליט מחדש. שולחים לי
          קובץ, ומקבלים בחזרה סאונד.
        </p>
      </section>

      <section className="mx-auto max-w-[72rem] px-4 sm:px-6 lg:px-8">
        <BusinessCrossLink
          title="קלטות VHS או קסטות ישנות?"
          text="המרה לדיגיטל ושחזור AI. לא רק קובץ דיגיטלי שכבר יש לכם."
          href="/online/legacy-digitization"
          linkLabel="החייאת זיכרונות"
        />
      </section>

      <section className="mx-auto max-w-[72rem] px-4 py-14 sm:px-6 lg:px-8">
        <h2 className="mb-8 text-xl font-semibold text-foreground">
          מה אנחנו עושים לקובץ שלכם?
        </h2>
        <div className="grid gap-5 sm:grid-cols-2">
          {VOCAL_FIX_PROCESSING.map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-border bg-background p-6"
            >
              <span className="text-2xl" aria-hidden>
                {item.icon}
              </span>
              <h3 className="mt-2 font-semibold text-foreground">{item.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-border bg-surface py-12">
        <div className="mx-auto max-w-[72rem] px-4 sm:px-6 lg:px-8">
          <h2 className="mb-4 text-lg font-semibold text-foreground">למי זה מתאים?</h2>
          <ul className="grid gap-2 sm:grid-cols-2">
            {VOCAL_FIX_AUDIENCE.map((item) => (
              <li key={item} className="flex gap-2 text-sm text-muted-foreground">
                <span className="text-brand-red">✓</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="border-t border-border bg-surface py-14">
        <div className="mx-auto max-w-[72rem] px-4 sm:px-6 lg:px-8">
          <SuccessRateEstimator />
        </div>
      </section>

      <section className="border-t border-border bg-background py-12">
        <div className="mx-auto max-w-[72rem] px-4 sm:px-6 lg:px-8">
          <header className="mx-auto max-w-2xl text-center">
            <h2 className="text-xl font-semibold text-foreground">
              שמעו את ההבדל בעצמכם
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              דוגמה מהקלטה פגומה - פודקאסט ישן, הרצאה או ארכיון. שחזור קשה ותלוי
              במקור.
            </p>
          </header>
          <div className="mx-auto mt-8 max-w-2xl">
            <SoundImprovementShowcase
              demoId="weber-restoration"
              variant="restoration"
              showDisclaimer
            />
          </div>
        </div>
      </section>

      <section className="border-t border-border bg-surface py-14">
        <div className="mx-auto max-w-[72rem] px-4 sm:px-6 lg:px-8">
          <header className="mb-8">
            <h2 className="text-xl font-semibold text-foreground">
              מה הבעיה בהקלטה שלכם?
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              בחרו קטגוריה - שמעו דגימת לפני/אחרי ממש כאן
            </p>
          </header>
          <AudioDamageSolver />
        </div>
      </section>

      <section className="mx-auto max-w-[72rem] px-4 py-14 sm:px-6 lg:px-8">
        <VocalFixPricingBlock />
      </section>

      <section className="py-8">
        <JourneyStepsLink variant="online" />
      </section>

      <section className="mx-auto max-w-[72rem] px-4 py-10 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-[#1a3a5c]/20 bg-[#0f2540]/5 p-6 dark:border-[#2a5080]/40 dark:bg-[#0a1a2e]/60">
          <div className="flex items-start gap-4">
            <span
              className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#0f2540]/10 text-2xl dark:bg-[#1a3a5c]/30"
              aria-hidden
            >
              🔒
            </span>
            <div>
              <h2 className="text-base font-semibold text-[#0f2540] dark:text-[#7ab3e0]">
                סודיות מוחלטת ומאובטחת
              </h2>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                כל קובץ המועלה עובר הצפנה מלאה, משמש אך ורק לצורך התיקון
                המקצועי, ונמחק אוטומטית משרתי האולפן בתוך 7 ימים מסיום
                העבודה. אין שיתוף, אין גיבוי חיצוני, אין שימוש מעבר לשירות.
              </p>
              <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5 text-xs text-muted-foreground">
                {["הצפנה מלאה בהעברה ובאחסון", "גישה לצוות המטפל בלבד", "מחיקה אוטומטית תוך 7 ימים"].map(
                  (item) => (
                    <li key={item} className="flex items-center gap-1.5">
                      <span className="text-[#0f2540]/60 dark:text-[#7ab3e0]/60" aria-hidden>
                        ✓
                      </span>
                      {item}
                    </li>
                  ),
                )}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <h2 className="mb-6 text-xl font-semibold text-foreground">שאלות נפוצות</h2>
        <FAQWithCtaLinks items={FAQ_ITEMS} />
      </section>

      <section className="border-t border-border bg-surface py-14 text-center">
        <a
          href={ctaHref}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex rounded-xl bg-brand-red px-7 py-3 text-sm font-semibold text-white hover:bg-brand-red-light"
        >
          שלחו קובץ בוואטסאפ </a>
        <div className="mt-5 flex justify-center">
          <ShareButton title="שיפור קול מהנייד | יקיר כהן הפקות" />
        </div>
      </section>

      <section className="mx-auto max-w-[72rem] px-4 pb-14 sm:px-6 lg:px-8 space-y-5">
        <div className="rounded-2xl border border-brand-red/25 bg-brand-red/5 p-6 text-center">
          <p className="font-semibold text-foreground">יש לך הקלטה פגומה?</p>
          <p className="mt-1 text-sm text-muted-foreground">אל תדאג - אני מציל הקלטות תוך שעות.</p>
          <a
            href={ctaHref}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex rounded-xl bg-brand-red px-6 py-2.5 text-sm font-semibold text-white hover:bg-brand-red-light"
          >
            שלח לי קובץ עכשיו
          </a>
        </div>
        <Link
          href="/blog/rescue-damaged-recording"
          className="flex items-start gap-4 rounded-2xl border border-border bg-surface p-5 transition-colors hover:border-brand-red/40"
        >
          <span className="mt-0.5 text-2xl" aria-hidden>📖</span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-brand-red">מאמר קשור</p>
            <p className="mt-1 font-semibold text-foreground">הצלת הקלטה פגומה: מה אפשרי, מה לא ואיך מקבלים החלטה נכונה</p>
            <p className="mt-1 text-sm text-muted-foreground">מדריך מקצועי לפני שמחליטים - לקריאה </p>
          </div>
        </Link>
      </section>
    </div>
  );
}
