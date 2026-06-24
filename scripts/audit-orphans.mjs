/**
 * Find sitemap routes with zero inbound internal links in source.
 * Run: node scripts/audit-orphans.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

const SCAN_DIRS = [
  path.join(root, "app"),
  path.join(root, "components"),
  path.join(root, "lib"),
];

const HREF_ATTR_RE = /href=["'{`=]+(\/(?!\/)[^"'#?`$]*?)["'}]/g;
const HREF_OBJ_RE = /href:\s*["'](\/(?!\/)[^"'#?]+)["']/g;

const SKIP_ORPHAN = new Set([
  "/",
  "/thank-you",
  "/privacy",
  "/terms",
  "/accessibility",
  "/online/vocal-fix/send-file",
]);

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

function loadBlogSlugs() {
  const blogSlugsFile = path.join(root, "lib", "data", "blog-slugs.ts");
  if (!fs.existsSync(blogSlugsFile)) return [];
  const blogText = fs.readFileSync(blogSlugsFile, "utf8");
  const match = blogText.match(/export const BLOG_SLUGS = \[([\s\S]*?)\];/);
  if (!match) return [];
  return [...match[1].matchAll(/"([^"]+)"/g)].map((m) => m[1]);
}

function loadOnlineSlugs() {
  const onlineFile = path.join(root, "lib", "data", "online-page.ts");
  if (!fs.existsSync(onlineFile)) return [];
  const text = fs.readFileSync(onlineFile, "utf8");
  return [...text.matchAll(/slug:\s*"([^"]+)"/g)].map((m) => m[1]);
}

function loadSitemapPaths(blogSlugs) {
  const sitemapFile = path.join(root, "app", "sitemap.ts");
  const text = fs.readFileSync(sitemapFile, "utf8");
  const paths = new Set(["/"]);

  for (const match of text.matchAll(/url\(["']?([^"')]+)["']?\)/g)) {
    const raw = match[1];
    if (raw.includes("$") || raw.includes("{")) continue;
    if (raw.startsWith("http")) {
      paths.add(new URL(raw).pathname.replace(/\/+$/, "") || "/");
    } else {
      paths.add(`/${raw.replace(/^\/+/, "").replace(/\/+$/, "")}`);
    }
  }

  for (const slug of blogSlugs) {
    paths.add(`/blog/${slug}`);
  }

  return paths;
}

function collectInboundLinks(blogSlugs, onlineSlugs) {
  const inbound = new Map();
  let hasDynamicBlogLinks = false;
  let hasDynamicOnlineLinks = false;
  const allContents = [];

  for (const dir of SCAN_DIRS) {
    for (const file of walk(dir)) {
      const content = fs.readFileSync(file, "utf8");
      allContents.push(content);

      if (content.includes("/blog/${")) hasDynamicBlogLinks = true;
      if (content.includes("/online/${")) hasDynamicOnlineLinks = true;

      for (const re of [HREF_ATTR_RE, HREF_OBJ_RE]) {
        re.lastIndex = 0;
        let match;
        while ((match = re.exec(content)) !== null) {
          const href = match[1].replace(/\/+$/, "") || "/";
          if (href.includes("$") || href.includes("{")) continue;
          inbound.set(href, (inbound.get(href) ?? 0) + 1);
        }
      }
    }
  }

  if (hasDynamicBlogLinks) {
    for (const slug of blogSlugs) {
      inbound.set(`/blog/${slug}`, (inbound.get(`/blog/${slug}`) ?? 0) + 1);
    }
  }

  if (hasDynamicOnlineLinks) {
    for (const slug of onlineSlugs) {
      inbound.set(`/online/${slug}`, (inbound.get(`/online/${slug}`) ?? 0) + 1);
    }
  }

  return { inbound, allContents };
}

function markPathReferences(inbound, sitemapPaths, allContents) {
  const corpus = allContents.join("\n");
  for (const p of sitemapPaths) {
    if (inbound.has(p)) continue;
    const bare = p.replace(/^\//, "");
    if (bare && corpus.includes(bare)) {
      inbound.set(p, 1);
    }
  }
}

const blogSlugs = loadBlogSlugs();
const onlineSlugs = loadOnlineSlugs();
const sitemapPaths = loadSitemapPaths(blogSlugs);
const { inbound, allContents } = collectInboundLinks(blogSlugs, onlineSlugs);
markPathReferences(inbound, sitemapPaths, allContents);

const orphans = [...sitemapPaths]
  .filter((p) => !SKIP_ORPHAN.has(p))
  .filter((p) => !inbound.has(p))
  .sort();

if (orphans.length === 0) {
  console.log("audit:orphans -- no orphan sitemap URLs detected");
  process.exit(0);
}

console.log(`audit:orphans -- ${orphans.length} sitemap URL(s) with no inbound href:`);
for (const p of orphans) console.log(`  ${p}`);
process.exit(1);
