import Link from "next/link";
import SectionDwellTracker from "@/components/analytics/SectionDwellTracker";
import CallbackLeadForm from "@/components/forms/CallbackLeadForm";
import PageRelatedFooter from "@/components/seo/PageRelatedFooter";
import FAQAccordion, { type FAQItem } from "@/components/ui/FAQAccordion";
import FadeIn from "@/components/ui/FadeIn";
import { CONTACT_PHONE_E164 } from "@/lib/constants";
import { absoluteUrl, SITE_URL } from "@/lib/site-url";
import { buildWhatsAppHref } from "@/lib/whatsapp";

export const FAQ_ITEMS: FAQItem[] = [
  {
    id: "religious",
    question: "אתם מתאימים לחתונה דתית?",
    answer:
      "כן. אנחנו רגילים לעבוד עם קהל דתי ומעורב - כולל רגישות לשעות, לשירי חופה ולרגעים שקטים בטקס.",
  },
  {
    id: "equipment",
    question: "מה כלול בעמדת ה-DJ?",
    answer:
      "עמדה, סאונד לאולם, מיקרופון לאירועים ותאורה בסיסית לעמדה. צרכים מיוחדים - מוסיפים בתיאום.",
  },
  {
    id: "travel",
    question: "יש תוספת הגעה לירושלים?",
    answer:
      "תלוי במיקום האירוע והשעה. נציין במפורש בהצעת המחיר לפני אישור - בלי הפתעות.",
  },
  {
    id: "playlist",
    question: "אפשר לשלוח רשימת שירים מראש?",
    answer:
      "מומלץ. שולחים לנו שירי חובה, שירים שלא להשמיע, וסגנון כללי - ובונים יחד את הערב.",
  },
];

const AUDIENCE_POINTS = [
  {
    title: "קהל דתי לאומי, חוצניקים, חב\"ד וברסלב",
    text: "מכירים את הקווים, את השירים שמתאימים, ואת הרגעים שצריך לכבד.",
  },
  {
    title: "הפרדה מלאה, או פתיחה בהדרגה",
    text: "אירועים עם הפרדה לאורך כל הערב, או כאלה שמתחילים בהפרדה במנה הראשונה ונפתחים לריקודים מעורבים בהמשך.",
  },
  {
    title: "אירועים ללא שירת נשים",
    text: "יודעים לשמור על האנרגיה גבוהה גם כשיש גבולות ברורים.",
  },
] as const;

const BOUTIQUE_POINTS = [
  "עבודה ישירה מול יקיר - לא מעבירים אתכם לספק אחר ביום האירוע.",
  "ציוד קצה עליון בלבד - Pioneer CDJ 3000, מיקסר Allen & Heath, רמקולי RCF.",
  "תקליטן גיבוי כסטנדרט בכל אירוע שמזמינים את יקיר.",
] as const;

const PRODUCTION_SERVICES = [
  { label: "השכרת רמקולים וציוד תאורה", href: "/events/equipment" },
  { label: "אטרקציות", href: "/events/attractions" },
  { label: "צלם", href: "/photography/wedding" },
  { label: "מפיק אירוע בפועל", href: "/events/host" },
] as const;

const DJ_FORM_SERVICE_OPTIONS = [
  "יקיר כהן (בוטיק)",
  "די ג'יי בוגר האקדמיה",
  "עדיין לא בטוח/ה",
] as const;

