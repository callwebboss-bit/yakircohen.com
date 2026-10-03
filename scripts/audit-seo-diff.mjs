/**
 * audit:seo-diff - שער אי-הפגיעה. מוכיח שאף אות שסורק קורא לא נחלש.
 *
 * למה זה קיים: התוכנית לשיפור העיצוב והנגישות נוגעת במאות קבצים על אתר
 * חי שמייצר הכנסה. הבעלים קבע תנאי אחד: אסור לגרוע ממה שעובד ואסור
 * להחליש אות נראות. אין דרך להוכיח את זה בעין. צריך מדידה לכל כתובת,
 * לפני ואחרי, ועצירה על כל הבדל שלא אושר במפורש.
 *
 * מה הוא בודק לכל כתובת ב-HTML הבנוי:
 *   title · meta description · canonical · meta robots · hreflang
 *   h1 (טקסט מלא) · מתאר h2-h4 · og:image
 *   קישורים יוצאים · קישורים נכנסים · ספירת מילים גלויות
 *   תמונות וכיסוי alt
 *   סוגי ה-@type ב-JSON-LD · ומפתחות המאפיינים בכל סוג
 * ובנוסף, ברמת האתר: מספר וסט הכתובות במפת האתר, תוכן robots.txt,
 * ומספר הכתובות ב-llms.txt.
 *
 * למה קישורים נכנסים ולא רק יוצאים: קישור פנימי הוא אות כוח לעמוד
 * שמקבל אותו. מחיקת רכיב ניווט אחד יכולה להוריד חמישים קישורים נכנסים
 * מעמוד מסוים, ובדיקה שסופרת רק את הקישורים שיוצאים מכל עמוד תדווח על
 * חמישים ירידות קטנות במקום על נזק אחד גדול ומרוכז.
 *
 * למה גם מפתחות המאפיינים ולא רק הסוגים: סבב התכנון גילה פריט שהיה
 * מסיר את dateModified מ-72 צמתי BlogPosting. סט הסוגים לא היה משתנה,
 * ובדיקה שמשווה סוגים בלבד הייתה מאשרת מחיקת מאפיין מ-72 עמודים.
 *
 * למה ספירת מילים ולא השוואת טקסט: השוואת טקסט מלא נכשלת על כל שינוי
 * ניסוח מאושר ומייצרת רעש. ספירה תופסת את מה שחשוב, כלומר גריעה.
 *
 * מה הוא לא מכסה, ואומר את זה במפורש:
 *  1. תוכן שמרונדר רק אחרי JavaScript. הבדיקה קוראת את ה-HTML של השרת.
 *  2. איכות התוכן. ספירת מילים לא יודעת אם הטקסט טוב.
 *  3. דירוג. אין כאן שום טענה על מיקום בתוצאות.
 *  4. מסלולים דינמיים שאינם מרונדרים מראש.
 *  5. שני קבצים פנימיים, _not-found ו-_global-error, מדולגים לפי אותה
 *     מוסכמת קידומת שכבר קיימת ב-prepare-pagefind. לכן 316 כתובות ולא 318.
 *     שניהם noindex, אבל זה חוסר כיסוי ולא החלטה מנומקת, וכדאי לסגור אותו
 *     אם עמוד ה-404 יקבל תוכן שחשוב לשמר.
 *  6. שינוי שאושר בטעות. רשימת האישורים היא באחריות הבעלים.
 *
 * שימוש:
 *   node scripts/audit-seo-diff.mjs --write-baseline   כתיבת בסיס
 *   node scripts/audit-seo-diff.mjs                    השוואה, ברירת מחדל
 *   node scripts/audit-seo-diff.mjs --json             פלט מכונה
 *
 * בסיס חסר אינו מדלג. הוא נכשל. בדיקה שעוברת בלי בסיס היא בדיוק
 * הכשל ש-audit:a11y סבל ממנו: ירוק אחרי אפס עמודים.
 */
