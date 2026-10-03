/**
 * prepare-pagefind.mjs
 *
 * Converts Next.js App Router HTML output from `.next/server/app` into a
 * directory structure that Pagefind will index with clean (no-.html) URLs.
 *
 * Next.js writes: `podcast.html`, `online/vocal-fix.html`, etc.
 * Pagefind indexes those as `/podcast.html`, `/online/vocal-fix.html`.
 *
 * This script converts them to `podcast/index.html`, `online/vocal-fix/index.html`
 * so Pagefind strips `index.html` and produces clean canonical URLs.
 *
 * Output directory: `.pagefind-src` (cleaned up after pagefind runs)
 */

import { readdirSync, statSync, mkdirSync, copyFileSync, rmSync, existsSync, readFileSync } from "fs";
import { join, dirname } from "path";

/*
 * Next 16.3 עם אדפטר (Vercel מפעיל אותו אוטומטית) כותב את ה-HTML שנבנה מראש
 * ל-.next/server/route-cache בשמות של מפתח מטמון, ולא ל-.next/server/app
 * (node_modules/next/dist/build/index.js, getRouteCacheKey). לכן סורקים את כל
 * .next/server ומחליטים על הכתובת לפי ה-canonical שבתוך כל עמוד, וזה עובד בשני
 * המבנים. בפריסה של 1b06ccd ב-Vercel נמצאו 0 קבצים והבנייה נפלה.
 */
const SRC_ROOT = ".next/server";
const DST_DIR = ".pagefind-src";
const SKIP_DIRS = new Set(["pages", "chunks", "edge", "static"]);
const CANONICAL_RE = /<link[^>]+rel="canonical"[^>]+href="https?:\/\/[^/"]+(\/[^"]*)?"/i;

function collectHtml(dir, out) {
  let entries;
  try {
    entries = readdirSync(dir);
  } catch {
    return;
  }
  for (const entry of entries) {
    const full = join(dir, entry);
    const stat = statSync(full);
    if (stat.isDirectory()) {
      if (dir === SRC_ROOT && SKIP_DIRS.has(entry)) continue;
      collectHtml(full, out);
    } else if (entry.endsWith(".html")) {
      out.push(full);
    }
  }
}

if (existsSync(DST_DIR)) {
  rmSync(DST_DIR, { recursive: true, force: true });
}

console.log(`Preparing Pagefind source: ${SRC_ROOT} (app + route-cache) → ${DST_DIR}`);
const files = [];
collectHtml(SRC_ROOT, files);
const seen = new Set();
let written = 0;
for (const file of files) {
  const html = readFileSync(file, "utf8");
  const m = html.match(CANONICAL_RE);
  if (!m) continue;
  const pathname = (m[1] || "/").replace(/\/+$/, "") || "/";
  if (seen.has(pathname)) continue;
  seen.add(pathname);
  const target = pathname === "/" ? join(DST_DIR, "index.html") : join(DST_DIR, pathname, "index.html");
  mkdirSync(dirname(target), { recursive: true });
  copyFileSync(file, target);
  written += 1;
}
console.log(`Done. ${written} pages from ${files.length} HTML files. Run pagefind on .pagefind-src`);
