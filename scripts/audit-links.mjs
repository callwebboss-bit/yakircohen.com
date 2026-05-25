import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const APP_DIR = path.join(ROOT, "app");
const SCAN_DIRS = [
  path.join(ROOT, "components"),
  path.join(ROOT, "lib"),
  path.join(ROOT, "app"),
];

const HREF_RE = /href=["'](\/(?!\/)[^"'#?]*?)["']/g;
const IMG_SRC_RE = /(?:src|thumbnail):\s*["'](\/images\/[^"']+)["']/g;
const DYNAMIC_SEGMENT_RE = /^\[.+\]$/;

function walk(dir, ext, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (e.name === "node_modules" || e.name === ".next") continue;
      walk(full, ext, out);
    } else if (ext.some((x) => e.name.endsWith(x))) {
      out.push(full);
    }
  }
  return out;
}

function loadBlogSlugs() {
  const blogFile = path.join(ROOT, "lib", "data", "blog.ts");
  if (!fs.existsSync(blogFile)) return [];
  const text = fs.readFileSync(blogFile, "utf8");
  return [...text.matchAll(/^\s*slug:\s*"([^"]+)"/gm)].map((m) => m[1]);
}

function expandDynamicRoutes(baseRoute, dirName) {
  if (dirName === "[slug]" && baseRoute === "/blog") {
    return loadBlogSlugs().map((slug) => `${baseRoute}/${slug}`);
  }
  return [];
}

function collectRoutes(dir, base = "") {
  const routes = new Set();
  if (!fs.existsSync(dir)) return routes;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (!e.isDirectory()) continue;
    if (e.name.startsWith("(") && e.name.endsWith(")")) {
      for (const r of collectRoutes(path.join(dir, e.name), base)) routes.add(r);
      continue;
    }
    if (e.name.startsWith("_")) continue;

    const segment = e.name;
    const full = path.join(dir, e.name);

    if (DYNAMIC_SEGMENT_RE.test(segment)) {
      const parentBase = base || "";
      for (const expanded of expandDynamicRoutes(parentBase, segment)) {
        routes.add(expanded);
      }
      for (const r of collectRoutes(full, parentBase)) routes.add(r);
      continue;
    }

    const nextBase = base ? `${base}/${segment}` : `/${segment}`;
    const hasPage = fs.existsSync(path.join(full, "page.tsx"));
    if (hasPage) routes.add(nextBase === "/page" ? "/" : nextBase);
    for (const r of collectRoutes(full, nextBase)) routes.add(r);
  }
  return routes;
}

const files = [];
for (const dir of SCAN_DIRS) walk(dir, [".tsx", ".ts", ".mjs"], files);

const hrefs = new Set();
const imagePaths = new Set();

for (const file of files) {
  const text = fs.readFileSync(file, "utf8");
  let m;
  while ((m = HREF_RE.exec(text)) !== null) {
    const href = m[1].replace(/\/$/, "") || "/";
    if (!href.includes("${")) hrefs.add(href);
  }
  while ((m = IMG_SRC_RE.exec(text)) !== null) {
    imagePaths.add(m[1]);
  }
}

const routes = collectRoutes(APP_DIR);
routes.add("/");

const missingRoutes = [...hrefs].filter((h) => !routes.has(h)).sort();
const missingImages = [...imagePaths]
  .filter((p) => {
    const abs = path.join(
      ROOT,
      "public",
      p.replace(/^\//, "").split("/").join(path.sep),
    );
    return !fs.existsSync(abs);
  })
  .sort();

console.log("ROUTES_FOUND:", routes.size);
console.log("INTERNAL_HREFS:", hrefs.size);
console.log("\n=== Broken internal links (href with no page.tsx) ===\n");
if (missingRoutes.length === 0) console.log("(none)");
else missingRoutes.forEach((r) => console.log(r));

console.log("\n=== Missing image files under public/ ===\n");
if (missingImages.length === 0) console.log("(none)");
else missingImages.forEach((r) => console.log(r));

if (missingRoutes.length > 0 || missingImages.length > 0) {
  process.exitCode = 1;
}
