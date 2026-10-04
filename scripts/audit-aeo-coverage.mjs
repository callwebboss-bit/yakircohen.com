/**
 * כל עמוד באתר חייב לפלוט אות AEO מהקובץ של עצמו.
 *
 * שתי גרסאות קודמות של הבדיקה הזו לא יכלו להיכשל:
 *
 * 1. הראשונה כללה בכל רשומה גם את ServicePageLayout.tsx המשותף, שמכיל את
 *    הסימנים תמיד, ולכן שום עמוד לא יכול היה להיכשל. היא גם ספרה
 *    "metaDescription={" כאות AEO, וזה לא אות AEO בשום הגדרה.
 *
 * 2. השנייה תיקנה את זה אבל בדקה רשימה קשיחה של 11 עמודי ליבה. 136 העמודים
 *    האחרים היו מחוץ להישג ידה מבנית. היא הדפיסה "תקין, 11 עמודי ליבה"
 *    בזמן ש-30 עמודים לא פלטו שום אות.
 *
 * הגרסה הזו הפוכה: היא מונה את כל קבצי page.tsx מהדיסק, ולכן עמוד חדש
 * נכנס לבדיקה מעצם קיומו ואי אפשר לשכוח להוסיף אותו.
 *
 * שלוש רמות של פטור, לפי סדר:
 *  - אוטומטי: עמוד שהוא redirect בלבד, או שמסומן noindex. שניהם מזוהים
 *    מהקוד ולא מרשימה, ולכן הם לא יכולים להתיישן.
 *  - EXEMPT: פטור מפורש עם נימוק. מאמת את עצמו, ורשומה מתה נכשלת.
 *  - BACKLOG: פער אמיתי שטרם נסגר. הרשימה יכולה רק להתכווץ. עמוד חדש
 *    בלי אות נכשל, ועמוד ברשימה שכבר כן פולט אות נכשל גם הוא ודורש
 *    להסיר אותו, אחרת החוב נשאר רשום לנצח.
 *
 * Run: node scripts/audit-aeo-coverage.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");

/** קבצים משותפים. אות שמגיע מהם אינו אות של העמוד. */
const SHARED = [
  "components/services/ServicePageLayout.tsx",
  "components/seo/AnswerBlock.tsx",
];

/** אות AEO אמיתי: תשובה, speakable, או FAQ שנפלט מהעמוד */
const AEO_MARKERS = [
  "<AnswerBlock",
  "<SpeakableSchema",
  "<FaqPageSchema",
  "<FAQAccordion",
  "<FAQWithCtaLinks",
  "buildFaqSchema(",
  '"@type": "FAQPage"',
  "data-speakable",
  /** העברת שאלות ל-layout, שהופך אותן ל-FAQPage */
  "faqs={",
  /** האצלה למרנדר הרג׳יסטרי, שפולט FaqPageSchema מ-service.faqs */
  "<ServicePageFromRegistry",
];

/**
 * עמודים חסומים לאינדוקס לחלוטין. לא מזוהים אוטומטית בכוונה:
 * הכלל הגס /index:\s*false/ פסל גם את /blog וגם את /book, ששניהם כן
 * באינדקס וה-noindex שלהם חל רק על עמודי עימוד או על פרמטרים. בדיקה
 * שמוציאה עמודים אמיתיים מהסריקה גרועה מבדיקה שמדווחת עליהם.
 */
const NOINDEX = {
  "/admin/leads": "ממשק אדמין",
  "/admin/login": "כניסת אדמין",
  "/online/vocal-fix/send-file": "עמוד העלאת קובץ, חסום לאינדוקס",
  "/thank-you": "עמוד תודה אחרי שליחה",
};

/** פטור מפורש. כל רשומה חייבת נימוק, וכל רשומה מאומתת מול המציאות. */
const EXEMPT = {
  "/privacy": "טקסט משפטי. תשובה מנוסחת לציטוט אינה מתאימה לעמוד מדיניות",
  "/terms": "טקסט משפטי",
  "/accessibility": "הצהרת נגישות. נוסח מחייב, לא שטח תשובות",
  "/sustainability": "הצהרת מדיניות",
};