import { readdirSync, statSync, readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { join, relative, sep } from "node:path";

const BUILD_DIR = ".next/server/app";
const BASELINE = "scripts/baselines/seo-pages.json";
const APPROVED = "scripts/baselines/seo-approved-changes.json";
const SKIP_PREFIXES = ["_", "("];

const args = process.argv.slice(2);
const WRITE = args.includes("--write-baseline");
/* --origin=http://localhost:3210 מאפשר לכסות גם עמודים דינמיים (ראה למטה). */
const ORIGIN = (args.find((a) => a.startsWith("--origin=")) || "").slice("--origin=".length) || process.env.SEO_DIFF_ORIGIN || "";
/* --remote: אל תקרא את .next כלל; משוך את כל כתובות מפת האתר מ---origin.
   זה מצב האימות אחרי פריסה: הבסיס הוא הבנייה שאושרה, וה"נוכחי" הוא האתר
   החי. כל הבדל שמדווח כ"אבד" הוא משהו שהאתר החי חסר לעומת המועמד. */
const REMOTE = args.includes("--remote");
if (REMOTE && !ORIGIN) {
  console.error("  ✗ --remote דורש --origin=https://...");
  process.exit(1);
}
const JSON_OUT = args.includes("--json");

/* ---------- איסוף קבצים, אותו הילוך כמו prepare-pagefind ---------- */

function walk(dir, out = []) {
  let entries;
  try {
    entries = readdirSync(dir);
  } catch {
    return out;
  }
  for (const entry of entries) {
    if (SKIP_PREFIXES.some((p) => entry.startsWith(p))) continue;
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) walk(full, out);
    else if (entry.endsWith(".html")) out.push(full);
  }
  return out;
}

function toUrl(file) {
  const rel = relative(BUILD_DIR, file).split(sep).join("/");
  const noExt = rel.replace(/\.html$/, "");
  return noExt === "index" ? "/" : "/" + noExt;
}

/* ---------- חילוץ ---------- */

const attr = (tag, name) => {
  const m = tag.match(new RegExp(name + '="([^"]*)"', "i"));
  return m ? m[1] : null;
};

function metaByName(html, name) {
  const re = new RegExp('<meta[^>]*name="' + name + '"[^>]*>', "i");
  const m = html.match(re);
  return m ? attr(m[0], "content") : null;
}

function metaByProperty(html, prop) {
  const re = new RegExp('<meta[^>]*property="' + prop + '"[^>]*>', "i");
  const m = html.match(re);
  return m ? attr(m[0], "content") : null;
}

function linkByRel(html, rel) {
  const re = new RegExp('<link[^>]*rel="' + rel + '"[^>]*>', "gi");
  return [...html.matchAll(re)].map((m) => attr(m[0], "href")).filter(Boolean);
}

function hreflangs(html) {
  const out = {};
  for (const m of html.matchAll(/<link[^>]*rel="alternate"[^>]*>/gi)) {
    const lang = attr(m[0], "hreflang");
    const href = attr(m[0], "href");
    if (lang && href) out[lang] = href;
  }
  return out;
}

const stripTags = (s) =>
  s
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#(\d+);/g, (_, d) => String.fromCharCode(+d))
    .replace(/\s+/g, " ")
    .trim();

function headings(html, level) {
  const re = new RegExp("<h" + level + "\\b[^>]*>([\\s\\S]*?)</h" + level + ">", "gi");
  return [...html.matchAll(re)].map((m) => stripTags(m[1])).filter(Boolean);
}

function visibleWordCount(html) {
  const body = html.match(/<body[^>]*>([\s\S]*)<\/body>/i);
  let text = body ? body[1] : html;
  text = text
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, " ")
    .replace(/<template[\s\S]*?<\/template>/gi, " ")
    .replace(/<!--[\s\S]*?-->/g, " ");
  const words = stripTags(text).split(/\s+/).filter((w) => w.length > 0);
  return words.length;
}

