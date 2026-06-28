import Link from "next/link";
import FAQWithCtaLinks, { type FaqCtaItem } from "@/components/ui/FAQWithCtaLinks";
import { buildWhatsAppHref } from "@/lib/whatsapp";
import { SITE_NAME } from "@/lib/constants";
import { formatFromPriceDual, getExVat } from "@/lib/data/pricing-catalog";
import ShareButton from "@/components/ui/ShareButton";

const PRICE_EX_VAT = getExVat("noise_removal_segment");

const WHAT_YOU_GET = [
  "הסרת רעשי רקע: מזגן, מאוורר, רחש אלקטרוני, רוח",
  "ניקוי שיח ורחש בין המילים",
  "שמירה על הקול הטבעי - בלי לחץ על הסאונד",
  "קובץ מוכן לפרסום - WAV או MP3 לבחירתכם",
];

const FAQ_ITEMS: FaqCtaItem[] = [
  {
    id: "what-is",
    question: "מה זה ניקוי רעשים בדיוק?",
    answer:
      "AI וכלים מקצועיים שמזהים את הרעש הקבוע ברקע - מזגן, מאוורר, רחש חשמלי - ומסירים אותו מבלי לפגוע בקול הדובר. התוצאה: הקלטה נקייה שנשמעת כאילו צולמה בסטודיו.",
    ctaText: "שלחו קובץ",
    whatsappMessage: "היי יקיר! יש לי הקלטה עם רעשי רקע - אשמח לסקיצה.",
    utm_campaign: "noise_faq_what",
  },
  {
    id: "who-for",
    question: "למי מתאים השירות?",
    answer:
      "לכל מי שהקליט בחדר לא מושתק: ראיון, פודקאסט, שיעור, נאום, שיר - כשיש רחש, מזגן, ציפורים, רוח או רעש רחוב שמפריע לאיכות ההקלטה.",
    ctaText: "שאלו אותנו",
    whatsappMessage: "היי יקיר! האם ניקוי רעשים יעזור להקלטה שלי?",
    utm_campaign: "noise_faq_who",
  },
  {
    id: "quality",
    question: "האם הניקוי ישמע מלאכותי?",
    answer:
      "לא, כשעושים את זה נכון. ניקוי אגרסיבי מדי יוצר אפקט מוזר על הקול. אנחנו עובדים בשכבות ובעדינות - כדי שהתוצאה תישמע מקצועית ולא \"לחוצה\".",
    ctaText: "בקשו סקיצה",
    whatsappMessage: "היי יקיר! אשמח לשמוע דוגמה לפני/אחרי ניקוי רעשים.",
    utm_campaign: "noise_faq_quality",
  },
  {
    id: "formats",
    question: "איך שולחים את הקובץ?",
    answer:
      "כל פורמט מתקבל: MP3, WAV, M4A, MP4. אפשר לשלוח ישירות בוואטסאפ, קישור ל-Google Drive, Dropbox - מה שנוח לכם.",
    ctaText: "שלחו עכשיו",
    whatsappMessage: "היי יקיר! שולח/ת קובץ לניקוי רעשים.",
    utm_campaign: "noise_faq_format",
  },
  {
    id: "longer",
    question: "מה אם הקטע ארוך מ-5 דקות?",
    answer:
      "במידה וההקלטה ארוכה מ-5 דקות, שלחו לנו הודעה בוואטסאפ ונחזור עם הצעת מחיר מותאמת לפי אורך הקטע.",
    ctaText: "הצעת מחיר",
    whatsappMessage: "היי יקיר! יש לי קטע ארוך - מה מחיר לניקוי רעשים?",
    utm_campaign: "noise_faq_longer",
  },
];

