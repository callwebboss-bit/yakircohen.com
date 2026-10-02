/**
 * Cross-check a Google Search Console "Page indexing -> Not found (404)"
 * export against this site's known routes and redirects.
 *
 * Usage: npm run audit:404 -- path/to/export.csv [--live <base>]
 *
 * For each 404 path in the export:
 * - if it matches a known route or an existing redirect source, it's stale
 *   GSC data that should clear after the next recrawl.
 * - otherwise, it's a real gap - add a redirect for it in
 *   lib/legacy-redirects.ts.
 *
 * --live <base>: בנוסף לבדיקה מול המפה, שולח בקשה לכל נתיב עברי בקובץ ודורש
 * תגובה אמיתית: 301/308 בקפיצה הראשונה ו-200 בסוף השרשרת (נתיב מת דורש 410).
 * למה: עד עכשיו "handled" פירושו היה "המפתח קיים במפה", וכל 214 המפתחות
 * העבריים היו במפה ובכל זאת החזירו 404 באתר החי (ED-01). רק תגובה אמיתית
 * מוכיחה שההפניה עובדת.
 * להריץ מול שרת מקומי או preview, למשל
 *   npm run audit:404 -- export.csv --live http://localhost:3200
 * הנתיב נשלח בלי לוכסן סופי, כי עם לוכסן Next מחזיר 308 משלו (הסרת הלוכסן)
 * גם לנתיב שאין לו הפניה, וזה היה עובר בטעות.
 */
import fs from "node:fs";
import path from "node:path";
import {
  GONE_EXACT_PATHS,
  GONE_PATH_PREFIXES,
  getLegacyRedirects,
} from "../lib/legacy-redirects";
import { getAllBlogSlugs } from "../lib/data/blog-slugs";

const root = path.join(import.meta.dirname, "..");
const appDir = path.join(root, "app");

const DYNAMIC_SEGMENT_RE = /^\[.+\]$/;

function collectRoutes(dir: string, base = ""): Set<string> {
  const routes = new Set<string>();
  if (!fs.existsSync(dir)) return routes;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    if (entry.name.startsWith("(") && entry.name.endsWith(")")) {
      for (const r of collectRoutes(path.join(dir, entry.name), base)) routes.add(r);
      continue;
    }
    if (entry.name.startsWith("_")) continue;

    const segment = entry.name;
    const full = path.join(dir, entry.name);

    if (DYNAMIC_SEGMENT_RE.test(segment)) {
      if (segment === "[slug]" && base === "/blog") {
        for (const slug of getAllBlogSlugs()) routes.add(`${base}/${slug}`);
      }
      for (const r of collectRoutes(full, base)) routes.add(r);
      continue;
    }

    const nextBase = base ? `${base}/${segment}` : `/${segment}`;
    if (fs.existsSync(path.join(full, "page.tsx"))) {
      routes.add(nextBase === "/page" ? "/" : nextBase);
    }
    for (const r of collectRoutes(full, nextBase)) routes.add(r);
  }
  return routes;
}

/** Convert a Next.js redirect `source` pattern ending in `/:name*` to a RegExp. */
function patternToRegex(source: string): RegExp | null {
  const match = source.match(/^(.*)\/:[A-Za-z0-9_]+\*$/);
  if (!match) return null;
  const base = match[1].replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`^${base}(?:/.*)?$`);
}

