/**
 * audit:audio-demo-coverage - מוודא ש-recommendedPages ב-audio-demos.ts נשאר אמת.
 *
 * השדה recommendedPages מתעד איפה כל הדגמת לפני/אחרי אמורה להופיע. נמדד
 * ב-2.10.2026: הוא היה מכובד כמעט במלואו, אבל שום דבר בקוד לא אכף אותו,
 * ושתי כתובות בו כבר הצביעו לראוטים שנמחקו. השער הזה הופך את השדה
 * ממסמך כוונות לחוזה: כתובת שמופיעה בו חייבת להתקיים ולהציג הוכחת אודיו.
 *
 * הזיהוי מכוון להיות רחב בכוונה. עמוד נחשב מכוסה אם איפשהו בעץ הייבוא שלו
 * יש ראיה להשמעת לפני/אחרי. זה תופס גם רכיבים ייעודיים כמו
 * FunnyRingtoneBeforeAfter שלא עוברים דרך audio-demos.ts, ולכן השער
 * לא מתלונן על עמוד שבפועל כן מציג הוכחה.
 */
import fs from "node:fs";
import path from "node:path";

const MAX_DEPTH = 5;

/** הדגמות שעדיין לא הופקו. אין להן קבצי אודיו, ולכן הן לא מרונדרות. */
const PENDING_ALLOWLIST = new Set(["singer-live-tuning"]);

const PROOF_MARKS = [
  /<AudioShowcase\b/,
  /<SoundImprovementShowcase\b/,
  /<MicroAudioAudition\b/,
  /getAudioDemo\s*\(/,
  /\bbeforeSrc\s*[=:]/,
];

function readIfExists(file) {
  try {
    return fs.readFileSync(file, "utf8");
  } catch {
    return null;
  }
}

/** מחזיר את קובץ ה-page.tsx של נתיב, אחרי הסרת route groups כמו (services). */
function findPageFile(routePath) {
  const pages = [];
  (function walk(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const p = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(p);
      else if (entry.name === "page.tsx") pages.push(p);
    }
  })("app");
  for (const p of pages) {
    const clean = path.dirname(p).replace(/[/\\]\([^)]*\)/g, "").slice("app".length);
    if ((clean === "" ? "/" : clean) === routePath) return p;
  }
  return null;
}

function rendersProof(file, seen = new Set(), depth = 0) {
  if (depth > MAX_DEPTH || seen.has(file)) return false;
  seen.add(file);
  const src = readIfExists(file);
  if (src === null) return false;
  if (PROOF_MARKS.some((re) => re.test(src))) return true;
  for (const spec of src.matchAll(/from "(@\/components\/[^"]+)"/g)) {
    const next = `${spec[1].replace("@/", "./")}.tsx`;
    if (rendersProof(next, seen, depth + 1)) return true;
  }
  return false;
}

const demosSrc = fs.readFileSync("lib/data/audio-demos.ts", "utf8");
const blogSrc = fs.readFileSync("lib/data/blog.ts", "utf8");

const blogPosts = new Map();
for (const chunk of blogSrc.split('\n    slug: "').slice(1)) {
  const slug = chunk.slice(0, chunk.indexOf('"'));
  const body = chunk.slice(0, chunk.indexOf("\n  },\n"));
  blogPosts.set(slug, /audioDemoId:/.test(body));
}

const problems = [];
let checked = 0;

for (const m of demosSrc.matchAll(
  /id: "([a-z0-9-]+)",([\s\S]*?)recommendedPages: (\[[^\]]*\])/g,
)) {
  const [, demoId, between, listRaw] = m;
  const pending = /status: "pending"/.test(between);
  for (const p of listRaw.matchAll(/"(\/[^"]*)"/g)) {
    const routePath = p[1];
    checked += 1;
    if (pending && PENDING_ALLOWLIST.has(demoId)) continue;

    if (routePath.startsWith("/blog/")) {
      const slug = routePath.slice("/blog/".length);
      if (!blogPosts.has(slug)) {
        problems.push(`${demoId} -> ${routePath} : הפוסט לא קיים`);
      } else if (!blogPosts.get(slug)) {
        problems.push(`${demoId} -> ${routePath} : הפוסט בלי audioDemoId`);
      }
      continue;
    }

    const file = findPageFile(routePath);
    if (!file) {
      problems.push(`${demoId} -> ${routePath} : הראוט לא קיים`);
    } else if (!rendersProof(file)) {
      problems.push(`${demoId} -> ${routePath} : העמוד לא מציג הוכחת אודיו`);
    }
  }
}

if (problems.length > 0) {
  console.error("\naudit:audio-demo-coverage נכשל\n");
  for (const p of problems) console.error(`  ✗ ${p}`);
  console.error(
    "\nרשומה ב-recommendedPages היא הבטחה שההדגמה מופיעה שם. או להוסיף אותה\n" +
      "לעמוד, או להסיר את הכתובת מהשדה. אם ההדגמה עוד לא הופקה, להוסיף את\n" +
      "המזהה ל-PENDING_ALLOWLIST עם הסבר.\n",
  );
  process.exit(1);
}

console.log(
  `תקין. ${checked} שיוכי הדגמה נבדקו, כולם מצביעים לעמוד קיים שמציג הוכחת אודיו.`,
);
