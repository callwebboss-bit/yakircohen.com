import type { PriceItemId } from "@/lib/data/pricing-catalog";
import {
  CATALOG_VAT_RATE,
  getExVat,
  getPriceById,
  getPriceFromById,
  getPriceTransparencyById,
} from "@/lib/data/pricing-catalog";
import { formatPriceScopeDisplay } from "@/lib/data/pricing-display";
import {
  buildAttractionsEventPriceAnswer,
  buildPodcastEditingPriceAnswer,
  buildPodcastRecordingPriceAnswer,
  buildRecordingSongStudioPriceAnswer,
} from "@/lib/data/faq-aeo";
import { absoluteUrl } from "@/lib/site-url";

export const INDUSTRY_2026_SLUG = "data/industry-2026";
export const INDUSTRY_2026_PATHNAME = `/${INDUSTRY_2026_SLUG}`;
export const INDUSTRY_2026_UPDATED_AT = "2026-08-18";

export const INDUSTRY_2026_TITLE =
  "נתוני תעשייה 2026: מחירי הקלטה, פודקאסט, קליפ ואטרקציות בישראל";
export const INDUSTRY_2026_DESCRIPTION =
  "כמה עולה להקליט שיר, קליפ בר או בת מצווה, אטרקציות לאירוע והקמת פודקאסט ב-2026. נתוני תעשייה מרוכזים ממחירון האתר, מטווחי שוק שכבר פורסמו וממתודולוגיה שקופה.";

type IndustryCtaLink = {
  label: string;
  href: string;
};

export type Industry2026PriceRow = {
  label: string;
  exVat?: number;
  primary: string;
  scopeLine?: string;
  vatLine?: string;
  note?: string;
  sourceLabel: string;
};

export type Industry2026Section = {
  id: string;
  kicker: string;
  title: string;
  intro: string;
  note?: string;
  rows: Industry2026PriceRow[];
  links: IndustryCtaLink[];
};

export type Industry2026FaqItem = {
  id: string;
  question: string;
  answer: string;
};

function buildCatalogRow(id: PriceItemId, overrides?: { note?: string }): Industry2026PriceRow {
  const item = getPriceById(id);
  const display = formatPriceScopeDisplay({
    exVat: item.exVat,
    scope: item.scope,
    showFromPrefix: getPriceFromById(id),
  });
  const transparency = getPriceTransparencyById(id);

  return {
    label: item.label,
    exVat: item.exVat,
    primary: display.primary,
    scopeLine: display.scopeLine,
    vatLine: display.vatLine,
    note: overrides?.note ?? transparency.scopeNote ?? item.context,
    sourceLabel: "מחירון יקיר כהן",
  };
}

function buildMarketRangeRow(
  label: string,
  primary: string,
  note: string,
  sourceLabel: string,
): Industry2026PriceRow {
  return {
    label,
    primary,
    note,
    sourceLabel,
  };
}

export const INDUSTRY_2026_METHODOLOGY = [
  "המחירים במחירון הם מחירי האתר לפני מע\"מ, מתוך pricing-catalog.ts.",
  "טווחי שוק מסומנים במפורש כטווחים שנכתבו כבר במדריכי 2026 באתר, לא כהבטחת מחיר של האולפן.",
  "עמוד זה לא משתמש כרגע בממוצעי סגירה של Event Index כי קובץ המדד הציבורי עדיין ללא מדגם.",
] as const;

export const INDUSTRY_2026_CITATION =
  `מקור לציטוט: יקיר כהן, נתוני תעשייה 2026, ${absoluteUrl(INDUSTRY_2026_SLUG)}`;

export const INDUSTRY_2026_QUICK_ANSWERS = [
  "הקלטת שיר באולפן מתחילה ב-590 ₪ לברכה, 1,200 ₪ לקאבר ו-3,500 ₪ לסינגל מקורי - לפני מע\"מ.",
  "קליפ בר או בת מצווה מלא מתחיל במחירון האתר ב-4,500 ₪, ובמדריך השוק טווח נפוץ מלא הוא 4,500-7,500 ₪.",
  "אטרקציה בודדת לאירוע מתחילה ב-1,750 ₪, וחבילת שלוש אטרקציות ב-4,450 ₪ - לפני מע\"מ.",
  "פודקאסט אודיו עולה 950 ₪ לפרק, פודקאסט וידאו 1,650 ₪, והפקה מלאה 2,500 ₪ - לפני מע\"מ.",
] as const;

