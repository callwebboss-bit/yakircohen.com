import type { Metadata } from "next";
import Link from "next/link";
import ContextualIntroParagraph from "@/components/seo/ContextualIntroParagraph";
import ServiceHubLinks from "@/components/services/ServiceHubLinks";
import { constructMetadata } from "@/lib/metadata";
import { buildWhatsAppHref } from "@/lib/whatsapp";
import { SITE_URL } from "@/lib/site-url";
import FAQAccordion, { type FAQItem } from "@/components/ui/FAQAccordion";
import FaqPageSchema from "@/components/seo/FaqPageSchema";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";

export const metadata: Metadata = constructMetadata({
  title: "אטרקציות לאירועים בירושלים",
  description:
    "עשן כבד, זיקוקים קרים, בועות וקונפטי לחתונות ואירועים בירושלים. מפעיל מקצועי, תיאום מנהל האולם - 15 דקות ממודיעין. הצעה תוך שעה.",
  slug: "events/attractions/jerusalem",
  keywords: [
    "אטרקציות לאירועים בירושלים",
    "מכונת עשן לחתונה ירושלים",
    "זיקוקים קרים ירושלים",
    "תותח קונפטי ירושלים",
    "אפקטים לחתונה ירושלים",
    "מכונת בועות לאירוע ירושלים",
  ],
});

const FAQ_ITEMS: FAQItem[] = [
  {
    id: "venue-coordination",
    question: "איך מתאמים עם מנהל האולם בירושלים?",
    answer:
      "אנחנו מתקשרים ישירות עם מנהל האולם לפני האירוע - בודקים גובה תקרה, אוורור ואישורי בטיחות. אתם לא מתעסקים עם הלוגיסטיקה.",
  },
  {
    id: "travel",
    question: "יש תוספת הגעה לירושלים?",
    answer:
      "תלוי במיקום ובשעת האירוע. נציין את עלות ההגעה במפורש בהצעת המחיר לפני אישור - בלי הפתעות.",
  },
  {
    id: "setup-time",
    question: "כמה זמן לוקחת ההתקנה?",
    answer:
      "בדרך כלל 30-60 דקות לפני האירוע. מגיעים מוקדם, בודקים ציוד ומוכנים לפני האורחים.",
  },
  {
    id: "which-attraction",
    question: "איזו אטרקציה מתאימה לאולמות ירושלים?",
    answer:
      "עשן כבד ומכונת בועות מתאימים לרוב האולמות. זיקוקים קרים דורשים גובה תקרה של 3.5 מטר לפחות ואוורור מספיק - נבדוק מראש.",
  },
  {
    id: "combination",
    question: "אפשר לשלב כמה אטרקציות?",
    answer:
      "כן, ובדרך כלל זה חוסך - חבילת שילוב (עשן + זיקוקים + קונפטי) עולה פחות מהזמנה נפרדת של כל אחד. שאלו על חבילות.",
  },
];