function internalLinks(html) {
  const set = new Set();
  for (const m of html.matchAll(/href="(\/[^"#?]*)"/g)) {
    let href = m[1];
    /* /_next/ הוא פלט הבנייה, ושמו נושא גיבוב שמשתנה בכל בנייה.
       בלי הסינון הזה כל 316 הכתובות היו מדווחות על שינוי קישורים
       בכל בנייה מחדש, השומר היה צועק תמיד, ולכן היו מפסיקים להקשיב לו.
       כל שאר הכתובות נשארות, כולל manifest, feed ו-favicon: אלה יעדים
       יציבים שהיעלמותם היא רגרסיה אמיתית שצריך לתפוס. */
    if (href.startsWith("/_next/")) continue;
    if (href.length > 1) href = href.replace(/\/$/, "");
    set.add(href);
  }
  return [...set].sort();
}

/* סוגי JSON-LD ומפתחות המאפיינים שלהם. עובר על גרפים מקוננים,
   כי build-site-schema פולט @graph ועמודים פולטים צמתים מקוננים. */
function jsonLd(html) {
  const types = new Set();
  const props = {};
  /* ספירת צמתים לכל @type. סט המפתחות הוא איחוד על כל הצמתים מאותו סוג,
     ולכן מחיקת price מ-15 מתוך 16 Offer, או מחצית זוגות השאלה-תשובה
     ב-FAQPage, לא שינתה אותו. הספירה תופסת בדיוק את זה. סבב ביקורת 16.9.2026. */
  const counts = {};
  const visit = (node) => {
    if (Array.isArray(node)) return node.forEach(visit);
    if (!node || typeof node !== "object") return;
    const t = node["@type"];
    const names = Array.isArray(t) ? t : t ? [t] : [];
    for (const name of names) {
      types.add(name);
      counts[name] = (counts[name] || 0) + 1;
      props[name] = props[name] || new Set();
      for (const k of Object.keys(node)) props[name].add(k);
    }
    for (const v of Object.values(node)) visit(v);
  };
  for (const m of html.matchAll(
    /<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi,
  )) {
    try {
      visit(JSON.parse(m[1]));
    } catch {
      types.add("__PARSE_ERROR__");
    }
  }
  const propsOut = {};
  for (const [k, v] of Object.entries(props)) propsOut[k] = [...v].sort();
  return { types: [...types].sort(), props: propsOut, counts };
}

/* מאיזה מקור נבנה הבסיס. בלי זה, בסיס שנלכד על עץ עבודה מלוכלך נראה
   זהה לבסיס שנלכד על קומיט נקי, ואי אפשר לדעת בדיעבד מה בדיוק נמדד. */
function gitState() {
  const run = (args) => {
    try {
      return execFileSync("git", args, { encoding: "utf8" }).trim();
    } catch {
      return null;
    }
  };
  const dirty = run(["status", "--porcelain"]);
  return {
    gitHead: run(["rev-parse", "--short", "HEAD"]),
    uncommittedFiles: dirty ? dirty.split("\n").length : 0,
  };
}

function buildId() {
  try {
    return readFileSync(".next/BUILD_ID", "utf8").trim();
  } catch {
    return null;
  }
}

function extract(file) {
  return extractHtml(readFileSync(file, "utf8"));
}

function extractHtml(html) {
  const titleM = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  const ld = jsonLd(html);
  const imgs = [...html.matchAll(/<img\b[^>]*>/gi)];
  return {
    title: titleM ? stripTags(titleM[1]) : null,
    description: metaByName(html, "description"),
    canonical: linkByRel(html, "canonical")[0] || null,
    robots: metaByName(html, "robots"),
    hreflang: hreflangs(html),
    ogImage: metaByProperty(html, "og:image"),
    h1: headings(html, 1),
    outline: [2, 3, 4].flatMap((l) => headings(html, l).map((t) => "h" + l + ":" + t)),
    links: internalLinks(html),
    words: visibleWordCount(html),
    ldTypes: ld.types,
    ldProps: ld.props,
    ldCounts: ld.counts,
    images: imgs.length,
    imagesWithAlt: imgs.filter((m) => /alt="[^"]+"/.test(m[0])).length,
    suspenseHidden: /<div hidden id="S:/.test(html),
  };
}

/* אותות ברמת האתר, לא ברמת העמוד. שלושתם קבצים שסורקים קוראים
   ישירות, ואף אחד מהם לא מופיע ב-HTML של עמוד כלשהו. */
function siteSignals() {
  const read = (f) => (existsSync(f) ? readFileSync(f, "utf8") : null);
  const sitemap = read(".next/server/app/sitemap.xml.body") || read(".next/server/app/sitemap.xml");
  const robots = read(".next/server/app/robots.txt.body") || read(".next/server/app/robots.txt");
  const llms = read("public/llms.txt");
  return {
    sitemapUrls: sitemap ? [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]).sort() : null,
    robotsText: robots ? robots.replace(/\s+/g, " ").trim() : null,
    llmsUrlCount: llms ? (llms.match(/yakircohen\.com/g) || []).length : null,
  };
}

