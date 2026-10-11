/**
 * audit:vat-display - בדף צרכני מוצג רק המחיר הכולל מע״מ (החלטת הבעלים D86, 11.10.2026).
 *
 * למה: עד 11.10 כל מחיר באתר הופיע פעמיים, "590 ₪ כולל מע״מ" ומתחתיו "500 ₪ + מע״מ".
 * הבעלים החליט שבדף צרכני יש מספר אחד, כולל מע״מ (סעיף 17ד לחוק הגנת הצרכן: "המחיר
 * הכולל בלבד"). עמודי העסקים (/business, /pro) נשארים לפני מע״מ בכוונה. הודעות לבעלים,
 * עמדת המכירות, closer, quote, llms.txt וסכמת JSON-LD לא נבדקים כאן: הם לא HTML גלוי.
 *
 * מה הוא עושה: קורא את ה-HTML הבנוי (.next/server/app, אותו הילוך כמו audit:seo-diff),
 * מוריד script, style, template ותגיות, ומחפש בטקסט הגלוי "+ מע״מ" ו"לפני מע״מ".
 * אזור שמסומן data-vat-business (למשל מתג "לעסקים" במחירון) מדולג.
 *
 * מצבים:
 *   node scripts/audit-vat-display.mjs            דוח בלבד, תמיד יוצא 0 (שלב 2א)
 *   node scripts/audit-vat-display.mjs --strict   יוצא 1 על כל ממצא (משלב 2ה)
 *   --json                                        פלט JSON לכל כתובת
 *
 * מה הוא לא רואה: עמודים דינמיים (/book, /online/*) ומחירים שאשף מצייר אחרי לחיצה.
 * אותם בודק החלק clarity של audit:live-tour בדפדפן.
 */
import { readdirSync, readFileSync, statSync, existsSync } from "node:fs";
import { join, relative, sep } from "node:path";

const BUILD_DIR = ".next/server/app";
const SKIP_PREFIXES = ["_", "("];
const args = process.argv.slice(2);
const STRICT = args.includes("--strict");
const JSON_OUT = args.includes("--json");

/** עמודים שמציגים לפני מע״מ בכוונה, או שאינם עמוד ללקוח */
const EXEMPT = /^\/(business|pro|admin|api)(\/|$)/;

const PATTERNS = [
  { id: "plus-vat", re: /\+\s?מע[״"]מ/g },
  { id: "before-vat", re: /לפני\s+מע[״"]מ/g },
];

function walk(dir, out = []) {
  let entries;
  try {
    entries = readdirSync(dir);
  } catch {
    return out;
  }
  for (const entry of entries) {
    if (SKIP_PREFIXES.some((p) => entry.startsWith(p))) continue;
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) walk(full, out);
    else if (entry.endsWith(".html")) out.push(full);
  }
  return out;
}

function toUrl(file) {
  const rel = relative(BUILD_DIR, file).split(sep).join("/");
  const noExt = rel.replace(/\.html$/, "");
  return noExt === "index" ? "/" : "/" + noExt;
}

/** מוריד אזור שלם שמסומן data-vat-business. תגית הפתיחה עד הסגירה התואמת שלה. */
function dropBusinessRegions(html) {
  let out = html;
  for (;;) {
    const m = out.match(/<([a-z][a-z0-9]*)\b[^>]*\bdata-vat-business\b[^>]*>/i);
    if (!m) return out;
    const tag = m[1].toLowerCase();
    const start = m.index;
    let depth = 0;
    const re = new RegExp(`<\\/?${tag}\\b[^>]*>`, "gi");
    re.lastIndex = start;
    let end = -1;
    for (let t = re.exec(out); t; t = re.exec(out)) {
      if (t[0][1] === "/") depth--;
      else if (!t[0].endsWith("/>")) depth++;
      if (depth === 0) {
        end = t.index + t[0].length;
        break;
      }
    }
    if (end < 0) return out.slice(0, start);
    out = out.slice(0, start) + out.slice(end);
  }
}

function visibleText(html) {
  return dropBusinessRegions(
    html
      .replace(/<script\b[\s\S]*?<\/script>/gi, " ")
      .replace(/<style\b[\s\S]*?<\/style>/gi, " ")
      .replace(/<template\b[\s\S]*?<\/template>/gi, " "),
  )
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&quot;/g, '"')
    .replace(/&#(\d+);/g, (_, d) => String.fromCharCode(+d))
    .replace(/\s+/g, " ");
}

if (!existsSync(BUILD_DIR)) {
  console.error(`  ✗ אין ${BUILD_DIR}. מריצים קודם npm run build:full.`);
  process.exit(STRICT ? 1 : 0);
}

const rows = [];
for (const file of walk(BUILD_DIR)) {
  const url = toUrl(file);
  if (EXEMPT.test(url)) continue;
  const text = visibleText(readFileSync(file, "utf8"));
  const hits = [];
  for (const { id, re } of PATTERNS) {
    for (const m of text.matchAll(re)) {
      hits.push({ id, context: text.slice(Math.max(0, m.index - 40), m.index + m[0].length + 10).trim() });
    }
  }
  if (hits.length) rows.push({ url, count: hits.length, sample: hits[0].context });
}
rows.sort((a, b) => b.count - a.count);
const total = rows.reduce((n, r) => n + r.count, 0);

if (JSON_OUT) {
  console.log(JSON.stringify({ strict: STRICT, pages: rows.length, total, rows }, null, 2));
} else {
  console.log(`audit:vat-display${STRICT ? " (strict)" : " (דוח בלבד)"}`);
  if (!rows.length) {
    console.log("  תקין. אין \"+ מע״מ\" או \"לפני מע״מ\" בטקסט הגלוי של עמוד צרכני.");
  } else {
    console.log(`  ${total} מופעים ב-${rows.length} עמודים צרכניים. העמודים עם הכי הרבה:`);
    for (const r of rows.slice(0, 25)) console.log(`    ${String(r.count).padStart(4)}  ${r.url}   ...${r.sample}...`);
    if (rows.length > 25) console.log(`    ועוד ${rows.length - 25} עמודים.`);
  }
}
process.exit(STRICT && rows.length ? 1 : 0);