export default function OnlineNoiseRemovalPageContent() {
  const ctaHref = buildWhatsAppHref({
    text: "היי יקיר! יש לי הקלטה עם רעשי רקע שרוצה לנקות. אשמח לשמוע.",
    utm_source: "online",
    utm_campaign: "noise_removal_cta",
  });

  return (
    <div className="bg-background">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_55%_at_50%_-10%,rgba(212,43,43,0.12),transparent_55%)]"
          aria-hidden
        />
        <div className="relative mx-auto max-w-3xl px-4 py-16 text-center sm:px-6 sm:py-20 lg:px-8">
          <nav aria-label="ניווט" className="mb-6">
            <ol className="flex flex-wrap items-center justify-center gap-2 text-xs text-muted-foreground">
              <li>
                <Link href="/" className="hover:text-brand-red">ראשי</Link>
              </li>
              <li aria-hidden>/</li>
              <li>
                <Link href="/online" className="hover:text-brand-red">Online</Link>
              </li>
              <li aria-hidden>/</li>
              <li>
                <Link href="/online/vocal-fix" className="hover:text-brand-red">שיפור קול</Link>
              </li>
              <li aria-hidden>/</li>
              <li className="font-medium text-foreground" aria-current="page">ניקוי רעשים</li>
            </ol>
          </nav>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-red">
            {SITE_NAME}
          </p>
          <h1 className="mt-3 font-serif text-3xl font-semibold leading-tight text-foreground sm:text-4xl">
            מזגן, רחש, רוח ברקע? נסיר אותם
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-sm text-muted-foreground">
            הקלטתם בבית, בחדר ישיבות, בחוץ - ויש רעש ברקע? שלחו קובץ ונחזיר
            קטע נקי ומקצועי בלי רעשים, בלי לפגוע בקול הטבעי.
          </p>
          <a
            href={ctaHref}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex rounded-xl bg-brand-red px-7 py-3 text-sm font-semibold text-white shadow-[0_0_20px_rgba(212,43,43,0.3)] hover:bg-brand-red-light"
          >
            שלחו קובץ בוואטסאפ </a>
          <p className="mt-3 text-xs text-muted-foreground">
            {formatFromPriceDual(PRICE_EX_VAT)} · קטע עד 5 דקות
          </p>
        </div>
      </section>

      {/* מה מקבלים */}
      <section className="border-b border-border bg-surface py-12">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl font-semibold text-foreground">מה מקבלים</h2>
          <ul className="mt-6 space-y-3">
            {WHAT_YOU_GET.map((item) => (
              <li key={item} className="flex gap-3 text-sm text-muted-foreground">
                <span className="mt-0.5 text-brand-red" aria-hidden>✓</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* מחיר */}
      <section className="border-b border-border py-12">
        <div className="mx-auto max-w-2xl px-4 text-center sm:px-6">
          <h2 className="text-xl font-semibold text-foreground">מחיר</h2>
          <p className="mt-3 text-2xl font-bold text-brand-red">
            {formatFromPriceDual(PRICE_EX_VAT)}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">לקטע עד 5 דקות</p>
          <p className="mt-2 text-xs text-muted-foreground">
            קטעים ארוכים יותר - הצעת מחיר בוואטסאפ
          </p>
          <div className="mt-6 flex flex-col items-center gap-3">
            <a
              href={ctaHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex rounded-xl bg-brand-red px-7 py-3 text-sm font-semibold text-white hover:bg-brand-red-light"
            >
              שלחו קובץ לבדיקה ראשונית חינם </a>
            <Link
              href="/online/vocal-fix/send-file"
              className="text-sm text-brand-red hover:underline"
            >
              אישור תנאים ושליחת קבצים
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <h2 className="mb-6 text-xl font-semibold text-foreground">שאלות נפוצות</h2>
        <FAQWithCtaLinks items={FAQ_ITEMS} />
      </section>

      {/* CTA footer */}
      <section className="border-t border-border bg-surface py-14 text-center">
        <p className="text-sm text-muted-foreground">
          שלחו קובץ - ונחזיר קטע נקי ומוכן לפרסום.
        </p>
        <a
          href={ctaHref}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-flex rounded-xl bg-brand-red px-7 py-3 text-sm font-semibold text-white hover:bg-brand-red-light"
        >
          שלחו הקלטה עכשיו </a>
        <div className="mt-5 flex justify-center gap-4">
          <Link href="/online" className="text-sm text-brand-red hover:underline">
            כל שירותי Online
          </Link>
          <ShareButton title="ניקוי רעשים | יקיר כהן הפקות" />
        </div>
      </section>
    </div>
  );
}
