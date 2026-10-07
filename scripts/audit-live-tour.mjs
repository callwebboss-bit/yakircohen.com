/**
 * audit:live-tour - סיור לקוח באתר החי, במובייל, בלי לשלוח כלום.
 *
 * למה זה קיים: כל השערים האחרים בודקים קוד, HTML סטטי או localhost. אף אחד לא
 * הולך באתר החי כמו לקוח: לא פותח את /book בטלפון, לא לוחץ "הפעל ניגון", לא
 * רואה מה מכסה את ה-CTA. הסיור הראשון (4.10.2026) מצא כך סרגל תחתון שקוף,
 * שתי הבטחות זמן באותו דף וכרטיס הערכה שהציג את המחיר לפני מע"מ.
 *
 * מה הוא עושה (שלושה חלקים, --only=book,pages,audio):
 *   book   מסע ב-/book עד שלב 3 של הוויזארד. לא לוחץ שליחה, לעולם.
 *   pages  עשרת עמודי הכסף: H1, הבטחת זמן, שכבות צפות במסך הראשון, CTA, מחירים.
 *   audio  כל עמוד עם הדגמות: לחיצה אמיתית על "הפעל ניגון" ובדיקה שהקובץ מנגן.
 *
 * בטיחות, ואי אפשר לכבות אותן:
 *   - כל בקשה ל-Google Analytics / GTM נחסמת, כדי לא לזהם את משפך הלידים.
 *   - כל בקשה ל-/api/lead* נחסמת, וספירה שלה שונה מאפס נכשלת.
 *   - הנתונים שמוזנים הם נתוני בדיקה מובהקים.
 *
 * שימוש:
 *   node scripts/audit-live-tour.mjs                       האתר החי, כל החלקים
 *   node scripts/audit-live-tour.mjs --only=pages          חלק אחד
 *   node scripts/audit-live-tour.mjs --base=http://localhost:3213
 *   node scripts/audit-live-tour.mjs --out=D:\\reports\\tour
 *
 * הדוח נכתב מחוץ לריפו (ברירת מחדל: תיקיית הבית, yakir-tour-reports/התאריך),
 * כי deploy:status נכשל על כל קובץ חדש בעץ. קוד יציאה 1 כשיש כשל. אזהרות לא
 * מכשילות.
 *
 * מה הוא לא מכסה: Safari אמיתי (זה Chromium עם פרופיל iPhone 14), פלט שמע
 * אמיתי, ושיפוט עיצובי. את זה צריך עין, והצילומים בתיקיית הדוח נועדו לה.
 */
import { chromium, devices } from "playwright";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const args = Object.fromEntries(
  process.argv.slice(2).map((a) => {
    const [k, v] = a.replace(/^--/, "").split("=");
    return [k, v ?? "1"];
  }),
);
const BASE = (args.base || "https://yakircohen.com").replace(/\/$/, "");
const ONLY = new Set((args.only || "book,pages,audio").split(","));
const DAY = new Date().toISOString().slice(0, 10);
const OUT = args.out || join(homedir(), "yakir-tour-reports", DAY);
mkdirSync(join(OUT, "screens"), { recursive: true });

/** עמודי הכסף. הרשימה היא החלטת הבעלים, לא לשנות בלי אישור. */
const MONEY_PAGES = [
  "/events/dj-events",
  "/studio",
  "/studio/recording-song-modiin",
  "/podcast",
  "/studio/blessings",
  "/online",
  "/photography",
  "/business",
  "/pricing",
  "/book",
];

/** עמודים שמציגים הדגמות אודיו. נבדקו ב-4.10.2026 מול recommendedPages וסריקת מפת האתר. */
const AUDIO_PAGES = [
  "/podcast/podcast-editing",
  "/podcast",
  "/online/vocal-fix",
  "/online",
  "/online/online-ai-pricing",
  "/online/vocal-fix/mixing",
  "/blog/ai-audio-restoration-guide",
  "/blog/sound-recovery-ai-podcast",
  "/studio/recording-song-modiin",
  "/online/vocal-fix/pitch-correction",
  "/pricing",
  "/studio/recording-song-modiin/gifts",
  "/studio/pricing",
  "/studio/blessings/video-clip",
  "/studio/blessings/bride-groom-blessing",
  "/studio/recording-song-modiin/gifts/funny-ringtone",
  "/academy",
  "/business/professional-voiceover",
  "/portfolio",
  "/voiceover",
  "/voiceover/services",
];

