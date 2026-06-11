/**
 * Audit pages with FAQ accordion markup but no FAQPage JSON-LD in source.
 * Run: node scripts/audit-schema.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const appDir = path.join(root, "app");

function walk(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, files);
    else if (/page\.tsx$/.test(entry.name)) files.push(full);
  }
  return files;
}

const issues = [];

for (const file of walk(appDir)) {
  const content = fs.readFileSync(file, "utf8");
  const hasFaqUi =
    content.includes("FAQAccordion") ||
    content.includes("FAQWithCtaLinks") ||
    content.includes('aria-labelledby="faq');
  const hasFaqSchema =
    content.includes("FaqPageSchema") ||
    content.includes('"@type": "FAQPage"') ||
    content.includes('"@type":"FAQPage"');

  if (hasFaqUi && !hasFaqSchema) {
    issues.push(path.relative(root, file));
  }
}

if (issues.length === 0) {
  console.log("audit:schema — no FAQ UI pages missing FAQPage schema");
  process.exit(0);
}

console.log(`audit:schema — ${issues.length} page(s) with FAQ UI but no schema:`);
for (const file of issues) console.log(`  ${file}`);
process.exit(1);
