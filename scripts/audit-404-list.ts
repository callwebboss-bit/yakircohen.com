/**
 * Cross-check a Google Search Console "Page indexing -> Not found (404)"
 * export against this site's known routes and redirects.
 *
 * Usage: npm run audit:404 -- path/to/export.csv
 *
 * For each 404 path in the export:
 * - if it matches a known route or an existing redirect source, it's stale
 *   GSC data that should clear after the next recrawl.
 * - otherwise, it's a real gap - add a redirect for it in
 *   lib/legacy-redirects.ts.
 */
import fs from "node:fs";
import path from "node:path";
import { getLegacyRedirects } from "../lib/legacy-redirects";
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
  if (!line || /^(url|page|address)$/i.test(line)) return null;

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

const file = process.argv[2];
if (!file) {
  console.error("Usage: npm run audit:404 -- path/to/export.csv");
  process.exit(1);
}

const absFile = path.resolve(process.cwd(), file);
const lines = fs.readFileSync(absFile, "utf8").split(/\r?\n/);

const routes = collectRoutes(appDir);
routes.add("/");

const redirects = getLegacyRedirects();
const staticSources = new Set(redirects.filter((r) => !r.source.includes(":")).map((r) => r.source));
const patternRegexes = redirects
  .map((r) => patternToRegex(r.source))
  .filter((re): re is RegExp => re !== null);

const handled: string[] = [];
const missing: string[] = [];
const seen = new Set<string>();

for (const rawLine of lines) {
  const p = normalize(rawLine);
  if (!p || seen.has(p)) continue;
  seen.add(p);

  if (routes.has(p) || staticSources.has(p) || patternRegexes.some((re) => re.test(p))) {
    handled.push(p);
  } else {
    missing.push(p);
  }
}

console.log(`Checked ${seen.size} unique paths from ${file}`);

console.log("\n=== Already handled - stale GSC entries (should clear after recrawl) ===\n");
if (handled.length === 0) console.log("(none)");
else handled.sort().forEach((p) => console.log(p));

console.log("\n=== Needs a new redirect in lib/legacy-redirects.ts ===\n");
if (missing.length === 0) console.log("(none)");
else missing.sort().forEach((p) => console.log(p));
