/**
 * audit-blog-og.mjs - כל פוסט בבלוג מגיש תמונת שיתוף אמיתית ב-1200x630.
 *
 * למה השומר הזה קיים: עד 30.9.2026 עמוד הפוסט הצהיר לוואטסאפ ולפייסבוק
 * על 1200x630 והגיש את התמונה הממוזערת כמו שהיא. מתוך 24 התמונות רק 7
 * באמת עמדו בזה: אחת SVG, שש צרות מ-600 פיקסלים (הקטנה 300x226), ושבע
 * לאורך (הגבוהה 1440x2560). הצהרה שאינה תואמת את הקובץ שוברת את התצוגה
 * המקדימה, וזה בדיוק מה שהגולש רואה כשמישהו משתף מאמר.
 *
 * מה שנבדק: כל תמונה ממוזערת ממופה, הקובץ קיים, והוא בדיוק 1200x630.
 * רשומה במפה שאין לה תמונה ממוזערת היא רשומה מתה ונכשלת גם היא, כי מפה
 * שלא מתוחזקת חוזרת להיות שקר.
 */

import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OG_WIDTH = 1200;
const OG_HEIGHT = 630;

const blogSrc = readFileSync(join(ROOT, "lib", "data", "blog.ts"), "utf8");
const mapSrc = readFileSync(join(ROOT, "lib", "data", "blog-og.generated.ts"), "utf8");

const thumbnails = [
  ...new Set([...blogSrc.matchAll(/thumbnail:\s*\n?\s*"([^"]+)"/g)].map((m) => m[1])),
];
const map = Object.fromEntries(
  [...mapSrc.matchAll(/^\s+"([^"]+)":\s*"([^"]+)",$/gm)].map((m) => [m[1], m[2]]),
);

const problems = [];

for (const thumb of thumbnails) {
  const og = map[thumb];
  if (!og) {
    problems.push(`${thumb}\n      אין לה תמונת שיתוף במפה`);
    continue;
  }
  const file = join(ROOT, "public", decodeURIComponent(og));
  if (!existsSync(file)) {
    problems.push(`${thumb}\n      הקובץ ${og} אינו קיים`);
    continue;
  }
  const meta = await sharp(file).metadata();
  if (meta.width !== OG_WIDTH || meta.height !== OG_HEIGHT) {
    problems.push(`${thumb}\n      ${og} הוא ${meta.width}x${meta.height} ולא ${OG_WIDTH}x${OG_HEIGHT}`);
  }
}

const stale = Object.keys(map).filter((k) => !thumbnails.includes(k));
for (const key of stale) {
  problems.push(`${key}\n      רשומה במפה שאין לה תמונה ממוזערת בשום פוסט`);
}

console.log("\n=== audit:blog-og ===\n");

if (problems.length > 0) {
  console.error(`  ✗ ${problems.length} בעיות בתמונות השיתוף של הבלוג:\n`);
  for (const p of problems) console.error("    " + p);
  console.error("\n    למה זה חשוב: זו התמונה שנפתחת כשמישהו משתף מאמר בוואטסאפ.");
  console.error("    תיקון: npm run generate:blog-og ואז לשמור את הקבצים ב-git.\n");
  process.exit(1);
}

console.log(
  `תקין. ${thumbnails.length} תמונות ממוזערות, לכל אחת תמונת שיתוף ב-${OG_WIDTH}x${OG_HEIGHT}.\n`,
);