export const INDUSTRY_2026_SECTIONS: readonly Industry2026Section[] = [
  {
    id: "song-recording",
    kicker: "אולפן",
    title: "כמה עולה להקליט שיר ב-2026?",
    intro:
      "הקלטת שיר באולפן ב-2026 מתחילה ב-590 ₪ לברכה, 1,200 ₪ לקאבר ו-3,500 ₪ לסינגל מקורי - לפני מע\"מ.",
    note:
      "המחיר הסופי תלוי בעיקר בכמות שעות האולפן, בעיבוד המוזיקלי ובמספר הגרסאות שמבקשים לקבל.",
    rows: [
      buildCatalogRow("blessing_recording"),
      buildCatalogRow("cover_song"),
      buildCatalogRow("song_package"),
      buildCatalogRow("single_production"),
      buildMarketRangeRow(
        "טווח שוק להקלטת שיר לבר מצווה",
        "600-900 ₪ להקלטה ועריכה בסיסית",
        "במדריך המחירים לבר מצווה טווח השוק הנפוץ להקלטה + עריכה בסיסית הוא 600-900 ₪, ומסלול עם עיבוד מלא נע בין 1,200 ל-2,500 ₪.",
        "מדריך: bar-mitzvah-recording-price-guide",
      ),
    ],
    links: [
      { label: "הקלטת שיר באולפן", href: "/studio/recording-song-modiin" },
      {
        label: "מדריך מחירון הקלטת שיר 2026",
        href: "/blog/studio-recording-cost-israel-2026",
      },
    ],
  },
  {
    id: "bar-mitzvah-clips",
    kicker: "קליפים",
    title: "כמה עולה קליפ בר או בת מצווה ב-2026?",
    intro:
      "קליפ בר או בת מצווה מלא מתחיל במחירון האתר ב-4,500 ₪ לפני מע\"מ, ובטווחי השוק שכבר פורסמו באתר הוא נע בדרך כלל בין 4,500 ל-7,500 ₪.",
    note:
      "כאן חשוב להפריד בין מחירון השירות של האולפן לבין טווחי שוק רחבים יותר, בעיקר כשיש הרבה משתתפים או יום צילום מורחב.",
    rows: [
      buildCatalogRow("full_production_clip", {
        note: "שיר מוגמר וקליפ וידאו לשיתוף. זהו מחירון השירות של האולפן, לא טווח שוק.",
      }),
      buildMarketRangeRow(
        "טווח שוק לקליפ מלא",
        "4,500-7,500 ₪",
        "מבוסס על המדריך לקליפ בת מצווה 2026. כולל שיר אישי, הקלטה, צילום ועריכה במסלול מלא.",
        "מדריך: bat-mitzvah-clip-guide",
      ),
      buildMarketRangeRow(
        "טווח שוק לקליפ מורחב",
        "8,000-15,000+ ₪",
        "רלוונטי לקליפ משפחתי רחב, 25+ משתתפים, ימי צילום נוספים או עריכת וידאו מורחבת.",
        "מדריך: bat-mitzvah-clip-guide",
      ),
    ],
    links: [
      { label: "קליפ בת מצווה", href: "/studio/blessings/bat-mitzvah-clip" },
      { label: "ברכות לבר מצווה", href: "/studio/blessings/bar-mitzvah" },
      { label: "מדריך קליפ בת מצווה 2026", href: "/blog/bat-mitzvah-clip-guide" },
    ],
  },
  {
    id: "event-attractions",
    kicker: "אירועים",
    title: "כמה עולות אטרקציות לאירוע ב-2026?",
    intro:
      "אטרקציה בודדת לאירוע מתחילה ב-1,750 ₪, חבילת שתי אטרקציות ב-3,200 ₪, וחבילת שלוש אטרקציות ב-4,450 ₪ - לפני מע\"מ.",
    note:
      "העלות תלויה בעיקר במספר האפקטים, אישורי האולם, שעת ההפעלה והאם צריך צוות הפעלה צמוד לאורך האירוע.",
    rows: [
      buildCatalogRow("event_attraction_1"),
      buildCatalogRow("event_attraction_2"),
      buildCatalogRow("event_attraction_3"),
      buildCatalogRow("event_attraction_4"),
      buildCatalogRow("single_effect"),
      buildCatalogRow("dj_premium", {
        note: "מחירון תקליטן מהצוות. נוסף כאן כי בחלק מהפניות משווים בין DJ לבד לבין DJ עם אטרקציות.",
      }),
      buildCatalogRow("dj_yakir_personal", {
        note: "מחירון יקיר כהן אישית. משתמשים במחירון הקטלוגי כמקור אמת מול אזכורים ישנים יותר בבלוג.",
      }),
    ],
    links: [
      { label: "אטרקציות לאירועים", href: "/events/attractions" },
      {
        label: "מדריך אטרקציות ואפקטים 2026",
        href: "/blog/wedding-effects-what-worth-it",
      },
    ],
  },
  {
    id: "podcast-pricing",
    kicker: "פודקאסט",
    title: "כמה עולה להקים, להקליט ולערוך פודקאסט ב-2026?",
    intro:
      "פודקאסט אודיו עולה 950 ₪ לפרק, פודקאסט וידאו 1,650 ₪, הפקה מלאה 2,500 ₪, ועריכה נפרדת 750 ₪ לשעת חומר - לפני מע\"מ.",
    note:
      "כששואלים \"כמה עולה להקים פודקאסט\" צריך להפריד בין ציוד ביתי חד-פעמי, הקלטת פרק באולפן, עריכת חומר קיים והפקה מלאה עם צילום.",
    rows: [
      buildCatalogRow("podcast_audio"),
      buildCatalogRow("podcast_video"),
      buildCatalogRow("full_podcast_production"),
      buildCatalogRow("podcast_editing_hour"),
      buildMarketRangeRow(
        "ציוד ביתי בסיסי לפרק ראשון",
        "400-1,200 ₪",
        "טווח שוק לציוד ביתי בסיסי שמופיע במדריך הפקת פודקאסט בישראל. זה לא מחירון האולפן.",
        "מדריך: podcast-production-guide-israel",
      ),
      buildMarketRangeRow(
        "טווח שוק להפקת פרק באולפן",
        "1,500-5,000+ ₪",
        "טווח רחב שמופיע במדריך ההשוואתי בין DIY לאולפן, לפי פורמט, מספר מצלמות ורמת פוסט.",
        "מדריך: podcast-production-guide-israel",
      ),
    ],
    links: [
      { label: "הפקת פודקאסט", href: "/podcast" },
      {
        label: "מדריך פודקאסט בלי לבזבז כסף",
        href: "/blog/first-podcast-without-wasting-money",
      },
    ],
  },
] as const;

