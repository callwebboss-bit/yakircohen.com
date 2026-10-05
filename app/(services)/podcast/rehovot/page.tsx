import { STUDIO_PARKING_NOTE } from "@/lib/constants";
import { podcastSeriesAnswer } from "@/lib/data/podcast-calculator";
import type { Metadata } from "next";
import Link from "next/link";
import { constructMetadata } from "@/lib/metadata";
import { buildWhatsAppHref } from "@/lib/whatsapp";
import { SITE_URL } from "@/lib/site-url";
import { ENTITY_IDS } from "@/lib/seo/entity-ids";
import { safeJsonLdStringify } from "@/lib/safe-json-ld";
import FAQAccordion, { type FAQItem } from "@/components/ui/FAQAccordion";
import FaqPageSchema from "@/components/seo/FaqPageSchema";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";

export const metadata: Metadata = constructMetadata({
  title: "אולפן פודקאסט קרוב לרחובות - 25 דקות מרחובות",
  description:
    "אולפן פודקאסט מקצועי 25 דקות מרחובות - חדרי הקלטה עם ציוד מקצועי, חניה פנויה ועריכה מלאה. מתאים לפרק ראשון ולסדרות פודקאסט עסקיות.",
  slug: "podcast/rehovot",
  keywords: [
    "אולפן פודקאסט רחובות",
    "פודקאסט קרוב לרחובות",
    "הקלטת פודקאסט רחובות",
    "אולפן הקלטות פודקאסט מודיעין",
    "הקלטת פודקאסט עסקי רחובות",
  ],
});

const FAQ_ITEMS: FAQItem[] = [
  {
    id: "distance",
    question: "כמה זמן נסיעה מרחובות?",
    answer:
      `כ-25-30 דקות בנסיעה רגילה דרך כביש 431. ${STUDIO_PARKING_NOTE}.`,
  },
  {
    id: "first-time",
    question: "לא הקלטתי פרק פודקאסט מעולם - אפשר להגיע?",
    answer:
      "כן, רוב הלקוחות מגיעים לפרק ראשון. מכינים אתכם לפני, מנחים בהקלטה ועורכים אחר כך. יוצאים עם פרק מוגמר, לא רק קובץ גולמי.",
  },
  {
    id: "equipment",
    question: "מה צריך להביא?",
    answer:
      "רק את עצמכם ואת הנושא. ציוד הקלטה, מיקים, headphones ותאורה (לצילום במקביל אם צריך) - הכל כאן.",
  },
  {
    id: "duration",
    question: "כמה לוקח לצאת עם פרק מוכן?",
    answer:
      "הפרק אצלכם באותה שנייה שמסיימים להקליט. ההקלטה עוברת ישר מהמצלמות למחשב, עם חיתוך בין המצלמות לפי מי שמדבר, גם עם כמה אורחים. מקבלים קובץ מוכן לפרסום ב-Spotify ו-Apple Podcasts.",
  },
  {
    id: "series",
    question: "יש הנחה על סדרת פרקים?",
    answer:
      /* החלטות 5.10.2026 (פודקאסט): חבילות פרקי אודיו */
      podcastSeriesAnswer(),
  },
];

