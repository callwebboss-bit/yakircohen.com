import { SITE_URL } from "@/lib/site-url";
import { ENTITY_IDS } from "@/lib/seo/entity-ids";
import {
  CONTACT_PHONE_E164,
  STUDIO_MAPS_URL,
} from "@/lib/constants";
import {
  BRAND_SAME_AS,
  FOUNDER_SAME_AS,
  FOUNDER_IMAGE_URL,
  FOUNDER_KNOWS_ABOUT,
} from "@/lib/seo/entity-same-as";
import { PODCAST_PACKAGES } from "@/lib/data/podcast-calculator";
import { withVat } from "@/lib/data/pricing";
import {
  DJ_TEAM_NOTE,
  getExVat,
  getPriceById,
  PODCAST_AUDIO_PACK_IDS,
  PODCAST_AUDIO_SCOPE_NOTE,
  PODCAST_PACK_NOTE,
  type PriceItemId,
} from "@/lib/data/pricing-catalog";
import { SITE_PHOTO_URL } from "@/lib/seo-config";
import { FOUNDER_CAREER_START_YEAR, FOUNDER_NAME, STUDIO_GEO } from "@/lib/constants";

const BASE = SITE_URL;

/**
 * הצעה מהקטלוג (שלב 4 WP12, S28, PI-18): sku הוא מזהה הקטלוג, price כולל מע״מ
 * כמו שהצרכן רואה, ו-priceSpecification נושא את המחיר לפני מע״מ עם דגל.
 * audit:schema-prices בודק את sku מול הקטלוג.
 */
function catalogOffer(
  id: PriceItemId,
  { name, description, url }: { name: string; description?: string; url: string },
) {
  const exVat = getExVat(id);
  return {
    "@type": "Offer" as const,
    name,
    ...(description ? { description } : {}),
    sku: id,
    price: String(withVat(exVat)),
    priceCurrency: "ILS",
    priceSpecification: {
      "@type": "UnitPriceSpecification",
      price: exVat,
      priceCurrency: "ILS",
      valueAddedTaxIncluded: false,
    },
    url,
  };
}

const PODCAST_PACKAGE_CATALOG_IDS: Record<string, PriceItemId> = {
  social: "content_package",
  video: "podcast_video",
  audio: "podcast_audio",
  starter: "studio_half_hour",
};

/* זהות העסק. האדם מקבל FOUNDER_SAME_AS, שאין בו את רישום המפות. */
const sameAsUrls = [...BRAND_SAME_AS];

const ADDRESS = {
  "@type": "PostalAddress",
  streetAddress: "עמק איילון 34",
  addressLocality: "מודיעין-מכבים-רעות",
  addressRegion: "מרכז",
  postalCode: "7170000",
  addressCountry: "IL",
};

