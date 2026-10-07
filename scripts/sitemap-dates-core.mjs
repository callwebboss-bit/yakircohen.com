/**
 * הלוגיקה הטהורה של generate-sitemap-dates.mjs, מופרדת כדי שאפשר יהיה לבדוק אותה
 * (lib/seo/sitemap-dates.test.ts). כאן אין כתיבת קבצים ואין קריאה ל-git.
 *
 * הרעיון: "קובץ המקור" של עמוד הוא לא רק ה-page.tsx, שברוב העמודים הוא עטיפה דקה,
 * אלא גם קבצי התוכן הפרטיים שהוא מייבא (components/seo/*PageContent.tsx,
 * lib/data/*-page.ts). מודול שמשרת הרבה עמודים (pricing-catalog, services) לא נחשב
 * מקור של אף אחד מהם, אחרת כל עדכון מחיר היה מסמן עשרות עמודים כמעודכנים.
 */
import fs from "node:fs";
import path from "node:path";

/** מודול שמגיעים אליו ממספר ראוטים גדול מזה נחשב משותף ולא משפיע על התאריך */
export const SHARED_FANOUT_LIMIT = 3;

/** תיקיות שנעקוב בהן אחרי imports. node_modules וחבילות חיצוניות לא נכנסות */
const FOLLOWED_DIRS = ["app", "lib", "components"];

/**
 * קבצים נגזרים לא נחשבים תוכן: JSON התאריכים עצמו (מעגליות: יצירה מחדש הייתה
 * מזיזה את התאריך של עצמה) וקבצים מיוצרים אחרים.
 */
const GENERATED_FILE = /\.generated\.|\/blog-slugs\.ts$/;

/**
 * קבצים שמחזיקים הרבה רשומות עם כתובת משלהן (פוסטים, מונחי מילון). git מתארך קובץ
 * ולא רשומה, ולכן תיקון שורה במונח אחד היה מסמן את כל 91 המונחים כמעודכנים. הרשומות
 * האלה מתוארכות ב-app/sitemap.ts משדות התאריך שלהן, ובלי שדה כזה נשארות על תאריך הראוט.
 * חלק מהם כבר מוחרגים כמשותפים לפי fan-out, והרשימה מבטיחה את זה גם כשהמספר יורד.
 */
export const MULTI_ENTRY_FILES = new Set(["lib/data/blog.ts", "lib/data/glossary.ts"]);

