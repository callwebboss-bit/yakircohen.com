import Link from "next/link";
import FAQWithCtaLinks, { type FaqCtaItem } from "@/components/ui/FAQWithCtaLinks";
import {
  PHOTO_ENHANCE_ADDONS,
  PHOTO_ENHANCE_AI_FEATURES,
  PHOTO_ENHANCE_COMPARE,
  PHOTO_ENHANCE_PACKAGES,
  PHOTO_ENHANCE_STEPS,
  PHOTO_ENHANCE_WHY_US,
} from "@/lib/data/online-photo-enhance-page";
import { buildWhatsAppHref } from "@/lib/whatsapp";
import { SITE_NAME } from "@/lib/constants";
import ShareButton from "@/components/ui/ShareButton";

const FAQ_ITEMS: FaqCtaItem[] = [
  {
    id: "all-photos",
    question: "האם זה עובד על כל תמונה?",
    answer:
      "כן, אבל התוצאה תלויה במקור. איכות סבירה - שיפור גדול. תמונה ממש הרוסה - תשתפר, אבל לא תהפוך לפרפקט.",
    ctaText: "שלחו תמונה לבדיקה",
    whatsappMessage: "היי יקיר! יש לי תמונה ישנה לשדרוג AI - אפשר לבדוק אם מתאים?",
    utm_campaign: "photo_enhance_faq_all",
  },
  {
    id: "sample",
    question: "אפשר לראות דוגמה לפני שמשלמים?",
    answer: "כן! שלחו תמונה אחת ונעשה שדרוג בסיסי חינם כדי שתראו את הפוטנציאל.",
    ctaText: "בקשו דוגמה חינם",
    whatsappMessage: "היי יקיר! אשמח לדוגמת שדרוג תמונה חינם לפני הזמנה.",
    utm_campaign: "photo_enhance_faq_sample",
  },
  {
    id: "bw",
    question: "זה עובד על תמונות שחור-לבן?",
    answer:
      "כן. צביעה (colorization) זה שירות נפרד - 100 ₪ לתמונה.",
    ctaText: "שאלו על צביעה",
    whatsappMessage: "היי יקיר! יש לי תמונת שחור-לבן - גם אפשר לצבוע?",
    utm_campaign: "photo_enhance_faq_bw",
  },
  {
    id: "print",
    question: "אפשר להדפיס את התמונות המשודרגות?",
    answer:
      "כן! בדיוק המטרה - רזולוציה מספקת להדפסה באיכות טובה.",
    ctaText: "הזמינו שדרוג",
    whatsappMessage: "היי יקיר! רוצה לשדרג תמונות להדפסה. כמה תמונות: [מספר]",
    utm_campaign: "photo_enhance_faq_print",
  },
  {
    id: "time",
    question: "כמה זמן זה לוקח?",
    answer: "יום עבודה אחד. לפעמים כמה שעות אם לא עמוס.",
    ctaText: "בדקו זמינות",
    whatsappMessage: "היי יקיר! צריך שדרוג תמונות בדחיפות - אפשר?",
    utm_campaign: "photo_enhance_faq_time",
  },
  {
    id: "unsatisfied",
    question: "מה אם התוצאה לא מספקת?",
    answer:
      "נתקן. אם ה-AI לא עשה עבודה טובה - מתקנים ידנית (ללא עלות נוספת, אלא אם זה עבודה מורכבת מאוד).",
    ctaText: "שלחו תמונה",
    whatsappMessage: "היי יקיר! מעוניין/ת בשדרוג תמונות ב-AI.",
    utm_campaign: "photo_enhance_faq_fix",
  },
];

