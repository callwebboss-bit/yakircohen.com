import type { Metadata } from "next";
import Link from "next/link";
import BookPageSections from "@/components/booking/BookPageSections";
import { constructMetadata } from "@/lib/metadata";
import { SITE_NAME } from "@/lib/constants";

export const metadata: Metadata = constructMetadata({
  title: "הזמנה מקוונת | יקיר כהן הפקות",
  description:
    "הזמינו שירות ישירות מהאתר: הקלטות, פודקאסטים, קליפים, אטרקציות לאירועים ושירותים דיגיטליים. בחרו שירות, הוסיפו תוספות, קבלו הצעת מחיר ושלחו הזמנה בוואטסאפ.",
  slug: "book",
  keywords: [
    "הזמנת אולפן",
    "הזמנת פודקאסט",
    "הזמנת אטרקציות לאירועים",
    "מחירון הקלטות",
    "הזמנה מקוונת",
  ],
});

const STATS = [
  { num: "20+", label: "שנות ניסיון" },
  { num: "5,000+", label: "לקוחות מרוצים" },
  { num: "⭐⭐⭐⭐⭐", label: "דירוג ממוצע" },
] as const;

export default function BookPage() {
  return (
    <div className="bg-background">
      {/* ── Hero ── */}
      <section className="relative overflow-hidden border-b border-border bg-background">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_55%_at_50%_-10%,rgba(212,43,43,0.12),transparent_55%)]"
          aria-hidden="true"
        />

        <div className="relative mx-auto max-w-3xl px-4 py-14 text-center sm:px-6 sm:py-16 lg:px-8">
          <nav aria-label="ניווט ארגוני" className="mb-6">
            <ol className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <li>
                <Link href="/" className="transition-colors duration-fast ease-luxury hover:text-brand-red focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red">
                  ראשי
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li className="font-medium text-foreground" aria-current="page">
                הזמנה מקוונת
              </li>
            </ol>
          </nav>

          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-red">
            {SITE_NAME}
          </p>

          <h1 className="mt-3 font-serif text-3xl font-semibold leading-tight tracking-tight text-foreground sm:text-4xl">
            מערכת הזמנות חכמה
          </h1>

          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            בחרו שירות, הוסיפו תוספות, מלאו פרטים, ותוך שניות ההזמנה תגיע
            ישירות לוואטסאפ. בלי טפסים שנעלמים ובלי המתנה לתשובה.
          </p>
        </div>
      </section>

      {/* ── Stats strip ── */}
      <section className="border-b border-border bg-surface py-6" aria-label="נתוני חברה">
        <div className="mx-auto flex max-w-[72rem] flex-wrap items-center justify-center gap-8 px-4 sm:px-6 lg:px-8">
          {STATS.map((s) => (
            <div key={s.label} className="text-center">
              <span className="block text-xl font-bold text-foreground">{s.num}</span>
              <span className="text-xs text-muted-foreground">{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      <BookPageSections />
    </div>
  );
}