const PAGE_PATH = "dj-events/cities/jerusalem";

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": ["EntertainmentBusiness", "LocalBusiness"],
      "@id": `${SITE_URL}/${PAGE_PATH}#dj-service`,
      name: "דיג׳יי לאירועים בירושלים - יקיר כהן הפקות",
      description: "ניהול מוזיקלי ותקלוט לאירועים בירושלים - חתונות, בר/בת מצווה, אירועים דתיים ומעורבים.",
      url: absoluteUrl(PAGE_PATH),
      parentOrganization: { "@id": `${SITE_URL}/#organization` },
      address: {
        "@type": "PostalAddress",
        streetAddress: "עמק איילון 34",
        addressLocality: "מודיעין",
        addressCountry: "IL",
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: "31.9077",
        longitude: "35.0064",
      },
      areaServed: [
        { "@type": "City", name: "ירושלים" },
        { "@type": "AdministrativeArea", name: "מחוז ירושלים" },
      ],
      serviceType: "DJ לאירועים בירושלים",
      telephone: CONTACT_PHONE_E164,
      priceRange: "₪₪₪",
      offers: {
        "@type": "AggregateOffer",
        priceCurrency: "ILS",
        lowPrice: "5900",
        highPrice: "9800",
      },
    },
    {
      "@type": "FAQPage",
      mainEntity: FAQ_ITEMS.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.answer,
        },
      })),
    },
  ],
};

const whatsappHref = buildWhatsAppHref({
  text: "שלום, אשמח לשמוע על די ג'יי לאירועים בירושלים",
  utm_source: "website",
  utm_campaign: "dj_jerusalem",
});

function WhatsAppIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-4 w-4 shrink-0"
      aria-hidden="true"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

