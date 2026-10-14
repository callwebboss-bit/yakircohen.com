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
 * הערות: דיף -U0 לא מראה איפה הערת בלוק נפתחה, ולכן שורה פנימית של הערה נראתה
 * כמו קוד. במצבים --range, --cached ו---worktree השער קורא את הקובץ המלא (לפני
 * ואחרי) ומסמן שורה שכולה הערה לפי המיקום האמיתי שלה. הערה בסוף שורת קוד
 * (/* ... *\/) מוסרת לפני הנרמול.
 *
 * מה מכשיל (יציאה 1): שורה בלי זוג בקוד שמגיע לגולש, כלומר app, components, lib
 * ו-hooks, חוץ מ-*.test.ts. הערות, הצהרות של טוקן צבע חדש, בדיקות וסקריפטים
 * מודפסים לעיון ולא מכשילים. קובץ רגיש ל-SEO בדיף מקבל אזהרה בכל מקרה.
 *
 * שימוש:
 *   node scripts/diff-gate.mjs                  git diff --cached, לפני קומיט
 *   node scripts/diff-gate.mjs --worktree       עץ העבודה מול HEAD
 *   node scripts/diff-gate.mjs --range A..B     טווח קומיטים, למשל HEAD~1..HEAD
 *   node scripts/diff-gate.mjs --patch f.diff   קובץ patch, לבדיקה עצמית (בלי הקשר קובץ)
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
const git = (args) => execFileSync("git", args, { encoding: "utf8", maxBuffer: 256 * 1024 * 1024 });

/** הדיף, ואיך לקרוא את הקובץ המלא לפני ואחרי (null במצב patch) */
function source() {
  const patch = after("--patch");
  if (patch) return { diff: readFileSync(patch, "utf8"), oldOf: null, newOf: null };
  const range = after("--range");
  if (range) {
    const [a, b] = range.split("..");
    return { diff: git(["diff", "-U0", range]), oldOf: (f) => git(["show", `${a}:${f}`]), newOf: (f) => git(["show", `${b}:${f}`]) };
  }
  if (argv.includes("--worktree")) {
    return { diff: git(["diff", "-U0", "HEAD"]), oldOf: (f) => git(["show", `HEAD:${f}`]), newOf: (f) => readFileSync(f, "utf8") };
  }
  return { diff: git(["diff", "--cached", "-U0"]), oldOf: (f) => git(["show", `HEAD:${f}`]), newOf: (f) => git(["show", `:${f}`]) };
}

/** קובץ → שורות שהוסרו ושנוספו, עם מספר השורה. הכותרות מזוהות רק לפני ה-@@ הראשון,
    כי שורה שהוסרה ומתחילה ב-"-- " נראית בדיוק כמו "--- a/file". */
function parse(diff) {
  const files = new Map();
  let file = null;
  let oldPath = null;
  let inHeader = false;
  let oldLine = 0;
  let newLine = 0;
  for (const line of diff.split("\n")) {
    if (line.startsWith("diff --git ")) {
      inHeader = true;
      file = null;
      continue;
    }
    if (inHeader && !line.startsWith("@@")) {
      if (line.startsWith("--- ")) oldPath = line.slice(4).replace(/^a\//, "");
      else if (line.startsWith("+++ ")) {
        const p = line.slice(4);
        file = p === "/dev/null" ? oldPath : p.replace(/^b\//, "");
        if (!files.has(file)) files.set(file, { removed: [], added: [] });
      }
      continue;
    }
    const hunk = /^@@ -(\d+)(?:,\d+)? \+(\d+)(?:,\d+)? @@/.exec(line);
    if (hunk) {
      inHeader = false;
      oldLine = Number(hunk[1]);
      newLine = Number(hunk[2]);
      continue;
    }
    if (!file) continue;
    if (line.startsWith("-")) files.get(file).removed.push({ text: line.slice(1), line: oldLine++ });
    else if (line.startsWith("+")) files.get(file).added.push({ text: line.slice(1), line: newLine++ });
  }
  return files;
}

/** מספרי השורות שכל התוכן שלהן הוא הערה (או רק סוגריים מסולסלים, כמו {/* ... *\/}).
    מדלג על מחרוזות, כדי ש-"**\/*" בתוך מחרוזת לא ייחשב פתיחת הערה. */
function commentOnlyLines(text, isCss) {
  const lines = text.split("\n");
  const result = new Set();
  let state = "code";
  let quote = "";
  lines.forEach((line, idx) => {
    let code = "";
    let hadComment = state === "block";
    for (let i = 0; i < line.length; i += 1) {
      const c = line[i];
      const n = line[i + 1];
      if (state === "block") {
        if (c === "*" && n === "/") {
          state = "code";
          i += 1;
        }
        continue;
      }
      if (state === "str") {
        code += c;
        if (c === "\\") {
          code += n ?? "";
          i += 1;
        } else if (c === quote) state = "code";
        continue;
      }
      if (c === "/" && n === "*") {
        state = "block";
        hadComment = true;
        i += 1;
        continue;
      }
      if (!isCss && c === "/" && n === "/") {
        hadComment = true;
        break;
      }
      if (c === '"' || c === "'" || c === "`") {
        state = "str";
        quote = c;
      }
      code += c;
    }
    if (state === "str" && quote !== "`") state = "code";
    if (hadComment && !code.replace(/[{}\s]/g, "")) result.add(idx + 1);
  });
  return result;
}

function normalize(line) {
  let s = line.replace(/\/\*.*?\*\//g, "").trim();
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

const startsAsComment = (s) => /^(\/\/|\/\*|\*|\*\/|\{\/\*)/.test(s.trim());
const isColorDeclaration = (s) => /^--[\w-]+:\s*C;?$/.test(normalize(s));
const safeRead = (fn, f) => {
  try {
    return fn(f);
  } catch {
    return "";
  }
};

const { diff, oldOf, newOf } = source();
const files = parse(diff);
const failing = [];
const info = [];
let paired = 0;

for (const [file, { removed, added }] of files) {
  if (!CODE_FILE.test(file)) continue;
  const isCss = file.endsWith(".css");
  const oldComments = oldOf ? commentOnlyLines(safeRead(oldOf, file), isCss) : new Set();
  const newComments = newOf ? commentOnlyLines(safeRead(newOf, file), isCss) : new Set();

  const pool = new Map();
  for (const entry of added) {
    const key = normalize(entry.text);
    pool.set(key, [...(pool.get(key) ?? []), entry]);
  }
  const unmatched = [];
  for (const entry of removed) {
    const bucket = pool.get(normalize(entry.text));
    if (bucket?.length) {
      bucket.shift();
      paired += 1;
    } else unmatched.push({ sign: "-", ...entry });
  }
  for (const bucket of pool.values()) for (const entry of bucket) unmatched.push({ sign: "+", ...entry });

  for (const { sign, text, line } of unmatched) {
    if (!text.trim()) continue;
    const shipped = SHIPPED.test(file) && !TEST_FILE.test(file);
    const comment = startsAsComment(text) || (sign === "-" ? oldComments : newComments).has(line);
    const harmless = comment || (sign === "+" && isColorDeclaration(text));
    (shipped && !harmless ? failing : info).push(`${file}:${line}: ${sign}${text}`);
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