/* ---------- הרצה ---------- */

if (!existsSync(BUILD_DIR)) {
  console.error("\naudit:seo-diff");
  console.error("  ✗ אין בנייה ב-" + BUILD_DIR + ".");
  console.error("  תיקון: npm run build:full, ואז להריץ שוב.\n");
  process.exit(1);
}

const files = REMOTE ? [] : walk(BUILD_DIR);
const pages = {};
for (const f of files) pages[toUrl(f)] = extract(f);

/* מצב remote: מפת האתר נמשכת מהמקור עצמו, וכל כתובת בה נמשכת ונמדדת. */
let remoteSite = null;
if (REMOTE) {
  const res = await fetch(ORIGIN + "/sitemap.xml", { signal: AbortSignal.timeout(30_000) });
  if (!res.ok) { console.error("  ✗ sitemap.xml לא נמשך מ-" + ORIGIN + ": HTTP " + res.status); process.exit(1); }
  const xml = await res.text();
  const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());
  const robots = await fetch(ORIGIN + "/robots.txt").then((r) => (r.ok ? r.text() : null)).catch(() => null);
  const llms = await fetch(ORIGIN + "/llms.txt").then((r) => (r.ok ? r.text() : null)).catch(() => null);
  remoteSite = {
    sitemapUrls: urls,
    robotsText: robots,
    llmsUrlCount: llms ? (llms.match(/https?:\/\/[^\s)]+/g) || []).length : null,
  };
  const paths = [...new Set(urls.map((u) => { try { const p = new URL(u).pathname.replace(/\/$/, ""); return p || "/"; } catch { return u; } }))];
  console.log("  remote: " + paths.length + " כתובות ממפת האתר של " + ORIGIN);
  let done = 0;
  const queue = [...paths];
  const worker = async () => {
    while (queue.length) {
      const path = queue.shift();
      try {
        const r = await fetch(ORIGIN + path, { signal: AbortSignal.timeout(30_000), headers: { "user-agent": "audit-seo-diff/remote" } });
        if (!r.ok) { console.error("  ✗ " + path + " HTTP " + r.status); continue; }
        pages[path] = { ...extractHtml(await r.text()), remote: true };
      } catch (error) {
        console.error("  ✗ " + path + ": " + error.message);
      }
      done += 1;
      if (done % 50 === 0) process.stdout.write("  " + done + "/" + paths.length + "\n");
    }
  };
  await Promise.all(Array.from({ length: 6 }, worker));
}

/* עמודים דינמיים: כתובות במפת האתר שאין להן קובץ HTML בבנייה.
   /book, /blog וארבעה עמודי online קוראים searchParams ולכן מרונדרים בכל
   בקשה. עד עכשיו השומר לא ראה אותם כלל, כלומר עמוד ההזמנה, מסלול ההכנסה,
   לא היה מכוסה באף שלב. עם --origin הם נמשכים מהשרת הרץ ונמדדים כמו
   כל עמוד אחר, ומסומנים dynamic. בלי --origin (למשל ב-CI, שאין בו שרת)
   הם מדולגים בהודעה מפורשת, לא בשקט, ולא נחשבים "נעלמו מהבנייה". */
const toPath = (u) => {
  try {
    const p = new URL(u).pathname.replace(/\/$/, "");
    return p || "/";
  } catch {
    return u;
  }
};
const dynamicPaths = REMOTE
  ? []
  : [...new Set((siteSignals().sitemapUrls || []).map(toPath))].filter((p) => !pages[p]);
