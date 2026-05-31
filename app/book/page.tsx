import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import BookPageSections from "@/components/booking/BookPageSections";
import TrustStatsBar from "@/components/marketing/TrustStatsBar";
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
    "הגברה לזמרים",
    "מחירון הקלטות",
    "הזמנה מקוונת",
  ],
});

export default function BookPage() {
  return (
    <div className="overflow-x-clip bg-background">
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

      <TrustStatsBar />

      <Suspense
        fallback={
          <p className="py-16 text-center text-sm text-muted-foreground">
            טוען טופסי הזמנה...
          </p>
        }
      >
        <BookPageSections />
      </Suspense>
    </div>
  );
}
