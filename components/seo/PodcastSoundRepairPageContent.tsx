import Link from "next/link";
import FAQWithCtaLinks, { type FaqCtaItem } from "@/components/ui/FAQWithCtaLinks";
import { buildWhatsAppHref } from "@/lib/whatsapp";
import { SITE_NAME } from "@/lib/constants";
import { formatFromPriceDual, getExVat } from "@/lib/data/pricing-catalog";
import TechBarrierReliefSection from "@/components/seo/TechBarrierReliefSection";
import ShareButton from "@/components/ui/ShareButton";
import { resolveTechBarrierRelief } from "@/lib/data/tech-barrier-relief";

const PRICE_EX_VAT = getExVat("noise_removal_segment");

const WHEN_IT_FITS = [
  "הקלטתם פרק בבית או בזום, ויש רעש מזגן, הד או רחש ברקע",
  "הקול לא אחיד - אורח חזק ומארח חלש, קפיצות ווליום בין קטעים",
  "הסאונד נשמע עמום או ביתי ואתם רוצים שהוא יישמע כמו אולפן",
  "יש ארכיון פרקים ישנים שרוצים לשדרג לפני העלאה מחדש",
];

const WHAT_YOU_GET = [
  "ניקוי רעשי רקע: מזגן, מאוורר, רחש חשמלי, הד קל",
  "איזון ווליום בין הדוברים ולאורך כל הפרק",
  "תיקון תדרים (EQ) לקול ברור ונעים להאזנה",
  "קובץ מוכן להעלאה לפלטפורמות - WAV או MP3",
];

const HOW_IT_WORKS = [
  "שולחים את הפרק בוואטסאפ או בקישור ל-Drive או Dropbox, בכל פורמט",
  "מקבלים סקיצה של 30-60 שניות בחינם, כדי לשמוע את ההבדל לפני שמחליטים",
  "אחרי אישור - עבודה מלאה: ניקוי, איזון, EQ ונורמליזציה לרמה שידורית",
  "מסירה של הקובץ המוכן, עם גרסת לפני ואחרי להשוואה",
];

export const FAQ_ITEMS: FaqCtaItem[] = [
  {
    id: "what-includes",
    question: "מה כולל תיקון סאונד לפרק פודקאסט?",
    answer:
      "ניקוי רעשי רקע, איזון ווליום בין הדוברים, תיקון תדרים (EQ) ונורמליזציה - עד שהפרק נשמע ברור, אחיד ומוכן להעלאה. שולחים את הקובץ המוקלט, מקבלים אותו ברמה שידורית בלי להקליט מחדש.",
    ctaText: "שלחו פרק",
    whatsappMessage: "שלום, יש לי פרק פודקאסט שצריך תיקון סאונד. אשמח להערכה.",
    utm_campaign: "podcast_repair_faq_what",
  },
  {
    id: "archive",
    question: "יש לי ארכיון פרקים ישנים - אפשר לתקן את כולם?",
    answer:
      "כן. אפשר לטפל בפרקים בודדים או בסדרה שלמה. שלחו כמה דוגמאות ונחזור עם הצעת מחיר לפי כמות הפרקים והאורך של כל אחד.",
    ctaText: "שלחו דוגמאות",
    whatsappMessage: "שלום, יש לי ארכיון פרקים ישנים שרוצה לשדרג. אשמח להצעה.",
    utm_campaign: "podcast_repair_faq_archive",
  },
  {
    id: "rerecord",
    question: "האם צריך להקליט את הפרק מחדש?",
    answer:
      "לא. זו בדיוק המטרה של השירות - לוקחים את ההקלטה הקיימת ומשפרים אותה. הקלטה מחדש נדרשת רק במקרים קיצוניים של עיוות חמור, ואז נגיד לכם את זה מראש בכנות.",
    ctaText: "שאלו אותנו",
    whatsappMessage: "שלום, האם אפשר לשפר את הפרק שלי בלי להקליט מחדש?",
    utm_campaign: "podcast_repair_faq_rerecord",
  },
  {
    id: "time",
    question: "כמה זמן לוקח לתקן פרק שלם?",
    answer:
      "בדרך כלל 2-5 ימי עסקים, תלוי באורך הפרק ובמצב ההקלטה. אחרי שנאזין לקובץ נגיד לכם זמן מדויק יחד עם הצעת המחיר.",
    ctaText: "בדקו זמן",
    whatsappMessage: "שלום, תוך כמה זמן אפשר לתקן פרק פודקאסט?",
    utm_campaign: "podcast_repair_faq_time",
  },
  {
    id: "price",
    question: "כמה עולה תיקון סאונד לפודקאסט?",
    answer: `תיקון של קטע קצר מתחיל ב-${PRICE_EX_VAT.toLocaleString("he-IL")} ₪ לפני מע״מ. לפרק שלם המחיר נקבע לפי האורך ומה שההקלטה צריכה - שולחים קובץ, מקבלים הצעה אחרי הסקיצה החינמית.`,
    ctaText: "קבלו הצעה",
    whatsappMessage: "שלום, אשמח להצעת מחיר לתיקון סאונד של פרק פודקאסט.",
    utm_campaign: "podcast_repair_faq_price",
  },
];