export default function OnlinePhotoEnhancePageContent() {
  const ctaHref = buildWhatsAppHref({
    text: "היי יקיר! אני מעוניין/ת בשדרוג תמונות ב-AI. אשמח לשלוח תמונה לדוגמה או להזמנה.",
    utm_source: "online",
    utm_campaign: "photo_enhance_cta",
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
                שדרוג תמונות AI
              </li>
            </ol>
          </nav>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-red">
            {SITE_NAME}
          </p>
          <h1 className="mt-3 font-serif text-3xl font-semibold leading-tight text-foreground sm:text-4xl">
            שדרוג תמונות בטכנולוגיית AI
          </h1>
          <p className="mx-auto mt-4 text-base font-medium text-foreground">
            הפכו תמונות ישנות לאיכות HD
          </p>
          <p className="mx-auto mt-5 max-w-2xl text-sm text-muted-foreground">
            תמונות ישנות מטושטשות? רזולוציה נמוכה? AI מתקדם משדרג את התמונות
            לאיכות גבוהה - חדות, צבעים ופרטים שנראים טבעיים.
          </p>
          <a
            href={ctaHref}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex rounded-xl bg-brand-red px-7 py-3 text-sm font-semibold text-white shadow-[0_0_20px_rgba(212,43,43,0.3)] hover:bg-brand-red-light"
          >
            שלחו תמונה לדוגמה חינם ←
          </a>
        </div>
      </section>

      <section className="mx-auto max-w-2xl px-4 py-12 sm:px-6 lg:px-8">
        <h2 className="text-xl font-semibold text-foreground">
          מה זה שדרוג תמונות בטכנולוגיית AI?
        </h2>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
          טכנולוגיה שמשתמשת בבינה מלאכותית לשיפור תמונות באיכות נמוכה. ה-AI
          מנתח את התמונה, מזהה פרטים חסרים או מטושטשים, ו&quot;ממציא&quot; אותם
          בצורה חכמה - חדות, רזולוציה, צבעים ותאורה.
        </p>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
          התוצאה: תמונה ישנה או חלשה הופכת לחדה וברורה, כאילו צולמה במצלמה
          מודרנית. מושלם לתמונות משפחה, סריקות, תמונות מהטלפון או כל קובץ
          שצריך שדרוג.
        </p>
      </section>

      <section className="border-t border-border bg-surface py-12">
        <div className="mx-auto max-w-[72rem] px-4 sm:px-6 lg:px-8">
          <h2 className="mb-6 text-lg font-semibold text-foreground">
            מה ה-AI עושה
          </h2>
          <ul className="grid gap-3 sm:grid-cols-2">
            {PHOTO_ENHANCE_AI_FEATURES.map((item) => (
              <li
                key={item}
                className="flex gap-2 rounded-lg border border-border bg-background px-4 py-3 text-sm text-muted-foreground"
              >
                <span className="text-brand-red shrink-0">✓</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
        <h2 className="text-lg font-semibold text-foreground">איך זה עובד?</h2>
        <ol className="mt-6 space-y-4">
          {PHOTO_ENHANCE_STEPS.map((s) => (
            <li key={s.step}>
              <p className="font-medium text-foreground">{s.step}</p>
              <p className="mt-1 text-sm text-muted-foreground">{s.body}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="border-t border-border bg-surface py-14">
        <div className="mx-auto max-w-[72rem] px-4 sm:px-6 lg:px-8">
          <h2 className="mb-8 text-center text-xl font-semibold text-foreground">
            כמה זה עולה?
          </h2>
          <div className="mx-auto grid max-w-3xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {PHOTO_ENHANCE_PACKAGES.map((pkg) => (
              <div
                key={pkg.count}
                className={`rounded-2xl border p-6 text-center ${
                  pkg.premium
                    ? "border-brand-red/40 bg-background shadow-[0_4px_24px_rgba(212,43,43,0.08)]"
                    : "border-border bg-background"
                }`}
              >
                {pkg.premium && (
                  <span className="mb-2 inline-block rounded-full bg-brand-red/10 px-2 py-0.5 text-xs font-bold text-brand-red">
                    פופולרי
                  </span>
                )}
                <p className="font-semibold text-foreground">{pkg.count}</p>
                <p className="mt-2 text-3xl font-bold text-foreground">
                  {pkg.price} ₪
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {pkg.perImage}
                </p>
              </div>
            ))}
          </div>
          <p className="mx-auto mt-6 max-w-xl text-center text-sm text-muted-foreground">
            כולל: שדרוג מלא ב-AI - הגדלת רזולוציה, חדות, צבעים והסרת רעשים.
            קובץ JPG/PNG באיכות גבוהה, מוכן להדפסה או שימוש דיגיטלי.
          </p>
          <p className="mx-auto mt-2 text-center text-xs text-muted-foreground">
            זמן אספקה: בדרך כלל יום עבודה אחד.
          </p>
          <h3 className="mx-auto mt-8 max-w-xl text-sm font-semibold text-foreground">
            תוספות
          </h3>
          <ul className="mx-auto mt-3 max-w-xl space-y-2">
            {PHOTO_ENHANCE_ADDONS.map((item) => (
              <li key={item} className="text-sm text-muted-foreground">
                • {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mx-auto max-w-[72rem] px-4 py-12 sm:px-6 lg:px-8">
        <h2 className="mb-6 text-lg font-semibold text-foreground">
          מה ההבדל בין שדרוג רגיל לשדרוג AI?
        </h2>
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full min-w-[20rem] text-sm">
            <thead>
              <tr className="border-b border-border bg-surface">
                <th className="px-4 py-3 text-start font-semibold text-foreground">
                  נושא
                </th>
                <th className="px-4 py-3 text-start font-semibold text-foreground">
                  שדרוג רגיל
                </th>
                <th className="px-4 py-3 text-start font-semibold text-foreground">
                  שדרוג AI
                </th>
              </tr>
            </thead>
            <tbody>
              {PHOTO_ENHANCE_COMPARE.map((row) => (
                <tr key={row.title} className="border-b border-border last:border-0">
                  <td className="px-4 py-3 font-medium text-foreground">
                    {row.title}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{row.regular}</td>
                  <td className="px-4 py-3 text-muted-foreground">{row.ai}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-sm text-muted-foreground">
          התוצאה: תמונה שנראית כאילו צולמה במצלמה טובה יותר מההתחלה.
        </p>
      </section>

      <section className="border-t border-border bg-surface py-12">
        <div className="mx-auto max-w-2xl px-4 sm:px-6">
          <h2 className="text-lg font-semibold text-foreground">
            למה לבחור בנו?
          </h2>
          <ul className="mt-6 space-y-3">
            {PHOTO_ENHANCE_WHY_US.map((item) => (
              <li key={item} className="flex gap-2 text-sm text-muted-foreground">
                <span className="text-brand-red">✓</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <h2 className="mb-6 text-xl font-semibold text-foreground">שאלות נפוצות</h2>
        <FAQWithCtaLinks items={FAQ_ITEMS} />
      </section>

      <section className="border-t border-border py-14 text-center">
        <a
          href={ctaHref}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex rounded-xl bg-brand-red px-7 py-3 text-sm font-semibold text-white hover:bg-brand-red-light"
        >
          שלחו תמונות בוואטסאפ ←
        </a>
        <div className="mt-5 flex flex-wrap justify-center gap-4">
          <Link href="/online" className="text-sm text-brand-red hover:underline">
            כל שירותי Online
          </Link>
          <ShareButton title="שדרוג תמונות AI | יקיר כהן הפקות" />
        </div>
      </section>
    </div>
  );
}