if (ORIGIN && dynamicPaths.length) {
  for (const path of dynamicPaths) {
    try {
      const res = await fetch(ORIGIN + path, { signal: AbortSignal.timeout(30_000) });
      if (!res.ok) throw new Error("HTTP " + res.status);
      pages[path] = { ...extractHtml(await res.text()), dynamic: true };
    } catch (error) {
      console.error("  ✗ עמוד דינמי " + path + " לא נמשך מ-" + ORIGIN + ": " + error.message);
      process.exit(1);
    }
  }
  console.log("  " + dynamicPaths.length + " עמודים דינמיים נמשכו מהשרת: " + dynamicPaths.join(", "));
} else if (dynamicPaths.length) {
  console.log(
    "  הערה: " + dynamicPaths.length + " עמודים דינמיים אינם מכוסים בהרצה זו (אין --origin): " +
      dynamicPaths.join(", "),
  );
}

const urlCount = Object.keys(pages).length;

/* גרף הקישורים הפנימי. לכל כתובת, כמה עמודים אחרים מקשרים אליה.
   מחושב אחרי שכל העמודים נקראו, כי אי אפשר לדעת את זה מעמוד אחד. */
{
  const inbound = {};
  for (const url of Object.keys(pages)) inbound[url] = 0;
  for (const [from, page] of Object.entries(pages)) {
    for (const to of page.links) {
      if (to !== from && inbound[to] !== undefined) inbound[to] += 1;
    }
  }
  for (const [url, page] of Object.entries(pages)) page.inbound = inbound[url];
}

const site = REMOTE ? remoteSite : siteSignals();

if (urlCount === 0) {
  console.error("\naudit:seo-diff");
  console.error("  ✗ אפס כתובות נמצאו ב-" + BUILD_DIR + ". בדיקה שעוברת על אפס עמודים היא בדיקה מזויפת.\n");
  process.exit(1);
}

if (WRITE) {
  mkdirSync("scripts/baselines", { recursive: true });
  writeFileSync(
    BASELINE,
    JSON.stringify(
      {
        capturedAt: new Date().toISOString(),
        buildId: buildId(),
        ...gitState(),
        urlCount,
        site,
        pages,
      },
      null,
      2,
    ) + "\n",
  );
  console.log("\naudit:seo-diff");
  console.log("  בסיס נכתב: " + BASELINE);
  console.log("  " + urlCount + " כתובות, " + files.length + " קבצי HTML.\n");
  process.exit(0);
}

if (!existsSync(BASELINE)) {
  console.error("\naudit:seo-diff");
  console.error("  ✗ אין בסיס ב-" + BASELINE + ".");
  console.error("  בלי בסיס אי אפשר להוכיח אי-פגיעה, ולכן זו שגיאה ולא דילוג.");
  console.error("  תיקון: node scripts/audit-seo-diff.mjs --write-baseline על בנייה ירוקה.\n");
  process.exit(1);
}

const base = JSON.parse(readFileSync(BASELINE, "utf8"));
const approved = existsSync(APPROVED) ? JSON.parse(readFileSync(APPROVED, "utf8")) : { changes: [] };
const approvedUsed = new Set();

const isApproved = (url, field) => {
  const hit = approved.changes.find(
    (c) => (c.url === url || c.url === "*") && (c.field === field || c.field === "*"),
  );
  if (hit) approvedUsed.add(approved.changes.indexOf(hit));
  return Boolean(hit);
};

const problems = [];
const skippedDynamic = [];

/* בלי --origin אין HTML לעמוד דינמי, ולכן אי אפשר למדוד אותו. אבל אפשר
   לוודא שהמסלול עדיין קיים בבנייה: app-paths-manifest מונה כל page.tsx
   שנבנה. מחיקת app/book/page.tsx בזמן שמפת האתר עוד מונה את /book הייתה
   עוברת בשקט כ"דולג", וזה עמוד ההכנסה. סבב ביקורת 16.9.2026. */
const MANIFEST = ".next/server/app-paths-manifest.json";
const manifestRoutes =
  !REMOTE && existsSync(MANIFEST)
    ? Object.keys(JSON.parse(readFileSync(MANIFEST, "utf8"))).map((key) => {
        /* קבוצות מסלול נמחקות, /page יורד, ומקטע דינמי [x] הופך לתבנית:
           ארבעת ה-hubs של /online יושבים תחת /online/[category]/page. */
        const path = key.replace(/\/\([^)]+\)/g, "").replace(/\/page$/, "") || "/";
        const pattern = path
          .split("/")
          .map((seg) => {
            if (/^\[\.\.\..+\]$/.test(seg)) return ".+";
            if (/^\[.+\]$/.test(seg)) return "[^/]+";
            return seg.replace(/[.*+?^${}()|\\]/g, (ch) => "\\" + ch);
          })
          .join("/");
        return new RegExp("^" + pattern + "$");
      })
    : null;
