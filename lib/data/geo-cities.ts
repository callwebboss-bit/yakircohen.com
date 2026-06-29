/**
 * Shared config for geo-targeted landing pages (studio + DJ).
 * Physical studio is always in Modi'in; city pages target nearby search intent.
 */

export type GeoCitySlug = "jerusalem" | "shoham" | "rehovot";

export type GeoCityConfig = {
  slug: GeoCitySlug;
  nameHe: string;
  /** Preposition form: "בשוהם", "ברחובות", "בירושלים" */
  nameHePrep: string;
  /** Resident form: "ירושלמים", "תושבי שוהם" */
  residentsLabel: string;
  driveMinutes: string;
  driveNote: string;
  studioPath: string;
  studioServiceId: string;
  djPath: string;
  legacyStudioRedirects: readonly string[];
  legacyEnglishStudioSlug?: string;
  keywords: {
    studio: readonly string[];
    dj: readonly string[];
  };
  whatsappStudio: string;
  whatsappDj: string;
  utm: {
    studio: string;
    dj: string;
  };
  djMeta: {
    title: string;
    description: string;
  };
  djAudienceIntro: string;
  /** Show Jerusalem-style religious audience cards */
  djReligiousAudience: boolean;
};

export const GEO_CITIES: Record<GeoCitySlug, GeoCityConfig> = {
  jerusalem: {
    slug: "jerusalem",
    nameHe: "ירושלים",
    nameHePrep: "בירושלים",
    residentsLabel: "ירושלמים",
    driveMinutes: "30",
    driveNote: "כביש 1 ממרכז ירושלים",
    studioPath: "studio/studio-jerusalem",
    studioServiceId: "studio-jerusalem",
    djPath: "dj-events/cities/jerusalem",
    legacyStudioRedirects: [
      "/אולפן-הקלטות-בירושלים",
      "/אולפן-הקלטות-בירושלים-מחירים",
    ],
    legacyEnglishStudioSlug: "/studio-jerusalem",
    keywords: {
      studio: [
        "אולפן הקלטות ירושלים",
        "הקלטת שיר ירושלים",
        "אולפן מודיעין ירושלים",
        "שיר לחופה ירושלים",
      ],
      dj: [
        "דיגגיי בירושלים",
        "תקליטן לחתונה ירושלים",
        "DJ לאירועים בירושלים",
        "תקליטן דתי ירושלים",
        "ניהול מוזיקלי ירושלים",
        "דיגגיי לבר מצווה ירושלים",
      ],
    },
    whatsappStudio: "שלום, מגיע מירושלים ומעוניין לתאם הקלטה באולפן",
    whatsappDj: "שלום, אשמח לשמוע על די ג'יי לאירועים בירושלים",
    utm: { studio: "studio_jerusalem", dj: "dj_jerusalem" },
    djMeta: {
      title:
        "דיג׳יי לאירועים בירושלים | ניהול מוזיקלי לאירועים דתיים ומעורבים",
      description:
        "ניהול מוזיקלי ותקלוט לאירועים בירושלים - חתונות, בר/בת מצווה, אירועי חברה. מפרט טכני קבוע, עבודה ישירה מול יקיר כהן או תקליטן מנוסה מהצוות.",
    },
    djAudienceIntro:
      "בירושלים יש קהל מגוון. חלק מהאורחים רוצים ריקודים חזקים, חלק צריכים שקט בטקס, וחלק מחפשים את שני העולמות באותו ערב. אנחנו לא מנחשים - אנחנו מכירים את השפה של כל קהל.",
    djReligiousAudience: true,
  },
  shoham: {
    slug: "shoham",
    nameHe: "שוהם",
    nameHePrep: "בשוהם",
    residentsLabel: "תושבי שוהם",
    driveMinutes: "10–15",
    driveNote: "כביש 443 / מחלף שוהם",
    studioPath: "studio/studio-shoham",
    studioServiceId: "studio-shoham",
    djPath: "dj-events/cities/shoham",
    legacyStudioRedirects: ["/אולפן-הקלטות-בשוהם"],
    legacyEnglishStudioSlug: "/studio-shoham",
    keywords: {
      studio: [
        "אולפן הקלטות שוהם",
        "הקלטת שיר שוהם",
        "אולפן הקלטות בשוהם",
        "שיר לחופה שוהם",
        "הקלטת ברכה שוהם",
      ],
      dj: [
        "דיגגיי בשוהם",
        "תקליטן לחתונה שוהם",
        "DJ לאירועים בשוהם",
        "דיגגיי לבר מצווה שוהם",
        "תקליטן לאירועים שוהם",
      ],
    },
    whatsappStudio: "שלום, מגיע משוהם ומעוניין לתאם הקלטה באולפן במודיעין",
    whatsappDj: "שלום, אשמח לשמוע על די ג'יי לאירועים בשוהם",
    utm: { studio: "studio_shoham", dj: "dj_shoham" },
    djMeta: {
      title: "דיג׳יי לאירועים בשוהם | חתונות ובר/בת מצווה",
      description:
        "DJ לאירועים בשוהם והסביבה - חתונות, בר/בת מצווה ואירועי חברה. מגיעים מהבסיס במודיעין, מפרט טכני קבוע ותיאום ישיר.",
    },
    djAudienceIntro:
      "בשוהם ובישובי הסביבה יש חתונות משפחתיות, אירועי בר/בת מצווה וערבי חברה עם קהל מגוון. אנחנו מכירים את האולמות באזור ויודעים להתאים מוזיקה, טקס וריקודים.",
    djReligiousAudience: true,
  },
  rehovot: {
    slug: "rehovot",
    nameHe: "רחובות",
    nameHePrep: "ברחובות",
    residentsLabel: "תושבי רחובות",
    driveMinutes: "25–30",
    driveNote: "כביש 431 / נתיבי איילון",
    studioPath: "studio/studio-rehovot",
    studioServiceId: "studio-rehovot",
    djPath: "dj-events/cities/rehovot",
    legacyStudioRedirects: ["/אולפן-הקלטות-ברחובות"],
    legacyEnglishStudioSlug: "/studio-rehovot",
    keywords: {
      studio: [
        "אולפן הקלטות רחובות",
        "הקלטת שיר רחובות",
        "אולפן הקלטות ברחובות",
        "שיר לחופה רחובות",
        "הקלטת ברכה רחובות",
      ],
      dj: [
        "דיגגיי ברחובות",
        "תקליטן לחתונה רחובות",
        "DJ לאירועים ברחובות",
        "דיגגיי לבר מצווה רחובות",
        "תקליטן לאירועים רחובות",
      ],
    },
    whatsappStudio: "שלום, מגיע מרחובות ומעוניין לתאם הקלטה באולפן במודיעין",
    whatsappDj: "שלום, אשמח לשמוע על די ג'יי לאירועים ברחובות",
    utm: { studio: "studio_rehovot", dj: "dj_rehovot" },
    djMeta: {
      title: "דיג׳יי לאירועים ברחובות | חתונות ובר/בת מצווה",
      description:
        "DJ לאירועים ברחובות והשפלה - חתונות, בר/בת מצווה ואירועי חברה. מגיעים מהבסיס במודיעין, מפרט טכני קבוע ותיאום ישיר.",
    },
    djAudienceIntro:
      "ברחובות ובאזור השפלה יש אולמות אירועים מגוונים - מחתונות דתיות ועד ערבי חברה. אנחנו מתאימים פלייליסט, טקס וריקודים לפי הקהל והאולם.",
    djReligiousAudience: true,
  },
};

