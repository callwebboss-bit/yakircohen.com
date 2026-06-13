/**
 * Curated, human-written studio updates - rotated by calendar week.
 * Edit the pool when production focus shifts; no live tickers or fake counters.
 */

export type StudioWeeklyPulse = {
  kicker: string;
  body: string;
  footnote?: string;
};

export type PulseEntry = {
  category: "studio" | "podcast" | "events" | "photography" | "voiceover" | "online" | "general";
  kicker: string;
  body: string;
  footnote?: string;
  href: string;
  linkLabel: string;
};

export const PULSE_POOL: PulseEntry[] = [
  {
    category: "studio",
    kicker: "השבוע באולפן",
    body: "שני פודקאסטים בעריכה, שלוש ברכות לחתונה.",
    footnote: "נשארו כמה שעות פנויות - כתבו לנו.",
    href: "/studio",
    linkLabel: "לאולפן ",
  },
  {
    category: "studio",
    kicker: "באולפן עכשיו",
    body: "מקליטים שיר מתנה לבר מצווה, גומרים עריכת פרק פודקאסט.",
    footnote: "נשמח לתאם שעה שקטה - כתבו בוואטסאפ.",
    href: "/studio/recording-song-modiin",
    linkLabel: "להקלטת שיר ",
  },
  {
    category: "podcast",
    kicker: "מרכז הפודקאסט",
    body: "גומרים פרק 8 של פודקאסט עסקי, מעלים ל-Spotify היום.",
    footnote: "רוצים לפתוח פודקאסט? תתחילו איתנו.",
    href: "/podcast",
    linkLabel: "למרכז הפודקאסט ",
  },
  {
    category: "podcast",
    kicker: "שחזור סאונד",
    body: "שלוש הקלטות ישנות שיצאו מהארכיון - ניקינו ואיפשרנו פרסום מחדש.",
    footnote: "יש לכם פרקים ישנים? שלחו לבדיקה.",
    href: "/online/vocal-fix",
    linkLabel: "לשחזור סאונד ",
  },
  {
    category: "events",
    kicker: "שבת אירועים",
    body: "שלוש חתונות השבועיים הקרובים - DJ + עשן + זיקוקים קרים.",
    footnote: "תאריכים נסגרים מהר - בדקו זמינות.",
    href: "/events",
    linkLabel: "לאירועים ",
  },
  {
    category: "voiceover",
    kicker: "סטודיו קריינות",
    body: "קמפיין רדיו + שתי מרכזיות IVR בהפקה השבוע.",
    footnote: "גמרנו מקום לפרויקט אחד נוסף.",
    href: "/voiceover",
    linkLabel: "לקריינות ",
  },
  {
    category: "online",
    kicker: "שירות AI מקוון",
    body: "שחזרנו 4 הקלטות פגומות, שיפרנו קול ל-3 יוצרי תוכן.",
    footnote: "שולחים קובץ - מקבלים תוצאה תוך ימים.",
    href: "/online",
    linkLabel: "לשירותים מקוונים ",
  },
  {
    category: "general",
    kicker: "יקיר כהן הפקות",
    body: "אולפן, פודקאסט, אירועים וקריינות - מודיעין, ירושלים והמרכז.",
    href: "/contact",
    linkLabel: "צרו קשר ",
  },
];

export function getPulseForPath(pathname: string): PulseEntry {
  const p = pathname;
  let filtered: PulseEntry[];

  if (p.startsWith("/studio") || p.startsWith("/online/vocal-fix") || p === "/online/vocal-fix") {
    filtered = PULSE_POOL.filter((e) => e.category === "studio");
  } else if (p.startsWith("/podcast")) {
    filtered = PULSE_POOL.filter((e) => e.category === "podcast");
  } else if (p.startsWith("/events") || p.startsWith("/dj-events")) {
    filtered = PULSE_POOL.filter((e) => e.category === "events");
  } else if (p.startsWith("/photography")) {
    filtered = PULSE_POOL.filter((e) => e.category === "photography");
  } else if (p.startsWith("/voiceover") || p.startsWith("/business")) {
    filtered = PULSE_POOL.filter((e) => e.category === "voiceover");
  } else if (p.startsWith("/online")) {
    filtered = PULSE_POOL.filter((e) => e.category === "online");
  } else {
    filtered = PULSE_POOL.filter((e) => e.category === "general");
  }

  if (filtered.length === 0) filtered = PULSE_POOL.filter((e) => e.category === "general");
  const week = Math.floor(Date.now() / (7 * 24 * 60 * 60 * 1000));
  return filtered[week % filtered.length]!;
}

/** Editorial pool - add or replace entries as the studio schedule evolves */
export const STUDIO_WEEKLY_PULSE_POOL: StudioWeeklyPulse[] = [
  {
    kicker: "השבוע באולפן",
    body: "שני פודקאסטים בעריכה, ושלוש ברכות לחתונה.",
    footnote: "נשארו כמה שעות פנויות השבוע - כתבו לנו.",
  },
  {
    kicker: "השבוע באולפן",
    body: "מקליטים שיר מתנה לבר מצווה, וסוגרים עריכת פרק פודקאסט לפני העלאה.",
    footnote: "נשמח לתאם שעה שקטה באולפן - כתבו לנו בוואטסאפ.",
  },
  {
    kicker: "השבוע באולפן",
    body: "מעבדים קריינות לקמפיין, ומכינים ברכת חתן/כלה עם ליווי צמוד באולפן.",
    footnote: "מקומות אחרונים לפני סוף השבוע.",
  },
  {
    kicker: "השבוע באולפן",
    body: "שולחים ללקוחות טיוטות ערוכות מפודקאסטים, ומלטשים סאונד לקליפ ברכה קצר.",
    footnote: "האולפן פתוח גם בערב - לפי תיאום מראש.",
  },
];

function getISOWeekNumber(date: Date): number {
  const utc = new Date(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()),
  );
  const day = utc.getUTCDay() || 7;
  utc.setUTCDate(utc.getUTCDate() + 4 - day);
  const yearStart = new Date(Date.UTC(utc.getUTCFullYear(), 0, 1));
  return Math.ceil(
    ((utc.getTime() - yearStart.getTime()) / 86_400_000 + 1) / 7,
  );
}

/** Returns this week's curated pulse from the editorial pool (deterministic, not live). */
export function getStudioWeeklyPulse(
  date: Date = new Date(),
): StudioWeeklyPulse {
  const week = getISOWeekNumber(date);
  const index = week % STUDIO_WEEKLY_PULSE_POOL.length;
  return STUDIO_WEEKLY_PULSE_POOL[index]!;
}
