/**
 * audit:llms-coverage - כל עמוד שירות עם תווית סמכותית חייב להופיע ב-llms.txt.
 *
 * למה זה קיים: llms.txt הוא הקובץ שמנועי תשובות קוראים כדי לדעת מה העסק
 * מציע. הוא הכיל 51 כתובות ייחודיות מתוך 322 במפת האתר, ובין החסרים היה
 * /pricing, שסכמת ה-Offer של האתר עצמו מפנה אליו. עמוד שלא מופיע כאן הוא
 * עמוד שהמנוע לא יודע שקיים.
 *
 * למה השומר הזה ולא ייצור אוטומטי של הקובץ: llms.txt כתוב ביד ובקפידה,
 * עם הבחנות שאי אפשר לייצר, למשל "שיעורי עברית פרטיים (Hebrew tutoring,
 * לא אולפן והקלטות)" שמונעת בלבול אמיתי. ייצור מחדש היה מוחק ערך עריכתי.
 * לכן: הכתיבה נשארת אנושית, והשומר רק דורש שאף עמוד לא ייעלם.
 *
 * מקור האמת לתוויות: רג׳יסטרי השירותים ו-hub-pages. אלה השניים שמחזיקים
 * כותרת אמיתית לכל ראוט, ולכן הם מגדירים את החוזה.
 *
 * Run: npm run audit:llms-coverage
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import * as hubs from "../lib/seo/hub-pages";
import {
  EVENTS_SERVICES,
  PHOTOGRAPHY_SERVICES,
  STUDIO_SERVICES,
  VIDEO_SERVICES,
  VOICEOVER_SERVICES,
} from "../lib/data/services";

const root = resolve(import.meta.dirname, "..");

/**
 * פטור מפורש. כל רשומה חייבת נימוק, וכל רשומה מאומתת:
 * ראוט שכבר לא קיים, או שדווקא כן מופיע בקובץ, מפיל את הבדיקה.
 */
const EXEMPT: Record<string, string> = {
  "/for-couples": "חסום לאינדוקס, עמוד נחיתה לקמפיינים",
  "/for-creators": "חסום לאינדוקס, עמוד נחיתה לקמפיינים",
  "/voucher": "הפניה בלבד ל-/shop",
};

function collectLabels(): Map<string, string> {
  const labels = new Map<string, string>();
  const registries = [
    STUDIO_SERVICES,
    VOICEOVER_SERVICES,
    EVENTS_SERVICES,
    VIDEO_SERVICES,
    PHOTOGRAPHY_SERVICES,
  ];
  for (const registry of registries) {
    for (const service of Object.values(registry) as { slug: string; title: string }[]) {
      labels.set(`/${service.slug.replace(/^\/+/, "")}`, service.title);
    }
  }
  for (const [key, value] of Object.entries(hubs)) {
    const hub = value as { slug?: string; title?: string };
    if (!key.endsWith("_HUB_SEO") || !hub?.slug || !hub?.title) continue;
    labels.set(`/${hub.slug.replace(/^\/+/, "")}`, hub.title.split("|")[0].trim());
  }
  return labels;
}

const labels = collectLabels();
const llms = readFileSync(resolve(root, "public/llms.txt"), "utf8");

/* גבול תחתון: אם המקורות הפסיקו להיטען, הבדיקה תעבור על אפס ראוטים */
if (labels.size < 40) {
  console.error("=== audit:llms-coverage ===\n");
  console.error(`  ✗ נאספו רק ${labels.size} ראוטים עם תווית. סביר שהייבוא נשבר.`);
  console.error("    בדיקה שרצה על כמעט כלום עוברת תמיד, ולכן היא נכשלת כאן.\n");
  process.exit(1);
}

/**
 * מופיע כמילה שלמה, כדי ש-/studio לא יחשב כיסוי ל-/studio/pricing.
 *
 * סורק את כל המופעים ולא רק את הראשון. הגרסה עם indexOf דיווחה
 * ש-/events/equipment חסר, כי /events/equipment/faq מופיע לפניו בקובץ
 * וה-indexOf נעצר שם. בדיקה שנעצרת במופע הראשון מדווחת שקר.
 */
function appearsIn(route: string): boolean {
  const url = `https://yakircohen.com${route}`;
  let from = 0;
  for (;;) {
    const index = llms.indexOf(url, from);
    if (index === -1) return false;
    const after = llms.charAt(index + url.length);
    if (after === "" || " \n\r\t·-,".includes(after)) return true;
    from = index + 1;
  }
}

const missing: string[] = [];
const exemptHits = new Set<string>();

for (const [route] of labels) {
  if (EXEMPT[route]) {
    exemptHits.add(route);
    continue;
  }
  if (!appearsIn(route)) missing.push(route);
}

/* כתובת שמופיעה פעמיים עם שתי תוויות שונות אומרת למנוע שיש שני עמודים */
const urls = [...llms.matchAll(/https:\/\/yakircohen\.com(\/[^\s)·,]*)/g)].map((m) => m[1]);
const duplicated = [...new Set(urls.filter((u, i) => urls.indexOf(u) !== i))];

const failures: string[] = [];

if (missing.length) {
  failures.push(
    `${missing.length} עמודים עם תווית סמכותית לא מופיעים ב-llms.txt:\n` +
      missing
        .sort()
        .map((r) => `        ${r.padEnd(46)} ${labels.get(r)}`)
        .join("\n") +
      "\n      להוסיף אותם לסקשן המתאים ב-public/llms.txt, או ל-EXEMPT עם נימוק.",
  );
}

if (duplicated.length) {
  failures.push(
    `${duplicated.length} כתובות מופיעות יותר מפעם אחת:\n` +
      duplicated.map((u) => `        ${u}`).join("\n") +
      "\n      שתי שורות לאותה כתובת נקראות כשני עמודים. להשאיר אחת.",
  );
}

const deadExempt = Object.keys(EXEMPT).filter((r) => !exemptHits.has(r));
if (deadExempt.length) {
  failures.push(
    `${deadExempt.length} רשומות ב-EXEMPT לא תואמות שום ראוט קיים:\n` +
      deadExempt.map((r) => `        ${r}`).join("\n") +
      "\n      להסיר. רשומה מתה משתיקה בדיקה.",
  );
}

const exemptButPresent = Object.keys(EXEMPT).filter((r) => exemptHits.has(r) && appearsIn(r));
if (exemptButPresent.length) {
  failures.push(
    `${exemptButPresent.length} עמודים פטורים ובכל זאת מופיעים ב-llms.txt:\n` +
      exemptButPresent.map((r) => `        ${r}  (${EXEMPT[r]})`).join("\n") +
      "\n      או להסיר מהקובץ, או להסיר מ-EXEMPT.",
  );
}

console.log("=== audit:llms-coverage ===\n");

if (failures.length) {
  console.error(`נמצאו ${failures.length} בעיות:\n`);
  for (const failure of failures) console.error(`  ✗ ${failure}\n`);
  process.exit(1);
}

console.log(
  `תקין. ${labels.size} ראוטים עם תווית סמכותית, ` +
    `${labels.size - Object.keys(EXEMPT).length} מהם מופיעים ב-llms.txt, ` +
    `${Object.keys(EXEMPT).length} בפטור מפורש, אפס כפילויות.`,
);
