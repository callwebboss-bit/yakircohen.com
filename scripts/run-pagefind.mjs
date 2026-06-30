#!/usr/bin/env node
/**
 * Run Pagefind and fail the build if zero pages were indexed.
 */
import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const ENTRY = path.join(ROOT, "public", "pagefind", "pagefind-entry.json");

execSync(
  "pagefind --site .pagefind-src --output-path public/pagefind --force-language he",
  { stdio: "inherit", cwd: ROOT },
);

if (!fs.existsSync(ENTRY)) {
  console.error("pagefind: missing pagefind-entry.json");
  process.exit(1);
}

const entry = JSON.parse(fs.readFileSync(ENTRY, "utf8"));
const count = entry.languages?.he?.page_count ?? 0;

if (count < 1) {
  console.error(`pagefind: indexed 0 pages — check .pagefind-src HTML output`);
  process.exit(1);
}

console.log(`pagefind: indexed ${count} pages (he)`);
