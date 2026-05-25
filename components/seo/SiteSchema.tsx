import { SITE_URL } from "@/lib/site-url";
import { CONTACT_PHONE_E164, SOCIAL_LINKS } from "@/lib/constants";
import { PODCAST_STARTER_PRICE } from "@/lib/data/podcast-calculator";
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
          name: "הקלטת שיר לאירוע",
          description:
            "הקלטה, מיקס ועריכת שיר לחתונה, בר מצווה ואירועים",
          price: "990",
          priceCurrency: "ILS",
          url: `${BASE}/studio/recording-song-modiin`,
        },
        {
          "@type": "Offer",
          name: "DJ ועיצוב לאירועים",
          description:
            "מערכות LED, DJ מקצועי ואטרקציות לחתונות ואירועים",
          price: "2500",
          priceCurrency: "ILS",
          url: `${BASE}/events/dj-events`,
        },
        {
          "@type": "Offer",
          name: "פודקאסט  -  פרק קצר (30 דקות)",
          description: "הקלטה ועריכה בסיסית באולפן במודיעין",
          price: String(PODCAST_STARTER_PRICE),
          priceCurrency: "ILS",
          url: `${BASE}/podcast`,
        },
        {
          "@type": "Offer",
          name: "הפקת פודקאסט מלאה",
          description: "צילום, הקלטה, עריכה  -  פרק מוכן תוך 24 שעות",
          price: "2500",
          priceCurrency: "ILS",
          url: `${BASE}/podcast/podcast-recording`,
        },
        {
          "@type": "Offer",
          name: "קורסי DJ ומוזיקה",
          description: "לימודי DJ, אקדמיה למוזיקה ופיתוח קול",
          price: "480",
          priceCurrency: "ILS",
          url: `${BASE}/academy`,
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
