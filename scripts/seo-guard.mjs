/**
 * seo-guard.mjs - שער אי-הפגיעה של מעבר המיתוג (D135, 14.10.2026).
 *
 * למה עוד שער ליד audit:seo-diff: seo-diff סופר מילים ומשווה מתאר, כי הוא נועד
 * לאשר שינויי ניסוח. מעבר צבע לא אמור לשנות אף תו, ולכן כאן ההשוואה מלאה:
 * title, canonical, כל ה-meta, hreflang, כל הכותרות, כל קישור וטקסט העוגן שלו,
 * כל תמונה וה-alt שלה, כל id, טקסט הגוף המלא ו-JSON-LD מנורמל. בנוסף סטטוס
 * והפניה לכל כתובת, סט הכתובות בשתי מפות האתר ותוכן robots.txt.
 *
 * למה שני שרתים ולא קבצי .next: שישה עמודים דינמיים (/book, /blog וארבעה תחת
 * /online) לא קיימים כ-HTML בבנייה. רק שרת מגיש את כל הכתובות.
 *
 * מה מוסר לפני ההשוואה: script (חוץ מ-ld+json), style, noscript ו-template.
 * מזהה הבנייה ושמות ה-chunks יושבים בתוך ה-scripts ומשתנים בכל בנייה, ו-style
 * הוא בדיוק מה שמעבר צבע אמור לשנות. גם link[rel=icon] לא נבדק: Next מוסיף לו
 * hash של התוכן, ושלב הנכסים מחליף את האייקונים באותם שמות.
 *
 * שימוש:
 *   node scripts/seo-guard.mjs http://localhost:3001 http://localhost:3002
 *   node scripts/seo-guard.mjs --files a.html b.html   ביקורת שלילית על שני קבצים
 *   --allow-meta=theme-color                          היתר מפורש לשדות meta (מופרדים בפסיק)
 *   --concurrency=6
 * הדוח המלא נכתב ל-$TMPDIR/seo-guard-report.json. יציאה 1 על כל הבדל.
 */

