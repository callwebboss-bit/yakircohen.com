/**
 * Nav coverage audit — Zero Lead Loss gate for Header + Footer.
 * Run: npm run audit:nav-coverage
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  SITE_NAVIGATION,
  HEADER_PRIMARY_NAV,
  HEADER_MORE_SERVICES_NAV,
  SITE_GLOBAL_LINKS,
  type SiteNavCategory,
} from "../lib/site-architecture";
import { FOOTER_SEMANTIC_TREE } from "../lib/seo-footer-links";
import {
  PROTECTED_PATHS,
  MIN_HUB_SUPPORT_LINKS,
} from "../lib/seo/protected-paths";
import {
  FOOTER_EXTRA_LINKS,
  FOOTER_LEGAL_LINKS,
  NAV_HUBS,
} from "../lib/constants";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const HUB_ROOT_EXCEPTIONS = new Set([
  "/studio",
  "/podcast",
  "/events",
  "/business",
  "/online",
  "/pro",
  "/academy",
  "/video",
  "/photography",
  "/voiceover",
  "/events/attractions",
]);

const MONEY_PAGES = [
  "/studio/recording-song-modiin",
  "/studio/blessings",
  "/studio/studio-jerusalem",
  "/studio/studio-shoham",
  "/studio/studio-rehovot",
  "/studio/pricing",
  "/podcast/podcast-recording",
  "/podcast/podcast-editing",
  "/podcast/mobile-podcast-at-home",
  "/events/dj-events",
  "/events/wedding-attractions-packages",
  "/events/stage-led-dj",
  "/online/vocal-fix",
  "/voiceover/services",
  "/pricing",
  "/about/faq",
  "/book",
].map(normalizeHref);

function normalizeHref(href: string | undefined): string {
  if (!href) return "";
  let clean = href.trim().split("#")[0].split("?")[0];
  if (clean.endsWith("/") && clean.length > 1) {
    clean = clean.slice(0, -1);
  }
  if (clean.startsWith("http")) return "";
  return clean;
}

function flattenCategory(cat: SiteNavCategory): string[] {
  const paths: string[] = [];
  if (cat.href) paths.push(normalizeHref(cat.href));
  if (cat.featured) {
    for (const f of cat.featured) {
      if (f.href) paths.push(normalizeHref(f.href));
    }
  }
  for (const c of cat.children) {
    if (c.href) paths.push(normalizeHref(c.href));
  }
  return paths.filter(Boolean);
}

function collectHeaderPaths(): Set<string> {
  const headerPaths = new Set<string>();
  for (const item of HEADER_PRIMARY_NAV) {
    if (item.kind === "dropdown") {
      for (const p of flattenCategory(item.category)) {
        headerPaths.add(p);
      }
    } else if (item.kind === "link" && item.href) {
      headerPaths.add(normalizeHref(item.href));
    }
  }
  for (const p of flattenCategory(HEADER_MORE_SERVICES_NAV)) {
    headerPaths.add(p);
  }
  return headerPaths;
}

function collectFooterPaths(): Set<string> {
  const footerPaths = new Set<string>();
  for (const section of FOOTER_SEMANTIC_TREE) {
    for (const link of section.links) {
      footerPaths.add(normalizeHref(link.href));
    }
  }
  for (const link of FOOTER_EXTRA_LINKS) {
    footerPaths.add(normalizeHref(link.href));
  }
  for (const link of FOOTER_LEGAL_LINKS) {
    footerPaths.add(normalizeHref(link.href));
  }
  for (const link of NAV_HUBS) {
    footerPaths.add(normalizeHref(link.href));
  }
  return footerPaths;
}

function collectFullNavPaths(): Set<string> {
  const fullNavPaths = new Set<string>();
  for (const cat of SITE_NAVIGATION) {
    for (const p of flattenCategory(cat)) {
      fullNavPaths.add(p);
    }
  }
  return fullNavPaths;
}

function collectGlobalPaths(): Set<string> {
  return new Set(
    SITE_GLOBAL_LINKS.map((l) => normalizeHref(l.href)).filter(Boolean),
  );
}

function countInbound(
  target: string,
  headerPaths: Set<string>,
  footerPaths: Set<string>,
  globalPaths: Set<string>,
): number {
  let count = 0;
  if (headerPaths.has(target)) count++;
  if (footerPaths.has(target)) count++;
  if (globalPaths.has(target)) count++;
  return count;
}

const args = process.argv.slice(2);
const headerPaths = collectHeaderPaths();
const footerPaths = collectFooterPaths();
const fullNavPaths = collectFullNavPaths();
const globalPaths = collectGlobalPaths();
const footerSources = new Set([...footerPaths, ...globalPaths]);

let hasFailed = false;
const gaps: string[] = [];
const navGaps: string[] = [];

console.log("audit:nav-coverage -- summary");
console.log(`  full_nav: ${fullNavPaths.size} unique paths`);
console.log(`  header:   ${headerPaths.size} unique paths`);
console.log(`  footer:   ${footerPaths.size} unique paths`);

for (const page of MONEY_PAGES) {
  const inHeader = headerPaths.has(page);
  const inFooter = footerSources.has(page);
  if (!inHeader && !inFooter) {
    console.error(
      `audit:nav-coverage -- CRITICAL: money page missing from header and footer: ${page}`,
    );
    gaps.push(page);
    hasFailed = true;
  }
}

for (const protectedPath of PROTECTED_PATHS) {
  const target = normalizeHref(protectedPath);
  const count = countInbound(target, headerPaths, footerPaths, globalPaths);
  if (count < 2) {
    console.error(
      `audit:nav-coverage -- PROTECTED PATH: ${target} has only ${count} inbound path(s), requires 2`,
    );
    hasFailed = true;
  }
}

for (const navPath of fullNavPaths) {
  if (HUB_ROOT_EXCEPTIONS.has(navPath)) continue;
  if (headerPaths.has(navPath)) continue;
  if (footerSources.has(navPath)) continue;
  navGaps.push(navPath);
}

if (navGaps.length > 0) {
  console.error(
    `audit:nav-coverage -- ${navGaps.length} nav path(s) not in header or footer:`,
  );
  for (const p of navGaps.sort()) {
    console.error(`  ${p}`);
  }
  hasFailed = true;
}

for (const [hub, expectedLinks] of Object.entries(MIN_HUB_SUPPORT_LINKS)) {
  for (const link of expectedLinks) {
    const target = normalizeHref(link);
    if (!headerPaths.has(target) && !footerSources.has(target)) {
      console.warn(
        `audit:nav-coverage -- HUB SUPPORT: ${target} for hub ${hub} not in header/footer (ensure hub page links it)`,
      );
    }
  }
}

const baselineDir = path.join(__dirname, "baselines");
const baselineFile = path.join(baselineDir, "nav-coverage.json");

if (args.includes("--write-baseline")) {
  if (!fs.existsSync(baselineDir)) fs.mkdirSync(baselineDir, { recursive: true });
  fs.writeFileSync(
    baselineFile,
    JSON.stringify(
      {
        header: [...headerPaths].sort(),
        footer: [...footerPaths].sort(),
        gaps: [...gaps, ...navGaps].sort(),
      },
      null,
      2,
    ),
  );
  console.log(`audit:nav-coverage -- baseline saved to scripts/baselines/nav-coverage.json`);
}

if (args.includes("--compare-baseline")) {
  if (!fs.existsSync(baselineFile)) {
    console.error("audit:nav-coverage -- baseline file not found; run with --write-baseline first");
    process.exit(1);
  }
  const baseline = JSON.parse(fs.readFileSync(baselineFile, "utf8")) as {
    gaps?: string[];
  };
  const baselineGaps = new Set(baseline.gaps ?? []);
  const newGaps = [...gaps, ...navGaps].filter((g) => !baselineGaps.has(g));
  if (newGaps.length > 0) {
    console.error(`audit:nav-coverage -- ${newGaps.length} new gap(s) vs baseline:`);
    for (const g of newGaps.sort()) console.error(`  ${g}`);
    hasFailed = true;
  }
}

if (hasFailed) {
  console.error("audit:nav-coverage -- FAILED");
  process.exit(1);
}

console.log("audit:nav-coverage -- PASSED");
process.exit(0);
