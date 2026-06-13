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
    "אולפן פודקאסט, תוכנית שמע ועריכת סאונד במודיעין. פרק מוכן לספוטיפיי ואפל תוך 24 שעות - החל מ-750 ₪.",
  keywords: [
    "אולפן פודקאסט",
    "תוכנית שמע",
    "עריכת סאונד",
    "RSS פודקאסט",
    "הפצה לספוטיפיי",
    "אולפן פודקאסט מודיעין",
    "פודקאסט משפחתי",
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
  title: "מחירון מרכזי",
  description:
    "מחירון שקוף לאולפן, פודקאסט ואירועים במודיעין. לפני ואחרי מע״מ, עם קישור להזמנה מקוונת.",
  keywords: ["מחירון", "מחירי אולפן", "פודקאסט", "אטרקציות לאירועים"],
  hub: "pricing",
};

export const PRO_HUB_SEO: HubPageSeo = {
  slug: "pro",
  title: "שירותים מקצועיים לדיג'ייז, פודקאסט והגברה",
  description:
    "תגים קוליים, מאשאפים דחופים, פס ייצור לפודקאסט, השכרת ציוד ותכנון הגברה - עם מחשבון הצעה ומחירון שקוף.",
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
