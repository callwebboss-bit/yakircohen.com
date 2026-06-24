import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const APP_DIR = path.join(ROOT, "app");
const PAGE_CONTENT_DIR = path.join(ROOT, "components", "seo");

const HEADING_RE = /<h([1-6])\b[^>]*>/gi;
/** Page delegates h1 to a layout/content wrapper. */
const DELEGATES_H1 =
  /ServicePageLayout|ServicePageFromRegistry|HomeHero|HomePageSections|PageContent|SeoShellPage|LegalPageLayout|BusinessServicePage/;
const REDIRECT_ONLY = /redirect\s*\(/;

function walkPages(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.name === "node_modules" || e.name === ".next") continue;
    const full = path.join(dir, e.name);
    if (e.isDirectory()) walkPages(full, out);
    else if (e.name === "page.tsx" || e.name.endsWith("PageContent.tsx")) {
      out.push(full);
    }
  }
  return out;
}

function stripComments(text) {
  return text.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/.*$/gm, "");
}

function extractLevels(text) {
  const levels = [];
  let m;
  HEADING_RE.lastIndex = 0;
  while ((m = HEADING_RE.exec(text))) levels.push(Number(m[1]));
  return levels;
}

const issues = [];
const files = [
  ...walkPages(APP_DIR),
  ...walkPages(PAGE_CONTENT_DIR).filter((f) => f.endsWith("PageContent.tsx")),
];

for (const file of files) {
  const raw = fs.readFileSync(file, "utf8");
  const text = stripComments(raw);
  const levels = extractLevels(text);
  const rel = path.relative(ROOT, file);

  if (file.includes(`${path.sep}app${path.sep}`) && file.endsWith("page.tsx")) {
    const h1 = levels.filter((l) => l === 1).length;
    const delegated = DELEGATES_H1.test(text) || REDIRECT_ONLY.test(text);
    if (h1 !== 1 && !delegated) {
      issues.push({ rel, kind: "h1-count", detail: `h1=${h1} (no ServicePageLayout/HomeHero)` });
    }
  }

  for (let i = 1; i < levels.length; i++) {
    if (levels[i] > levels[i - 1] + 1) {
      issues.push({
        rel,
        kind: "skip",
        detail: `h${levels[i - 1]} → h${levels[i]}`,
      });
      break;
    }
  }
}

if (issues.length === 0) {
  console.log(`audit-headings: OK (${files.length} page files)`);
  process.exit(0);
}

console.log(`audit-headings: ${issues.length} issue(s)\n`);
for (const i of issues) {
  console.log(`  [${i.kind}] ${i.rel} -- ${i.detail}`);
}
process.exit(1);
