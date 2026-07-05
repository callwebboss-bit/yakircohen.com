import {
  EVENTS_SERVICES,
  PHOTOGRAPHY_SERVICES,
  STUDIO_SERVICES,
  VIDEO_SERVICES,
  VOICEOVER_SERVICES,
  type ServiceEntity,
} from "@/lib/data/services";
import { PODCAST_STARTER_PRICE } from "@/lib/data/podcast-calculator";

export type SiteSearchItem = {
  title: string;
  description: string;
  category: string;
  href: string;
  keywords: readonly string[];
};

const CATEGORY_LABELS: Record<ServiceEntity["category"], string> = {
  studio: "סטודיו וברכות",
  podcast: "פודקאסט",
  voiceover: "קריינות",
  events: "אירועים",
  video: "וידאו",
  photography: "צילום",
};

const PODCAST_STARTING_LABEL = `החל מ-${PODCAST_STARTER_PRICE} ₪`;

const PODCAST_HUB_ITEMS: SiteSearchItem[] = [
  {
    title: "הפקת פודקאסט מלאה",
    description: `צילום 4K, הקלטה אולפנית, עריכה, פרק בדרך כלל מוכן תוך 24 שעות. ${PODCAST_STARTING_LABEL} לפרק קצר.`,
    category: "פודקאסט",
    href: "/podcast",
    keywords: ["פודקאסט", "הקלטה", "אולפן", "4K", "ספוטיפיי", "750"],
  },
  {
    title: "פודקאסט עם סבא וסבתא",
    description: "חוויה משפחתית, פודקאסט + הקלטת שיר באולפן",
    category: "פודקאסט",
    href: "/podcast/podcast-with-grandpa",
    keywords: ["סבא", "סבתא", "מתנה", "שיר", "מורשת"],
  },
  {
    title: "צילום והקלטת פודקאסט",
    description: "הפקה מלאה, פרק בדרך כלל מוכן תוך 24 שעות, החל מ-2,500 ₪",
    category: "פודקאסט",
    href: "/podcast/podcast-recording",
    keywords: ["צילום", "הקלטה", "הפקה מלאה", "4K"],
  },
  {
    title: "הפקת פודקאסט מא׳ עד ת׳",
    description: `ליווי מהרעיון ועד פרסום, ${PODCAST_STARTING_LABEL} לפרק קצר (חצי שעה)`,
    category: "פודקאסט",
    href: "/podcast/podcast-production",
    keywords: ["הפקה", "פודקאסט", "ליווי", "750"],
  },
  {
    title: "השכרת סטודיו לפודקאסט במודיעין",
    description: `ציוד מקצועי, חדר מבודד וליווי טכני, ${PODCAST_STARTING_LABEL} לפרק קצר`,
    category: "פודקאסט",
    href: "/podcast/podcast-studio-modiin",
    keywords: ["אולפן", "הקלטה", "השכרת סטודיו", "מודיעין", "750"],
  },
  {
    title: "פודקאסט נייד עד הבית",
    description: "האולפן מגיע אליכם, בית, משרד או אירוע",
    category: "פודקאסט",
    href: "/podcast/mobile-podcast-at-home",
    keywords: ["נייד", "בית", "הגעה", "משרד"],
  },
  {
    title: "עריכת פודקאסט מלאה",
    description: "ניקוי, שיפור קול, חיתוך, פרק מוכן לפרסום",
    category: "פודקאסט",
    href: "/podcast/podcast-editing",
    keywords: ["עריכה", "ניקוי רעשים", "מיקס"],
  },
];

function serviceToSearchItem(service: ServiceEntity): SiteSearchItem {
  return {
    title: service.hubCard?.title ?? service.title,
    description: service.hubCard?.description ?? service.subtitle,
    category: CATEGORY_LABELS[service.category],
    href: `/${service.slug}`,
    keywords: service.keywords,
  };
}

export function getSiteSearchIndex(): SiteSearchItem[] {
  const fromRegistry = [
    ...Object.values(STUDIO_SERVICES),
    ...Object.values(VOICEOVER_SERVICES),
    ...Object.values(EVENTS_SERVICES),
    ...Object.values(VIDEO_SERVICES),
    ...Object.values(PHOTOGRAPHY_SERVICES),
  ].map(serviceToSearchItem);

  const extras: SiteSearchItem[] = [
    {
      title: "דף הבית",
      description: "אולפן, פודקאסט, אירועים ווידאו",
      category: "כללי",
      href: "/",
      keywords: ["בית", "ראשי"],
    },
    {
      title: "צור קשר",
      description: "טלפון, אימייל ווואטסאפ",
      category: "כללי",
      href: "/contact",
      keywords: ["קשר", "טלפון"],
    },
    {
      title: "מחירון אולפן",
      description: "שעת אולפן, חבילת שיר וסינגל",
      category: "סטודיו",
      href: "/studio/pricing",
      keywords: ["מחירון", "מחיר", "חבילה"],
    },
    {
      title: "שאלות נפוצות",
      description: "תשובות על שירותים ותהליכים",
      category: "כללי",
      href: "/about/faq",
      keywords: ["שאלות", "FAQ"],
    },
    {
      title: "מגזין",
      description: "מאמרים וטיפים מהאולפן",
      category: "בלוג",
      href: "/blog",
      keywords: ["בלוג", "מאמרים"],
    },
  ];

  return [...PODCAST_HUB_ITEMS, ...fromRegistry, ...extras];
}

export const POPULAR_SEARCH_QUERIES = [
  "שיר כניסה לחופה",
  "תקליטן לחתונה",
  "אולפן מודיעין",
  "פודקאסט",
  "מחירון",
] as const;
