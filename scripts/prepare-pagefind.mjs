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

import { readdirSync, statSync, mkdirSync, copyFileSync, rmSync, existsSync } from "fs";
import { join, basename } from "path";

const SRC_DIR = ".next/server/app";
const DST_DIR = ".pagefind-src";

const SKIP_PREFIXES = ["_", "("];

function shouldSkip(name) {
  return SKIP_PREFIXES.some((p) => name.startsWith(p));
}

function processDir(srcDir, dstDir) {
  let entries;
  try {
    entries = readdirSync(srcDir);
  } catch {
    return;
  }

  for (const entry of entries) {
    if (shouldSkip(entry)) continue;

    const srcPath = join(srcDir, entry);
    const stat = statSync(srcPath);

    if (stat.isDirectory()) {
      processDir(srcPath, join(dstDir, entry));
    } else if (entry.endsWith(".html")) {
      const stem = basename(entry, ".html");
      // Convert page.html → page/index.html so Pagefind strips index.html → /page
      const targetDir = join(dstDir, stem);
      mkdirSync(targetDir, { recursive: true });
      copyFileSync(srcPath, join(targetDir, "index.html"));
    }
    // Skip .rsc, .meta, .segments files
  }
}

// Clean previous run
if (existsSync(DST_DIR)) {
  rmSync(DST_DIR, { recursive: true, force: true });
}

console.log(`Preparing Pagefind source: ${SRC_DIR} → ${DST_DIR}`);
processDir(SRC_DIR, DST_DIR);
console.log("Done. Run pagefind on .pagefind-src");
