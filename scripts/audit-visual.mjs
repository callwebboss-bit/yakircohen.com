/**
 * audit-visual.mjs - 36 צילומי מסך, 12 תבניות על 3 רוחבים, ודיף פיקסלים מולם.
 *
 * למה זה קיים: אין Storybook, אין Percy ואין אף בדיקת יחידה על רכיב.
 * בלי הצילומים האלה, שינוי CSS שמזיז אלמנט או מסתיר אותו עובר בשקט
 * דרך כל 25 השומרים הקיימים, כי כולם בודקים HTML ולא פיקסלים.
 *
 * למה מקומי ומחוץ ל-git (החלטה 23): הריפו יושב על Dropbox ומסונכרן
 * בין מק לווינדוס. 36 קבצי PNG מלאים בכל סבב היו מנפחים אותו בלי סוף.
 * הצילומים נשארים ב-.visual-baseline/ שמוחרג, ורק ההבדלים מדווחים.
 *
 * הסף נמדד ולא נוחש: שתי לכידות עצמאיות של אתר ללא שינוי הניבו אפס
 * פיקסלים שונים ב-36 הצילומים. ראה את ההערה על CHANGED_PIXELS למטה.
 * שינוי מידות העמוד מדווח תמיד, בלי שום סף.
 *
 * מה מנוטרל בכוונה כדי שהצילום יהיה דטרמיניסטי: אנימציות, מעברים,
 * ו-caret. בלעדיהם אותו עמוד מצטלם אחרת בכל פעם וכל דיף חסר ערך.
 *
 * שימוש:
 *   node scripts/audit-visual.mjs --base    לכידת בסיס
 *   node scripts/audit-visual.mjs           צילום והשוואה מול הבסיס
 *   --port=3210                             יציאת השרת
 */