const ATTRACTIONS = [
  {
    title: "עשן כבד לחתונה",
    desc: "רצפת ריקוד עם שכבת עשן לבנה. מרהיב בצילום ויוצר אנרגיה בפתיחת ריקודים.",
    href: "/events/attractions/wedding-smoking-machine",
  },
  {
    title: "זיקוקים קרים",
    desc: "זיקוקים בטוחים ללא חום ללמד. מרהיבים בצילום, ללא עשן ורוח.",
    href: "/events/attractions/cold-fireworks",
  },
  {
    title: "תותח קונפטי",
    desc: "ניירות צבעוניים ברגע השיא. קל לניקוי, מרשים בתמונות.",
    href: "/events/attractions/confetti-cannon",
  },
  {
    title: "מכונת בועות",
    desc: "בועות בכל הגודלים - מתאים לחתונות, בר מצווה ואירועי ילדים.",
    href: "/events/attractions/bubble-machine",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "אטרקציות לאירועים בירושלים",
  description: "עשן כבד, זיקוקים קרים, בועות וקונפטי לחתונות ואירועים בירושלים",
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
  url: `${SITE_URL}/events/attractions/jerusalem`,
};

const waHref = buildWhatsAppHref({
  text: "שלום, מעוניין/ת באטרקציות לאירוע בירושלים. אשמח לשמוע על אפשרויות ומחירים.",
  utm_source: "website",
  utm_campaign: "attractions_jerusalem",
});

export default function AttractionsJerusalemPage() {
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
                <li><Link href="/events" className="hover:text-brand-red">אירועים</Link></li>
                <li aria-hidden>/</li>
                <li><Link href="/events/attractions" className="hover:text-brand-red">אטרקציות</Link></li>
                <li aria-hidden>/</li>
                <li className="font-medium text-foreground" aria-current="page">ירושלים</li>
              </ol>
            </nav>

            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-red">
              יקיר כהן הפקות
            </p>
            <h1 className="mt-4 font-serif text-3xl font-semibold text-foreground sm:text-4xl lg:text-5xl">
              אטרקציות לאירועים בירושלים
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground">
              עשן כבד, זיקוקים קרים, בועות וקונפטי - מגיעים לאולמות ירושלים ישירות ממודיעין.
              תיאום מול מנהל האולם, התקנה מוקדמת ופעלת בלי שתרגישו כלום.
            </p>
            <ContextualIntroParagraph pathname="/events/attractions/jerusalem" className="mt-4" />
            <p className="mt-3 text-sm font-semibold text-brand-red">
              15 דקות מירושלים - בלי דמי הגעה מופרזים
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
              <Button as="link" href="/events/wedding-attractions-packages" variant="outline">
                ראו חבילות אירוע
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

          <ServiceHubLinks
            headingId="attractions-heading"
            heading="האטרקציות שמגיעות לירושלים"
            subheading="משרתים חתונות, בר ובת מצווה, אירועי חברה ומסיבות פרטיות באזור ירושלים."
            links={ATTRACTIONS.map((a) => ({
              href: a.href,
              title: a.title,
              description: a.desc,
              ctaLabel: "לפרטים ומחיר",
            }))}
            columns={2}
          />

          {/* אזור שירות */}
          <section
            className="rounded-2xl border border-border bg-surface px-6 py-8 sm:px-10"
            aria-labelledby="service-area-heading"
          >
            <h2 id="service-area-heading" className="font-serif text-xl font-semibold text-foreground sm:text-2xl">
              אולמות שאנחנו מכירים בירושלים
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              עובדים עם אולמות גדולים וקטנים בכל אזור ירושלים - ממרכז העיר ועד לשכונות. לפני
              האירוע, מתאמים ישירות עם מנהל המקום ובודקים גובה תקרה, אוורור ואישורים.
            </p>
            <ul className="mt-5 flex flex-wrap gap-2">
              {["ירושלים מרכז", "גבעת שאול", "רמות", "ארמון הנציב", "מלחה", "מסוף ירושלים"].map((area) => (
                <li
                  key={area}
                  className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3.5 py-1.5 text-xs font-medium text-foreground"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-brand-red" aria-hidden />
                  {area}
                </li>
              ))}
            </ul>
          </section>

          {/* FAQ */}
          <FAQAccordion
            items={FAQ_ITEMS}
            title="שאלות על אטרקציות בירושלים"
            subtitle="תשובות לפני שמזמינים"
          />

          {/* Bottom CTA */}
          <section className="rounded-2xl border border-border bg-surface px-6 py-10 text-center sm:px-10">
            <h2 className="font-serif text-2xl font-semibold text-foreground">
              מוכנים לתכנן את האירוע?
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">
              שולחים הודעה עם תאריך ומיקום האירוע - ומקבלים הצעה עם מחירים בתוך שעה.
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
              <Button as="link" href="/events/attractions" variant="outline">
                כל האטרקציות
              </Button>
            </div>
          </section>

          <ServiceHubLinks
            headingId="jerusalem-related-heading"
            heading="שירותים קשורים"
            subheading="שירותים נוספים לאירועים בירושלים ובמרכז."
            links={[
              {
                href: "/dj-events/cities/jerusalem",
                title: "DJ לאירועים בירושלים",
                description: "תקליטן מנוסה לאולמות בירושלים - ממודיעין.",
              },
              {
                href: "/events/wedding-attractions-packages",
                title: "חבילות אירוע",
                description: "שילוב אטרקציות במחיר מוזל לאירוע אחד.",
              },
              {
                href: "/events/equipment",
                title: "ציוד הגברה",
                description: "הגברה ותאורה לאירועים קטנים ובינוניים.",
              },
              {
                href: "/photography/wedding",
                title: "צילום חתונות",
                description: "צלם חתונות עם ניסיון באירועים באזור ירושלים.",
              },
            ]}
            columns={4}
          />
        </div>
      </article>
    </>
  );
}
