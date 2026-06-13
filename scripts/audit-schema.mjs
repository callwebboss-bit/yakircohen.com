/**
 * Audit pages with FAQ accordion markup but no FAQPage JSON-LD in source,
 * plus Person/Organization entity checks on site-schema.json.
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

const faqIssues = [];

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
    faqIssues.push(path.relative(root, file));
  }
}

const entityIssues = [];
const schemaPath = path.join(root, "lib", "seo", "site-schema.json");

if (fs.existsSync(schemaPath)) {
  const schema = JSON.parse(fs.readFileSync(schemaPath, "utf8"));
  const graph = schema["@graph"] ?? [];

  const org = graph.find((n) => n["@type"] === "Organization");
  const person = graph.find((n) => n["@type"] === "Person");

  if (!org?.founder) {
    entityIssues.push("Organization missing founder");
  }
  if (!org?.sameAs?.length) {
    entityIssues.push("Organization missing sameAs");
  }
  if (!person) {
    entityIssues.push("Person node missing from @graph");
  } else {
    if (!person.sameAs?.length) {
      entityIssues.push("Person missing sameAs");
    }
    if (!person.image) {
      entityIssues.push("Person missing image");
    }
    if (!person.knowsAbout?.length) {
      entityIssues.push("Person missing knowsAbout");
    }
  }
} else {
  entityIssues.push("site-schema.json not found — run npm run generate:schema");
}

const totalIssues = faqIssues.length + entityIssues.length;

if (totalIssues === 0) {
  console.log(
    "audit:schema — no FAQ UI pages missing FAQPage schema; entity graph OK",
  );
  process.exit(0);
}

if (faqIssues.length > 0) {
  console.log(
    `audit:schema — ${faqIssues.length} page(s) with FAQ UI but no schema:`,
  );
  for (const file of faqIssues) console.log(`  ${file}`);
}

if (entityIssues.length > 0) {
  console.log(`audit:schema — entity issues:`);
  for (const issue of entityIssues) console.log(`  ${issue}`);
}

process.exit(1);
