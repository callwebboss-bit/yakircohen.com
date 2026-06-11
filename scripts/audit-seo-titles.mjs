/**
 * Audit page titles for duplicate brand suffix (| יקיר כהן הפקות).
 * Run: node scripts/audit-seo-titles.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const BRAND = "יקיר כהן הפקות";
const SUFFIX = ` | ${BRAND}`;

const SCAN_DIRS = [
  path.join(root, "app"),
  path.join(root, "lib", "data"),
  path.join(root, "components", "seo"),
];

const TITLE_PATTERNS = [
  /metaTitle:\s*["'`]([^"'`]+)["'`]/g,
  /title:\s*["'`]([^"'`]+)["'`]/g,
  /title:\s*`([^`]+)`/g,
];

function walk(dir, files = []) {
  if (!fs.existsSync(dir)) return files;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === "node_modules" || entry.name === ".next") continue;
      walk(full, files);
    } else if (/\.(tsx?|jsx?|mjs)$/.test(entry.name)) {
      files.push(full);
    }
  }
  return files;
}

const issues = [];

for (const dir of SCAN_DIRS) {
  for (const file of walk(dir)) {
    const content = fs.readFileSync(file, "utf8");
    if (!content.includes(BRAND)) continue;

    for (const pattern of TITLE_PATTERNS) {
      pattern.lastIndex = 0;
      let match;
      while ((match = pattern.exec(content)) !== null) {
        const title = match[1].trim();
        if (title.includes(SUFFIX) || title.endsWith(BRAND)) {
          issues.push({ file: path.relative(root, file), title });
        }
      }
    }
  }
}

if (issues.length === 0) {
  console.log("audit:seo-titles — no duplicate brand suffix found");
  process.exit(0);
}

console.log(`audit:seo-titles — ${issues.length} issue(s):`);
for (const { file, title } of issues) {
  console.log(`  ${file}: "${title}"`);
}
process.exit(1);
