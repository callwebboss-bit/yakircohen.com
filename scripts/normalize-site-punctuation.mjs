/**
 * מחליף סימני פיסוק "רובוטיים" בתוכן האתר:
 * -- – → - | מרכאות מעוקלות → ישרות | · ← → מוסרים/מוחלפים
 *
 * Usage: node scripts/normalize-site-punctuation.mjs
 *        node scripts/normalize-site-punctuation.mjs --check
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const CHECK_ONLY = process.argv.includes("--check");

const SKIP_DIRS = new Set([
  "node_modules",
  ".next",
  "docs",
  "scripts",
  "public",
  ".cursor",
  ".git",
]);

const SKIP_FILE_RE = /\.(test|spec)\.(ts|tsx|mjs|js)$/;

const SCAN_ROOTS = ["components", "lib", "app", "hooks"];

function normalizeText(text) {
  let out = text;
  out = out.replace(/\u2014/g, "-");
  out = out.replace(/\u2013/g, "-");
  out = out.replace(/\u2015/g, "-");
  out = out.replace(/[\u201C\u201D\u2033\u2036]/g, '"');
  out = out.replace(/[\u2018\u2019\u2032\u2035]/g, "'");
  out = out.replace(/\u00AB/g, "");
  out = out.replace(/\u00BB/g, "");
  out = out.replace(/\u00B7/g, "-");
  out = out.replace(/\u2219/g, "-");
  out = out.replace(/\s*←\s*/g, " ");
  out = out.replace(/\s*→\s*/g, " ");
  return out;
}

function shouldSkipDir(name) {
  return SKIP_DIRS.has(name);
}

function shouldProcessFile(relPath) {
  if (!/\.(tsx?|mdx)$/.test(relPath)) return false;
  if (SKIP_FILE_RE.test(relPath)) return false;
  if (relPath.startsWith("lib/analytics/")) return false;
  return true;
}

function walk(dir, files = []) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    if (ent.isDirectory()) {
      if (shouldSkipDir(ent.name)) continue;
      walk(path.join(dir, ent.name), files);
    } else if (ent.isFile()) {
      const full = path.join(dir, ent.name);
      const rel = path.relative(ROOT, full).replace(/\\/g, "/");
      if (shouldProcessFile(rel)) files.push(full);
    }
  }
  return files;
}

const counts = {
  emDash: 0,
  enDash: 0,
  curlyDouble: 0,
  curlySingle: 0,
  middleDot: 0,
  arrows: 0,
};

function countMatches(text) {
  counts.emDash += (text.match(/\u2014/g) ?? []).length;
  counts.enDash += (text.match(/\u2013/g) ?? []).length;
  counts.curlyDouble += (text.match(/[\u201C\u201D\u2033\u2036]/g) ?? []).length;
  counts.curlySingle += (text.match(/[\u2018\u2019\u2032\u2035]/g) ?? []).length;
  counts.middleDot += (text.match(/\u00B7/g) ?? []).length;
  counts.arrows += (text.match(/[←→]/g) ?? []).length;
}

let changedFiles = 0;

for (const scanRoot of SCAN_ROOTS) {
  const abs = path.join(ROOT, scanRoot);
  if (!fs.existsSync(abs)) continue;
  for (const file of walk(abs)) {
    const before = fs.readFileSync(file, "utf8");
    countMatches(before);
    const after = normalizeText(before);
    if (after !== before) {
      changedFiles += 1;
      if (!CHECK_ONLY) fs.writeFileSync(file, after, "utf8");
    }
  }
}

if (CHECK_ONLY) {
  console.log("[normalize-site-punctuation] dry-run:", { ...counts, files: changedFiles });
} else {
  console.log(`[normalize-site-punctuation] updated ${changedFiles} files`);
  console.log(
    "[normalize-site-punctuation] replaced:",
    `--×${counts.emDash}`,
    `–×${counts.enDash}`,
    `""×${counts.curlyDouble}`,
    `''×${counts.curlySingle}`,
    `·×${counts.middleDot}`,
    `arrows×${counts.arrows}`,
  );
}