/** Build full JSON-LD graph for the site root layout. */
export function buildSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": ENTITY_IDS.website,
        url: BASE,
        name: "יקיר כהן הפקות",
        description:
          "אולפן הקלטות פרמיום, הפקות מוזיקה לאירועים, פודקאסטים וקריינות במודיעין",
        inLanguage: "he-IL",
        image: SITE_PHOTO_URL,
        publisher: { "@id": ENTITY_IDS.organization },
      },
      {
        "@type": "Organization",
        "@id": ENTITY_IDS.organization,
        name: "יקיר כהן הפקות",
        alternateName: "Yakir Cohen Productions",
        url: BASE,
        logo: {
          "@type": "ImageObject",
          url: `${BASE}/images/logo.svg`,
        },
        telephone: CONTACT_PHONE_E164,
        foundingDate: "2010",
        founder: { "@id": ENTITY_IDS.founder },
        address: ADDRESS,
        sameAs: sameAsUrls,
      },
      {
        "@type": "Person",
        "@id": ENTITY_IDS.founder,
        name: FOUNDER_NAME,
        alternateName: "Yakir Cohen",
        jobTitle: "מפיק מוזיקלי ומדריך קול",
        /* הוותק האישי, בנפרד מ-foundingDate של העסק. בלי זה "20+ שנות
           ניסיון" בעמוד ו-foundingDate 2010 בסכמה נראים כסתירה. Role הוא
           הדפוס של schema.org לעטוף ערך מאפיין בתאריך התחלה. */
        hasOccupation: {
          "@type": "Role",
          startDate: String(FOUNDER_CAREER_START_YEAR),
          hasOccupation: {
            "@type": "Occupation",
            name: "מפיק מוזיקלי ומהנדס סאונד",
          },
        },
        url: `${BASE}/about`,
        image: FOUNDER_IMAGE_URL,
        knowsAbout: [...FOUNDER_KNOWS_ABOUT],
        /* בלי רישום העסק במפות. צומת האדם שהצהיר עליו כזהות שלו אמר
           למנוע שהאדם והעסק הם אותה ישות. ראו lib/seo/entity-same-as.ts */
        sameAs: [...FOUNDER_SAME_AS],
        worksFor: { "@id": ENTITY_IDS.organization },
      },
      {
        "@type": [
          "LocalBusiness",
          "EntertainmentBusiness",
          "MusicRecordingStudio",
        ],
        "@id": ENTITY_IDS.localBusiness,
        name: "יקיר כהן הפקות",
        alternateName: ["Yakir Cohen Productions", "יקיר כהן הפקות מוזיקה"],
        url: BASE,
        /* גוגל ממליץ על image ל-LocalBusiness והצומת היה בלעדיו. אותה תמונה
           שכבר משמשת את WebSite, ולכן היא קיימת, נמדדה חיה ומוגשת מהדומיין
           הקנוני. עמוד /studio הצהיר במקומה קובץ תחת www שמחזיר 404. */
        image: SITE_PHOTO_URL,
        telephone: CONTACT_PHONE_E164,
        priceRange: "₪₪",
        currenciesAccepted: "ILS",
        paymentAccepted: "Cash, Credit Card, Bank Transfer, Bit",
        address: ADDRESS,
        geo: {
          "@type": "GeoCoordinates",
          latitude: STUDIO_GEO.latitude,
          longitude: STUDIO_GEO.longitude,
        },
        hasMap: STUDIO_MAPS_URL,
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
            closes: "22:00",
          },
          {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: "Friday",
            opens: "09:00",
            closes: "14:00",
          },
          /* מוצאי שבת. 21:00 בטוח אחרי צאת השבת בכל עונות השנה. */
          {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: "Saturday",
            opens: "21:00",
            closes: "22:30",
          },
        ],
        areaServed: [
          { "@type": "City", name: "מודיעין-מכבים-רעות" },
          { "@type": "City", name: "ירושלים" },
          { "@type": "City", name: "תל אביב" },
          { "@type": "City", name: "שוהם" },
          { "@type": "City", name: "רחובות" },
          { "@type": "AdministrativeArea", name: "מרכז" },
        ],
        sameAs: sameAsUrls,
        parentOrganization: { "@id": ENTITY_IDS.organization },
        makesOffer: [
          catalogOffer("studio_half_hour", {
            name: "חצי שעה באולפן",
            description: "הקלטה קצרה, פודקאסט או ברכה - קובץ גולמי, בלי עריכה",
            url: `${BASE}/studio/pricing`,
          }),
          catalogOffer("studio_hour", {
            name: "שעת אולפן מלאה",
            description: "הקלטה באולפן במודיעין",
            url: `${BASE}/studio/pricing`,
          }),
          /* השיר מוצג לצרכן כולל מע״מ (2.10.2026), ולכן price כולל מע״מ
             ו-priceSpecification נושא את המחיר לפני מע״מ, כמו ב-SeoPortfolioGalleryJsonLd */
          catalogOffer("song_recording", {
            name: "הקלטת שיר באולפן",
            description: "הקלטה, מיקס ומאסטר בסשן של שעה. תיקון זיופים בתוספת - מחיר כולל מע״מ",
            url: `${BASE}/studio/recording-song-modiin`,
          }),
          catalogOffer("event_attraction_1", {
            name: "אטרקציה לאירוע",
            description: "עשן, בועות, זיקוקים ועוד - מחיר התחלתי",
            url: `${BASE}/events/attractions`,
          }),
          catalogOffer("dj_premium", {
            name: "תקליטן מהצוות",
            description: DJ_TEAM_NOTE,
            url: `${BASE}/events/dj-events`,
          }),
          ...PODCAST_PACKAGES.slice(0, 2).map((pkg) =>
            catalogOffer(PODCAST_PACKAGE_CATALOG_IDS[pkg.id], {
              name: pkg.name,
              description: pkg.summary,
              url: `${BASE}/podcast`,
            }),
          ),
          /* החלטות 5.10.2026 (פודקאסט): פרק אודיו וחבילות פרקי אודיו */
          catalogOffer("podcast_audio", {
            name: "פודקאסט אודיו",
            description: PODCAST_AUDIO_SCOPE_NOTE,
            url: `${BASE}/podcast`,
          }),
          ...PODCAST_AUDIO_PACK_IDS.map((id) =>
            catalogOffer(id, {
              name: getPriceById(id).label,
              description: PODCAST_PACK_NOTE,
              url: `${BASE}/podcast`,
            }),
          ),
          /* "מחירון מרכזי" ירד: זה לא מוצר, והמחיר שלו היה שעת אולפן (S28) */
          {
            "@type": "Offer",
            name: "שיעור ניסיון עברית פרטי",
            description: "שיעור היכרות אחד על אחד - פרונטלי או בזום, מודיעין והמרכז",
            price: "500",
            priceCurrency: "ILS",
            url: `${BASE}/academy/ulpan`,
          },
          {
            "@type": "Offer",
            name: "שיפור קול מהנייד",
            description: "הסרת רעשים, חידוד והעשרת קול - הקלטה ביתית לאיכות אולפן",
            price: "250",
            priceCurrency: "ILS",
            url: `${BASE}/online/vocal-fix`,
          },
          catalogOffer("damaged_recording_rescue", {
            name: "תיקון הקלטות פגומות",
            description: "שחזור ארכיונים, פרקים ישנים והקלטות עם הד, רעש ועיוות, לכל 5 דקות",
            url: `${BASE}/online/vocal-fix`,
          }),
          {
            "@type": "Offer",
            name: "מיקס ומאסטרינג מקוון",
            description: "סאונד מסחרי מוכן לספוטיפיי, יוטיוב ורדיו",
            price: "500",
            priceCurrency: "ILS",
            url: `${BASE}/online/vocal-fix/mixing`,
          },
          /* WP6: היה 250 כתוב. המחיר בקטלוג, בעמוד המיקס ובאשף הוא 300 */
          catalogOffer("studio_pitch_correction", {
            name: "תיקון זיופים",
            description: "Pitch Correction מדויק וטבעי - לא Auto-Tune אוטומטי",
            url: `${BASE}/online/vocal-fix/pitch-correction`,
          }),
          {
            "@type": "Offer",
            name: "שדרוג תמונות AI",
            description: "הגדלה, חידוד ושיפור תמונות ישנות באמצעות AI",
            price: "50",
            priceCurrency: "ILS",
            url: `${BASE}/online/vocal-fix/photo-enhance`,
          },
        ],
      },
      {
        "@type": "Service",
        "@id": `${BASE}/online/#service`,
        name: "שירותי AI מקוונים",
        description:
          "שיפור קול, תיקון הקלטות פגומות, מיקס ומאסטרינג, תיקון זיופים ושדרוג תמונות - הכל מרחוק",
        provider: { "@id": ENTITY_IDS.organization },
        serviceType: "Audio Production",
        areaServed: { "@type": "Country", name: "Israel" },
        url: `${BASE}/online`,
        offers: [
          {
            "@type": "Offer",
            name: "שיפור קול מהנייד",
            price: "250",
            priceCurrency: "ILS",
            url: `${BASE}/online/vocal-fix`,
          },
          {
            "@type": "Offer",
            name: "מיקס ומאסטרינג",
            price: "500",
            priceCurrency: "ILS",
            url: `${BASE}/online/vocal-fix/mixing`,
          },
          catalogOffer("studio_pitch_correction", {
            name: "תיקון זיופים",
            url: `${BASE}/online/vocal-fix/pitch-correction`,
          }),
        ],
      },
      /* 12 צמתי Review של המלצות שהאתר מפרסם על עצמו הוסרו מכאן ב-9.9.2026.
         ביקורות מטעם העסק על עצמו אינן כשירות ל-rich results לפי הנחיות גוגל
         ומסומנות לעתים כספאם. ההמלצות נשארות גלויות בעמודים, רק לא בסכמה,
         באותו היגיון שהוחלט לדירוג. */
    ],
  };
}
