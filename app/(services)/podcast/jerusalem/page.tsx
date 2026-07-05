import type { Metadata } from "next";
import Link from "next/link";
import { constructMetadata } from "@/lib/metadata";
import { buildWhatsAppHref } from "@/lib/whatsapp";
import { SITE_URL } from "@/lib/site-url";
import FAQAccordion, { type FAQItem } from "@/components/ui/FAQAccordion";
import FaqPageSchema from "@/components/seo/FaqPageSchema";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";

export const metadata: Metadata = constructMetadata({
  title: "אולפן פודקאסט קרוב לירושלים - 15 דקות מירושלים",
  description:
    "אולפן פודקאסט מקצועי 15 דקות מירושלים - חדרי הקלטה עם ציוד מקצועי, חניה פנויה ועריכה מלאה. מתאים לפרק ראשון ולסדרות פודקאסט עסקיות.",
  slug: "podcast/jerusalem",
  keywords: [
    "אולפן פודקאסט ירושלים",
    "פודקאסט קרוב לירושלים",
    "הקלטת פודקאסט ירושלים",
    "אולפן הקלטות פודקאסט מודיעין",
    "הקלטת פודקאסט עסקי ירושלים",
    "אולפן פודקאסט ליד ירושלים",
  ],
});

const FAQ_ITEMS: FAQItem[] = [
  {
    id: "distance",
    question: "כמה זמן נסיעה מירושלים?",
    answer:
      "כ-15-20 דקות בנסיעה רגילה דרך כביש 1. יש חניה פנויה ממש ליד האולפן - בלי להסתובב.",
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
      "הקלטה של שעה + עריכה = פרק מוכן תוך 2-3 ימי עסקים. לפרקים ארוכים יותר - 4-5 ימים. מקבלים קובץ מוכן לפרסום ב-Spotify ו-Apple Podcasts.",
  },
  {
    id: "series",
    question: "יש הנחה על סדרת פרקים?",
    answer:
      "כן, יש חבילות ל-4 ו-8 פרקים עם חיסכון של 15-20% לעומת פרק בודד. מתאים לפודקאסטים עסקיים עם יציאה קבועה.",
  },
];

const FEATURES = [
  {
    title: "15 דקות מירושלים",
    desc: "דרך כביש 1, ללא פקקים בדרך כלל. חניה פנויה ליד האולפן.",
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
  name: "אולפן פודקאסט קרוב לירושלים",
  description:
    "הקלטת פודקאסט מקצועי 15 דקות מירושלים. ציוד מלא, עריכה, מסירה לפרסום.",
  provider: {
    "@type": "LocalBusiness",
    name: "יקיר כהן הפקות",
    telephone: "+972587555456",
    address: {
      "@type": "PostalAddress",
      streetAddress: "עמק איילון 34",
      addressLocality: "מודיעין-מכבים-רעות",
      addressCountry: "IL",
    },
    areaServed: ["ירושלים", "מודיעין-מכבים-רעות", "המרכז"],
  },
  url: `${SITE_URL}/podcast/jerusalem`,
};

const waHref = buildWhatsAppHref({
  text: "שלום, מעוניין/ת להקליט פודקאסט באולפן - מגיע/ה מירושלים. אשמח לשמוע על אפשרויות ותאריכים פנויים.",
  utm_source: "website",
  utm_campaign: "podcast_jerusalem",
});

export default function PodcastJerusalemPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
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
                <li className="font-medium text-foreground" aria-current="page">ירושלים</li>
              </ol>
            </nav>

            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-red">
              יקיר כהן הפקות
            </p>
            <h1 className="mt-4 font-serif text-3xl font-semibold text-foreground sm:text-4xl lg:text-5xl">
              אולפן פודקאסט 15 דקות מירושלים
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground">
              מגיעים ממודיעין - 15 דקות מירושלים דרך כביש 1 עם חניה פנויה.
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
              בדרך כלל תוך שעה בשעות פעילות (א-ה 9:00-20:00){" "}
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
              איך מגיעים מירושלים?
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              כביש 1 מירושלים לכיוון תל אביב, יציאה מודיעין. נסיעה של 15-20 דקות ברוב שעות היום
              (לא בשעות פקקים עמוסות). חניה פנויה ברחוב ליד האולפן - לא צריך לחפש.
            </p>
            <p className="mt-4 text-sm text-muted-foreground">
              כתובת: עמק איילון 34, מודיעין-מכבים-רעות. קוד כניסה ישלח בWA לפני ההקלטה.
            </p>
          </section>

          {/* FAQ */}
          <FAQAccordion
            items={FAQ_ITEMS}
            title="שאלות על הקלטת פודקאסט מירושלים"
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
                { label: "אולפן הקלטות ירושלים", href: "/studio/studio-jerusalem" },
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
