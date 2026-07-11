/**
 * Ensures sitemap URLs are indexable (not noindex, not redirect-only).
 * Run: node scripts/audit-sitemap-indexable.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

const sitemapSrc = fs.readFileSync(path.join(root, "app/sitemap.ts"), "utf8");
const legacySrc = fs.readFileSync(
  path.join(root, "lib/legacy-redirects.ts"),
  "utf8",
);
const archSrc = fs.readFileSync(
  path.join(root, "lib/site-architecture.ts"),
  "utf8",
);

const urlRe = /url\("([^"]+)"\)/g;
const sitemapPaths = new Set();
let m;
while ((m = urlRe.exec(sitemapSrc)) !== null) {
  sitemapPaths.add(m[1] === "" ? "/" : `/${m[1]}`);
}

const legacyMapRe = /"([^"]+)":\s*"([^"]+)"/g;
const redirectSources = new Set();
while ((m = legacyMapRe.exec(legacySrc)) !== null) {
  redirectSources.add(m[1]);
}

const canonicalRe = /"(\/[^"]+)":\s*"(\/[^"]+)"/g;
while ((m = canonicalRe.exec(archSrc)) !== null) {
  if (m[0].includes("CANONICAL_REDIRECTS")) break;
}
const canonicalBlock = archSrc.match(
  /CANONICAL_REDIRECTS[^=]*=\s*\{([^}]+)\}/s,
);
if (canonicalBlock) {
  const inner = canonicalBlock[1];
  const pairRe = /"(\/[^"]+)":\s*"(\/[^"]+)"/g;
  while ((m = pairRe.exec(inner)) !== null) {
    redirectSources.add(m[1]);
  }
}

const NOINDEX_PAGES = [
  "/for-couples",
  "/for-creators",
  "/online/vocal-fix/send-file",
  "/courses",
  "/equipment/used-gear",
  "/voucher",
  "/thank-you",
];

const errors = [];

for (const p of sitemapPaths) {
  const norm = p === "/" ? "/" : p.replace(/\/$/, "");
  if (redirectSources.has(norm)) {
    errors.push(`${norm}: in sitemap but is a redirect source`);
  }
  if (NOINDEX_PAGES.includes(norm)) {
    errors.push(`${norm}: in sitemap but should be noindex or redirect-only`);
  }
}

if (errors.length) {
  console.error("audit:sitemap-indexable failed:\n" + errors.map((e) => `  - ${e}`).join("\n"));
  process.exit(1);
}

console.log(`audit:sitemap-indexable OK (${sitemapPaths.size} URLs checked)`);