import { existsSync, mkdirSync, readdirSync, rmSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { chromium } from "playwright";
import sharp from "sharp";

import { TEMPLATE_PAGES, VIEWPORTS } from "./template-pages.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(ROOT, ".visual-baseline");
const BASE_DIR = join(OUT, "base");
const CURRENT_DIR = join(OUT, "current");
const DIFF_DIR = join(OUT, "diff");

/**
 * כמה פיקסלים מותר להם להשתנות לפני שזה נחשב הבדל.
 *
 * הסף הזה נמדד ולא נוחש. שתי לכידות עצמאיות של אותו אתר, ללא שום שינוי
 * קוד ביניהן, הניבו **אפס** פיקסלים שונים בכל 36 הצילומים. רצפת הרעש
 * האמיתית היא אפס, ולכן הסף הראשון שכתבתי (0.2% מהפיקסלים) היה רחב פי
 * אלפי מונים מהנדרש והיה מפספס כל שינוי מקומי.
 *
 * למה 500 ולא אפס: שדרוג כרום או שינוי סביבה מזיזים החלקת קצוות בכמה
 * פיקסלים בלי שאף שורת קוד השתנתה. 500 פיקסלים הם ריבוע של 22 על 22,
 * קטן בהרבה מכל כפתור או שורת טקסט, וגדול מכל רעש שנמדד.
 *
 * מה עדיין לא נתפס: שינוי בגודל של מילה בודדת (בערך 640 פיקסלים) נמצא
 * בדיוק בגבול. השומר הזה מגן מפני שינויי פריסה וצבע, ולא מפני טעות
 * הקלדה. את הטקסט שומר audit:seo-diff, שסופר מילים לכל כתובת.
 */
const CHANGED_PIXELS = Number(process.env.VISUAL_PIXELS ?? 500);
/** הפרש ערוץ שנחשב "פיקסל שונה". מתחתיו זה רעש קידוד. */
const CHANNEL_DELTA = 12;

const args = process.argv.slice(2);
const isBase = args.includes("--base");
/** --reuse משווה את הצילומים הקיימים ב-current בלי לצלם מחדש. */
const isReuse = args.includes("--reuse");
const portArg = args.find((a) => a.startsWith("--port="));
const PORT = portArg ? portArg.slice("--port=".length) : process.env.LH_PORT || "3210";
const ORIGIN = `http://localhost:${PORT}`;

const slug = (path) => (path === "/" ? "home" : path.slice(1).replace(/\//g, "_"));

/** מנטרל כל מקור תזוזה שאינו השינוי שאנחנו בודקים. */
const FREEZE_CSS = `
  *, *::before, *::after {
    animation-duration: 0s !important;
    animation-delay: 0s !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0s !important;
    transition-delay: 0s !important;
    caret-color: transparent !important;
  }
  html { scroll-behavior: auto !important; }
`;

async function capture(targetDir) {
  rmSync(targetDir, { recursive: true, force: true });
  const browser = await chromium.launch();
  let shots = 0;

  try {
    for (const viewport of VIEWPORTS) {
      mkdirSync(join(targetDir, viewport.name), { recursive: true });
      const context = await browser.newContext({
        viewport: { width: viewport.width, height: viewport.height },
        deviceScaleFactor: 1,
        reducedMotion: "reduce",
        locale: "he-IL",
        timezoneId: "Asia/Jerusalem",
      });

      for (const page of TEMPLATE_PAGES) {
        const tab = await context.newPage();

        /* למה load ולא networkidle, ולמה כישלון בהמתנה אינו עוצר:
           /events/dj-events מחזיק בקשת /_next/image פתוחה דקה ויותר
           בהרצה ראשונה. המקור הוא תצלום 4032x3024 במשקל 1.05MB, ואופטימיזציה
           ראשונה שלו יקרה. בהרצה שנייה אותה בקשה חוזרת ב-80 אלפיות מהמטמון.
           העמוד עצמו מרונדר מזמן כשזה קורה, ולכן המתנה שנגמרת בלי אירוע load
           אינה סיבה להפיל את כל הסבב. האסרשן על h1 למטה הוא מה שמוודא
           שבאמת יש מה לצלם. */
        try {
          await tab.goto(ORIGIN + page.path, { waitUntil: "load", timeout: 90_000 });
        } catch (error) {
          if (error.name !== "TimeoutError") throw error;
          process.stdout.write(`\n    ! ${page.path} לא סיים load תוך 90 שניות, ממשיך לצלם\n`);
        }
        await tab.addStyleTag({ content: FREEZE_CSS });
        await tab.evaluate(() => document.fonts.ready);

        // גלילה עד הסוף וחזרה, כדי שתמונות עצלות ייטענו לפני הצילום.
        await tab.evaluate(async () => {
          const step = window.innerHeight;
          for (let y = 0; y < document.body.scrollHeight; y += step) {
            window.scrollTo(0, y);
            await new Promise((r) => setTimeout(r, 60));
          }
          window.scrollTo(0, 0);
        });
        await tab.waitForTimeout(600);

        /* צילום של עמוד ריק נראה בדיוק כמו צילום תקין בדיף, ולכן
           הבסיס היה נקבע על כלום. h1 הוא הסימן הזול שהעמוד באמת רונדר. */
        const headings = await tab.locator("h1").count();
        if (headings === 0) {
          throw new Error(`${page.path} ברוחב ${viewport.name} רונדר בלי h1. הצילום לא נשמר.`);
        }

        await tab.screenshot({
          path: join(targetDir, viewport.name, `${slug(page.path)}.png`),
          fullPage: true,
          animations: "disabled",
        });
        shots += 1;
        await tab.close();
      }

      await context.close();
      process.stdout.write(`  רוחב ${viewport.name}: ${TEMPLATE_PAGES.length} צילומים\n`);
    }
  } finally {
    await browser.close();
  }

  return shots;
}

/** דיף פיקסלים דרך sharp. מחזיר אחוז שונות, או null כשהמידות שונות. */
async function diffPair(basePath, currentPath, diffPath) {
  const [a, b] = await Promise.all([
    sharp(basePath).raw().toBuffer({ resolveWithObject: true }),
    sharp(currentPath).raw().toBuffer({ resolveWithObject: true }),
  ]);

  if (a.info.width !== b.info.width || a.info.height !== b.info.height) {
    return { dimensions: [`${a.info.width}x${a.info.height}`, `${b.info.width}x${b.info.height}`] };
  }

  const { width, height, channels } = a.info;
  const mask = Buffer.alloc(width * height * 3);
  let changed = 0;

  for (let p = 0; p < width * height; p += 1) {
    const i = p * channels;
    const delta =
      Math.abs(a.data[i] - b.data[i]) +
      Math.abs(a.data[i + 1] - b.data[i + 1]) +
      Math.abs(a.data[i + 2] - b.data[i + 2]);

    if (delta > CHANNEL_DELTA) {
      changed += 1;
      mask[p * 3] = 255;
      mask[p * 3 + 1] = 0;
      mask[p * 3 + 2] = 0;
    } else {
      const grey = Math.round((a.data[i] + a.data[i + 1] + a.data[i + 2]) / 3 / 3 + 170);
      mask[p * 3] = grey;
      mask[p * 3 + 1] = grey;
      mask[p * 3 + 2] = grey;
    }
  }

  const percent = (changed / (width * height)) * 100;

  if (changed > CHANGED_PIXELS) {
    mkdirSync(dirname(diffPath), { recursive: true });
    await sharp(mask, { raw: { width, height, channels: 3 } })
      .png()
      .toFile(diffPath);
  }

  return { percent, changed, total: width * height };
}

console.log(
  `צילומי מסך: ${TEMPLATE_PAGES.length} תבניות על ${VIEWPORTS.length} רוחבים` +
    ` = ${TEMPLATE_PAGES.length * VIEWPORTS.length} קבצים`,
);
console.log("  שרת: " + ORIGIN);

if (isBase) {
  const shots = await capture(BASE_DIR);
  console.log(`\n  ✓ ${shots} צילומי בסיס ב-${BASE_DIR.replace(ROOT + "/", "")}`);
  console.log("  התיקייה מוחרגת מ-git בכוונה. אין לצרף אותה לקומיט.");
  process.exit(0);
}

if (!existsSync(BASE_DIR)) {
  console.error("\n  ✗ אין בסיס ב-" + BASE_DIR.replace(ROOT + "/", ""));
  console.error("  בלי בסיס אין מול מה להשוות, ולכן זו שגיאה ולא דילוג.");
  process.exit(1);
}

if (isReuse) {
  console.log("  --reuse: משווה את הצילומים הקיימים, בלי לצלם מחדש");
} else {
  await capture(CURRENT_DIR);
}
rmSync(DIFF_DIR, { recursive: true, force: true });

const findings = [];
for (const viewport of VIEWPORTS) {
  const dir = join(BASE_DIR, viewport.name);
  if (!existsSync(dir)) continue;

  for (const file of readdirSync(dir).filter((f) => f.endsWith(".png"))) {
    const basePath = join(dir, file);
    const currentPath = join(CURRENT_DIR, viewport.name, file);

    if (!existsSync(currentPath)) {
      findings.push(`${viewport.name}/${file} · לא צולם בהרצה הזו`);
      continue;
    }

    const result = await diffPair(basePath, currentPath, join(DIFF_DIR, viewport.name, file));

    if (result.dimensions) {
      findings.push(
        `${viewport.name}/${file} · שינוי מידות: ${result.dimensions[0]} -> ${result.dimensions[1]}`,
      );
    } else if (result.changed > CHANGED_PIXELS) {
      findings.push(
        `${viewport.name}/${file} · ${result.changed.toLocaleString("he-IL")} פיקסלים` +
          ` (${result.percent.toFixed(3)}% מהעמוד)`,
      );
    }
  }
}

if (findings.length > 0) {
  console.log(`\n  ${findings.length} הבדלים מעל הסף של ${CHANGED_PIXELS} פיקסלים:`);
  for (const f of findings) console.log("    " + f);
  console.log(`\n  מפות ההבדל: ${DIFF_DIR.replace(ROOT + "/", "")} (אדום = פיקסל שהשתנה)`);
  console.log("  הבדל אינו בהכרח רגרסיה. יש לעבור עליהם אחד אחד ולאשר או לתקן.");
  process.exit(1);
}

console.log(
  `\n  ✓ אין הבדל מעל ${CHANGED_PIXELS} פיקסלים באף אחד מ-` +
    `${TEMPLATE_PAGES.length * VIEWPORTS.length} הצילומים.`,
);
