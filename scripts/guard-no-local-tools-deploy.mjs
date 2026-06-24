/**
 * Fail CI/Vercel build if local-tools / yakir-closer artifacts appear in the deploy tree.
 * local-tools/ lives beside yakircohen-site -- it must never land in public/ or app/.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");

const BLOCKED_BASENAMES = new Set([
  "yakir-closer.html",
  "closer-config.js",
  "closer-config.json",
  "closer-site-sync.js",
  "closer-brand-copy.js",
  "closer-reply-builders.js",
  "local-tools",
]);

const SKIP_DIRS = new Set(["node_modules", ".next", ".git", "pagefind", ".pagefind-src"]);

function scanDir(dir, hits) {
  if (!fs.existsSync(dir)) return;
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    if (SKIP_DIRS.has(ent.name)) continue;
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) {
      if (BLOCKED_BASENAMES.has(ent.name)) {
        hits.push(full);
        continue;
      }
      scanDir(full, hits);
      continue;
    }
    if (BLOCKED_BASENAMES.has(ent.name) || /yakir-closer/i.test(ent.name)) {
      hits.push(full);
    }
  }
}

const hits = [];
for (const rel of ["public", "app", "components", "lib"]) {
  scanDir(path.join(root, rel), hits);
}

const publicLocalTools = path.join(root, "public", "local-tools");
if (fs.existsSync(publicLocalTools)) hits.push(publicLocalTools);

if (hits.length) {
  console.error("\n⛔ DEPLOY BLOCKED -- local-tools must never ship with the site:\n");
  for (const h of hits) {
    console.error("  •", path.relative(root, h));
  }
  console.error(
    "\nRemove these paths from yakircohen-site. Closer stays in ../local-tools/ (Dropbox/local only).\n",
  );
  process.exit(1);
}

console.log("guard:local-tools ok -- no closer artifacts in site deploy tree");
