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
/* 500 הוסתר מתחתיו הנקודה הירוקה של מחוון הזמינות (0.5rem = 64 פיקסלים)
   וכל אייקון קטן. רצפת הרעש שנמדדה בשני צילומים מלאים של אותה בנייה
   הייתה 0 פיקסלים, ולכן 40 עדיין מעל הרעש ומתחת לאייקון הקטן ביותר.
   סבב ביקורת 16.9.2026. אם יופיע רעש, להעלות לפי המדידה ולא לפי הרגשה. */
const CHANGED_PIXELS = Number(process.env.VISUAL_PIXELS ?? 40);

/* מסננים להרצה ממוקדת בזמן שמתקנים את השער עצמו. ריק = הכול.
   VISUAL_ONLY=podcast,studio  ·  VISUAL_WIDTHS=1440 */
const ONLY = (process.env.VISUAL_ONLY ?? "").split(",").map((s) => s.trim()).filter(Boolean);
const WIDTHS = (process.env.VISUAL_WIDTHS ?? "").split(",").map((s) => s.trim()).filter(Boolean);
const pickPages = (pages) => (ONLY.length ? pages.filter((p) => ONLY.some((o) => p.path.includes(o))) : pages);
const pickViewports = (views) => (WIDTHS.length ? views.filter((v) => WIDTHS.includes(v.name)) : views);
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

/* תחליף אחיד לכל תמונה חיצונית: פיקסל אפור אטום. הדפדפן מותח אותו לפי
   object-fit של המסגרת, ולכן התוצאה זהה בכל הרצה. */
const EXTERNAL_IMAGE_STUB = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
  "base64",
);

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
  /* .footer-shell מוגדר content-visibility: auto עם contain-intrinsic-size
     של 72rem. בדפדפן ללא ממשק הפוטר נמצא מתחת לקיפול ולכן מקבל גובה קבוע
     ולא מצויר: שני קישורים שנוספו לשורת הפוטר ב-15.9 לא הופיעו באף אחד
     מ-36 הצילומים. הצילום חייב לראות הכל, גם מה שהגולש רואה רק בגלילה. */
  * { content-visibility: visible !important; }