function normalize(rawLine: string): string | null {
  let line = rawLine.trim().replace(/^"|"$/g, "").replace(/,$/, "");
  /* שורת הכותרת, גם בייצוא העברי של Search Console ("כתובת אתר,נסרק לאחרונה") */
  if (!line || /^(url|page|address|כתובת אתר)(,|$)/i.test(line)) return null;

  const urlMatch = line.match(/https?:\/\/[^\s",]+/);
  if (urlMatch) line = urlMatch[0];

  try {
    const url = new URL(line, "https://yakircohen.com");
    line = decodeURIComponent(url.pathname);
  } catch {
    line = decodeURIComponent(line.split(/[?#]/)[0]);
  }

  if (!line.startsWith("/")) line = `/${line}`;
  if (line.length > 1) line = line.replace(/\/$/, "");
  return line;
}

const args = process.argv.slice(2);
const liveIdx = args.indexOf("--live");
const liveBase = liveIdx === -1 ? null : args[liveIdx + 1];
if (liveIdx !== -1) {
  if (!liveBase || !/^https?:\/\//.test(liveBase)) {
    console.error("--live needs a base URL, e.g. --live http://localhost:3200");
    process.exit(1);
  }
  args.splice(liveIdx, 2);
}
const file = args[0];
if (!file) {
  console.error("Usage: npm run audit:404 -- path/to/export.csv [--live <base>]");
  process.exit(1);
}

const absFile = path.resolve(process.cwd(), file);
const lines = fs.readFileSync(absFile, "utf8").split(/\r?\n/);

const routes = collectRoutes(appDir);
routes.add("/");

const redirects = getLegacyRedirects();
/* המקורות במפה מקודדים באחוזים (toNextSource), והנתיבים מהקובץ מפוענחים
   ב-normalize. משווים בצורה המפוענחת. */
function safeDecode(p: string): string {
  try {
    return decodeURI(p);
  } catch {
    return p;
  }
}
const staticSources = new Set(
  redirects.filter((r) => !r.source.includes(":")).map((r) => safeDecode(r.source)),
);
const patternRegexes = redirects
  .map((r) => patternToRegex(r.source))
  .filter((re): re is RegExp => re !== null);

/* נתיבים שמקבלים 410 ב-proxy.ts. בלי זה הכלי היה ממליץ להוסיף להם הפניה,
   בדיוק ההפך ממה שנכון: הם אמורים להיעלם מהאינדקס, לא להיות מופנים. */
function isGonePath(p: string): boolean {
  const clean = p.replace(/\/+$/, "") || "/";
  return (
    (GONE_EXACT_PATHS as readonly string[]).includes(clean) ||
    (GONE_PATH_PREFIXES as readonly string[]).some(
      (prefix) => clean === prefix || clean.startsWith(`${prefix}/`),
    )
  );
}

const handled: string[] = [];
const gone: string[] = [];
const missing: string[] = [];
const seen = new Set<string>();

for (const rawLine of lines) {
  const p = normalize(rawLine);
  if (!p || seen.has(p)) continue;
  seen.add(p);

  if (isGonePath(p)) {
    gone.push(p);
  } else if (
    routes.has(p) ||
    staticSources.has(p) ||
    patternRegexes.some((re) => re.test(p))
  ) {
    handled.push(p);
  } else {
    missing.push(p);
  }
}

console.log(`Checked ${seen.size} unique paths from ${file}`);

console.log("\n=== Already handled - stale GSC entries (should clear after recrawl) ===\n");
if (handled.length === 0) console.log("(none)");
else handled.sort().forEach((p) => console.log(p));

console.log("\n=== Intentionally 410 Gone (no redirect wanted - should drop out of the index) ===\n");
if (gone.length === 0) console.log("(none)");
else gone.sort().forEach((p) => console.log(p));

console.log("\n=== Needs a new redirect in lib/legacy-redirects.ts ===\n");
if (missing.length === 0) console.log("(none)");
else missing.sort().forEach((p) => console.log(p));

/* ---------------------------------------------------------------- --live */

const HEBREW_RE = /[\u0590-\u05FF]/;
const MAX_HOPS = 5;

type LiveResult = { path: string; ok: boolean; chain: string };

/* שרת dev מקומי מאתחל את עצמו כשהזיכרון מתקרב לסף ("restarting..."), ובזמן
   הזה החיבור נדחה. ניסיון חוזר קצר מבדיל בין זה לבין כשל אמיתי. */
async function fetchWithRetry(url: string, attempts = 4): Promise<Response> {
  for (let i = 1; ; i++) {
    try {
      return await fetch(url, { redirect: "manual" });
    } catch (err) {
      if (i >= attempts) throw err;
      await new Promise((r) => setTimeout(r, 3000));
    }
  }
}

async function checkLive(base: string, p: string): Promise<LiveResult> {
  const origin = new URL(base).origin;
  const expectGone = isGonePath(p);
  let url = new URL(encodeURI(p), base).href;
  const hops: string[] = [];
  for (let hop = 0; hop <= MAX_HOPS; hop++) {
    let res: Response;
    try {
      res = await fetchWithRetry(url);
    } catch (err) {
      return { path: p, ok: false, chain: `${hops.join(" ")} fetch failed: ${(err as Error).message}` };
    }
    const location = res.headers.get("location");
    hops.push(String(res.status));

    if (hop === 0) {
      if (expectGone) return { path: p, ok: res.status === 410, chain: `${res.status} (expect 410)` };
      if (res.status !== 301 && res.status !== 308) {
        return { path: p, ok: false, chain: `${res.status} (expect 301/308)` };
      }
    }
    if ((res.status === 301 || res.status === 308 || res.status === 307 || res.status === 302) && location) {
      const next = new URL(location, url);
      hops.push(`-> ${safeDecode(next.pathname)}${next.search}`);
      /* יעד חיצוני (וואטסאפ) הוא סוף השרשרת מבחינתנו. לא שולחים אליו בקשה. */
      if (next.origin !== origin) return { path: p, ok: true, chain: `${hops.join(" ")} (external)` };
      url = next.href;
      continue;
    }
    return { path: p, ok: res.status === 200, chain: hops.join(" ") };
  }
  return { path: p, ok: false, chain: `${hops.join(" ")} (more than ${MAX_HOPS} hops)` };
}

async function runLive(base: string): Promise<void> {
  const targets = [...seen].filter((p) => HEBREW_RE.test(p)).sort();
  console.log(`\n=== --live ${base}: ${targets.length} Hebrew paths (need 301/308 then 200; gone paths need 410) ===\n`);

  const results: LiveResult[] = [];
  const queue = [...targets];
  /* מקביליות נמוכה: שרת dev מקמפל כל יעד בפעם הראשונה */
  await Promise.all(
    Array.from({ length: 4 }, async () => {
      for (let p = queue.shift(); p !== undefined; p = queue.shift()) {
        results.push(await checkLive(base, p));
      }
    }),
  );
  results.sort((a, b) => a.path.localeCompare(b.path));

  const failed = results.filter((r) => !r.ok);
  for (const r of results) console.log(`${r.ok ? "OK  " : "FAIL"} ${r.path}  ${r.chain}`);
  console.log(`\n--live summary: ${results.length - failed.length} ok, ${failed.length} failed`);
  if (failed.length > 0) process.exitCode = 1;
}

/* בלי top-level await: הקובץ רץ ב-tsx כ-CommonJS (אין "type": "module") */
if (liveBase) {
  runLive(liveBase).catch((err) => {
    console.error(err);
    process.exitCode = 1;
  });
}
