/**
 * Audit pages with FAQ accordion markup but no FAQPage JSON-LD in source,
 * plus Person/Organization entity checks on site-schema.json.
 * Resolves @/components/**\/*PageContent imports from page.tsx.
 * Also directly scans content component directories.
 * Run: node scripts/audit-schema.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const appDir = path.join(root, "app");
const componentsDir = path.join(root, "components");

/** Directories under components/ that hold pure UI primitives or infrastructure — skip for content scan. */
const SKIP_COMPONENT_DIRS = new Set([
  "ui", "forms", "booking", "blog", "marketing", "services",
  "calculators", "layouts", "providers", "icons",
]);

function walk(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, files);
    else if (/page\.tsx$/.test(entry.name)) files.push(full);
  }
  return files;
}

/** Walk content component directories (skipping UI/infra). */
function walkContentComponents(dir, files = [], depth = 0) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (depth === 0 && SKIP_COMPONENT_DIRS.has(entry.name)) continue;
      walkContentComponents(full, files, depth + 1);
    } else if (/\.tsx$/.test(entry.name)) {
      files.push(full);
    }
  }
  return files;
}

/** True if content uses a FAQ accordion component (import-based, not definition-based). */
function hasFaqUi(content) {
  return (
    /import\s+.*FAQAccordion/.test(content) ||
    /import\s+.*FAQWithCtaLinks/.test(content) ||
    content.includes('aria-labelledby="faq')
  );
}

function hasFaqSchema(content) {
  return (
    content.includes("FaqPageSchema") ||
    content.includes("buildFaqSchema") ||
    content.includes("buildUlpanPageSchema") ||
    content.includes('"@type": "FAQPage"') ||
    content.includes('"@type":"FAQPage"') ||
    content.includes("ServicePageFromRegistry") ||
    (content.includes("ServicePageLayout") &&
      /pagePath\s*=/.test(content) &&
      /faqs\s*=/.test(content))
  );
}

/** Resolve *PageContent (and shell) imports reachable from a page or lib shell. */
function resolveImportedContent(pageContent) {
  const chunks = [];
  const importRe =
    /from\s+["']@\/components\/((?:[A-Za-z0-9_-]+\/)*[A-Za-z0-9]+(?:PageContent|Page|Sections?))["']/g;

  function collectFrom(source) {
    let match;
    while ((match = importRe.exec(source)) !== null) {
      const rel = match[1].replace(/\//g, path.sep);
      for (const ext of [".tsx", ".ts"]) {
        const candidate = path.join(componentsDir, `${rel}${ext}`);
        if (fs.existsSync(candidate)) {
          chunks.push(fs.readFileSync(candidate, "utf8"));
          break;
        }
      }
    }
  }

  collectFrom(pageContent);

  if (pageContent.includes("business-page-shell")) {
    const shellPath = path.join(root, "lib", "business-page-shell.tsx");
    if (fs.existsSync(shellPath)) {
      collectFrom(fs.readFileSync(shellPath, "utf8"));
    }
  }

  return chunks.join("\n");
}

const faqIssues = [];
const seenComponentFiles = new Set();

for (const file of walk(appDir)) {
  const pageContent = fs.readFileSync(file, "utf8");
  const importedContent = resolveImportedContent(pageContent);
  const combined = `${pageContent}\n${importedContent}`;

  const hasUi = hasFaqUi(combined);
  const hasSchema =
    hasFaqSchema(pageContent) || hasFaqSchema(importedContent);

  // Skip noindex pages — FAQ schema won't produce rich results on them
  const isNoindex =
    /index:\s*false/.test(pageContent) ||
    /noindex/.test(pageContent);

  if (hasUi && !hasSchema) {
    if (isNoindex) {
      console.log(`  skip (noindex): ${path.relative(root, file)}`);
    } else {
      faqIssues.push(path.relative(root, file));
    }
  }

  // Track component files already covered via this page's imports (and business shell)
  for (const relPath of [pageContent, importedContent]) {
    const importRe =
      /from\s+["']@\/components\/((?:[A-Za-z0-9_-]+\/)*[A-Za-z0-9]+(?:PageContent|Page|Sections?))["']/g;
    let match;
    while ((match = importRe.exec(relPath)) !== null) {
      const rel = match[1].replace(/\//g, path.sep);
      for (const ext of [".tsx", ".ts"]) {
        const candidate = path.join(componentsDir, `${rel}${ext}`);
        if (fs.existsSync(candidate)) seenComponentFiles.add(candidate);
      }
    }
  }
}

// Directly scan content component files not reachable via page imports
const componentReport = [];
for (const file of walkContentComponents(componentsDir)) {
  if (seenComponentFiles.has(file)) continue;
  const content = fs.readFileSync(file, "utf8");
  const hasUi = hasFaqUi(content);
  const hasSchema = hasFaqSchema(content);
  if (!hasUi) continue; // not a FAQ page — skip
  const status = hasSchema ? "both" : "ui-only";
  componentReport.push({ file: path.relative(root, file), status });
  if (!hasSchema) {
    faqIssues.push(`${path.relative(root, file)} [component-direct]`);
  }
}

if (componentReport.length > 0) {
  console.log("audit:schema -- component FAQ coverage (not reached via page imports):");
  for (const { file, status } of componentReport) {
    console.log(`  ${status === "both" ? "✓" : "✗"} ${file}  [${status}]`);
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
  entityIssues.push("site-schema.json not found -- run npm run generate:schema");
}

const totalIssues = faqIssues.length + entityIssues.length;

if (totalIssues === 0) {
  console.log(
    "audit:schema -- no FAQ UI pages missing FAQPage schema; entity graph OK",
  );
  process.exit(0);
}

if (faqIssues.length > 0) {
  console.log(
    `\naudit:schema -- ${faqIssues.length} page(s) with FAQ UI but no schema:`,
  );
  for (const file of faqIssues) console.log(`  ${file}`);
}

if (entityIssues.length > 0) {
  console.log(`\naudit:schema -- entity issues:`);
  for (const issue of entityIssues) console.log(`  ${issue}`);
}

process.exit(1);
