import Link from "next/link";
import FAQWithCtaLinks, { type FaqCtaItem } from "@/components/ui/FAQWithCtaLinks";
import { buildWhatsAppHref } from "@/lib/whatsapp";
import { SITE_NAME } from "@/lib/constants";
import { formatFromPriceDual, getExVat } from "@/lib/data/pricing-catalog";
import ShareButton from "@/components/ui/ShareButton";

const PRICE_EX_VAT = getExVat("eq_freq_fix");

const WHAT_YOU_GET = [
  "איזון תדרים: הסרת צרימה, עמימות וחוסר נוכחות",
  "EQ מקצועי שמתאים את הקול לפלטפורמה (פודקאסט, יוטיוב, אינסטגרם)",
  "קול שנשמע ברור, חם ואמין - בלי שיישמע ביתי",
  "קובץ מוכן לפרסום - WAV או MP3 לבחירתכם",
];

const PROBLEMS = [
  { icon: "😖", label: "הסאונד עמום ו'ביתי'" },
  { icon: "😬", label: "יש צרימה לא נעימה" },
  { icon: "😶", label: "הקול לא מורגש, חסר נוכחות" },
  { icon: "🎤", label: "ההקלטה נשמעת רחוקה מהמיקרופון" },
];

const FAQ_ITEMS: FaqCtaItem[] = [
  {
    id: "what-is",
    question: "מה זה EQ ותיקון תדרים - בשפה פשוטה?",
    answer:
      "EQ הוא קיצור של Equalizer - כלי לאיזון תדרים. כל קול מורכב מתדרים שונים: בסים, אמצע וחרשים. כשהיחס ביניהם לא נכון, הסאונד נשמע עמום, צורמני או ביתי. תיקון EQ מאזן אותם כך שהסאונד נשמע ברור, חם ומקצועי.",
    ctaText: "שלחו קובץ",
    whatsappMessage: "היי יקיר! הסאונד שלי נשמע לא טוב - אשמח לתיקון EQ.",
    utm_campaign: "eq_faq_what",
  },
  {
    id: "who-for",
    question: "למי מתאים השירות?",
    answer:
      "לפודקאסטים, ראיונות, שירים, קריינות ושיעורים מוקלטים - כל מי שהסאונד שלו נשמע טלפוני, עמום, או שיש בו צרימה שמפריעה למאזינים.",
    ctaText: "שאלו אותנו",
    whatsappMessage: "היי יקיר! האם תיקון EQ יעזור לסאונד שלי?",
    utm_campaign: "eq_faq_who",
  },
  {
    id: "natural",
    question: "האם הקול ישתנה לאחר התיקון?",
    answer:
      "לא - הקול שלכם ישאר שלכם. המטרה היא שיישמע כאילו הוקלט בתנאים מעולים. מתקנים את הסאונד, לא את הזהות הקולית.",
    ctaText: "בקשו סקיצה",
    whatsappMessage: "היי יקיר! אשמח לשמוע דוגמה לפני/אחרי תיקון EQ.",
    utm_campaign: "eq_faq_natural",
  },
  {
    id: "combo",
    question: "אפשר לשלב עם ניקוי רעשים?",
    answer:
      "בהחלט - ורוב הלקוחות שלנו עושים את זה. שאלו אותנו בוואטסאפ על חבילה משולבת.",
    ctaText: "שאלו על חבילה",
    whatsappMessage: "היי יקיר! רוצה ניקוי רעשים + תיקון EQ ביחד - כמה עולה?",
    utm_campaign: "eq_faq_combo",
  },
  {
    id: "longer",
    question: "מה אם הקטע ארוך מ-5 דקות?",
    answer:
      "במידה וההקלטה ארוכה מ-5 דקות, שלחו לנו הודעה בוואטסאפ ונחזור עם הצעת מחיר מותאמת לפי אורך הקטע.",
    ctaText: "הצעת מחיר",
    whatsappMessage: "היי יקיר! יש לי קטע ארוך - מה מחיר לתיקון EQ?",
    utm_campaign: "eq_faq_longer",
  },
];

export default function OnlineEqFixPageContent() {
  const ctaHref = buildWhatsAppHref({
    text: "היי יקיר! הסאונד שלי לא נשמע טוב ורוצה תיקון תדרים ו-EQ. אשמח לשמוע.",
    utm_source: "online",
    utm_campaign: "eq_fix_cta",
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
              <li className="font-medium text-foreground" aria-current="page">תיקון תדרים ו-EQ</li>
            </ol>
          </nav>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-red">
            {SITE_NAME}
          </p>
          <h1 className="mt-3 font-serif text-3xl font-semibold leading-tight text-foreground sm:text-4xl">
            הסאונד נשמע עמום, צורמני, לא מקצועי?
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-sm text-muted-foreground">
            זה לא בעיה של המיקרופון שלכם - זה תדרים לא מאוזנים. אנחנו מתקנים
            את זה כך שהקול יישמע ברור, חם ואמין - בדיוק כמו שנשמע אצל הפודקאסטים
            הגדולים.
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

      {/* בעיות שנפתרות */}
      <section className="border-b border-border bg-surface py-12">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl font-semibold text-foreground">מכירים את הבעיות האלה?</h2>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {PROBLEMS.map((p) => (
              <div
                key={p.label}
                className="flex items-center gap-3 rounded-xl border border-border bg-background p-4 text-sm text-muted-foreground"
              >
                <span className="text-xl" aria-hidden>{p.icon}</span>
                {p.label}
              </div>
            ))}
          </div>
          <p className="mt-6 text-sm font-medium text-foreground">
            כל אחת מהבעיות האלה ניתנת לתיקון עם EQ ועיצוב תדרים מקצועי.
          </p>
        </div>
      </section>

      {/* מה מקבלים */}
      <section className="border-b border-border py-12">
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
          שלחו קובץ - ונחזיר עם סאונד שנשמע מקצועי.
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
          <ShareButton title="תיקון תדרים ו-EQ | יקיר כהן הפקות" />
        </div>
      </section>
    </div>
  );
}
