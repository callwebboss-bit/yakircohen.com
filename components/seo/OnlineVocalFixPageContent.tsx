import Link from "next/link";
import FAQWithCtaLinks, { type FaqCtaItem } from "@/components/ui/FAQWithCtaLinks";
import {
  VOCAL_FIX_AUDIENCE,
  VOCAL_FIX_PRICE_INCLUDED,
  VOCAL_FIX_PROCESSING,
  VOCAL_FIX_STEPS,
} from "@/lib/data/online-vocal-fix-page";
import { buildWhatsAppHref } from "@/lib/whatsapp";
import { SITE_NAME } from "@/lib/constants";
import ShareButton from "@/components/ui/ShareButton";

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
              אישור תנאים ושליחה ←
            </Link>
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

      <section className="mx-auto max-w-[72rem] px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-md rounded-2xl border border-brand-red/30 bg-background p-8 text-center shadow-sm">
          <h2 className="text-xl font-semibold text-foreground">כמה זה עולה?</h2>
          <p className="mt-4 text-4xl font-bold text-foreground">250 ₪</p>
          <p className="text-sm text-muted-foreground">+ מע&quot;מ</p>
          <ul className="mt-6 space-y-2 text-start text-sm text-muted-foreground">
            {VOCAL_FIX_PRICE_INCLUDED.map((item) => (
              <li key={item} className="flex gap-2">
                <span className="text-brand-red">✓</span>
                {item}
              </li>
            ))}
          </ul>
          <p className="mt-4 text-xs text-muted-foreground">
            לקטעים ארוכים: כל 5 דקות נוספות - 200 ₪
          </p>
          <div className="mt-4 flex flex-col gap-2 text-sm">
            <Link
              href="/online/vocal-fix/pitch-correction"
              className="font-medium text-brand-red hover:underline"
            >
              גם צריך תיקון זיופים? ←
            </Link>
            <Link
              href="/online/vocal-fix/photo-enhance"
              className="font-medium text-brand-red hover:underline"
            >
              שדרוג תמונות ב-AI (מ-50 ₪) ←
            </Link>
            <Link
              href="/online/vocal-fix/mixing"
              className="font-medium text-brand-red hover:underline"
            >
              מיקס ומאסטרינג (500 ₪) ←
            </Link>
          </div>
        </div>
      </section>

      <section className="border-t border-border bg-surface py-12">
        <div className="mx-auto max-w-2xl px-4 sm:px-6">
          <h2 className="text-lg font-semibold text-foreground">איך זה עובד?</h2>
          <ol className="mt-6 space-y-4">
            {VOCAL_FIX_STEPS.map((s) => (
              <li key={s.step}>
                <p className="font-medium text-foreground">{s.step}</p>
                <p className="mt-1 text-sm text-muted-foreground">{s.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
        <h2 className="text-lg font-semibold text-foreground">דיסקרטיות מוחלטת</h2>
        <p className="mt-3 text-sm text-muted-foreground">
          החומרים רגישים. מחויבות ל-100% סודיות, קבצים במערכות מאובטחות,
          נגישים רק לצוות המטפל, ללא שימוש מעבר לשירות.
        </p>
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
          שלחו קובץ בוואטסאפ ←
        </a>
        <div className="mt-5 flex justify-center">
          <ShareButton title="שיפור קול מהנייד | יקיר כהן הפקות" />
        </div>
      </section>
    </div>
  );
}
