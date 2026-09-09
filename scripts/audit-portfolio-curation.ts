/**
 * אוצרות הווידאו לא נבלעת בשקט.
 *
 * הרקע: lib/data/video-portfolio.ts מחפש מזהה סרטון בקטלוג, וכשהוא לא מוצא
 * הוא מחזיר null ו-.filter(Boolean) מוחק אותו בלי אזהרה. התוצאה בפועל:
 * /events/equipment/dry-hire מציג סרטון אחד מתוך ארבעה שנבחרו ידנית,
 * studio-hub מציג שישה מתוך שמונה, ו-Fsy4Eg00dCA נבחר לארבעה פלייליסטים
 * ומופיע באפס. מישהו עשה את עבודת האוצרות והצינור בלע אותה.
 *
 * שלוש בדיקות:
 *   1. מזהה ב-PLAYLIST_EXPLICIT_IDS שלא נפתר. הסרטון פשוט לא מרונדר.
 *   2. מזהה ב-PLAYLIST_FEATURED_IDS שלא בקטלוג. הקידום לא עושה כלום.
 *   3. PORTFOLIO_CATALOG_COUNT חייב להיות מספר הרשומות בפועל. הוא הצהיר 272
 *      בזמן שהיו 273, ושני עמודים הציגו את המספר השגוי לגולשים.
 *
 * Run: npm run audit:portfolio-curation
 */
import { PORTFOLIO_VIDEO_CATALOG, PORTFOLIO_CATALOG_COUNT } from "../lib/data/video-catalog.generated";
import { PORTFOLIO_VIDEO_SUPPLEMENT } from "../lib/data/video-catalog.supplement";
import {
  PLAYLIST_EXPLICIT_IDS,
  PLAYLIST_FEATURED_IDS,
  PLAYLIST_VIDEO_FALLBACKS,
} from "../lib/data/video-catalog.overrides";

/**
 * שבעה עשר מזהים שכבר לא נפתרים כשהשומר הזה נכתב (2026-09-07).
 *
 * הם לא מתוקנים כאן במכוון: אי אפשר לאמת מהקוד שסרטון קיים ביוטיוב, ומזהה
 * שגוי יוצר נגן שבור באתר חי. ההיתר קיים כדי שהשומר ייכשל מיד על כל מזהה
 * *חדש* שנשבר, בלי לחסום פריסה על חוב קיים.
 *
 * ההיתר מאמת את עצמו: ברגע שמזהה חוזר לקטלוג, השומר נכשל ודורש להסיר אותו
 * מכאן, ולכן הרשימה לא יכולה להתיישן בשקט. המטרה היא שהיא תתרוקן.
 */
const KNOWN_UNRESOLVED: ReadonlySet<string> = new Set([
  "1DUnuS_hv5Y",
  "1ilgnokOS7Q",
  "5pBisBkfTEg",
  "9O0d3v1SqMc",
  "D3JV9SDY6GY",
  "Fsy4Eg00dCA",
  "GFYoIU-UseE",
  "K1oAL8qg1W0",
  "eKGkeVYzUl4",
  "hg5qW6nk0iU",
  "nBtKa0JZfL0",
  "ne023hwMqH0",
  "oVeIMBTmS_8",
  "q18Lu0MvXHo",
  "q1Omi-3L3QM",
  "wa_mOrjJvK8",
  "zHkq_5bXptg",
]);

const knownIds = new Set<string>(
  [...PORTFOLIO_VIDEO_CATALOG, ...PORTFOLIO_VIDEO_SUPPLEMENT].map(
    (v) => v.videoId,
  ),
);
const fallbackIds = new Set(Object.keys(PLAYLIST_VIDEO_FALLBACKS ?? {}));

const errors: string[] = [];
const carried: string[] = [];

/* 1 + 2: מזהים שנבחרו ידנית ולא נפתרים */
const unresolved = new Map<string, { dropped: string[]; dead: string[] }>();
const bucket = (id: string) => {
  let entry = unresolved.get(id);
  if (!entry) {
    entry = { dropped: [], dead: [] };
    unresolved.set(id, entry);
  }
  return entry;
};

for (const [playlist, list] of Object.entries(PLAYLIST_EXPLICIT_IDS ?? {})) {
  for (const id of list ?? []) {
    if (!knownIds.has(id) && !fallbackIds.has(id)) bucket(id).dropped.push(playlist);
  }
}
for (const [playlist, list] of Object.entries(PLAYLIST_FEATURED_IDS ?? {})) {
  for (const id of list ?? []) {
    if (!knownIds.has(id)) bucket(id).dead.push(playlist);
  }
}

for (const [id, where] of unresolved) {
  /* PLAYLIST_EXPLICIT_IDS משתמש באותם מערכים של PLAYLIST_FEATURED_IDS בחמישה
     פלייליסטים, ולכן אותו פלייליסט היה מדווח פעמיים על אותו מזהה. כשהסרטון
     כבר לא מרונדר שם, "קידום ללא השפעה" הוא רעש. */
  const droppedIn = new Set(where.dropped);
  where.dead = where.dead.filter((playlist) => !droppedIn.has(playlist));

  const detail = [
    where.dropped.length
      ? `לא מרונדר כלל ב: ${where.dropped.join(", ")}`
      : null,
    where.dead.length ? `קידום ללא השפעה ב: ${where.dead.join(", ")}` : null,
  ]
    .filter(Boolean)
    .join(" · ");

  if (KNOWN_UNRESOLVED.has(id)) {
    carried.push(`${id} — ${detail}`);
    continue;
  }
  errors.push(
    `מזהה חדש שנשבר: ${id}\n      ${detail}\n` +
      `      או שהמזהה שגוי, או שהסרטון צריך להיכנס ל-video-catalog.supplement.ts.`,
  );
}

/* ההיתר חייב להתרוקן, ולכן מזהה שכבר נפתר לא רשאי להישאר בו */
for (const id of KNOWN_UNRESOLVED) {
  if (!unresolved.has(id)) {
    errors.push(
      `${id} כבר נפתר, אבל הוא עדיין ברשימת ההיתר של audit-portfolio-curation.ts.\n` +
        `      להסיר אותו משם. אחרת ההיתר מכסה על תקלות עתידיות.`,
    );
  }
}

/* 3: המספר שמוצג לגולשים */
if (PORTFOLIO_CATALOG_COUNT !== PORTFOLIO_VIDEO_CATALOG.length) {
  errors.push(
    `PORTFOLIO_CATALOG_COUNT מצהיר ${PORTFOLIO_CATALOG_COUNT} בזמן שיש ${PORTFOLIO_VIDEO_CATALOG.length} רשומות.\n` +
      `      המספר הזה מוצג לגולשים ב-/portfolio וב-/studio. להריץ npm run import:portfolio, או לתקן את הקבוע.`,
  );
}

console.log("=== audit:portfolio-curation ===\n");

if (errors.length) {
  console.error(`נמצאו ${errors.length} בעיות:\n`);
  for (const e of errors) console.error(`  ✗ ${e}`);
  process.exit(1);
}

console.log(
  `תקין. ${PORTFOLIO_CATALOG_COUNT} סרטונים בקטלוג, והמספר תואם למה שמוצג בעמודים.`,
);

if (carried.length) {
  console.log(
    `\nחוב ידוע: ${carried.length} מזהים שנבחרו ידנית ולא נפתרים. אלה בחירות אוצרות\n` +
      `שנעלמו מהאתר, ולא באג חדש. כל אחד דורש אימות מול יוטיוב לפני שמחזירים אותו:\n`,
  );
  for (const c of carried.sort()) console.log(`  · ${c}`);
}
