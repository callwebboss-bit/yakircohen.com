/**
 * ה-matcher ב-proxy.ts חייב להיות ליטרל סטטי, ולכן רשימת הנתיבים המתים מופיעה
 * פעמיים: כנתונים ב-lib/legacy-redirects.ts וכ-matcher ב-proxy.ts. סחיפה בין
 * השתיים שקטה לגמרי: הנתיב פשוט מפסיק לקבל 410 ואף בדיקה לא נכשלת.
 *
 * הסקריפט הזה אוכף שלושה דברים:
 *   1. כל prefix ו-exact ברשימת הנתונים מכוסה ב-matcher
 *   2. אין ב-matcher נתיב מת שאינו ברשימת הנתונים
 *   3. אף נתיב מת לא חוזר גם כ-301 ב-legacy-redirects (אחרת ה-301 תופס ראשון)
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const legacy = fs.readFileSync(path.join(ROOT, "lib/legacy-redirects.ts"), "utf8");
const proxy = fs.readFileSync(path.join(ROOT, "proxy.ts"), "utf8");
/* מקורות ההפניה מפוזרים על פני שלושה קבצים וששה מבנים. בדיקה שקוראת רק אחד
   מהם עוברת בירוק בזמן שה-410 מת. */
const REDIRECT_SOURCE_FILES = [
  "lib/legacy-redirects.ts",
  "lib/site-architecture.ts",
  "next.config.ts",
].map((rel) => ({ rel, text: fs.readFileSync(path.join(ROOT, rel), "utf8") }));

/* הערות שורה נספרו בעבר כערכים קיימים, ולכן matcher ש"בוטל בהערה" עבר את הבדיקה */
function stripComments(text) {
  return text.replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, "");
}

function escapeRe(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/* תופס גם `NAME = [...]` וגם `name: [...]` (matcher הוא מאפיין של אובייקט) */
function listConst(text, name) {
  const block = text.match(new RegExp(`${name}\\s*[:=]\\s*\\[([\\s\\S]*?)\\]`));
  if (!block) return null;
  return [...block[1].matchAll(/"([^"]+)"/g)].map((m) => m[1]);
}

const prefixes = listConst(stripComments(legacy), "GONE_PATH_PREFIXES");
const exacts = listConst(stripComments(legacy), "GONE_EXACT_PATHS");
const matcher = listConst(stripComments(proxy), "matcher");

const errors = [];
if (!prefixes) errors.push("GONE_PATH_PREFIXES not found in lib/legacy-redirects.ts");
if (!exacts) errors.push("GONE_EXACT_PATHS not found in lib/legacy-redirects.ts");
if (!matcher) errors.push("config.matcher not found in proxy.ts");

if (prefixes && exacts && matcher) {
  const matcherSet = new Set(matcher);

  for (const prefix of prefixes) {
    if (!matcherSet.has(`${prefix}/:path*`)) {
      errors.push(`prefix "${prefix}" has no matcher entry "${prefix}/:path*" in proxy.ts`);
    }
  }
  for (const exact of exacts) {
    if (!matcherSet.has(exact)) {
      errors.push(`exact path "${exact}" missing from proxy.ts matcher`);
    }
  }

  const known = new Set([...prefixes.map((p) => `${p}/:path*`), ...exacts]);
  for (const entry of matcher) {
    if (!known.has(entry)) {
      errors.push(`proxy.ts matcher has "${entry}" with no entry in the gone lists`);
    }
  }

  /* 301 רץ לפני ה-proxy, ולכן דפוס שחזר לרשימת ההפניות מנטרל את ה-410 בשקט.
     שני המבנים שקיימים בקוד: `source: "/x"` במערכים, ו-`"/x": "/dest"` במפות. */
  for (const prefix of [...prefixes, ...exacts]) {
    const esc = escapeRe(prefix);
    const asSource = new RegExp(`source:\\s*"${esc}(?:/|")`);
    const asMapKey = new RegExp(`"${esc}(?:/[^"]*)?"\\s*:\\s*"`);
    for (const { rel, text } of REDIRECT_SOURCE_FILES) {
      const body = stripComments(text);
      if (asSource.test(body) || asMapKey.test(body)) {
        errors.push(
          `"${prefix}" is BOTH a 410 path and a 301 source in ${rel} -- the 301 wins and the 410 is dead`,
        );
      }
    }
  }

  /* בלי זה, מחיקת בלוק ה-410 כולו מ-proxy.ts משאירה את האודיט ירוק */
  if (!/status:\s*410/.test(proxy)) {
    errors.push("proxy.ts no longer returns status 410 anywhere");
  }
  if (!/GONE_PATH_PREFIXES/.test(proxy) || !/GONE_EXACT_PATHS/.test(proxy)) {
    errors.push("proxy.ts no longer reads the gone lists");
  }
}

if (errors.length) {
  console.error(`audit:proxy-gone -- ${errors.length} issue(s):`);
  for (const e of errors) console.error(`  ✗ ${e}`);
  process.exit(1);
}

console.log(
  `audit:proxy-gone OK -- ${prefixes.length} prefixes + ${exacts.length} exact paths return 410, none shadowed by a 301`,
);