/**
 * חוב פתוח. הרשימה הזו יכולה רק להתכווץ.
 *
 * נמדד ב-14 בספטמבר 2026: 147 קבצי page.tsx, 117 פולטים אות, 30 לא.
 * מתוך ה-30, שמונה נפטרים אוטומטית (ארבע הפניות וארבעה noindex),
 * ארבעה ב-EXEMPT, ו-18 הם הפער האמיתי שלמטה.
 *
 * אלה עמודים שגולש מגיע אליהם ושמנוע תשובות עשוי לצטט, והם לא מציעים
 * לו שום משפט בצורת תשובה. סגירת הפער דורשת טקסט אמיתי שנכתב כדי
 * להיות מצוטט, ולא שכפול של תיאור ה-meta.
 */
const BACKLOG = {
  "/about": "עמוד האודות, אות E-E-A-T מרכזי",
  "/academy": "hub האקדמיה",
  "/academy/ai-music": "קורס",
  "/areas": "עמוד אזורי שירות, כוונה גיאוגרפית מובהקת",
  "/blog": "אינדקס המגזין",
  /* 87 הפוסטים לא פולטים אות AEO, ומעולם לא פלטו. עד 30.9.2026 הבדיקה
     חשבה אחרת: העמוד ייבא DEFAULT_OG_WIDTH מ-lib/seo/page-schema, ואותו
     קובץ מגדיר buildFaqSchema, שהוא סמן. כלומר הכיסוי נספר על הגדרה
     בקובץ מיובא ולא על פליטה מהעמוד. כשהייבוא ירד בסבב תמונות השיתוף,
     האמת נחשפה. זה חוב אמיתי, לא רגרסיה. */
  "/blog/[slug]": "עמוד פוסט. תשובה קצרה בראש הפוסט דורשת ניסוח של הבעלים",
  "/business/professional-voiceover": "עמוד B2B",
  "/clinic": "עמוד הקליניקה",
  "/dj-events/cities/jerusalem": "עמוד גיאו ל-DJ",
  "/gallery": "גלריה",
  "/glossary": "hub המילון",
  "/matanot": "עמוד המתנות",
  "/online/online-ai-pricing": "מחירון שירותי AI",
  "/packages": "עמוד חבילות",
  "/portfolio": "תיק עבודות",
  "/pro": "hub מקצועי",
  "/pro/event-index": "מוצר הנתונים לספקי אירועים",
  "/start": "עמוד כניסה",
  "/testimonials": "המלצות",
};

/* ── סריקה ──────────────────────────────────────────────────────────────── */

/** קבצים בריפו נשמרים גם מווינדוס. BOM בתחילת קובץ שובר עוגן ^import. */
function read(file) {
  const src = fs.readFileSync(file, "utf8");
  return src.charCodeAt(0) === 0xfeff ? src.slice(1) : src;
}

const pages = [];
(function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === "api") continue;
      walk(full);
    } else if (entry.name === "page.tsx") {
      pages.push(path.relative(root, full).split(path.sep).join("/"));
    }
  }
})(path.join(root, "app"));

function routeOf(file) {
  const r = file
    .replace(/^app/, "")
    .replace(/\/page\.tsx$/, "")
    .replace(/\/\([^/]+\)/g, "");
  return r || "/";
}

/** רכיבי התוכן שהעמוד מייבא, רמה אחת. זה המקום שבו גוף העמוד באמת יושב. */
function contentFiles(page) {
  const out = [page];
  for (const m of read(path.join(root, page)).matchAll(
    /^\s*import\s+(?!type\s)[^;]*?from\s+"(@\/(?:components|lib)\/[^"]+)"/gm,
  )) {
    const base = m[1].slice(2);
    for (const ext of [".tsx", ".ts", ""]) {
      const candidate = base + ext;
      if (fs.existsSync(path.join(root, candidate))) {
        out.push(candidate);
        break;
      }
    }
  }
  return out.filter((f) => !SHARED.includes(f));
}

const uncovered = [];
const autoSkipped = [];
const exemptHits = new Set();
const noindexHits = new Set();
const backlogHits = new Set();
let covered = 0;