export const INDUSTRY_2026_FAQS: readonly Industry2026FaqItem[] = [
  {
    id: "record-song-2026",
    question: "כמה עולה להקליט שיר ב-2026?",
    answer: buildRecordingSongStudioPriceAnswer(),
  },
  {
    id: "bar-mitzvah-clip-2026",
    question: "כמה עולה קליפ בר מצווה או בת מצווה ב-2026?",
    answer:
      "מחירון האולפן לקליפ מלא מתחיל ב-4,500 ₪ לפני מע\"מ. במדריך השוק שכבר פורסם באתר, טווח נפוץ לקליפ מלא הוא 4,500 עד 7,500 ₪, וקליפ מורחב יכול להגיע גם ל-8,000 עד 15,000 ₪ ומעלה.",
  },
  {
    id: "attractions-2026",
    question: "כמה עולות אטרקציות לאירוע ב-2026?",
    answer: buildAttractionsEventPriceAnswer(),
  },
  {
    id: "start-podcast-2026",
    question: "כמה עולה להקים פודקאסט ב-2026?",
    answer:
      "אם בוחרים ציוד ביתי בסיסי, טווח נפוץ להתחלה הוא 400 עד 1,200 ₪ לפני עריכת זמן עבודה. אם רוצים להתחיל באולפן בלי לקנות ציוד, פרק אודיו מתחיל ב-950 ₪ לפני מע\"מ והפקה מלאה ב-2,500 ₪.",
  },
  {
    id: "record-podcast-2026",
    question: "כמה עולה להקליט פודקאסט ב-2026?",
    answer: buildPodcastRecordingPriceAnswer(),
  },
  {
    id: "edit-podcast-2026",
    question: "כמה עולה לערוך פודקאסט ב-2026?",
    answer: buildPodcastEditingPriceAnswer(),
  },
];

export const INDUSTRY_2026_OFFERS = INDUSTRY_2026_SECTIONS.flatMap((section) =>
  section.rows
    .filter((row) => row.exVat != null)
    .map((row, index) => ({
      id: `${section.id}-${index + 1}`,
      name: row.label,
      description: section.title,
      priceExVat: row.exVat ?? null,
    })),
);

export const INDUSTRY_2026_DATASET_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "Dataset",
  name: "נתוני תעשייה 2026 - מחירי הקלטה, פודקאסט, קליפ ואטרקציות בישראל",
  description: INDUSTRY_2026_DESCRIPTION,
  url: absoluteUrl(INDUSTRY_2026_SLUG),
  inLanguage: "he-IL",
  datePublished: INDUSTRY_2026_UPDATED_AT,
  dateModified: INDUSTRY_2026_UPDATED_AT,
  license: absoluteUrl("terms"),
  creator: {
    "@type": "Organization",
    name: "Yakir Cohen",
    url: absoluteUrl(),
  },
  publisher: {
    "@type": "Organization",
    name: "Yakir Cohen",
    url: absoluteUrl(),
  },
  isAccessibleForFree: true,
  variableMeasured: [
    "מחיר לפני מע\"מ",
    "טווח שוק נצפה",
    "סוג שירות",
    "מה כלול",
  ],
  measurementTechnique:
    "שילוב בין מחירון האתר כ-source of truth לבין טווחי שוק שפורסמו כבר במדריכי 2026 באתר.",
};

export const INDUSTRY_2026_VAT_NOTE = `כל המחירים בעמוד הם לפני מע"מ (${Math.round(CATALOG_VAT_RATE * 100)}%).`;