/** עמודים עם סרגל תחתון משלהם (PricingStickyBookCta, BookStickyMobileBar). הוא כפיל של ה-CTA, לא מכסה אותו. */
const OWN_STICKY_BAR = new Set(["/pricing", "/book"]);

/* הבטחת מענה (לא זמן מסירה) של 24 שעות. החלטת הבעלים D62, 5.10.2026: היא רק בכרטיס גוגל,
   ובאתר TIME_CLAIMS.quoteHour ("בדרך כלל תוך שעה"). */
const RESPONSE_24H = /(?:אחזור|נחזור|יחזור|חוזרים|הצעה|מענה|תשובה)[^.\n]{0,24}תוך 24 שעות/;

/** תקן קבצי ההדגמה, public/audio/README.md: עד 2MB. */
const MAX_AUDIO_BYTES = 2 * 1024 * 1024;

const results = []; // { area, name, status: "pass" | "fail" | "warn" | "info", detail }
const add = (area, name, status, detail = "") => {
  results.push({ area, name, status, detail });
  const mark = { pass: "ok  ", fail: "FAIL", warn: "warn", info: "info" }[status];
  console.log(`  [${mark}] ${area} / ${name}${detail ? `  -  ${detail}` : ""}`);
};

/* ---------- קטלוג מחירים (אופציונלי, רק כשהסקריפט רץ מתוך הריפו) ---------- */
function loadCatalogPrices() {
  const file = join(ROOT, "lib", "data", "pricing-catalog.ts");
  if (!existsSync(file)) return null;
  const set = new Set();
  for (const m of readFileSync(file, "utf8").matchAll(/exVat:\s*(\d+)/g)) {
    set.add(Number(m[1]));
    set.add(Math.round(Number(m[1]) * 1.18));
  }
  return set;
}

/* ---------- דפדפן עם חסימות ---------- */
const leadAttempts = [];
async function newContext(browser) {
  const ctx = await browser.newContext({ ...devices["iPhone 14"], locale: "he-IL" });
  await ctx.route(/google-analytics\.com|googletagmanager\.com|analytics\.google\.com/, (r) => r.abort());
  await ctx.route(/\/api\/(lead|leads)/, (r) => {
    leadAttempts.push(`${r.request().method()} ${r.request().url()}`);
    return r.abort();
  });
  await ctx.addInitScript(() => {
    window.__plays = [];
    const orig = HTMLMediaElement.prototype.play;
    HTMLMediaElement.prototype.play = function () {
      const rec = { el: this, result: "pending" };
      window.__plays.push(rec);
      const p = orig.apply(this, arguments);
      if (p && p.then) p.then(() => (rec.result = "resolved"), (e) => (rec.result = "rejected:" + e.name));
      return p;
    };
  });
  return ctx;
}

async function shot(page, name) {
  await page.screenshot({ path: join(OUT, "screens", `${name}.png`) });
}

async function scrollThrough(page) {
  const h = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < h; y += 450) {
    await page.evaluate((v) => scrollTo(0, v), y);
    await page.waitForTimeout(90);
  }
  await page.waitForTimeout(700);
  await page.evaluate(() => scrollTo(0, 0));
}