const routeBuilt = (url) => !manifestRoutes || manifestRoutes.some((re) => re.test(url));

const note = (url, field, msg) => {
  if (!isApproved(url, field)) problems.push({ url, field, msg });
};

const sameSet = (a, b) => a.length === b.length && a.every((v, i) => v === b[i]);

/* קישורים נכנסים, תפוחים מול תפוחים. הבסיס נלכד עם --origin ולכן כלל את
   ששת העמודים הדינמיים ואת הקישורים היוצאים מהם. הרצה בלי --origin מודדת
   316 עמודים, ואז כל עמוד שהפוטר מקשר אליו "ירד" מ-317 ל-311 בלי שדבר
   השתנה: 117 רגרסיות מזויפות על אותה בנייה בדיוק (נמדד 16.9.2026). לכן
   ספירת הבסיס מחושבת מחדש מרשימות הקישורים השמורות בו, רק על העמודים
   שנמדדו בהרצה הזו. */
const measured = new Set(Object.keys(pages));
const baseInbound = {};
for (const [from, p] of Object.entries(base.pages)) {
  if (!measured.has(from) || !Array.isArray(p.links)) continue;
  for (const to of p.links) if (to !== from) baseInbound[to] = (baseInbound[to] || 0) + 1;
}

for (const [url, was] of Object.entries(base.pages)) {
  const now = pages[url];
  if (!now) {
    if (was.dynamic && !ORIGIN) {
      if (routeBuilt(url)) {
        skippedDynamic.push(url);
        continue;
      }
      note(url, "exists", "עמוד דינמי שמסלולו אינו ב-app-paths-manifest: המסלול נמחק מהבנייה");
      continue;
    }
    note(url, "exists", "הכתובת נעלמה מהבנייה");
    continue;
  }
  for (const f of ["title", "description", "canonical", "robots", "ogImage"]) {
    if (was[f] !== now[f]) note(url, f, was[f] + "  ->  " + now[f]);
  }
  if (JSON.stringify(was.hreflang) !== JSON.stringify(now.hreflang))
    note(url, "hreflang", JSON.stringify(was.hreflang) + " -> " + JSON.stringify(now.hreflang));
  if (!sameSet(was.h1, now.h1)) note(url, "h1", was.h1.join(" | ") + "  ->  " + now.h1.join(" | "));
  if (!sameSet(was.outline, now.outline)) {
    const lost = was.outline.filter((h) => !now.outline.includes(h));
    note(url, "outline", lost.length ? "כותרות שאבדו: " + lost.join(" | ") : "סדר הכותרות השתנה");
  }
  const lostLinks = was.links.filter((l) => !now.links.includes(l));
  if (lostLinks.length) note(url, "links", lostLinks.length + " קישורים פנימיים אבדו: " + lostLinks.slice(0, 5).join(", "));
  if (now.words < was.words) note(url, "words", was.words + " -> " + now.words + " מילים");
  const wasInbound = Array.isArray(was.links) ? (baseInbound[url] || 0) : was.inbound;
  if (typeof wasInbound === "number" && now.inbound < wasInbound)
    note(url, "inbound", "קישורים נכנסים: " + wasInbound + " -> " + now.inbound);
  if (typeof was.images === "number" && now.images < was.images)
    note(url, "images", "תמונות: " + was.images + " -> " + now.images);
  if (typeof was.imagesWithAlt === "number" && now.imagesWithAlt < was.imagesWithAlt)
    note(url, "imagesWithAlt", "תמונות עם alt: " + was.imagesWithAlt + " -> " + now.imagesWithAlt);
  const lostTypes = was.ldTypes.filter((t) => !now.ldTypes.includes(t));
  if (lostTypes.length) note(url, "ldTypes", "סוגי סכמה שאבדו: " + lostTypes.join(", "));
  for (const [type, keys] of Object.entries(was.ldProps)) {
    const nowKeys = now.ldProps[type] || [];
    const lostKeys = keys.filter((k) => !nowKeys.includes(k));
    if (lostKeys.length) note(url, "ldProps", type + " איבד מאפיינים: " + lostKeys.join(", "));
  }
  for (const [type, n] of Object.entries(was.ldCounts || {})) {
    const nowN = (now.ldCounts || {})[type] || 0;
    if (nowN < n) note(url, "ldCounts", type + ": " + n + " -> " + nowN + " צמתים בסכמה");
  }
}

