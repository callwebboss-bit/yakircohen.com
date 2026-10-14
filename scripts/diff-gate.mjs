/**
 * diff-gate.mjs - שער מהיר לפני כל קומיט של מעבר המיתוג (D135, 14.10.2026).
 *
 * השאלה שהוא עונה עליה: האם הדיף משנה רק צבע. כל שורה שהוסרה וכל שורה שנוספה
 * עוברות נרמול: ערכי צבע (hex, rgb, hsl, oklch, color-mix, var(--…)) ושמות טוקני
 * הצבע של Tailwind הופכים ל-C. אם אחרי הנרמול לכל שורה שהוסרה יש זוג זהה בין
 * השורות שנוספו באותו קובץ, השינוי הוא צבע בלבד. כל שורה בלי זוג מודפסת.
 *
 * למה נרמול ולא grep על className כמו במפרט: grep היה פוסל כל שורה בלי className,
 * כולל `events: "#d42b2b"` ב-service-accent.ts, ומעביר שורה עם className שגם
 * הטקסט שלה השתנה. הנרמול בודק את שתיהן נכון.
 *
 * מה מכשיל (יציאה 1): שורה בלי זוג בקוד שמגיע לגולש, כלומר app, components, lib
 * ו-hooks, חוץ מ-*.test.ts. הערות, הצהרות של טוקן צבע חדש, בדיקות וסקריפטים
 * מודפסים לעיון ולא מכשילים. קובץ רגיש ל-SEO בדיף מקבל אזהרה בכל מקרה.
 *
 * שימוש:
 *   node scripts/diff-gate.mjs                  git diff --cached, לפני קומיט
 *   node scripts/diff-gate.mjs --range A..B     טווח קומיטים, למשל HEAD~1..HEAD
 *   node scripts/diff-gate.mjs --patch f.diff   קובץ patch, לבדיקה עצמית
 */

import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";

const CODE_FILE = /\.(tsx?|jsx?|mjs|css)$/;
const SHIPPED = /^(app|components|lib|hooks)\//;
const TEST_FILE = /\.test\.tsx?$/;
const SEO_SENSITIVE = /sitemap|robots|next\.config|middleware|proxy\.ts|metadata|layout\.tsx|manifest\.ts|llms\.txt/;

/* שמות טוקני צבע בתוך class: bg-brand-red/10, text-gold-ink, border-danger */
const COLOR_TOKEN =
  "(?:brand-red(?:-light|-dark|-text)?|danger(?:-text)?|gold(?:-ink|-deep|-bright)?|ink(?:-soft)?|paper|catalog-gold|catalog-silver|primary|destructive|service-accent(?:-ink|-bright)?)";

const argv = process.argv.slice(2);
const after = (flag) => {
  const i = argv.indexOf(flag);
  return i >= 0 ? argv[i + 1] : undefined;
};

function readDiff() {
  const patch = after("--patch");
  if (patch) return readFileSync(patch, "utf8");
  const range = after("--range");
  return execFileSync("git", range ? ["diff", "-U0", range] : ["diff", "--cached", "-U0"], {
    encoding: "utf8",
    maxBuffer: 256 * 1024 * 1024,
  });
}

/** קובץ → שורות שהוסרו ושנוספו. הכותרות מזוהות רק לפני ה-@@ הראשון, כי שורה
    שהוסרה ומתחילה ב-"-- " נראית בדיוק כמו "--- a/file". */
function parse(diff) {
  const files = new Map();
  let file = null;
  let oldPath = null;
  let inHeader = false;
  for (const line of diff.split("\n")) {
    if (line.startsWith("diff --git ")) {
      inHeader = true;
      file = null;
      continue;
    }
    if (inHeader) {
      if (line.startsWith("--- ")) oldPath = line.slice(4).replace(/^a\//, "");
      else if (line.startsWith("+++ ")) {
        const p = line.slice(4);
        file = p === "/dev/null" ? oldPath : p.replace(/^b\//, "");
        if (!files.has(file)) files.set(file, { removed: [], added: [] });
      } else if (line.startsWith("@@")) inHeader = false;
      continue;
    }
    if (line.startsWith("@@") || !file) continue;
    if (line.startsWith("-")) files.get(file).removed.push(line.slice(1));
    else if (line.startsWith("+")) files.get(file).added.push(line.slice(1));
  }
  return files;
}

function normalize(line) {
  let s = line.trim();
  let prev;
  do {
    prev = s;
    s = s.replace(/var\(\s*--[\w-]+\s*(?:,[^()]*)?\)/g, "C");
    /* לא \b: בתוך class של Tailwind רווח נכתב _, ו-_ הוא תו מילה (0_0_20px_rgba) */
    s = s.replace(/(?<![A-Za-z])(?:rgba?|hsla?|oklch|oklab|lab|lch)\([^()]*\)/g, "C");
    s = s.replace(/color-mix\([^()]*\)/g, "C");
  } while (s !== prev);
  s = s.replace(/#(?:[0-9a-fA-F]{8}|[0-9a-fA-F]{6}|[0-9a-fA-F]{3})\b/g, "C");
  s = s.replace(new RegExp(`-${COLOR_TOKEN}(?![\\w-])`, "g"), "-C");
  s = s.replace(/-\[C\]/g, "-C");
  s = s.replace(/-C\/(?:\[[\d.]+%?\]|[\d.]+)/g, "-C");
  return s;
}

const isComment = (s) => /^(\/\/|\/\*|\*|\*\/|\{\/\*)/.test(s.trim());
const isColorDeclaration = (s) => /^--[\w-]+:\s*C;?$/.test(normalize(s));

const files = parse(readDiff());
const failing = [];
const info = [];
let paired = 0;

for (const [file, { removed, added }] of files) {
  if (!CODE_FILE.test(file)) continue;
  const pool = new Map();
  for (const line of added) {
    const key = normalize(line);
    pool.set(key, [...(pool.get(key) ?? []), line]);
  }
  const unmatched = [];
  for (const line of removed) {
    const key = normalize(line);
    const bucket = pool.get(key);
    if (bucket?.length) {
      bucket.shift();
      paired += 1;
    } else unmatched.push("-" + line);
  }
  for (const bucket of pool.values()) for (const line of bucket) unmatched.push("+" + line);

  for (const entry of unmatched) {
    const body = entry.slice(1);
    if (!body.trim()) continue;
    const shipped = SHIPPED.test(file) && !TEST_FILE.test(file);
    const harmless = isComment(body) || (entry[0] === "+" && isColorDeclaration(body));
    (shipped && !harmless ? failing : info).push(`${file}: ${entry}`);
  }
}

const sensitive = [...files.keys()].filter((f) => SEO_SENSITIVE.test(f));

console.log(`DIFF GATE: ${files.size} קבצים, ${paired} זוגות של שינוי צבע בלבד`);
if (sensitive.length) {
  console.log("\n! אזהרה: קובץ רגיש ל-SEO בדיף. דורש אישור מפורש:");
  for (const f of sensitive) console.log("  " + f);
}
if (info.length) {
  console.log(`\nלעיון, לא מכשיל (${info.length}): הערות, טוקן צבע חדש, בדיקות, סקריפטים`);
  for (const l of info) console.log("  " + l);
}
if (failing.length) {
  console.error(`\nDIFF GATE FAILED: ${failing.length} שורות בקוד האתר שאינן צבע בלבד. בדוק שורה-שורה:`);
  for (const l of failing) console.error("  " + l);
  process.exit(1);
}
console.log("\nDIFF GATE PASSED");