import * as cheerio from "cheerio";
import { readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const argv = process.argv.slice(2);
const option = (name) => {
  const hit = argv.find((a) => a.startsWith(`--${name}=`));
  return hit ? hit.slice(name.length + 3) : undefined;
};
const positional = argv.filter((a) => !a.startsWith("--"));
const FILES_MODE = argv.includes("--files");
const ALLOW_META = new Set(
  (option("allow-meta") ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean),
);
const CONCURRENCY = Math.max(1, Number(option("concurrency") ?? 6));
const REPORT = join(tmpdir(), "seo-guard-report.json");

/**
 * שדות שנמצאו רועשים בין שתי בניות של אותו קוד. כל רשומה רק אחרי מדידה, עם
 * נימוק. לעולם לא text או jsonld בשלמותם: שם יושב התוכן שהשער הזה שומר.
 */
const NOISY_FIELDS = new Set([]);

/**
 * שני תגי meta של Sentry בעמודים הדינמיים בלבד: מזהה מעקב ומספר אקראי שונים בכל
 * בקשה, גם מאותו שרת. נמדד 14.10.2026: בבדיקה העצמית (שתי בניות של eb0a8ae3)
 * אלה היו 6 ההבדלים היחידים מתוך 355 כתובות, כולם ב-/book, /blog ו-/online/*.
 * מוחרגים רק שני השמות האלה. כל שאר ה-meta נבדק.
 */
const NOISY_META = new Set(["sentry-trace", "baggage"]);

const norm = (s) => (s || "").replace(/\s+/g, " ").trim();
const sortDeep = (v) =>
  Array.isArray(v)
    ? v.map(sortDeep)
    : v && typeof v === "object"
      ? Object.fromEntries(
          Object.keys(v)
            .sort()
            .map((k) => [k, sortDeep(v[k])]),
        )
      : v;

/** /_next/image?url=%2Fimages%2Fa.webp&w=640 → /images/a.webp. בלי זה כל תמונה נראית זהה */
function imageKey(src) {
  if (!src) return "";
  try {
    const u = new URL(src, "http://local");
    if (u.pathname === "/_next/image") return u.searchParams.get("url") ?? u.pathname;
    return u.host === "local" ? u.pathname : u.host + u.pathname;
  } catch {
    return src;
  }
}

function fingerprint(html) {
  const $ = cheerio.load(html);
  const jsonld = $('script[type="application/ld+json"]')
    .toArray()
    .map((el) => {
      const raw = $(el).text() || $(el).html() || "";
      try {
        return JSON.stringify(sortDeep(JSON.parse(raw)));
      } catch {
        return "UNPARSEABLE:" + norm(raw);
      }
    })
    .sort();
  $("script, style, noscript, template").remove();
  return {
    root: `${$("html").attr("lang") ?? ""}|${$("html").attr("dir") ?? ""}`,
    title: norm($("head title").first().text()),
    canonical: $("link[rel=canonical]").attr("href") ?? "",
    alternates: $("link[rel=alternate]")
      .toArray()
      .map((el) => `${$(el).attr("hreflang") ?? $(el).attr("type") ?? ""}|${$(el).attr("href") ?? ""}`)
      .sort(),
    meta: $("meta")
      .toArray()
      .map((el) => [
        $(el).attr("name") ?? $(el).attr("property") ?? $(el).attr("http-equiv") ?? $(el).attr("itemprop"),
        $(el).attr("content") ?? "",
      ])
      .filter(([k]) => k && !ALLOW_META.has(k) && !NOISY_META.has(k))
      .map(([k, v]) => `${k}=${v}`)
      .sort(),
    headings: $("h1,h2,h3,h4,h5,h6")
      .toArray()
      .map((el) => el.tagName.toLowerCase() + "|" + norm($(el).text())),
    links: $("a[href]")
      .toArray()
      .map((el) => `${$(el).attr("href")}|${norm($(el).text())}|${$(el).attr("rel") ?? ""}`),
    images: $("img")
      .toArray()
      .map((el) => imageKey($(el).attr("src")) + "|" + ($(el).attr("alt") ?? "MISSING")),
    ids: $("[id]")
      .toArray()
      .map((el) => $(el).attr("id"))
      .sort(),
    text: norm($("body").text()),
    jsonld,
  };
}

/** הקשר סביב התו הראשון שונה, במקום 400 התווים הראשונים שבדרך כלל זהים */
function firstDiff(x, y) {
  let i = 0;
  while (i < x.length && i < y.length && x[i] === y[i]) i += 1;
  const from = Math.max(0, i - 80);
  return { at: i, a: x.slice(from, i + 160), b: y.slice(from, i + 160) };
}

function compare(fa, fb) {
  const out = [];
  for (const field of Object.keys(fa)) {
    if (NOISY_FIELDS.has(field)) continue;
    const [x, y] = [JSON.stringify(fa[field]), JSON.stringify(fb[field])];
    if (x !== y) out.push({ field, ...firstDiff(x, y) });
  }
  return out;
}

async function get(url) {
  for (let attempt = 1; ; attempt += 1) {
    try {
      const r = await fetch(url, { redirect: "manual", signal: AbortSignal.timeout(90_000) });
      return {
        status: r.status,
        loc: r.headers.get("location") ?? "",
        html: r.status < 300 ? await r.text() : "",
      };
    } catch (err) {
      if (attempt >= 2) throw new Error(`${url}: ${err.message}`);
    }
  }
}

async function sitemapPaths(base) {
  const xml = await (await fetch(base + "/sitemap.xml")).text();
  return [...new Set([...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname))];
}

function finish(problems, label) {
  writeFileSync(REPORT, JSON.stringify(problems, null, 2));
  if (problems.length) {
    const byField = {};
    for (const p of problems) byField[p.field] = (byField[p.field] ?? 0) + 1;
    console.error(`\nSEO GUARD FAILED: ${problems.length} הבדלים (${label})`);
    console.error("  לפי שדה: " + JSON.stringify(byField));
    for (const p of problems.slice(0, 30)) {
      console.error(`  - ${p.route} ${p.field}` + (p.at !== undefined ? ` @${p.at}` : ""));
    }
    console.error("  דוח מלא: " + REPORT);
    process.exit(1);
  }
  console.log(`\nSEO GUARD PASSED - 0 הבדלים (${label})`);
  console.log("  דוח: " + REPORT);
}

if (FILES_MODE) {
  const [fileA, fileB] = positional;
  if (!fileA || !fileB) {
    console.error("usage: seo-guard.mjs --files <a.html> <b.html>");
    process.exit(2);
  }
  const diffs = compare(fingerprint(readFileSync(fileA, "utf8")), fingerprint(readFileSync(fileB, "utf8")));
  finish(
    diffs.map((d) => ({ route: fileB, ...d })),
    "2 קבצים",
  );
} else {
  const [A, B] = positional.map((u) => u.replace(/\/$/, ""));
  if (!A || !B) {
    console.error("usage: seo-guard.mjs <baseA> <baseB>");
    process.exit(2);
  }
  console.log(`A = ${A}\nB = ${B}` + (ALLOW_META.size ? `\nmeta מותר: ${[...ALLOW_META].join(", ")}` : ""));

  const [routesA, routesB] = await Promise.all([sitemapPaths(A), sitemapPaths(B)]);
  const problems = [];
  const setB = new Set(routesB);
  const setA = new Set(routesA);
  for (const r of routesA) if (!setB.has(r)) problems.push({ route: r, field: "sitemap", a: "present", b: "missing" });
  for (const r of routesB) if (!setA.has(r)) problems.push({ route: r, field: "sitemap", a: "missing", b: "present" });
  /* robots.txt: אינו כתובת במפת האתר, ולכן נבדק בנפרד, כטקסט מלא */
  const [robotsA, robotsB] = await Promise.all([get(A + "/robots.txt"), get(B + "/robots.txt")]);
  if (robotsA.status !== robotsB.status || robotsA.html !== robotsB.html) {
    problems.push({ route: "/robots.txt", field: "robots", ...firstDiff(robotsA.html, robotsB.html) });
  }
  const routes = [...new Set([...routesA, ...routesB])];
  console.log(`routes: ${routes.length} (A ${routesA.length}, B ${routesB.length})`);

  let next = 0;
  let done = 0;
  async function worker() {
    while (next < routes.length) {
      const route = routes[next++];
      const [a, b] = await Promise.all([get(A + route), get(B + route)]);
      if (a.status !== b.status) problems.push({ route, field: "status", a: a.status, b: b.status });
      if (a.loc !== b.loc) problems.push({ route, field: "redirect", a: a.loc, b: b.loc });
      if (a.status < 300 && b.status < 300) {
        for (const d of compare(fingerprint(a.html), fingerprint(b.html))) problems.push({ route, ...d });
      }
      if (++done % 50 === 0) console.log(`${done}/${routes.length}`);
    }
  }
  await Promise.all(Array.from({ length: CONCURRENCY }, worker));
  finish(problems, `${routes.length} כתובות`);
}