`;

/** כל תמונה עצלה הופכת מיידית, כי headless לא תמיד יורה lazy בגלילה. */
async function forceEagerImages(tab) {
  await tab.evaluate(() => {
    for (const img of document.querySelectorAll('img[loading="lazy"]')) {
      img.loading = "eager";
      img.setAttribute("loading", "eager");
    }
  });
}

/**
 * תמונה שנכשלה: טעינה חוזרת עם פרמטר שעוקף מטמון. מחזיר כמה נמצאו שבורות.
 *
 * נמצא 30.9.2026: התמונה מדווחת complete=true עם naturalWidth=0, כלומר
 * הדפדפן סיים ונכשל. המקור תקין והשרת מחזיר 200. הבקשה הראשונה נופלת על
 * מטמון קר של מאופטם התמונות של Next, והדפדפן שומר את הכישלון לאותה
 * כתובת: גם רענון עמוד מקבל את הכישלון השמור. נבדק בדפדפן: אותה כתובת
 * בדיוק עם פרמטר שעוקף מטמון נטענת מיד, ב-1920 פיקסלים.
 *
 * זה מסביר את כל אי-היציבות של השער. כל צילום פותח הקשר חדש עם מטמון
 * ריק, ולכן הצילום הראשון אחרי בנייה טרייה איבד תמונה והשני לא. ההפרשים
 * שנמדדו, 82,053 פיקסלים שוב ושוב, היו תמיד אריח גלריה אחד בדיוק.
 */
async function retryFailedImages(tab) {
  return tab.evaluate(async () => {
    const broken = [...document.querySelectorAll("img")].filter(
      (img) => img.complete && img.naturalWidth === 0 && img.src,
    );
    await Promise.all(
      broken.map((img) => {
        const src = img.src;
        return new Promise((resolve) => {
          const done = () => resolve(undefined);
          img.addEventListener("load", done, { once: true });
          img.addEventListener("error", done, { once: true });
          setTimeout(done, 30_000);
          img.src = src + (src.includes("?") ? "&" : "?") + "__visualRetry=1";
        });
      }),
    );
    return broken.length;
  });
}

/**
 * המתנה מפורשת לכל תמונה, עם תקרה. השהיה קבועה לא יודעת על מה היא ממתינה.
 *
 * שני שלבים, ושניהם נדרשים. load בלבד לא הספיק: נמדד 16.9.2026 שצילומים
 * חזרו עם מלבנים אפורים בדיוק באותם אזורים (82,053 פיקסלים, אותו מספר
 * בכל הרצה), בזמן ש-naturalWidth כבר היה גדול מאפס. כלומר הבייטים הגיעו
 * והדפדפן עוד לא פענח את התמונה כשהצילום נלכד. decode ממתין בדיוק לזה.
 */
async function waitForImages(tab) {
  await tab.evaluate(async () => {
    const pending = [...document.querySelectorAll("img")].filter(
      (img) => !img.complete || img.naturalWidth === 0,
    );
    await Promise.all(
      pending.map(
        (img) =>
          new Promise((resolve) => {
            const done = () => resolve(undefined);
            img.addEventListener("load", done, { once: true });
            img.addEventListener("error", done, { once: true });
            setTimeout(done, 20_000);
          }),
      ),
    );

    /* שלב שני: פענוח. decode נפתר רק כשהתמונה מוכנה לציור על המסך. */
    await Promise.all(
      [...document.querySelectorAll("img")].map((img) =>
        typeof img.decode === "function" ? img.decode().catch(() => undefined) : undefined,
      ),
    );
  });
}

async function capture(targetDir) {
  /* מסנן פעיל: לא מוחקים את השאר, אחרת הרצה ממוקדת מוחקת את כל הבסיס. */
  if (ONLY.length === 0 && WIDTHS.length === 0) {
    rmSync(targetDir, { recursive: true, force: true });
  }
  const browser = await chromium.launch();
  let shots = 0;

  try {
    for (const viewport of pickViewports(VIEWPORTS)) {
      mkdirSync(join(targetDir, viewport.name), { recursive: true });
      const context = await browser.newContext({
        viewport: { width: viewport.width, height: viewport.height },
        deviceScaleFactor: 1,
        reducedMotion: "reduce",
        locale: "he-IL",
        timezoneId: "Asia/Jerusalem",
      });

      /* כל תמונה ממקור חיצוני מוחלפת בתמונה קבועה.

         למה: הנגנים מושכים תמונה ממוזערת מ-i.ytimg.com בזמן הצילום, כלומר
         השער מדד את ה-CDN של יוטיוב ולא את הפריסה שלנו. נמדד 16.9.2026:
         אותה בנייה בדיוק החזירה 686,714 פיקסלים שונים ב-/events ו-1,285,137
         ב-/podcast, כולם בתוך מסגרות הנגנים, בזמן שאף שורת קוד לא נגעה בהם.
         שער שמדווח על שינוי כשלא השתנה דבר מאבד את כל ערכו.

         מה נשמר: המסגרת, היחס, המיקום וכל מה שמסביב, כלומר בדיוק מה שהשער
         אמור לשמור. מה שאבד: אי אפשר לתפוס תמונה ממוזערת שנשברה בצד יוטיוב,
         וזה ממילא לא היה בשליטתנו. */
      await context.route("**/*", async (route, request) => {
        if (request.resourceType() !== "image" || request.url().startsWith(ORIGIN)) {
          return route.continue();
        }
        return route.fulfill({
          status: 200,
          contentType: "image/png",
          body: EXTERNAL_IMAGE_STUB,
        });
      });

      /* קיבוע השעון לפני שקוד העמוד רץ.
         TimeGreeting מציג "בוקר טוב" או "שלום" לפי השעה, ולכן אותו עמוד
         הצטלם אחרת בבוקר ובצהריים. הרכיב עצמו כתוב נכון: הוא רכיב לקוח
         שמרנדר null בשרת ומעדכן באפקט, ולכן אין לו באג. הבעיה הייתה בכלי.
         new Date(arg) עם ארגומנט ממשיך לעבוד כרגיל, כדי שתאריכים מפורשים
         בעמוד לא ישתנו. */
      await context.addInitScript(() => {
        const FIXED = new Date("2026-06-15T10:30:00+03:00").getTime();
        const RealDate = Date;
        class FrozenDate extends RealDate {
          constructor(...args) {
            if (args.length === 0) super(FIXED);
            else super(...args);
          }
          static now() {
            return FIXED;
          }
        }
        window.Date = FrozenDate;
      });

      /* הקפאת טיימרים חוזרים לפני שקוד העמוד רץ.
         PromoBanner (הוסר בשלב 5) החליף הודעה ב-setInterval, ולכן אותו עמוד מצטלם עם
         הודעה אחרת בכל הרצה: 2,021 פיקסלים של הבדל בלי ששורת קוד השתנתה.
         setTimeout נשאר עובד, כי עליו נשענת טעינה עצלה והמתנות אמיתיות.
         מה שנשמר הוא בדיוק המצב שהשרת שלח, וזה גם מה שגולש רואה ראשון. */
      await context.addInitScript(() => {
        window.setInterval = () => 0;
      });

      for (const page of pickPages(TEMPLATE_PAGES)) {
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

        /* גלילה עד הסוף וחזרה, כדי שתמונות עצלות ייטענו לפני הצילום.
           הגובה נקרא מחדש בכל צעד ומ-documentElement ולא מ-body: הנוסח
           הקודם קרא את body.scrollHeight פעם אחת מראש, עצר לפני תחתית
           העמוד, ושתי תמונות עצלות ב-/about מעולם לא נכנסו לשדה הראייה.
           הדפדפן לא ביקש אותן כלל, והבסיס נשמר עם שתי מסגרות ריקות. */
        await tab.evaluate(async () => {
          const step = Math.max(200, Math.floor(window.innerHeight * 0.8));
          let y = 0;
          for (let guard = 0; guard < 400; guard += 1) {
            window.scrollTo(0, y);
            await new Promise((r) => setTimeout(r, 70));
            const bottom = document.documentElement.scrollHeight - window.innerHeight;
            if (y >= bottom) break;
            y = Math.min(y + step, bottom);
          }
          window.scrollTo(0, 0);
          await new Promise((r) => setTimeout(r, 120));
        });
        /* ביטול טעינה עצלה לפני ההמתנה.
           בדפדפן ללא ממשק גרפי, loading="lazy" לא נורה תמיד בגלילה
           מתוכנתת: שתי תמונות ב-/about לא נתבקשו כלל גם אחרי גלילה מלאה
           עד תחתית העמוד, והבסיס נשמר איתן ריקות. עם eager הן נטענו מיד
           בסטטוס 200, כלומר האתר תקין והכלי היה זה שטעה.
           גולש אמיתי טוען אותן בגלילה רגילה; הצילום צריך את כולן תמיד. */
        await forceEagerImages(tab);

        /* המתנה מפורשת לכל התמונות.
           בלכידת הבסיס הראשונה מטמון אופטימיזציית התמונות היה קר, וכמה
           תמונות עצלות לא הספיקו להיטען. התוצאה: בסיס עם מסגרות ריקות,
           שכל השוואה אליו מדווחת "הבדל" שהוא רק תזמון. השהיה קבועה לא
           פותרת את זה כי היא לא יודעת על מה היא ממתינה. */
        await waitForImages(tab);

        await tab.waitForTimeout(600);

        /* תמונה שנשארה ריקה אחרי ההמתנה נרשמת. צילום עם מסגרת ריקה אינו
           בסיס תקין, וצריך לדעת עליו במקום לגלות אותו כ"הבדל" מאוחר יותר. */
        const emptyImages = await tab.evaluate(
          () =>
            [...document.querySelectorAll("img")].filter(
              (img) => img.naturalWidth === 0,
            ).length,
        );
        if (emptyImages > 0) {
          const retried = await retryFailedImages(tab);
          process.stdout.write(`\n    ! ${page.path} ברוחב ${viewport.name}: ${retried} תמונות נטענו מחדש\n`);
          await waitForImages(tab);
        }

        /* צילום של עמוד ריק נראה בדיוק כמו צילום תקין בדיף, ולכן
           הבסיס היה נקבע על כלום. h1 הוא הסימן הזול שהעמוד באמת רונדר. */
        const headings = await tab.locator("h1").count();
        if (headings === 0) {
          throw new Error(`${page.path} ברוחב ${viewport.name} רונדר בלי h1. הצילום לא נשמר.`);
        }

        /* גלילה שנייה, ממש לפני הצילום.
           הגלילה הראשונה קורית לפני המתנת התמונות, כלומר שניות לפני
           הצילום בפועל. בעמוד של 24,000 פיקסלים הדפדפן מרסטר רק את מה
           שקרוב לשדה הראייה, והאריחים הרחוקים מפונים מהמטמון. נמדד
           16.9.2026: שני צילומים של אותה בנייה בדיוק נבדלו ב-82,053
           ואז ב-318,554 פיקסלים, תמיד באזורי תמונה ותמיד עמוק בעמוד.
           המעבר הזה מאלץ רסטור טרי של כל רצועה לפני התפירה. */
        await tab.evaluate(async () => {
          const step = Math.max(200, Math.floor(window.innerHeight * 0.9));
          const bottom = () => document.documentElement.scrollHeight - window.innerHeight;
          for (let y = 0; y <= bottom(); y += step) {
            window.scrollTo(0, y);
            await new Promise((r) => requestAnimationFrame(() => r(undefined)));
          }
          window.scrollTo(0, 0);
          await new Promise((r) => setTimeout(r, 250));
        });

        /* המתנה אחרונה, אחרי הגלילה וממש לפני הצילום.
           הגלילה עצמה מרכיבה אריחי גלריה נוספים, והם מתחילים להיטען רק
           עכשיו. בלי ההמתנה הזו הם עדיין בדרך כשהצילום נלכד, וזה בדיוק
           מה שקרה ב-/events: אריח אחד חסר בלי שאף אזהרה נורתה, כי בזמן
           הבדיקה הקודמת הוא עוד לא היה ב-DOM בכלל. */
        await forceEagerImages(tab);
        await waitForImages(tab);
        const lateFailures = await retryFailedImages(tab);
        if (lateFailures > 0) {
          await waitForImages(tab);
          await tab.waitForTimeout(400);
          const stillBroken = await tab.evaluate(
            () => [...document.querySelectorAll("img")].filter((img) => img.naturalWidth === 0).length,
          );
          process.stdout.write(
            `\n    ! ${page.path} ברוחב ${viewport.name}: ${lateFailures} תמונות נטענו מחדש לפני הצילום` +
              (stillBroken > 0 ? `, ${stillBroken} עדיין שבורות\n` : "\n"),
          );
          if (stillBroken > 0) {
            throw new Error(
              `${page.path} ברוחב ${viewport.name}: ${stillBroken} תמונות לא נטענו גם אחרי טעינה חוזרת. הצילום לא נשמר.`,
            );
          }
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

/* עוברים על האיחוד של הבסיס והנוכחי, לא על הבסיס בלבד. קודם הלולאה
   קראה רק את תיקיית הבסיס, ולכן תבנית או רוחב שנוספו אחרי לכידת הבסיס
   צולמו ולא הושוו לכלום, והסיכום הכריז "אין הבדל ב-36 צילומים".
   סבב ביקורת 16.9.2026. */
const findings = [];
let compared = 0;
for (const viewport of pickViewports(VIEWPORTS)) {
  const dir = join(BASE_DIR, viewport.name);
  const curDir = join(CURRENT_DIR, viewport.name);
  const pngs = (d) => (existsSync(d) ? readdirSync(d).filter((f) => f.endsWith(".png")) : []);
  const files = [...new Set([...pngs(dir), ...pngs(curDir)])].sort();

  for (const file of files) {
    const basePath = join(dir, file);
    const currentPath = join(curDir, file);

    if (!existsSync(basePath)) {
      findings.push(`${viewport.name}/${file} · אין צילום בסיס (תבנית או רוחב חדשים): ללכוד בסיס מחדש`);
      continue;
    }
    if (!existsSync(currentPath)) {
      findings.push(`${viewport.name}/${file} · לא צולם בהרצה הזו`);
      continue;
    }
    compared += 1;

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

const expected = pickPages(TEMPLATE_PAGES).length * pickViewports(VIEWPORTS).length;
if (compared !== expected) {
  console.error(`\n  ✗ הושוו ${compared} צילומים, צפויים ${expected}. הבסיס אינו מכסה את כל התבניות.`);
  process.exit(1);
}
console.log(`\n  ✓ אין הבדל מעל ${CHANGED_PIXELS} פיקסלים באף אחד מ-${compared} הצילומים.`);