export const GEO_CITY_SLUGS = Object.keys(GEO_CITIES) as GeoCitySlug[];

export const NEW_GEO_CITY_SLUGS = ["shoham", "rehovot"] as const satisfies readonly GeoCitySlug[];

export type NewGeoCitySlug = (typeof NEW_GEO_CITY_SLUGS)[number];

export function getGeoCity(slug: GeoCitySlug): GeoCityConfig {
  return GEO_CITIES[slug];
}

export function getNewGeoCity(slug: NewGeoCitySlug): GeoCityConfig {
  return GEO_CITIES[slug];
}

export function buildStudioWhyUs(city: GeoCityConfig): readonly string[] {
  return [
    "ליווי אישי גם בלי ניסיון  -  מוציאים את הטוב ביותר מכל אחד",
    "סאונד מקצועי  -  ציוד מהשורה הראשונה ותוצאה רדיופונית",
    `נגישות מ${city.nameHe}  -  כ-${city.driveMinutes} דק׳ נסיעה, חניה בשפע`,
    "תוצר גמיש  -  מייל, וואטסאפ או USB אישי",
    "אופציה לקליפ משפחתי או מצגת תמונות",
    "מתאים לקהל הדתי  -  יחס מכבד ותוכן כשר",
  ] as const;
}
