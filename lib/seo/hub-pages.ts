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
  title: "אולפן פודקאסט מקצועי במודיעין",
  description:
    "הקלטת פודקאסט באולפן מקצועי במודיעין - שיפור הקלטות, עריכה מקצועית ומסירה תוך 24 שעות. החל מ-750 ₪. מגיעים, מדברים, ויוצאים עם פרק מוכן לספוטיפיי.",
  keywords: [
    "אולפן פודקאסט",
    "הקלטת פודקאסט",
    "אולפן פודקאסט מודיעין",
    "הקלטת פודקאסט מודיעין",
    "שיפור הקלטות",
    "פודקאסט משפחתי",
    "עריכת פודקאסט",
    "פודקאסט וידאו",
  ],
  hub: "podcast",
};

export const ACADEMY_HUB_SEO: HubPageSeo = {
  slug: "academy",
  title: "האקדמיה | לימוד DJ, הפקה מוזיקלית ו-AI",
  description:
    "קורסי DJ, הפקה מוזיקלית ו-AI. שיעור פרטי 1:1 באולפן במודיעין - שיעור מלא 990 ₪ (שעה) או Pro Session 1,280 ₪ (שעה וחצי). מסלולי Retainer, NeverMind ומעבדת סאונד.",
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
    "מרכז שירותי AI אונליין: אודיו, פודקאסט, וידאו, תמונה ותוכן עסקי. אתם שולחים חומר, אנחנו מבצעים הכל ומחזירים תוצר מוכן עם ליווי אישי.",
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
  title: "מחירון מרכזי",
  description:
    "כל המחירים במקום אחד: אולפן, פודקאסט, עריכה ואטרקציות לאירועים. לפני ואחרי מע״מ, עם קישור להזמנה מקוונת.",
  keywords: ["מחירון", "מחירי אולפן", "פודקאסט", "אטרקציות לאירועים"],
  hub: "pricing",
};

export const BLOG_HUB_SEO: HubPageSeo = {
  slug: "blog",
  title: "מגזין מקצועי",
  description:
    "מדריכים ותובנות על הקלטה, פודקאסט, אולפן, DJ, אירועים, קריינות וסאונד.",
  keywords: ["מגזין", "מדריכי אולפן", "טיפים לפודקאסט", "בלוג מוזיקה"],
  hub: "blog",
};

export const START_HUB_SEO: HubPageSeo = {
  slug: "start",
  title: "מה קורה אחרי שפונים",
  description:
    "3 שלבים ברורים: ניתוח, ביצוע ומסירה. אולפן, אירועים, פודקאסט ועריכה מרחוק - בלי הפתעות.",
  keywords: ["איך מתחילים", "שלבי עבודה", "אולפן מודיעין", "הזמנת שירות"],
  hub: "book",
};

export const PORTFOLIO_HUB_SEO: HubPageSeo = {
  slug: "portfolio",
  title: "תיק עבודות וידאו",
  description:
    "מעל 270 דוגמאות וידאו מהאולפן, פודקאסט, ברכות, DJ וקריינות במודיעין - צפו לפי נושא והזמינו שירות.",
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
    "ציוד אולפן יד שנייה, ציוד די ג'יי, רמקולים מוגברים RCF, ציוד הגברה ותאורה מקצועי למכירה.",
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
    "שובר מתנה לאולפן (מ-750 ₪ חצי שעה), אטרקציות והפקות. מתנה מקורית לחתונה, יום הולדת או כל אירוע.",
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
    "מרחב חקירה לוגי לגמגום. פירוק הנחות נסתרות, חקירת המנגנון והפרדת הזהות מהפעולה הטכנית של הדיבור.",
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
    "ליווי אישי לגמגום - ילדים, נוער ומבוגרים. שיטת NeverMind: נשימה, ביטחון עצמי ודיבור חופשי. תרגול מציאותי מול מיקרופון באולפן במודיעין.",
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
    "מעל 20 שנה של אהבה לסאונד. אולפן הקלטות במודיעין, הפקת פודקאסטים, אטרקציות לאירועים ושירותי DJ. הכירו את יקיר כהן והמשפחה המקצועית שלנו.",
  keywords: ["אודות", "יקיר כהן", "אולפן מודיעין", "הפקות"],
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