export default function PodcastSoundRepairPageContent() {
  const ctaHref = buildWhatsAppHref({
    text: "שלום, יש לי פרק פודקאסט שצריך תיקון סאונד. אשמח להערכה.",
    utm_source: "online",
    utm_campaign: "podcast_repair_cta",
  });
  const techBarrierRelief = resolveTechBarrierRelief(
    "/online/vocal-fix/podcast-repair",
  );

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
              <li className="font-medium text-foreground" aria-current="page">תיקון סאונד פודקאסט</li>
            </ol>
          </nav>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-red">
            {SITE_NAME}
          </p>
          <h1 className="mt-3 font-serif text-3xl font-semibold leading-tight text-foreground sm:text-4xl">
            תיקון סאונד לפרק פודקאסט קיים
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-sm text-muted-foreground">
            הקלטתם פרק והאיכות לא במקום - רעשים, קול לא אחיד או סאונד ביתי? שלחו
            את הקובץ ונחזיר אותו נקי, מאוזן ומוכן להעלאה, בלי להקליט מחדש.
          </p>
          <a
            href={ctaHref}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex rounded-xl bg-brand-red px-7 py-3 text-sm font-semibold text-white shadow-[0_0_20px_rgba(212,43,43,0.3)] hover:bg-brand-red-light"
          >
            שלחו פרק בוואטסאפ </a>
          <p className="mt-3 text-xs text-muted-foreground">
            {formatFromPriceDual(PRICE_EX_VAT)} · סקיצה ראשונית חינם
          </p>
        </div>
      </section>

      {techBarrierRelief ? (
        <TechBarrierReliefSection config={techBarrierRelief} />
      ) : null}

      {/* מתי זה מתאים */}
      <section className="border-b border-border bg-surface py-12">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl font-semibold text-foreground">מתי השירות מתאים לכם</h2>
          <ul className="mt-6 space-y-3">
            {WHEN_IT_FITS.map((item) => (
              <li key={item} className="flex gap-3 text-sm text-muted-foreground">
                <span className="mt-0.5 text-brand-red" aria-hidden>•</span>
                {item}
              </li>
            ))}
          </ul>
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

      {/* איך זה עובד */}
      <section className="border-b border-border bg-surface py-12">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl font-semibold text-foreground">איך זה עובד</h2>
          <ol className="mt-6 space-y-4">
            {HOW_IT_WORKS.map((item, i) => (
              <li key={item} className="flex gap-4 text-sm text-muted-foreground">
                <span
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-red/10 text-sm font-semibold text-brand-red"
                  aria-hidden
                >
                  {i + 1}
                </span>
                <span className="pt-0.5">{item}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* מחיר */}
      <section className="border-b border-border py-12">
        <div className="mx-auto max-w-2xl px-4 text-center sm:px-6">
          <h2 className="text-xl font-semibold text-foreground">מחיר</h2>
          <p className="mt-3 text-2xl font-bold text-brand-red">
            {formatFromPriceDual(PRICE_EX_VAT)}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">לתיקון קטע קצר</p>
          <p className="mt-2 text-xs text-muted-foreground">
            פרק שלם - הצעת מחיר לפי אורך, אחרי סקיצה ראשונית חינם
          </p>
          <div className="mt-6 flex flex-col items-center gap-3">
            <a
              href={ctaHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex rounded-xl bg-brand-red px-7 py-3 text-sm font-semibold text-white hover:bg-brand-red-light"
            >
              שלחו פרק לסקיצה חינם </a>
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
          שלחו פרק - ונחזיר אותו נקי, מאוזן ומוכן להעלאה.
        </p>
        <a
          href={ctaHref}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-flex rounded-xl bg-brand-red px-7 py-3 text-sm font-semibold text-white hover:bg-brand-red-light"
        >
          שלחו פרק עכשיו </a>
        <div className="mt-5 flex flex-wrap justify-center gap-4">
          <Link href="/online/vocal-fix" className="text-sm text-brand-red hover:underline">
            שיפור ותיקון סאונד מרחוק
          </Link>
          <Link href="/podcast/podcast-editing" className="text-sm text-brand-red hover:underline">
            עריכת פודקאסט מלאה
          </Link>
          <ShareButton title="תיקון סאונד פודקאסט | יקיר כהן הפקות" />
        </div>
      </section>
    </div>
  );
}