export default function DjJerusalemPageContent() {
  return (
    <article className="bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <SectionDwellTracker sectionId="dj-jerusalem-boutique" eventLabel="boutique" />
      <SectionDwellTracker sectionId="dj-jerusalem-academy" eventLabel="academy" />

      <header className="px-4 py-10 sm:px-6 sm:py-20">
        <FadeIn className="mx-auto max-w-3xl text-center">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            די ג&apos;יי לאירועים בירושלים
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-muted-foreground sm:text-xl">
            בלי סיסמאות, נטו מוזיקה וקריאת קהל שמבינה מי נמצא על הרחבה
          </p>
          <p className="mt-6 text-base leading-relaxed text-foreground sm:text-lg">
            אירוע טוב בנוי על הבנה של האנשים. זה מתחיל בלקרוא את החדר, להבין את
            הגבולות, ולדעת לחבר בין עולמות.
          </p>
          <p className="mt-10">
            <Link
              href="#dj-jerusalem-form"
              className="text-sm font-medium text-brand-red underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red"
            >
              לשאלון התאמה קצר
            </Link>
          </p>
        </FadeIn>
      </header>

      <section
        className="border-t border-border px-4 py-10 sm:px-6 sm:py-20"
        aria-labelledby="dj-jerusalem-audience-heading"
      >
        <FadeIn className="mx-auto max-w-3xl">
          <h2
            id="dj-jerusalem-audience-heading"
            className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
          >
            הקהל שלכם, השפה שלנו
          </h2>
          <p className="mt-6 text-base leading-relaxed text-muted-foreground sm:text-lg">
            בירושלים יש קהל מגוון. חלק מהאורחים רוצים ריקודים חזקים, חלק צריכים
            שקט בטקס, וחלק מחפשים את שני העולמות באותו ערב. אנחנו לא מנחשים -
            אנחנו מכירים את השפה של כל קהל.
          </p>
          <ul className="mt-12 grid gap-5">
            {AUDIENCE_POINTS.map((point) => (
              <li
                key={point.title}
                className="rounded-2xl border border-border bg-surface p-6 sm:p-7"
              >
                <h3 className="font-semibold text-foreground">{point.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground sm:text-base">
                  {point.text}
                </p>
              </li>
            ))}
          </ul>
          <p className="mt-10 text-base leading-relaxed text-foreground sm:text-lg">
            אנחנו מנגנים הכל ויודעים לחבר בין העולמות. גם חילוני, גם דתי, גם
            מעורב - בלי שאף צד ירגיש ששכחו אותו.
          </p>
        </FadeIn>
      </section>

      <section
        className="border-t border-border px-4 py-10 sm:px-6 sm:py-20"
        aria-labelledby="dj-jerusalem-method-heading"
      >
        <FadeIn className="mx-auto max-w-3xl">
          <h2
            id="dj-jerusalem-method-heading"
            className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
          >
            מנגנון הפעולה: ניהול אישי מול פיקוח מערכתי
          </h2>
          <p className="mt-6 text-base leading-relaxed text-muted-foreground sm:text-lg">
            אנו מנטרלים את אלמנט המקריות מהאירוע. העבודה מתבצעת תחת מפרט טכני ומוזיקלי קבוע, המיושם בשני מסלולי בחירה ברורים:
          </p>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-border bg-surface p-6">
              <h3 className="font-semibold text-foreground">ניהול והפקה מלאה (ניהול אישי)</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                יקיר כהן נוכח באירוע ומנהל את הרחבה, המעברים והתזמון המוזיקלי באופן פעיל מתחילת הערב ועד סיומו.
              </p>
            </div>
            <div className="rounded-2xl border border-border bg-surface p-6">
              <h3 className="font-semibold text-foreground">ביצוע מונחה (פיקוח מערכת)</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                תקליטן מנוסה מהצוות הקבוע מוביל את האירוע. המפרט הטכני נבנה מראש ומפוקח ישירות על ידי יקיר כהן מרחוק.
              </p>
            </div>
          </div>
        </FadeIn>
      </section>

      <section
        id="dj-jerusalem-boutique"
        className="border-t border-border px-4 py-10 sm:px-6 sm:py-20"
        aria-labelledby="dj-jerusalem-boutique-heading"
      >
        <FadeIn className="mx-auto max-w-3xl">
          <h2
            id="dj-jerusalem-boutique-heading"
            className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
          >
            יקיר כהן - רמת בוטיק
          </h2>
          <ul className="mt-8 space-y-4">
            {BOUTIQUE_POINTS.map((point) => (
              <li
                key={point}
                className="flex gap-3 text-base leading-relaxed text-foreground"
              >
                <span
                  className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-red"
                  aria-hidden="true"
                />
                {point}
              </li>
            ))}
          </ul>
          <p className="mt-10 rounded-2xl border border-border bg-surface p-6 text-base leading-relaxed text-foreground sm:p-8 sm:text-lg">
            המחיר שלנו לא הכי זול בשוק, כי אנחנו מספקים שקט נפשי, גיבוי מלא
            ורמת הפקה בלי הפתעות רעות.
          </p>
        </FadeIn>
      </section>

      <section
        id="dj-jerusalem-academy"
        className="border-t border-border px-4 py-10 sm:px-6 sm:py-20"
        aria-labelledby="dj-jerusalem-academy-heading"
      >
        <FadeIn className="mx-auto max-w-3xl">
          <h2
            id="dj-jerusalem-academy-heading"
            className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
          >
            האקדמיה - חלופה חכמה
          </h2>
          <p className="mt-6 text-base leading-relaxed text-muted-foreground sm:text-lg">
            מי שרוצה את הסטנדרט של יקיר כהן הפקות אבל נמצא בתקציב שונה, יכול
            לבחור בדי ג&apos;יי שעבר את{" "}
            <Link
              href="/academy"
              className="font-medium text-brand-red underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red"
            >
              האקדמיה שלנו
            </Link>
            . הוא למד את השיטה, את קריאת הקהל, ואת הדרך שבה אנחנו מנהלים
            אירוע.
          </p>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
            מלאו את השאלון הקצר, ואנחנו נתאים לכם בדיוק את הדי ג&apos;יי הנכון
            עבורכם מהצוות שלנו.
          </p>
          <div id="dj-jerusalem-form" className="mt-12 scroll-mt-24">
            <CallbackLeadForm
              heading="שאלון התאמה קצר"
              description="השאירו פרטים ונחזור אליכם עם ההתאמה הנכונה - יקיר או די ג'יי מהאקדמיה."
              successHeading="תודה, נחזור אליכם בקרוב"
              successDescription="פתחנו שיח בוואטסאפ. אפשר לצרף פרטים נוספים על האירוע."
              utmCampaign="dj_jerusalem"
              serviceOptions={DJ_FORM_SERVICE_OPTIONS}
              formLabel="שאלון התאמה לדי ג'יי בירושלים"
            />
          </div>
        </FadeIn>
      </section>

      <section
        className="border-t border-border px-4 py-10 sm:px-6 sm:py-20"
        aria-labelledby="dj-jerusalem-production-heading"
      >
        <FadeIn className="mx-auto max-w-5xl">
          <h2
            id="dj-jerusalem-production-heading"
            className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
          >
            הפקה משלימה תחת קורת גג אחת
          </h2>
          <p className="mt-6 max-w-3xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            במקום לחפש ספקים שונים, הכל מנוהל תחת קורת גג אחת דרך אזור אישי
            מסודר.
          </p>
          <ul className="mt-12 grid gap-4 sm:grid-cols-2">
            {PRODUCTION_SERVICES.map((service) => (
              <li key={service.href}>
                <Link
                  href={service.href}
                  className="flex h-full items-center rounded-2xl border border-border bg-surface px-6 py-5 text-base font-medium text-foreground transition-colors hover:border-brand-red/30 hover:text-brand-red focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red"
                >
                  {service.label}
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-10 max-w-3xl text-base leading-relaxed text-muted-foreground">
            רמקולים, אטרקציות, צילום ומפק - הכל באותה רמת גימור, עם תיאום אחד
            שמכיר את האירוע שלכם.
          </p>
        </FadeIn>
      </section>

      <section
        className="border-t border-border px-4 py-10 sm:px-6 sm:py-20"
        aria-labelledby="dj-jerusalem-cta-heading"
      >
        <FadeIn className="mx-auto max-w-3xl text-center">
          <h2 id="dj-jerusalem-cta-heading" className="sr-only">
            יצירת קשר
          </h2>
          <p className="text-lg leading-relaxed text-foreground sm:text-xl">
            דברו איתנו, נבין מה אתם צריכים, ונתקדם משם.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="פתיחת שיח בוואטסאפ על די ג'יי לאירועים בירושלים"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand-red px-7 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-brand-red-light focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red sm:w-auto"
            >
              <WhatsAppIcon />
              דברו איתנו בוואטסאפ
            </a>
            <Link
              href="#dj-jerusalem-form"
              className="inline-flex w-full items-center justify-center rounded-xl border border-border bg-surface px-7 py-3.5 text-sm font-semibold text-foreground transition-colors hover:border-brand-red/30 hover:text-brand-red focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red sm:w-auto"
              aria-label="מעבר לשאלון התאמה בראש העמוד"
            >
              לשאלון התאמה
            </Link>
          </div>
        </FadeIn>
      </section>

      <div className="border-t border-border px-4 py-10 sm:px-6 sm:py-16 lg:px-8">
        <div className="mx-auto max-w-3xl space-y-12">
          <FAQAccordion
            title="שאלות נפוצות - DJ בירושלים"
            items={FAQ_ITEMS}
          />

          <section aria-labelledby="dj-jerusalem-aeo-heading">
            <h2
              id="dj-jerusalem-aeo-heading"
              className="text-xl font-semibold text-foreground sm:text-2xl"
            >
              נתונים יבשים ומענה לשאלות נפוצות
            </h2>
            <div className="mt-6 space-y-6">
              <div>
                <h3 className="font-semibold text-foreground">מה כולל מפרט הציוד הבסיסי לאירוע בירושלים?</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  עמדת תקלוט מקצועית מלאה, פלטת DJ Pioneer CDJ 3000, מיקסר Allen &amp; Heath, רמקולי RCF, מיקרופון ייעודי לברכות ומערכת גיבוי לכל רכיב.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground">כיצד מתאימים את המוזיקה לקהל דתי או מעורב?</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  בפגישת תכנון מקדימה מגדירים גבולות ברורים: שירים לחופה, שירים אסורים, ניהול הפרדה ורגעים שקטים בטקס. המפרט נשמר ומפוקח לאורך כל האירוע.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground">האם יש תוספת מחיר על הגעה לירושלים?</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  תוספת נסיעה מצוינת במפורש בהצעת המחיר לפני אישור. אין הפתעות ביום האירוע.
                </p>
              </div>
            </div>
          </section>

          <PageRelatedFooter pathname="/dj-events/cities/jerusalem" />
        </div>
      </div>
    </article>
  );
}
