/**
 * Ingest blog articles from content/blog-queue.json into lib/data/blog.ts.
 * Run when the user supplies an external article queue file.
 *
 * Usage: node scripts/ingest-blog-queue.mjs [--dry-run]
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const QUEUE_FILE = path.join(ROOT, "content", "blog-queue.json");
const BLOG_FILE = path.join(ROOT, "lib", "data", "blog.ts");
const dryRun = process.argv.includes("--dry-run");

if (!fs.existsSync(QUEUE_FILE)) {
  console.error(`Missing ${QUEUE_FILE}. Add your article queue JSON first.`);
  process.exit(1);
}

const queue = JSON.parse(fs.readFileSync(QUEUE_FILE, "utf8"));
const articles = Array.isArray(queue.articles) ? queue.articles : [];

if (articles.length === 0) {
  console.error("No articles in queue.");
  process.exit(1);
}

const errors = [];
for (const article of articles) {
  if (!article.slug || !article.title) {
    errors.push(`Article missing slug/title: ${JSON.stringify(article).slice(0, 80)}`);
  }
  if (article.content?.includes("—")) {
    errors.push(`${article.slug}: contains em-dash (use -)`);
  }
}

if (errors.length) {
  console.error("Validation failed:\n" + errors.join("\n"));
  process.exit(1);
}

console.log(`Validated ${articles.length} article(s).`);
if (dryRun) {
  console.log("Dry run - no files modified.");
  process.exit(0);
}

console.log(
  "Manual step: merge validated articles into BLOG_POSTS in lib/data/blog.ts (automated patch not implemented yet).",
);