/* אותות ברמת האתר. בסיס ישן בלי הסעיף הזה מדלג ואומר זאת. */
if (base.site) {
  const b = base.site;
  if (b.sitemapUrls && site.sitemapUrls) {
    const lost = b.sitemapUrls.filter((u) => !site.sitemapUrls.includes(u));
    if (lost.length)
      note("site", "sitemap", lost.length + " כתובות ירדו ממפת האתר: " + lost.slice(0, 5).join(", "));
  }
  {
    const dup = site.sitemapUrls.filter((u, i) => site.sitemapUrls.indexOf(u) !== i);
    if (dup.length) note("site", "sitemap", dup.length + " כתובות מופיעות פעמיים במפת האתר: " + dup.slice(0, 5).join(", "));
  }
  if (b.robotsText && site.robotsText && b.robotsText !== site.robotsText)
    note("site", "robots", "robots.txt השתנה");
  if (typeof b.llmsUrlCount === "number" && site.llmsUrlCount < b.llmsUrlCount)
    note("site", "llms", "כתובות ב-llms.txt: " + b.llmsUrlCount + " -> " + site.llmsUrlCount);
} else {
  console.log("  הערה: הבסיס נלכד לפני שנוספו אותות ברמת האתר. לכתוב בסיס מחדש כדי לכסות אותם.");
}

const added = Object.keys(pages).filter((u) => !base.pages[u]);
const staleApprovals = approved.changes
  .map((c, i) => ({ c, i }))
  .filter(({ i }) => !approvedUsed.has(i));

if (JSON_OUT) {
  console.log(JSON.stringify({ problems, added, staleApprovals: staleApprovals.map((s) => s.c) }, null, 2));
}

console.log("\naudit:seo-diff");
console.log("  בסיס: " + base.urlCount + " כתובות (" + base.capturedAt + ")");
console.log("  בנייה נוכחית: " + urlCount + " כתובות");
if (skippedDynamic.length)
  console.log("  דולגו " + skippedDynamic.length + " עמודים דינמיים מהבסיס (אין --origin): " + skippedDynamic.join(", "));
if (added.length) console.log("  כתובות חדשות: " + added.length + " (" + added.slice(0, 5).join(", ") + ")");

let failed = false;

if (problems.length) {
  failed = true;
  console.error("\n  ✗ " + problems.length + " רגרסיות שלא אושרו:\n");
  for (const p of problems.slice(0, 60)) console.error("    " + p.url + " · " + p.field + " · " + p.msg);
  if (problems.length > 60) console.error("    ... ועוד " + (problems.length - 60));
  console.error("");
}

if (staleApprovals.length) {
  failed = true;
  console.error("  ✗ " + staleApprovals.length + " אישורים ב-" + APPROVED + " לא תאמו שום הבדל.");
  console.error("    אישור מת משתיק בדיקה. למחוק אותו:\n");
  for (const { c } of staleApprovals) console.error("    " + c.url + " · " + c.field + " · " + (c.why || ""));
  console.error("");
}

if (failed) {
  console.error("  תיקון: או לבטל את השינוי, או להוסיף רשומה מנומקת ל-" + APPROVED);
  console.error('  בצורה { "url": "/x", "field": "words", "why": "הסבר" }, באישור הבעלים.\n');
  process.exit(1);
}

console.log(
  "  תקין. אף כותרת, קנוניקל, h1, קישור יוצא או נכנס, מילה, תמונה, alt,\n" +
    "  מאפיין סכמה, כתובת במפת האתר או שורה ב-robots לא אבדו.\n",
);