const EXTS = ["", ".ts", ".tsx", ".mjs", "/index.ts", "/index.tsx"];
const PARSEABLE = /\.(?:ts|tsx|mjs|js)$/;
const IMPORT_RE =
  /(?:import|export)\s[^'"]*?from\s*["']([^"']+)["']|import\s*["']([^"']+)["']|import\(\s*["']([^"']+)["']\s*\)/g;

const toPosix = (p) => p.split(path.sep).join("/");

/** ראוט (למשל "/studio/recording-song-modiin") מקובץ page.tsx, או null אם אין לו כתובת קבועה */
export function routeFromFile(file, appDir, dynamicAllowed = []) {
  const rel = path.relative(appDir, path.dirname(file));
  if (rel.startsWith("..")) return null;
  const segments = toPosix(rel)
    .split("/")
    .filter((s) => s && !(s.startsWith("(") && s.endsWith(")")));
  const route = "/" + segments.join("/");
  if (segments.some((s) => s.startsWith("_"))) return null;
  if (segments.some((s) => s.startsWith("["))) {
    return dynamicAllowed.includes(route) ? route : null;
  }
  return route;
}

function resolveImport(spec, fromFile, root) {
  let base;
  if (spec.startsWith("@/")) base = path.join(root, spec.slice(2));
  else if (spec.startsWith(".")) base = path.resolve(path.dirname(fromFile), spec);
  else return null;
  for (const ext of EXTS) {
    const candidate = base + ext;
    if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) return candidate;
  }
  return null;
}

/** גרף imports מקומי עם מטמון. מחזיר פונקציה שנותנת את התלויות הישירות של קובץ */
export function createImportGraph(root) {
  const cache = new Map();
  return function depsOf(file) {
    const hit = cache.get(file);
    if (hit) return hit;
    const deps = new Set();
    if (PARSEABLE.test(file)) {
      const src = fs.readFileSync(file, "utf8");
      for (const m of src.matchAll(IMPORT_RE)) {
        const resolved = resolveImport(m[1] || m[2] || m[3], file, root);
        if (!resolved) continue;
        const top = toPosix(path.relative(root, resolved)).split("/")[0];
        if (FOLLOWED_DIRS.includes(top)) deps.add(resolved);
      }
    }
    const out = [...deps];
    cache.set(file, out);
    return out;
  };
}

/** כל הקבצים שהעמוד מגיע אליהם דרך imports, כולל העמוד עצמו */
export function closureOf(entry, depsOf) {
  const seen = new Set([entry]);
  const stack = [entry];
  while (stack.length) {
    for (const dep of depsOf(stack.pop())) {
      if (!seen.has(dep)) {
        seen.add(dep);
        stack.push(dep);
      }
    }
  }
  return seen;
}

/** קובץ → לכמה עמודים הוא מגיע. closures הוא אוסף של Set מ-closureOf */
export function countFanout(closures) {
  const fanout = new Map();
  for (const set of closures) {
    for (const file of set) fanout.set(file, (fanout.get(file) ?? 0) + 1);
  }
  return fanout;
}

/** קבצי המקור של עמוד: ה-page.tsx עצמו תמיד, ובנוסף כל קובץ פרטי (לא משותף ולא נגזר) */
export function routeSourceFiles(entry, closure, fanout, root, limit = SHARED_FANOUT_LIMIT) {
  return [...closure].filter((file) => {
    if (file === entry) return true;
    const rel = toPosix(path.relative(root, file));
    if (GENERATED_FILE.test(rel) || MULTI_ENTRY_FILES.has(rel)) return false;
    return (fanout.get(file) ?? 0) <= limit;
  });
}

/**
 * git log --format=__C__%cI --name-only → מפה של קובץ לתאריך הקומיט האחרון שנגע בו.
 * git מחזיר מהחדש לישן, ולכן ההופעה הראשונה של קובץ היא האחרונה בזמן.
 */
export function parseGitLog(raw) {
  const map = new Map();
  let current = null;
  for (const line of raw.split("\n")) {
    if (line.startsWith("__C__")) {
      current = line.slice(5).trim();
    } else if (line.trim() && current && !map.has(line.trim())) {
      map.set(line.trim(), current);
    }
  }
  return map;
}

/** התאריך המאוחר ביותר מבין הקבצים. משווים לפי רגע ולא לפי מחרוזת, כי ההיסט (+02:00/+03:00) משתנה */
export function latestGitDate(files, gitDates, toRel) {
  let best;
  let bestMs = -Infinity;
  for (const file of files) {
    const iso = gitDates.get(toRel(file));
    if (!iso) continue;
    const ms = Date.parse(iso);
    if (ms > bestMs) {
      bestMs = ms;
      best = iso;
    }
  }
  return best;
}

/** ערך של קבוע מחרוזת מקובץ מקור (למשל `export const X_UPDATED_AT = "2026-10-04"`), או undefined */
export function readStringConstant(source, name) {
  const m = source.match(new RegExp(`\\b${name}\\s*(?::\\s*string\\s*)?=\\s*["']([^"']+)["']`));
  return m ? m[1] : undefined;
}

/**
 * שרשרת הנפילה: תאריך git של קבצי המקור. בלעדיו, המאוחר מבין תאריך תוכן מפורש
 * מהקוד לבין הערך שכבר נשמר ב-JSON בריצה קודמת (כך נפילה לעולם לא מחזירה תאריך
 * אחורה). בשוויון יום נשמר הערך הקודם, כדי שהקובץ לא ישתנה סתם. בלי שניהם אין lastmod.
 * מחזיר גם את המקור, כדי שהסקריפט ידווח כמה ראוטים הגיעו מכל שלב.
 */
export function resolveRouteDate({ gitDate, contentDate, previousDate }) {
  if (gitDate) return { date: gitDate, source: "git" };
  /* קבוע התאריך הוא YYYY-MM-DD ללא שעה, ולכן משווים ימים ולא רגעים */
  if (contentDate && (!previousDate || contentDate.slice(0, 10) > previousDate.slice(0, 10))) {
    return { date: contentDate, source: "content" };
  }
  if (previousDate) return { date: previousDate, source: "previous" };
  return { date: undefined, source: "none" };
}
