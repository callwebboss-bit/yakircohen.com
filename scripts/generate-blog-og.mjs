/**
 * generate-blog-og.mjs - תמונת שיתוף אמיתית בגודל 1200x630 לכל פוסט בבלוג.
 *
 * הבעיה שנמדדה 30.9.2026: 87 הפוסטים חולקים 24 תמונות ממוזערות, ורק 7 מהן
 * עומדות בדרישות של רשתות השיתוף. השאר הן SVG אחת, שש צרות מ-600 פיקסלים
 * (הקטנה שבהן 300x226), ושבע לאורך (הגבוהה 1440x2560). בנוסף, וזה החמור
 * יותר, constructMetadata הצהיר על 1200x630 לכל פוסט בלי קשר למידות
 * האמיתיות. כלומר וואטסאפ ופייסבוק קיבלו הצהרה שאינה נכונה, והתצוגה
 * המקדימה יצאה חתוכה או לא נטענה כלל.
 *
 * מה הסקריפט עושה: לכל תמונה ממוזערת ייחודית הוא מייצר קובץ 1200x630
 * תחת public/images/og/blog, וכותב מפה מהנתיב המקורי לנתיב החדש.
 *
 * שתי אסטרטגיות חיתוך, לפי יחס הצדדים של המקור:
 * - רחב או כמעט ריבועי: חיתוך לפי אזור העניין (sharp position attention),
 *   שמוצא את החלק הבולט בתמונה במקום לחתוך מהמרכז בעיוורון.
 * - לאורך ממש: התמונה נכנסת בשלמותה על רקע בצבע האתר. חיתוך של 1536x2048
 *   ל-1200x630 היה מוריד ראשים.
 *
 * מקור קטן מ-1200x630 מוגדל, וזה מכוון: תמונה רכה בגודל הנכון עדיפה על
 * תמונה חדה שהרשת דוחה. הסקריפט מדווח על כל מקור כזה בשמו.
 *
 * הרצה: npm run generate:blog-og
 */

import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const BLOG_DATA = join(ROOT, "lib", "data", "blog.ts");
const OUT_DIR = join(ROOT, "public", "images", "og", "blog");
const MAP_FILE = join(ROOT, "lib", "data", "blog-og.generated.ts");

export const OG_WIDTH = 1200;
export const OG_HEIGHT = 630;

/** רקע לתמונות לאורך: אותו נייר של האתר, כדי שהמסגרת לא תיראה כתקלה. */
const PAD_BACKGROUND = { r: 250, g: 250, b: 248, alpha: 1 };

/** מתחת ליחס הזה התמונה נחשבת לאורך ונכנסת בשלמותה במקום להיחתך. */
const PORTRAIT_RATIO = 0.9;

function ogNameFor(sourcePath) {
  return "og-" + createHash("sha256").update(sourcePath).digest("hex").slice(0, 12) + ".webp";
}

const src = readFileSync(BLOG_DATA, "utf8");
const thumbnails = [
  ...new Set([...src.matchAll(/thumbnail:\s*\n?\s*"([^"]+)"/g)].map((m) => m[1])),
].sort();

if (thumbnails.length === 0) {
  console.error("generate:blog-og ✗ לא נמצאה אף תמונה ממוזערת ב-lib/data/blog.ts");
  process.exit(1);
}

mkdirSync(OUT_DIR, { recursive: true });

const map = {};
const upscaled = [];
const padded = [];
const failed = [];

for (const thumb of thumbnails) {
  const source = join(ROOT, "public", decodeURIComponent(thumb));
  if (!existsSync(source)) {
    failed.push(`${thumb} (הקובץ אינו קיים)`);
    continue;
  }

  const outName = ogNameFor(thumb);
  const outPath = join(OUT_DIR, outName);
  const publicPath = `/images/og/blog/${outName}`;

  try {
    const meta = await sharp(source).metadata();
    const ratio = meta.width / meta.height;
    const isPortrait = ratio < PORTRAIT_RATIO;

    if (meta.width < OG_WIDTH || meta.height < OG_HEIGHT) {
      upscaled.push(`${thumb} (${meta.width}x${meta.height})`);
    }
    if (isPortrait) padded.push(`${thumb} (${meta.width}x${meta.height})`);

    if (isPortrait) {
      /* רקע מטושטש מהתמונה עצמה, ולא פס בצבע אחיד.
         נמדד על צילום 1536x2048: עם פס אחיד התמונה תפסה שליש מהרוחב ושני
         שלישים נשארו ריקים. הטשטוש ממלא את המסגרת, שומר על גוון הצילום,
         ולא מתחרה בתמונה החדה שמעליו. הכהייה קלה כדי שהחדה תבלוט. */
      const blurred = await sharp(source)
        .resize(OG_WIDTH, OG_HEIGHT, { fit: "cover", position: "centre" })
        .blur(28)
        .modulate({ brightness: 0.72 })
        .toBuffer();
      const foreground = await sharp(source)
        .resize(OG_WIDTH, OG_HEIGHT, { fit: "inside", withoutEnlargement: false })
        .toBuffer();
      await sharp(blurred)
        .composite([{ input: foreground, gravity: "centre" }])
        .webp({ quality: 82 })
        .toFile(outPath);
    } else {
      await sharp(source)
        .resize(OG_WIDTH, OG_HEIGHT, {
          fit: "cover",
          position: sharp.strategy.attention,
          background: PAD_BACKGROUND,
        })
        .webp({ quality: 82 })
        .toFile(outPath);
    }

    map[thumb] = publicPath;
  } catch (error) {
    failed.push(`${thumb} (${error.message})`);
  }
}

const entries = Object.entries(map)
  .map(([from, to]) => `  ${JSON.stringify(from)}: ${JSON.stringify(to)},`)
  .join("\n");

writeFileSync(
  MAP_FILE,
  `/* נוצר על ידי scripts/generate-blog-og.mjs. לא לערוך ביד. */
/* מפה מהתמונה הממוזערת של הפוסט לתמונת השיתוף שלו ב-${OG_WIDTH}x${OG_HEIGHT}. */

export const BLOG_OG_WIDTH = ${OG_WIDTH};
export const BLOG_OG_HEIGHT = ${OG_HEIGHT};

export const BLOG_OG_BY_THUMBNAIL: Readonly<Record<string, string>> = {
${entries}
};
`,
  "utf8",
);

console.log("\ngenerate:blog-og");
console.log(`  ${Object.keys(map).length} תמונות שיתוף ב-${OG_WIDTH}x${OG_HEIGHT}.`);
if (padded.length) {
  console.log(`\n  ${padded.length} מקורות לאורך נכנסו בשלמותם על רקע במקום להיחתך:`);
  for (const p of padded) console.log("    " + p);
}
if (upscaled.length) {
  console.log(`\n  ${upscaled.length} מקורות קטנים מהיעד והוגדלו. שווה להחליף אותם במקור גדול יותר:`);
  for (const u of upscaled) console.log("    " + u);
}
if (failed.length) {
  console.error(`\n  ✗ ${failed.length} נכשלו:`);
  for (const f of failed) console.error("    " + f);
  process.exit(1);
}
console.log("");
