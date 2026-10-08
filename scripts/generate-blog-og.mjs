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
 * לוגו: בדיקת הלוגו של 7.10.2026 מצאה שאף תמונת שיתוף של הבלוג לא נושאת
 * את הלוגו. מי שמקבל מאמר בוואטסאפ רואה צילום בלי לדעת של מי האתר. לכן
 * כל תמונה מקבלת את logoBadge המשותף (scripts/lib/brand-logo.mjs), אותה
 * לוחית כמו בשאר תמונות השיתוף באתר.
 *
 * שם הקובץ נגזר מנתיב התמונה הממוזערת ולא מהמקור בפועל, גם כשיש החלפת מקור
 * (OG_SOURCE_OVERRIDES). כך כתובות og:image לא משתנות, וקו הבסיס של
 * audit:seo-diff ‏(scripts/baselines/seo-pages.json) נשאר תקף.
 *
 * הרצה: npm run generate:blog-og
 */

import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import { logoBadge } from "./lib/brand-logo.mjs";

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

/**
 * מקור אחר לתמונת השיתוף בלבד, כשהתמונה הממוזערת עצמה לא מתאימה לשיתוף.
 * המפתח הוא התמונה הממוזערת כפי שהיא ב-lib/data/blog.ts, הערך הוא המקור
 * שממנו נוצרת תמונת השיתוף.
 *
 * חבילת סלואו: בצילום רואים על מסך ה-LED של עמדת הדי-ג'יי "ALMOG COHEN",
 * מותג של די-ג'יי אחר (בדיקת הלוגו 7.10.2026). הוא תמונת השיתוף של
 * wedding-song-2026, של 5-things-before-choosing-wedding-dj ושל
 * heavy-smoke-vs-light-smoke-events. המחליף הוא ריקוד סלואו בעשן הכבד של
 * יקיר כהן הפקות, מתיקיית תיק העבודות של העשן הכבד (שנקראת דרך
 * lib/service-portfolio-images.ts). 2400x1800, אותו נושא של זוג בעשן, ובלי
 * שום מותג זר בפריים (נבדק בעין על הקובץ המלא, 7.10.2026).
 *
 * למה לא להחליף את thumbnail ב-blog.ts: התמונה הממוזערת בעמוד עוברת דרך
 * next/image, ומכסת אופטימיזציית התמונות ב-Vercel Hobby מוצתה. קובץ חדש
 * מאחורי next/image מחזיר 402 ותמונה שבורה. תמונת השיתוף מוגשת ישירות
 * מ-public ולא נוגעת במכסה.
 */
const OG_SOURCE_OVERRIDES = {
  "/images/services/events/wedding-packages/חבילת סלואו יקיר כהן הפקות.webp":
    "/images/services/events/attractions/wedding-smoking-machine/ריקוד סלואו בעשן הכבד של יקיר כהן הפקות.webp",
};

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
const overridden = [];

/* החלפת מקור שאין לה תמונה ממוזערת היא רשומה מתה: מישהו החליף את התמונה
   בפוסט וההחלפה כבר לא עושה כלום. נכשלים כדי שלא תישאר הגנה מדומה. */
for (const key of Object.keys(OG_SOURCE_OVERRIDES)) {
  if (!thumbnails.includes(key)) failed.push(`${key} (החלפת מקור בלי תמונה ממוזערת באף פוסט)`);
}

/* הלוחית זהה בכל התמונות, ולכן מרונדרת פעם אחת. */
const badge = await logoBadge({ canvasWidth: OG_WIDTH });

for (const thumb of thumbnails) {
  const sourcePublic = OG_SOURCE_OVERRIDES[thumb] ?? thumb;
  const source = join(ROOT, "public", decodeURIComponent(sourcePublic));
  if (!existsSync(source)) {
    failed.push(`${sourcePublic} (הקובץ אינו קיים)`);
    continue;
  }
  if (sourcePublic !== thumb) overridden.push(`${thumb}\n      מקור: ${sourcePublic}`);

  const outName = ogNameFor(thumb);
  const outPath = join(OUT_DIR, outName);
  const publicPath = `/images/og/blog/${outName}`;

  try {
    const meta = await sharp(source).metadata();
    const ratio = meta.width / meta.height;
    const isPortrait = ratio < PORTRAIT_RATIO;

    if (meta.width < OG_WIDTH || meta.height < OG_HEIGHT) {
      upscaled.push(`${sourcePublic} (${meta.width}x${meta.height})`);
    }
    if (isPortrait) padded.push(`${sourcePublic} (${meta.width}x${meta.height})`);

    let base;
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
      base = await sharp(blurred)
        .composite([{ input: foreground, gravity: "centre" }])
        .toBuffer();
    } else {
      base = await sharp(source)
        .resize(OG_WIDTH, OG_HEIGHT, {
          fit: "cover",
          position: sharp.strategy.attention,
          background: PAD_BACKGROUND,
        })
        .toBuffer();
    }

    /* הלוגו מונח אחרון, מעל התמונה הסופית, כדי שהחיתוך לא יזיז או יחתוך אותו. */
    await sharp(base).composite([badge]).webp({ quality: 82 }).toFile(outPath);

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
console.log(`  ${Object.keys(map).length} תמונות שיתוף ב-${OG_WIDTH}x${OG_HEIGHT}, כולן עם הלוגו.`);
if (overridden.length) {
  console.log(`\n  ${overridden.length} תמונות שיתוף נוצרו ממקור אחר מהתמונה הממוזערת (OG_SOURCE_OVERRIDES):`);
  for (const o of overridden) console.log("    " + o);
}
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
