import type { Metadata } from "next";
import type { ServiceEntity } from "@/lib/data/services";
import { constructMetadata } from "@/lib/metadata";
import {
  ogImageToMetadataParam,
  resolveOgForHub,
  type HubOgKey,
} from "@/lib/seo/og-images";
import { normalizeTitle } from "@/lib/seo/normalize-title";

export type HubPageSeo = {
  slug: string;
  title: string;
  description: string;
  keywords: readonly string[];
  hub: HubOgKey;
};

export const PODCAST_HUB_SEO: HubPageSeo = {
  slug: "podcast",
  title: "אולפן פודקאסט מקצועי במודיעין | מבוסס חומרה",
  description:
    "אולפן פודקאסט מקצועי במודיעין, מבוסס חומרה. 4 מתחמי הקלטה, מיקרופוני Shure & Rode, פרק בדרך כלל מוכן לספוטיפיי תוך 24 שעות מ-750 ₪.",
  keywords: [
    "אולפן פודקאסט",
    "תוכנית שמע",
    "עריכת סאונד",
    "RSS פודקאסט",
    "הפצה לספוטיפיי",
    "אולפן פודקאסט מודיעין",
    "פודקאסט משפחתי",
    "Shure Rode מיקרופון",
    "4K פודקאסט וידאו",
  ],
  hub: "podcast",
};

export const ACADEMY_HUB_SEO: HubPageSeo = {
  slug: "academy",
  title: "האקדמיה | לימוד DJ, הפקה מוזיקלית ו-AI",
  description:
    "קורסי DJ והפקה מוזיקלית במודיעין. שיעור פרטי 990 ₪, Pro Session 1,280 ₪ - NeverMind ומעבדת סאונד.",
  keywords: [
    "קורס DJ",
    "לימוד תקליטנות",
    "קורס הפקה מוזיקלית",
    "AI מוזיקה",
    "אולפן הקלטות מודיעין",
    "פרוטוקול NeverMind",
  ],
  hub: "academy",
};

export const ONLINE_HUB_SEO: HubPageSeo = {
  slug: "online",
  title: "מאגר שירותי AI אונליין",
  description:
    "שירותי AI לסאונד וסרטונים - ממודיעין. שלחו חומר, נחזיר תוצר מוכן עם ליווי אישי.",
  keywords: [
    "שירותי AI אונליין",
    "הפקה מרחוק",
    "עריכת אודיו AI",
    "עריכת פודקאסט אונליין",
    "מאגר שירותים דיגיטליים",
  ],
  hub: "online",
};

export const PRICING_HUB_SEO: HubPageSeo = {
  slug: "pricing",
  title: "מחירון שקוף | אולפן, פודקאסט ואירועים – מודיעין",
  description:
    "מחירון שקוף ממודיעין. אולפן מ-750 ₪, פודקאסט מ-950 ₪, אטרקציות לאירועים ושירותי AI – לפני ואחרי מע״מ, עם הזמנה מקוונת.",
  keywords: [
    "מחירון אולפן",
    "מחיר הקלטה באולפן",
    "מחיר פודקאסט",
    "מחיר אטרקציות לאירועים",
    "מחירון מודיעין",
    "כמה עולה שעת אולפן",
    "מחיר הקלטת שיר",
    "מחיר מצגת תמונות",
    "מחירים לפני מע״מ",
    "הזמנת אולפן מקוון",
  ],
  hub: "pricing",
};

export const PRO_HUB_SEO: HubPageSeo = {
  slug: "pro",
  title: "שירותים מקצועיים לדיג'ייז, פודקאסט והגברה",
  description:
    "שירותים מקצועיים במודיעין לדיגייז ופודקאסט. תגים קוליים, מאשאפים ופס ייצור.",
  keywords: [
    "שירותים לדיג'יי",
    "תג קולי לדיג'יי",
    "השכרת ציוד הגברה",
    "עריכת פודקאסט לעסק",
    "מאשאפ לחתונה",
    "תכנון הגברה לאירוע",
  ],
  hub: "events",
};