for (const page of pages) {
  const route = routeOf(page);
  const src = read(path.join(root, page));

  /* רשימה מפורשת גוברת על זיהוי אוטומטי. עמודי האדמין קוראים ל-redirect
     למשתמש לא מחובר אבל כן מרנדרים למחובר, ולכן הם שייכים ל-NOINDEX ולא
     לקטגוריית ההפניות. */
  if (NOINDEX[route]) {
    noindexHits.add(route);
    continue;
  }
  /* עמוד שכל תפקידו הפניה לא מרנדר כלום */
  if (/\bredirect\(/.test(src)) {
    autoSkipped.push(`${route} (הפניה בלבד)`);
    continue;
  }

  const hasMarker = contentFiles(page).some((f) => {
    try {
      const text = read(path.join(root, f));
      return AEO_MARKERS.some((marker) => text.includes(marker));
    } catch {
      return false;
    }
  });

  if (hasMarker) {
    covered++;
    if (EXEMPT[route]) exemptHits.add(route);
    if (BACKLOG[route]) backlogHits.add(route);
    continue;
  }

  if (EXEMPT[route]) {
    exemptHits.add(route);
    continue;
  }
  if (BACKLOG[route]) {
    backlogHits.add(route);
    continue;
  }
  uncovered.push(route);
}

/* ── דיווח ──────────────────────────────────────────────────────────────── */

console.log("=== audit:aeo-coverage ===\n");

const failures = [];

if (pages.length < 50) {
  failures.push(
    `נסרקו רק ${pages.length} עמודים. סביר שהסריקה נשברה, לא שהאתר התכווץ.\n` +
      "      בדיקה שסורקת כמעט כלום עוברת תמיד, ולכן היא נכשלת כאן.",
  );
}

if (uncovered.length) {
  failures.push(
    `${uncovered.length} עמודים חדשים בלי שום אות AEO:\n` +
      uncovered.map((r) => `        ${r}`).join("\n") +
      "\n      תיקון: להוסיף AnswerBlock או FAQ לעמוד, או להעביר faqs={...} ל-layout.\n" +
      "      אם העמוד באמת לא אמור לפלוט אות, להוסיף אותו ל-EXEMPT עם נימוק.",
  );
}

/* פטור שכבר לא רלוונטי מכסה על תקלה עתידית */
const deadNoindex = Object.keys(NOINDEX).filter((r) => !noindexHits.has(r));
if (deadNoindex.length) {
  failures.push(
    `${deadNoindex.length} רשומות ב-NOINDEX לא תואמות שום עמוד קיים:\n` +
      deadNoindex.map((r) => `        ${r}`).join("\n") +
      "\n      הראוט נמחק, או שהוא כבר לא חסום לאינדוקס. להסיר או להעביר.",
  );
}

const deadExempt = Object.keys(EXEMPT).filter((r) => !exemptHits.has(r));
if (deadExempt.length) {
  failures.push(
    `${deadExempt.length} רשומות ב-EXEMPT לא תואמות שום עמוד קיים:\n` +
      deadExempt.map((r) => `        ${r}`).join("\n") +
      "\n      להסיר אותן. רשומה מתה משתיקה בדיקה.",
  );
}

const deadBacklog = Object.keys(BACKLOG).filter((r) => !backlogHits.has(r));
if (deadBacklog.length) {
  failures.push(
    `${deadBacklog.length} רשומות ב-BACKLOG לא תואמות שום עמוד קיים:\n` +
      deadBacklog.map((r) => `        ${r}`).join("\n") +
      "\n      הראוט נמחק או שונה. להסיר מ-BACKLOG.",
  );
}

/* חוב שנסגר חייב לרדת מהרשימה, אחרת הוא נשאר רשום לנצח */
const closed = [...backlogHits].filter((r) => {
  const page = pages.find((p) => routeOf(p) === r);
  if (!page) return false;
  return contentFiles(page).some((f) => {
    try {
      return AEO_MARKERS.some((m) => read(path.join(root, f)).includes(m));
    } catch {
      return false;
    }
  });
});
if (closed.length) {
  failures.push(
    `${closed.length} עמודים ב-BACKLOG כבר פולטים אות AEO:\n` +
      closed.map((r) => `        ${r}`).join("\n") +
      "\n      זו בשורה טובה, והבדיקה נכשלת בכוונה: להסיר אותם מ-BACKLOG\n" +
      "      כדי שהחוב יתכווץ ולא יישאר רשום אחרי שנסגר.",
  );
}

if (failures.length) {
  console.error(`נמצאו ${failures.length} בעיות:\n`);
  for (const f of failures) console.error(`  ✗ ${f}\n`);
  process.exit(1);
}

const backlogCount = Object.keys(BACKLOG).length;
console.log(
  `תקין. ${pages.length} עמודים נסרקו: ${covered} פולטים אות AEO, ` +
    `${autoSkipped.length} נפטרו אוטומטית, ${Object.keys(EXEMPT).length} בפטור מפורש.`,
);
console.log(`\nחוב פתוח: ${backlogCount} עמודים בלי אות AEO. הרשימה יכולה רק להתכווץ.`);
for (const [route, why] of Object.entries(BACKLOG)) {
  console.log(`  · ${route.padEnd(34)} ${why}`);
}