const FEATURES = [
  {
    title: "25 דקות מרחובות",
    desc: "דרך כביש 431 לכיוון מודיעין. חניה פנויה ליד האולפן.",
  },
  {
    title: "ציוד מיקרופון Shure + Rode",
    desc: "מיקים מקצועיים לשני דוברים, headphones נפרדים, acoustic treatment מלא.",
  },
  {
    title: "עריכה מלאה כולל",
    desc: "חיתוך, ניקוי רעשים, נורמליזציה לSpotify ומוזיקת רקע אם רוצים.",
  },
  {
    title: "מסירה לפרסום",
    desc: "קובץ MP3 + קובץ גלאם לתמונת נגן + אפשרות להעלות ב-RSS שלכם.",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "אולפן פודקאסט קרוב לרחובות",
  description:
    "הקלטת פודקאסט מקצועי 25 דקות מרחובות. ציוד מלא, עריכה, מסירה לפרסום.",
  /* הפניה לעסק המוכרז בגרף האתר, במקום LocalBusiness אנונימי בלי @id.
     עותק אנונימי עם אותה כתובת נקרא כעסק נוסף ולא כאותו עסק, ולכן הוא
     מפצל את הישות במקום לחזק אותה. אזור השירות עבר לצומת ה-Service, שם
     הוא מתאר את הכיסוי של השירות הזה ולא של העסק. */
  provider: { "@id": ENTITY_IDS.localBusiness },
  areaServed: ["רחובות", "מודיעין-מכבים-רעות", "המרכז"],
  url: `${SITE_URL}/podcast/rehovot`,
};

const waHref = buildWhatsAppHref({
  text: "שלום, מעוניין/ת להקליט פודקאסט באולפן - מגיע/ה מרחובות. אשמח לשמוע על אפשרויות ותאריכים פנויים.",
  utm_source: "website",
  utm_campaign: "podcast_rehovot",
});

export default function PodcastRehovotPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLdStringify(jsonLd) }}
      />
      <FaqPageSchema items={FAQ_ITEMS.map((f) => ({ question: f.question, answer: String(f.answer) }))} />

      <article className="bg-background">
        {/* Hero */}
        <header className="border-b border-border bg-background">
          <Container variant="wide" className="py-14 sm:py-18 lg:py-20">
            <nav aria-label="ניווט ארגוני" className="mb-5">
              <ol className="flex items-center gap-2 text-xs text-muted-foreground">
                <li><Link href="/" className="hover:text-brand-red">ראשי</Link></li>
                <li aria-hidden>/</li>
                <li><Link href="/podcast" className="hover:text-brand-red">פודקאסט</Link></li>
                <li aria-hidden>/</li>
                <li className="font-medium text-foreground" aria-current="page">רחובות</li>
              </ol>
            </nav>

            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-red">
              יקיר כהן הפקות
            </p>
            <h1 className="mt-4 font-serif text-3xl font-semibold text-foreground sm:text-4xl lg:text-5xl">
              אולפן פודקאסט 25 דקות מרחובות
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground">
              מגיעים ממודיעין - 25 דקות מרחובות דרך כביש 431 עם חניה פנויה.
              מקליטים, עורכים ומוסרים פרק מוכן לSpotify ו-Apple Podcasts.
            </p>
            <p className="mt-3 text-sm font-semibold text-brand-red">
              תהליך מלווה לפרק ראשון, בדרך כלל בלי חודשים של ניסוי
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Button
                as="a"
                href={waHref}
                target="_blank"
                rel="noopener noreferrer"
                variant="primary"
                liquid
              >
                קבלו מחיר ותאריך פנוי
              </Button>
              <Button as="link" href="/podcast/podcast-studio-modiin" variant="outline">
                פרטים על האולפן
              </Button>
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              מענה אנושי בשעות הפעילות{" "}
              <Link href="/start" className="font-semibold text-brand-red hover:underline">
                איך התהליך עובד
              </Link>
            </p>
          </Container>
        </header>

        <div className="mx-auto max-w-[72rem] space-y-16 px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
          {/* מה כלול */}
          <section aria-labelledby="features-heading">
            <header className="mb-8 text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-red">
                מה כלול
              </p>
              <h2 id="features-heading" className="mt-2 font-serif text-2xl font-semibold text-foreground sm:text-3xl">
                הקלטה מלאה עד לפרסום
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                לא רק חדר הקלטה - מגיעים עם תמיכה מהפרק הראשון ועד לפרסום ברשתות.
              </p>
            </header>
            <ul className="grid gap-5 sm:grid-cols-2">
              {FEATURES.map((f) => (
                <li
                  key={f.title}
                  className="rounded-2xl border border-border bg-surface p-6"
                >
                  <h3 className="font-semibold text-foreground">{f.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.desc}</p>
                </li>
              ))}
            </ul>
          </section>

          {/* נסיעה */}
          <section
            className="rounded-2xl border border-border bg-surface px-6 py-8 sm:px-10"
            aria-labelledby="location-heading"
          >
            <h2 id="location-heading" className="font-serif text-xl font-semibold text-foreground sm:text-2xl">
              איך מגיעים מרחובות?
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              כביש 431 מזרחה לכיוון מודיעין. נסיעה של 25-30 דקות ברוב שעות היום.
              {STUDIO_PARKING_NOTE}.
            </p>
            <p className="mt-4 text-sm text-muted-foreground">
              כתובת: עמק איילון 34, מודיעין-מכבים-רעות. קוד כניסה ישלח בWA לפני ההקלטה.
            </p>
          </section>

          {/* FAQ */}
          <FAQAccordion
            items={FAQ_ITEMS}
            title="שאלות על הקלטת פודקאסט מרחובות"
            subtitle="תשובות לפני שמגיעים"
          />

          {/* Bottom CTA */}
          <section className="rounded-2xl border border-border bg-surface px-6 py-10 text-center sm:px-10">
            <h2 className="font-serif text-2xl font-semibold text-foreground">
              מוכנים להקליט פרק ראשון?
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">
              שולחים הודעה עם נושא הפודקאסט ותאריך מועדף - ומחזירים עם מחיר ותאריך פנוי תוך שעה.
            </p>
            <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <Button
                as="a"
                href={waHref}
                target="_blank"
                rel="noopener noreferrer"
                variant="primary"
                liquid
              >
                קבלו הצעה עכשיו
              </Button>
              <Button as="link" href="/podcast" variant="outline">
                כל שירותי הפודקאסט
              </Button>
            </div>
          </section>

          {/* Internal links */}
          <nav aria-label="שירותים קשורים">
            <ul className="flex flex-wrap gap-3 text-sm">
              {[
                { label: "אולפן הקלטות פודקאסט במודיעין", href: "/podcast/podcast-studio-modiin" },
                { label: "עריכת פודקאסט אונליין", href: "/podcast/podcast-editing" },
                { label: "אולפן הקלטות רחובות", href: "/studio/studio-rehovot" },
                { label: "הקלטות לעסקים", href: "/business" },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="font-medium text-brand-red hover:underline">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </article>
    </>
  );
}