/* ---------- חלק 1: /book ---------- */
async function tourBook(browser) {
  console.log("\n== book: מסע ב-/book במובייל ==");
  const ctx = await newContext(browser);
  const page = await ctx.newPage();
  page.setDefaultTimeout(8000);
  const pageErrors = [];
  page.on("pageerror", (e) => pageErrors.push(e.message.slice(0, 120)));
  const resp = await page.goto(`${BASE}/book`, { waitUntil: "load" });
  await page.waitForTimeout(3000);
  add("book", "העמוד נטען", resp.status() === 200 ? "pass" : "fail", `status ${resp.status()}`);
  await shot(page, "book-00-top");

  const facts = await page.evaluate(() => {
    const bar = document.querySelector(".book-glass-bar");
    const alpha = (() => {
      if (!bar) return null;
      const m = getComputedStyle(bar).backgroundColor.match(/[\d.]+/g);
      return m && m.length >= 4 ? Number(m[3]) : 1;
    })();
    return {
      h1: document.querySelectorAll("h1").length,
      overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
      barAlpha: alpha,
      text: document.body.innerText,
    };
  });
  add("book", "H1 אחד בדיוק", facts.h1 === 1 ? "pass" : "fail", `נמצאו ${facts.h1}`);
  add("book", "אין גלישה לרוחב", facts.overflow ? "fail" : "pass");
  add("book", "הסרגל התחתון אטום", facts.barAlpha === null || facts.barAlpha === 1 ? "pass" : "fail", `alpha ${facts.barAlpha}`);

  const promises = new Set((facts.text.match(/תוך (?:24 שעות|שעה|שעתיים|שעות)/g) || []).map((s) => s.trim()));
  add("book", "הבטחת זמן אחת בדף", promises.size <= 1 ? "pass" : "fail", [...promises].join(" / ") || "אין");

  // הטופס החכם: בחירה ראשונה, מחיר כולל מע"מ קודם, והסרגל מציג את הבחירה
  const firstCategory = page.locator("#smart-form-heading + p + div button").first();
  await firstCategory.scrollIntoViewIfNeeded();
  await firstCategory.click();
  await page.waitForTimeout(1200);
  const radio = page.locator('#smart-form [role="radio"]').first();
  if (await radio.count()) {
    await radio.click();
    await page.waitForTimeout(1200);
  }
  const state = await page.evaluate(() => {
    const rec = [...document.querySelectorAll("#smart-form div")]
      .filter((e) => /הערכת תקציב/.test(e.innerText) && /סה["״]כ משוער/.test(e.innerText))
      .sort((a, b) => a.innerText.length - b.innerText.length)[0];
    return {
      receipt: rec ? rec.innerText.replace(/\n+/g, " | ") : "",
      bar: document.querySelector(".book-glass-bar")?.innerText.replace(/\s+/g, " ") || "",
    };
  });
  const incl = state.receipt.match(/סה["״]כ משוער, כולל מע["״]מ \| ([\d,]+)/);
  const excl = state.receipt.match(/לפני מע["״]מ \(\d+%\): ([\d,]+)/);
  const toNum = (m) => (m ? Number(m[1].replace(/,/g, "")) : null);
  add(
    "book",
    "כרטיס ההערכה: כולל מע״מ קודם",
    incl && excl && toNum(incl) > toNum(excl) ? "pass" : "fail",
    incl ? `כולל ${incl[1]}, לפני ${excl ? excl[1] : "?"}` : state.receipt.slice(0, 140) || "הכרטיס לא נמצא",
  );
  add(
    "book",
    "הסרגל התחתון מציג את הבחירה והמחיר",
    incl && state.bar.includes(incl[1]) && /כולל מע["״]מ/.test(state.bar) ? "pass" : "fail",
    state.bar.slice(0, 80),
  );
  await shot(page, "book-01-after-selection");

  const fonts = await page.evaluate(() =>
    [...document.querySelectorAll("input:not([type=checkbox]):not([type=radio]):not([type=file]),textarea,select")]
      .filter((e) => e.offsetParent)
      .map((e) => parseFloat(getComputedStyle(e).fontSize)),
  );
  add("book", "שדות הטופס 16px ומעלה", fonts.every((f) => f >= 16) ? "pass" : "fail", `קטנים: ${fonts.filter((f) => f < 16).length} מתוך ${fonts.length}`);

  // הוויזארד: עד שלב 3, בלי שליחה
  const nameBox = page.getByLabel("שם מלא", { exact: true }).first();
  await nameBox.scrollIntoViewIfNeeded();
  await nameBox.fill("בדיקת מערכת");
  await page.getByLabel("טלפון נייד", { exact: true }).first().fill("0501234567");
  await page.getByRole("button", { name: "המשך", exact: true }).first().click();
  await page.waitForTimeout(1200);
  const step2 = /שלב 2 מתוך 3/.test(await page.evaluate(() => document.body.innerText));
  add("book", "וויזארד שלב 1 עובר לשלב 2", step2 ? "pass" : "fail");
  await shot(page, "book-02-wizard-step2");
  if (step2) {
    await page.getByText(/^א'/).first().click();
    await page.getByRole("button", { name: /המשך לסיכום/ }).first().click();
    await page.waitForTimeout(1200);
    const step3 = /שלב 3 מתוך 3/.test(await page.evaluate(() => document.body.innerText));
    add("book", "וויזארד שלב 2 עובר לשלב 3", step3 ? "pass" : "fail");
    await shot(page, "book-03-wizard-step3");
    const submit = await page.getByRole("button", { name: /קבלו הצעה/ }).count();
    add("book", "כפתור השליחה קיים (לא נלחץ)", submit > 0 ? "pass" : "warn");
  }
  add("book", "אין שגיאות JavaScript", pageErrors.length === 0 ? "pass" : "fail", pageErrors.join(" | "));
  await ctx.close();
}

/* ---------- חלק 2: עמודי הכסף ---------- */
async function tourPages(browser) {
  console.log("\n== pages: עשרת עמודי הכסף ==");
  const catalog = loadCatalogPrices();
  const ctx = await newContext(browser);
  for (const path of MONEY_PAGES) {
    const page = await ctx.newPage();
    const resp = await page.goto(`${BASE}${path}`, { waitUntil: "load" });
    await page.waitForTimeout(3200);
    const rawHtml = await (await ctx.request.get(`${BASE}${path}`)).text();
    const rawH1 = (rawHtml.match(/<h1[\s>]/gi) || []).length;
    const d = await page.evaluate(() => {
      const vh = innerHeight;
      const layers = [...document.querySelectorAll("*")].filter((e) => {
        const cs = getComputedStyle(e);
        if (cs.position !== "fixed" || cs.visibility === "hidden" || parseFloat(cs.opacity) < 0.05) return false;
        const b = e.getBoundingClientRect();
        if (b.width < 20 || b.height < 20 || b.width > 420 || b.bottom < 0 || b.top > vh) return false;
        const label = e.getAttribute("aria-label") || "";
        return !/scroll-progress/.test(e.className.toString()) && !e.closest("header") && !/נגישות/.test(label + e.innerText);
      }).length;
      const main = document.querySelector("#main-content") || document.body;
      const actionWords = /הצעה|מחיר|בחירת|הזמנ|קביעת|שלחו|התחל/;
      const cta = [...main.querySelectorAll('a[href*="/book"], a[href^="https://wa.me"], a[href^="tel:"], button')].find((e) => {
        const b = e.getBoundingClientRect();
        const isLink = e.tagName === "A";
        return (
          b.width > 60 &&
          b.height > 28 &&
          b.top >= 0 &&
          b.top < vh - 20 &&
          getComputedStyle(e).position !== "fixed" &&
          (isLink || actionWords.test(e.innerText || ""))
        );
      });
      let covered = null;
      if (cta) {
        const b = cta.getBoundingClientRect();
        let hit = 0;
        let total = 0;
        for (let i = 1; i < 8; i++) {
          for (let j = 1; j < 4; j++) {
            const y = b.top + (b.height * j) / 4;
            if (y >= vh) continue;
            total++;
            const t = document.elementFromPoint(b.left + (b.width * i) / 8, y);
            if (t && !cta.contains(t) && !t.contains(cta)) hit++;
          }
        }
        covered = total ? Math.round((100 * hit) / total) : 0;
      }
      return {
        h1: document.querySelectorAll("h1").length,
        text: document.body.innerText,
        layers,
        cta: cta ? (cta.innerText || cta.getAttribute("aria-label") || "").trim().replace(/\s+/g, " ").slice(0, 36) : null,
        covered,
      };
    });
    await shot(page, `page-${path.replace(/\//g, "_") || "home"}`);
    const area = `page ${path}`;
    add(area, "נטען", resp.status() === 200 ? "pass" : "fail", `status ${resp.status()}`);
    add(area, "H1 אחד בדיוק (גולמי ומרונדר)", d.h1 === 1 && rawH1 === 1 ? "pass" : "fail", `מרונדר ${d.h1}, גולמי ${rawH1}`);
    /* החלטת הבעלים D62 ו-D76, 7.10.2026: באתר נשאר "בדרך כלל תוך שעה", ולכן הכשל הוא
       הבטחת מענה של 24 שעות ולא "תוך שעה" כמו בענף של 4.10. */
    const reply24h = d.text.match(RESPONSE_24H);
    add(area, "הבטחת מענה לפי D62, בלי 'תוך 24 שעות'", reply24h ? "fail" : "pass", reply24h ? `"${reply24h[0]}"` : "");
    const ownBar = OWN_STICKY_BAR.has(path);
    add(area, "מסך ראשון בלי שכבות צפות מעל התוכן", d.layers === 0 || ownBar ? "pass" : "warn", ownBar ? "סרגל תחתון משלו, מדלגים" : `${d.layers} שכבות`);
    add(area, "CTA במסך הראשון", d.cta ? "pass" : "warn", d.cta ? `"${d.cta}"` : "לא נמצא קישור ל-/book, וואטסאפ או טלפון");
    if (d.covered !== null && !ownBar) add(area, "ה-CTA לא מכוסה", d.covered > 30 ? "warn" : "pass", `${d.covered}% מכוסה`);
    if (catalog) {
      const outliers = new Set();
      for (const m of d.text.matchAll(/(?:₪\s?([\d,]+)|([\d,]+)\s?(?:₪|ש"ח|ש״ח))/g)) {
        const pre = d.text.slice(Math.max(0, m.index - 25), m.index);
        if (/ערך זמן/.test(pre)) continue;
        const v = Number((m[1] || m[2]).replace(/,/g, ""));
        if (v && !catalog.has(v)) outliers.add(v);
      }
      add(area, "כל המחירים בקטלוג", outliers.size === 0 ? "pass" : "warn", outliers.size ? `לא בקטלוג: ${[...outliers].join(", ")}` : "");
    }
    await page.close();
  }
  await ctx.close();
}

/* ---------- חלק 3: אודיו ---------- */
async function tourAudio(browser) {
  console.log("\n== audio: ניגון הדגמות ==");
  const ctx = await newContext(browser);
  const seen = new Map(); // url -> status
  for (const path of AUDIO_PAGES) {
    const page = await ctx.newPage();
    page.setDefaultTimeout(5000);
    page.on("response", (r) => {
      if (/\.mp3(\?|$)/i.test(r.url())) seen.set(r.url(), r.status());
    });
    const resp = await page.goto(`${BASE}${path}`, { waitUntil: "load" });
    await page.waitForTimeout(1500);
    await scrollThrough(page);
    const area = `audio ${path}`;
    if (resp.status() !== 200) {
      add(area, "נטען", "fail", `status ${resp.status()}`);
      await page.close();
      continue;
    }
    const btn = page.locator('button[aria-label*="הפעל"]:visible, button[aria-label*="נגן"]:visible, button[aria-label*="Play"]:visible').first();
    let method = "אין כפתור";
    if (await btn.count()) {
      try {
        await btn.scrollIntoViewIfNeeded();
        await btn.click({ timeout: 3000 });
        method = "לחיצה";
      } catch {
        method = "לחיצה נכשלה";
      }
    }
    await page.waitForTimeout(3200);
    const read = () =>
      page.evaluate(() => (window.__plays || []).map((r) => ({
        f: decodeURIComponent((r.el.currentSrc || r.el.src || "").split("/").pop()),
        ok: r.el.currentTime > 0.3 && r.el.readyState >= 2 && !r.el.error,
        err: r.el.error ? r.el.error.code : r.result.startsWith("rejected") ? r.result : null,
      })));
    let played = await read();
    if (!played.some((p) => p.ok)) {
      // אין כפתור שהסקריפט מכיר, אבל יש <audio> בעמוד: ניגון ישיר (פחות אמין מלחיצה)
      const domAudio = await page.evaluate(() => document.querySelectorAll("audio").length);
      if (domAudio) {
        await page.evaluate(async () => {
          for (const a of document.querySelectorAll("audio")) await a.play().catch(() => {});
        });
        await page.waitForTimeout(2500);
        played = await read();
        method = "ניגון ישיר";
      }
    }
    const okFiles = played.filter((p) => p.ok).map((p) => p.f);
    const failed = played.filter((p) => p.err).map((p) => `${p.f}:${p.err}`);
    add(area, `ניגון (${method})`, okFiles.length ? "pass" : "fail", okFiles.length ? okFiles.join(", ") : failed.join("; ") || "שום קובץ לא התחיל");
    await page.close();
  }
  // כל קובץ ששמענו עליו: סטטוס, סוג וגודל
  for (const [url, st] of seen) {
    const name = decodeURIComponent(url.split("/").pop());
    const head = await fetch(url, { method: "HEAD" }).catch(() => null);
    const size = Number(head?.headers.get("content-length") || 0);
    const type = head?.headers.get("content-type") || "";
    const ok = st === 200 || st === 206;
    add(`audio file ${name}`, "מוגש כראוי", ok && /audio/.test(type) ? "pass" : "fail", `status ${st}, ${type || "?"}`);
    if (size > MAX_AUDIO_BYTES) add(`audio file ${name}`, "משקל עד 2MB", "warn", `${(size / 1048576).toFixed(2)}MB`);
  }
  await ctx.close();
}

/* ---------- הרצה ודוח ---------- */
const browser = await chromium.launch({ args: ["--autoplay-policy=no-user-gesture-required"] });
console.log(`סיור לקוח: ${BASE}  ->  ${OUT}`);
try {
  if (ONLY.has("book")) await tourBook(browser);
  if (ONLY.has("pages")) await tourPages(browser);
  if (ONLY.has("audio")) await tourAudio(browser);
} finally {
  await browser.close();
}
add("safety", "אף בקשת ליד לא יצאה", leadAttempts.length === 0 ? "pass" : "fail", leadAttempts.join(" | "));

const count = (s) => results.filter((r) => r.status === s).length;
const icon = { pass: "✓", fail: "✗", warn: "!", info: "i" };
const md = [
  `# סיור לקוח, ${DAY}`,
  "",
  `אתר: ${BASE}. הצלחות: ${count("pass")}, כשלים: ${count("fail")}, אזהרות: ${count("warn")}.`,
  "",
  ...["fail", "warn"].flatMap((s) => {
    const rows = results.filter((r) => r.status === s);
    return rows.length ? [`## ${s === "fail" ? "כשלים" : "אזהרות"}`, ...rows.map((r) => `- ${r.area} / ${r.name}: ${r.detail}`), ""] : [];
  }),
  "## הכול",
  "",
  "| | אזור | בדיקה | פרט |",
  "|---|---|---|---|",
  ...results.map((r) => `| ${icon[r.status]} | ${r.area} | ${r.name} | ${r.detail.replace(/\|/g, "/")} |`),
  "",
  "צילומים: תיקיית screens ליד הדוח. השיפוט העיצובי הוא של אדם, לא של הסקריפט.",
].join("\n");
writeFileSync(join(OUT, "report.md"), md);
writeFileSync(join(OUT, "report.json"), JSON.stringify({ base: BASE, day: DAY, results }, null, 2));
console.log(`\nסיכום: ${count("pass")} עברו, ${count("fail")} נכשלו, ${count("warn")} אזהרות. דוח: ${join(OUT, "report.md")}`);
process.exit(count("fail") ? 1 : 0);
