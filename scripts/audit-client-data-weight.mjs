/**
 * מאגרי תוכן כבדים לא נשלחים לדפדפן.
 *
 * הרקע: components/layout/Breadcrumbs.tsx הוא רכיב לקוח, והוא ייבא בעקיפין
 * את lib/data/blog.ts (409KB) ואת lib/data/services.ts (173KB). התוצאה:
 * כ-585KB נשלחו לכל דפדפן בכל עמוד באתר, גם בעמוד הבית שבו הקוד הזה מחזיר
 * רשימה ריקה לפני שהוא נוגע בנתונים. זה היה מקור רוב 750KB ה-JS הלא בשימוש
 * ש-Lighthouse דיווח עליו.
 *
 * השומר סורק את גרף הייבוא מכל קובץ "use client" ונכשל אם הוא מגיע למאגר
 * כבד. הוא לא מסתמך על גודל אלא על רשימה מפורשת, כי קובץ יכול לגדול.
 *
 * Run: npm run audit:client-data-weight
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const SCAN_DIRS = ["app", "components", "lib", "hooks"];

/** מאגרים שאסור להם להגיע ללקוח, ולמה */
const FORBIDDEN = {
  "lib/data/blog.ts": "כל 87 הפוסטים כמחרוזות HTML. להשתמש ב-blog-slugs או ב-breadcrumb-titles.generated",
  "lib/data/services.ts": "רג׳יסטרי השירותים המלא. להעביר את מה שצריך כ-prop מהשרת",
  "lib/data/video-catalog.generated.ts": "273 סרטונים. להעביר רק את הפלייליסט הרלוונטי",
  "lib/data/glossary.ts": "91 מונחים עם הגדרות",
};

/**
 * היתרים מפורשים: רכיב שהנתונים הכבדים הם התוכן שלו עצמו.
 *
 * ההיתר מאמת את עצמו: אם הרכיב כבר לא מייבא את המאגר, השומר נכשל ודורש
 * להסיר את ההיתר, ולכן הרשימה לא יכולה להתיישן בשקט.
 *
 * שניהם מחוץ לחמשת עמודי הליבה שנמדדים. **צריך אימות מחדש מול בנייה
 * אמיתית**, כי אם Turbopack מייצר חבילה מונוליטית הם כן יגיעו לכל עמוד.
 */
const ALLOWED = {
  "components/glossary/GlossaryHubContent.tsx|lib/data/glossary.ts":
    "עמוד /glossary עצמו. 91 המונחים הם התוכן של העמוד, לא נתוני עזר",
  "components/not-found/NotFoundContent.tsx|lib/data/services.ts":
    "עמוד 404 עם חיפוש. ראוט נפרד, לא בחמשת עמודי הליבה",
};

const files = [];
const walk = (dir) => {
  if (!fs.existsSync(dir)) return;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      if ([".next", "node_modules", ".git"].includes(e.name)) continue;
      walk(full);
    } else if (/\.(tsx?|mjs)$/.test(e.name) && !/\.test\./.test(e.name)) files.push(full);
  }
};
SCAN_DIRS.forEach((d) => walk(path.join(ROOT, d)));

const rel = (f) => path.relative(ROOT, f).split(path.sep).join("/");
const source = new Map();
for (const f of files) source.set(rel(f), fs.readFileSync(f, "utf8"));

/** ייבואים אמיתיים בלבד. type-only לא נשלח לדפדפן. */
function importsOf(file) {
  const src = source.get(file) ?? "";
  const out = new Set();
  /* [^;]* ולא [\s\S]*: הביטוי הקודם חצה שורות, התחיל בייבוא של react
     והמשיך עד ה-from של השורה הבאה, ולכן ייחס ייבוא type-only לייבוא ערך
     שקדם לו. ייבוא מרובה שורות עדיין נתפס, כי אין בו נקודה-פסיק. */
  for (const m of src.matchAll(/^[ \t]*import\s+(?!type\s)([^;]*?)from\s+"(@\/[^"]+|\.[^"]+)"/gm)) {
    const clause = m[1] ?? "";
    /* import { type X } בלבד גם הוא נמחק בקומפילציה */
    if (/^\s*\{\s*(type\s+[^,}]+\s*,?\s*)+\}\s*$/.test(clause)) continue;
    let spec = m[2];
    let target = spec.startsWith("@/")
      ? spec.slice(2)
      : path.posix.normalize(path.posix.join(path.posix.dirname(file), spec));
    for (const ext of [".ts", ".tsx", "/index.ts", "/index.tsx", ""]) {
      if (source.has(target + ext)) { out.add(target + ext); break; }
    }
  }
  return out;
}

const clientRoots = [...source.keys()].filter((f) => /^\s*["']use client["']/.test(source.get(f)));
const violations = [];
const allowedHits = new Set();

for (const root of clientRoots) {
  const seen = new Set([root]);
  const queue = [[root, [root]]];
  while (queue.length) {
    const [cur, chain] = queue.shift();
    for (const dep of importsOf(cur)) {
      if (seen.has(dep)) continue;
      seen.add(dep);
      const why = FORBIDDEN[dep];
      if (why) {
        const key = `${root}|${dep}`;
        if (ALLOWED[key]) { allowedHits.add(key); continue; }
        violations.push({ root, dep, why, chain: [...chain, dep] });
        continue;
      }
      queue.push([dep, [...chain, dep]]);
    }
  }
}

console.log("=== audit:client-data-weight ===\n");
if (violations.length) {
  console.error(`נמצאו ${violations.length} מאגרים כבדים שמגיעים ללקוח:\n`);
  for (const v of violations) {
    console.error(`  ✗ ${v.dep}`);
    console.error(`      ${v.why}`);
    console.error(`      שרשרת: ${v.chain.join(" -> ")}`);
  }
  process.exit(1);
}
/* היתר שכבר לא נחוץ חייב לרדת, אחרת הוא יכסה על תקלה עתידית */
const dead = Object.keys(ALLOWED).filter((k) => !allowedHits.has(k));
if (dead.length) {
  console.error("נמצאו היתרים מיותרים:\n");
  for (const k of dead) {
    console.error(`  ✗ ${k.replace("|", " -> ")} כבר לא קיים. להסיר מ-ALLOWED.`);
  }
  process.exit(1);
}

console.log(
  `תקין. ${clientRoots.length} רכיבי לקוח נסרקו, אף אחד מהם לא מגיע ל-${Object.keys(FORBIDDEN).length} המאגרים הכבדים.`,
);
if (allowedHits.size) {
  console.log(`\nחריגים מאושרים (${allowedHits.size}), מחוץ לעמודי הליבה:`);
  for (const k of allowedHits) console.log(`  · ${k.split("|")[0]}\n      ${ALLOWED[k]}`);
}
