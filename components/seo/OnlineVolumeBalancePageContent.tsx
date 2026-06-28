import Link from "next/link";
import FAQWithCtaLinks, { type FaqCtaItem } from "@/components/ui/FAQWithCtaLinks";
import { buildWhatsAppHref } from "@/lib/whatsapp";
import { SITE_NAME } from "@/lib/constants";
import { formatFromPriceDual, getExVat } from "@/lib/data/pricing-catalog";
import ShareButton from "@/components/ui/ShareButton";

const PRICE_EX_VAT = getExVat("volume_balance_full");

const WHAT_YOU_GET = [
  "איזון עוצמות קול בין כל הקטעים בהקלטה",
  "ווליום אחיד לאורך כל הקובץ - בלי עליות וירידות פתאומיות",
  "נורמליזציה לפלטפורמות (יוטיוב, אינסטגרם, ספוטיפיי)",
  "קובץ מוכן לפרסום - WAV או MP3 לבחירתכם",
];

const FAQ_ITEMS: FaqCtaItem[] = [
  {
    id: "what-is",
    question: "מה זה בדיוק איזון ווליומים?",
    answer:
      "כשמקליטים כמה אנשים בשיחה, ראיון או פודקאסט, קול אחד לרוב רם יותר מהשני. גם בין קטעים שהוקלטו בזמנים שונים, ההבדל מורגש. אנחנו מאזנים את כל עוצמות הקול כך שהמאזין ייהנה מחוויה אחידה - בלי לגעת בריגולה.",
    ctaText: "שלחו קובץ",
    whatsappMessage: "היי יקיר! יש לי הקלטה עם ווליום לא אחיד - אשמח לשמוע איך עוזרים.",
    utm_campaign: "volume_faq_what",
  },
  {
    id: "who-for",
    question: "למי מתאים השירות?",
    answer:
      "לכל מי שהקליט ראיון, שיחה, שיר, פודקאסט, שיעור או נאום עם יותר מדובר אחד - ורוצה שכולם יישמעו ברמת ווליום דומה. גם למי שמרכיב קטעים שהוקלטו בנפרד ורוצה עקביות.",
    ctaText: "שלחו דוגמה",
    whatsappMessage: "היי יקיר! יש לי הקלטה עם ווליום לא אחיד - אשמח לסקיצה.",
    utm_campaign: "volume_faq_who",
  },
  {
    id: "how-long",
    question: "תוך כמה זמן אקבל את הקובץ המאוזן?",
    answer:
      "בדרך כלל 1-3 ימי עסקים. קטעים קצרים מוכנים לרוב הרבה יותר מהר. בדחיפות - שאלו אותנו בוואטסאפ ונבדוק זמינות.",
    ctaText: "שאלו על דחיפות",
    whatsappMessage: "היי יקיר! צריך איזון ווליומים בדחיפות - מה זמינות?",
    utm_campaign: "volume_faq_speed",
  },
  {
    id: "formats",
    question: "באיזה פורמט שולחים?",
    answer:
      "כל פורמט מתקבל: MP3, WAV, M4A ועוד. אפשר לשלוח ישירות בוואטסאפ, קישור ל-Drive, Dropbox - מה שנוח לכם.",
    ctaText: "שלחו קובץ",
    whatsappMessage: "היי יקיר! שולח/ת קובץ לאיזון ווליומים.",
    utm_campaign: "volume_faq_format",
  },
  {
    id: "longer",
    question: "מה קורה אם הקטע ארוך מ-5 דקות?",
    answer:
      "במידה וההקלטה ארוכה מ-5 דקות, שלחו לנו הודעה בוואטסאפ ונחזור עם הצעת מחיר מותאמת לפי אורך הקטע.",
    ctaText: "הצעת מחיר לקטע ארוך",
    whatsappMessage: "היי יקיר! יש לי הקלטה ארוכה - מה מחיר לאיזון ווליומים?",
    utm_campaign: "volume_faq_longer",
  },
];

export default function OnlineVolumeBalancePageContent() {
  const ctaHref = buildWhatsAppHref({
    text: "היי יקיר! יש לי הקלטה שצריכה איזון ווליומים. אשמח לשמוע.",
    utm_source: "online",
    utm_campaign: "volume_balance_cta",
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
              <li className="font-medium text-foreground" aria-current="page">איזון ווליומים</li>
            </ol>
          </nav>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-red">
            {SITE_NAME}
          </p>
          <h1 className="mt-3 font-serif text-3xl font-semibold leading-tight text-foreground sm:text-4xl">
            הקלטתם - ועכשיו קול אחד רם מדי והשני שקט מדי?
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-sm text-muted-foreground">
            זה קורה לכולם. אנחנו מאזנים את הווליומים כך שהמאזין לא צריך לגעת בריגולה.
            שלחו קובץ, מקבלים חזרה קטע מוכן לפרסום.
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
          שלחו קובץ - ונחזיר עם ווליום אחיד ומוכן לפרסום.
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
          <ShareButton title="איזון ווליומים | יקיר כהן הפקות" />
        </div>
      </section>
    </div>
  );
}
