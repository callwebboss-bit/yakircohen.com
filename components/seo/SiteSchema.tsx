import { SITE_URL } from "@/lib/site-url";
import { CONTACT_PHONE_E164, SOCIAL_LINKS } from "@/lib/constants";
import { PODCAST_PACKAGES } from "@/lib/data/podcast-calculator";
import {
  EVENT_ATTRACTION_FROM_NIS,
  STUDIO_HALF_HOUR_NIS,
  STUDIO_ONE_HOUR_NIS,
} from "@/lib/data/pricing";
import { SITE_TESTIMONIALS } from "@/lib/data/testimonials";
import { DEFAULT_OG_IMAGE_URL } from "@/lib/seo-config";
import { buildReviewSchemaGraph } from "@/lib/review-schema";

const BASE = SITE_URL;

const socialUrls = SOCIAL_LINKS.map((s) => s.href);

const ADDRESS = {
  "@type": "PostalAddress",
  streetAddress: "עמק איילון 34",
  addressLocality: "מודיעין-מכבים-רעות",
  addressRegion: "מרכז",
  postalCode: "7170000",
  addressCountry: "IL",
};

const schema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${BASE}/#website`,
      url: BASE,
      name: "יקיר כהן הפקות",
      description:
        "אולפן הקלטות פרמיום, הפקות מוזיקה לאירועים, פודקאסטים וקריינות במודיעין",
      inLanguage: "he-IL",
      image: DEFAULT_OG_IMAGE_URL,
      publisher: { "@id": `${BASE}/#organization` },
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: `${BASE}/?q={search_term_string}`,
        },
        "query-input": "required name=search_term_string",
      },
    },
    {
      "@type": "Organization",
      "@id": `${BASE}/#organization`,
      name: "יקיר כהן הפקות",
      alternateName: "Yakir Cohen Productions",
      url: BASE,
      logo: {
        "@type": "ImageObject",
        url: `${BASE}/images/logo.svg`,
      },
      telephone: CONTACT_PHONE_E164,
      foundingDate: "2010",
      address: ADDRESS,
      sameAs: socialUrls,
    },
    {
      "@type": "Person",
      "@id": `${BASE}/#founder`,
      name: "יקיר כהן",
      jobTitle: "מפיק מוזיקלי ומדריך קול",
      url: `${BASE}/about`,
      sameAs: socialUrls,
      worksFor: { "@id": `${BASE}/#organization` },
    },
    {
      "@type": [
        "LocalBusiness",
        "EntertainmentBusiness",
        "MusicRecordingStudio",
      ],
      "@id": `${BASE}/#localbusiness`,
      name: "יקיר כהן הפקות",
      alternateName: ["Yakir Cohen Productions", "יקיר כהן הפקות מוזיקה"],
      url: BASE,
      telephone: CONTACT_PHONE_E164,
      priceRange: "₪₪",
      currenciesAccepted: "ILS",
      paymentAccepted: "Cash, Credit Card, Bank Transfer, Bit",
      address: ADDRESS,
      geo: {
        "@type": "GeoCoordinates",
        latitude: 31.901,
        longitude: 35.013,
      },
      hasMap: "https://maps.google.com/?q=מודיעין+עמק+איילון+34",
      openingHoursSpecification: [
        {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: [
            "Sunday",
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
          ],
          opens: "09:00",
          closes: "20:00",
        },
        {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: "Friday",
          opens: "09:00",
          closes: "14:00",
        },
      ],
      areaServed: [
        { "@type": "City", name: "מודיעין-מכבים-רעות" },
        { "@type": "City", name: "ירושלים" },
        { "@type": "City", name: "תל אביב" },
        { "@type": "AdministrativeArea", name: "מרכז" },
      ],
      sameAs: socialUrls,
      parentOrganization: { "@id": `${BASE}/#organization` },
      makesOffer: [
        {
          "@type": "Offer",
          name: "חצי שעה באולפן",
          description: "הקלטה קצרה, פודקאסט או ברכה - מחיר לפני מע״מ",
          price: String(STUDIO_HALF_HOUR_NIS),
          priceCurrency: "ILS",
          url: `${BASE}/studio/pricing`,
        },
        {
          "@type": "Offer",
          name: "שעת אולפן מלאה",
          description: "הקלטה באולפן במודיעין - מחיר לפני מע״מ",
          price: String(STUDIO_ONE_HOUR_NIS),
          priceCurrency: "ILS",
          url: `${BASE}/studio/pricing`,
        },
        {
          "@type": "Offer",
          name: "הקלטת שיר לאירוע (חבילה)",
          description: "הקלטה, מיקס ועריכה לחתונה ואירועים",
          price: "1800",
          priceCurrency: "ILS",
          url: `${BASE}/book`,
        },
        {
          "@type": "Offer",
          name: "אטרקציה לאירוע",
          description: "עשן, בועות, זיקוקים ועוד - מחיר התחלתי לפני מע״מ",
          price: String(EVENT_ATTRACTION_FROM_NIS),
          priceCurrency: "ILS",
          url: `${BASE}/events/attractions`,
        },
        ...PODCAST_PACKAGES.slice(0, 2).map((pkg) => ({
          "@type": "Offer" as const,
          name: pkg.name,
          description: pkg.summary,
          price: String(pkg.price),
          priceCurrency: "ILS",
          url: `${BASE}/podcast`,
        })),
        {
          "@type": "Offer",
          name: "מחירון מרכזי",
          description: "כל המחירים במקום אחד",
          price: String(STUDIO_ONE_HOUR_NIS),
          priceCurrency: "ILS",
          url: `${BASE}/pricing`,
        },
      ],
    },
    ...buildReviewSchemaGraph(SITE_TESTIMONIALS),
  ],
};

export default function SiteSchema() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