export const BUSINESS_HUB_SEO: HubPageSeo = {
  slug: "business",
  title: "הפקת תוכן לעסקים | קריינות, פודקאסט וסרט תדמית - חשבונית מס",
  description:
    "הפקת תוכן לעסקים במודיעין: רילז, קריינות ופודקאסט. חשבונית מס - תגובה, בדרך כלל תוך 24 שעות.",
  keywords: [
    "הפקת תוכן לעסקים",
    "הפקת תוכן לעסקים פתח תקווה",
    "קריינות לחברה",
    "פודקאסט לחברה",
    "תוכן שיווקי לעסקים",
    "רילז לעסקים מודיעין",
    "סרט תדמית לחברה",
    "קריינות לעסקים",
    "תוכן שיווקי לעסקים",
  ],
  hub: "video",
};

export const BLOG_HUB_SEO: HubPageSeo = {
  slug: "blog",
  title: "מגזין מקצועי",
  description:
    "מגזין אולפן ופודקאסט במודיעין. מדריכים על הקלטה, DJ, אירועים וסאונד.",
  keywords: ["מגזין", "מדריכי אולפן", "טיפים לפודקאסט", "בלוג מוזיקה"],
  hub: "blog",
};

export const START_HUB_SEO: HubPageSeo = {
  slug: "start",
  title: "מה קורה אחרי שפונים",
  description:
    "מה קורה אחרי שפונים - ממודיעין. ניתוח, ביצוע ומסירה - בלי הפתעות.",
  keywords: ["איך מתחילים", "שלבי עבודה", "אולפן מודיעין", "הזמנת שירות"],
  hub: "book",
};

export const PORTFOLIO_HUB_SEO: HubPageSeo = {
  slug: "portfolio",
  title: "תיק עבודות וידאו",
  description:
    "תיק עבודות וידאו ממודיעין. מעל 270 דוגמאות - אולפן, פודקאסט, DJ וקריינות.",
  keywords: [
    "תיק עבודות אולפן",
    "דוגמאות הקלטה",
    "אולפן מודיעין",
  ],
  hub: "studio",
};

export const SHOP_HUB_SEO: HubPageSeo = {
  slug: "shop",
  title: "חנות ציוד מקצועי - אולפן, הגברה ותאורה",
  description:
    "ציוד אולפן יד שנייה במודיעין. די ג'יי, RCF, הגברה ותאורה מקצועית.",
  keywords: [
    "ציוד אולפן יד שנייה",
    "ציוד די ג'יי",
    "רמקולים מוגברים",
    "אולפן ביתי",
  ],
  hub: "shop",
};

export const VOUCHER_HUB_SEO: HubPageSeo = {
  slug: "voucher",
  title: "שובר מתנה | אולפן ואירועים",
  description:
    "שובר מתנה לאולפן במודיעין. מ-750 ₪ - אולפן, אטרקציות והפקות לאירועים.",
  keywords: ["שובר מתנה", "שובר אולפן", "מתנה לאירוע", "שובר חתונה"],
  hub: "voucher",
};

export const CONTACT_HUB_SEO: HubPageSeo = {
  slug: "contact",
  title: "יצירת קשר",
  description:
    "צרו קשר - אולפן הקלטות, DJ, קריינות ופודקאסטים במודיעין. זמינים בוואטסאפ בשעות הפעילות.",
  keywords: ["צור קשר", "אולפן מודיעין", "DJ מודיעין", "וואטסאפ"],
  hub: "book",
};

export const CLINIC_HUB_SEO: HubPageSeo = {
  slug: "clinic",
  title: "קליניקה - חקירה לוגית של גמגום",
  description:
    "קליניקה לגמגום במודיעין. חקירה לוגית - פירוק הנחות והפרדת הזהות מהדיבור.",
  keywords: [
    "קליניקה לגמגום",
    "חקירה לוגית של גמגום",
    "עבודה מכנית על דיבור",
  ],
  hub: "academy",
};

export const STUTTERING_HUB_SEO: HubPageSeo = {
  slug: "stuttering",
  title: "טיפול בגמגום ילדים ומבוגרים | שיטת NeverMind",
  description:
    "ליווי לגמגום במודיעין. ילדים, נוער ומבוגרים - שיטת NeverMind מול מיקרופון.",
  keywords: [
    "טיפול בגמגום",
    "גמגום ילדים",
    "גמגום מבוגרים",
    "הפסקת גמגום",
    "NeverMind גמגום",
    "קורס גמגום מודיעין",
    "ליווי גמגום",
  ],
  hub: "academy",
};

export const ABOUT_HUB_SEO: HubPageSeo = {
  slug: "about",
  title: "אודות",
  description:
    "אודות יקיר כהן - אולפן במודיעין. 20+ שנות סאונד, פודקאסטים, DJ ואטרקציות.",
  keywords: ["אודות", "יקיר כהן", "אולפן מודיעין", "הפקות"],
  hub: "studio",
};

export const FOR_COUPLES_HUB_SEO: HubPageSeo = {
  slug: "for-couples",
  title: "שיר לחתונה, DJ וצילום | מסלול לזוגות",
  description:
    "מסלול לזוגות במודיעין: שיר במתנה, DJ ואטרקציות. תגובה, בדרך כלל תוך 24 שעות.",
  keywords: [
    "שיר לחתונה",
    "DJ לחתונה",
    "חבילות לחתונה",
    "הקלטת שיר במתנה",
    "צילום חתונה מודיעין",
  ],
  hub: "events",
};

export const FOR_CREATORS_HUB_SEO: HubPageSeo = {
  slug: "for-creators",
  title: "אולפן, מיקס וקורסים | מסלול ליוצרים",
  description:
    "מסלול ליוצרים במודיעין: הקלטה, פודקאסט, מיקס וקורסי DJ. מסירה, בדרך כלל תוך 24 שעות.",
  keywords: [
    "אולפן ליוצרים",
    "הקלטת שיר",
    "מיקס אונליין",
    "קורס DJ מודיעין",
    "הפקה מוזיקלית",
  ],
  hub: "studio",
};

export const PACKAGES_HUB_SEO: HubPageSeo = {
  slug: "packages",
  title: "חבילות אולפן, פודקאסט וחתונות",
  description:
    "חבילות מוכנות במודיעין: שיר באולפן, פודקאסט ופסטיבל לחתונה. מחירים שקופים לפני מע״מ.",
  keywords: [
    "חבילות אולפן",
    "חבילת פודקאסט",
    "חבילות לחתונה",
    "מחירון חבילות",
  ],
  hub: "pricing",
};

export const GALLERY_HUB_SEO: HubPageSeo = {
  slug: "gallery",
  title: "גלריית תמונות | אולפן ואירועים",
  description:
    "תמונות מהאולפן, DJ, אפקטים ופודקאסטים במודיעין. דוגמאות מהשטח לפני שמזמינים.",
  keywords: [
    "גלריה אולפן",
    "תמונות חתונה",
    "אולפן מודיעין",
    "דוגמאות DJ",
  ],
  hub: "studio",
};

export const TESTIMONIALS_HUB_SEO: HubPageSeo = {
  slug: "testimonials",
  title: "המלצות לקוחות | אולפן ואירועים במודיעין",
  description:
    "ביקורות לקוחות על אולפן ואירועים במודיעין. DJ, פודקאסט וקריינות - תגובות אמיתיות.",
  keywords: [
    "המלצות לקוחות",
    "ביקורות אולפן מודיעין",
    "DJ חתונה המלצות",
  ],
  hub: "studio",
};

export function metadataForHubSeo(seo: HubPageSeo): Metadata {
  return constructMetadata({
    title: seo.title,
    description: seo.description,
    slug: seo.slug,
    keywords: [...seo.keywords],
    ogImage: ogImageToMetadataParam(resolveOgForHub(seo.hub)),
  });
}

export function hubSchemaPropsFromSeo(seo: HubPageSeo) {
  return {
    slug: seo.slug,
    title: normalizeTitle(seo.title),
    description: seo.description,
    hub: seo.hub,
  };
}

export function hubSchemaPropsFromService(
  service: ServiceEntity,
  hub: HubOgKey,
) {
  return {
    slug: service.slug,
    title: normalizeTitle(service.metaTitle),
    description: service.metaDescription,
    hub,
  };
}
