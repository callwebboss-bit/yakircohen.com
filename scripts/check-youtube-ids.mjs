import { readFileSync, readdirSync, statSync } from "fs";
import { join } from "path";

const ROOT = join(import.meta.dirname, "..");

function walk(dir, files = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (name === "node_modules" || name === ".next") continue;
    const st = statSync(p);
    if (st.isDirectory()) walk(p, files);
    else if (/\.(ts|tsx|mjs|js)$/.test(name)) files.push(p);
  }
  return files;
}

const ids = new Map();
for (const file of walk(join(ROOT, "lib")).concat(walk(join(ROOT, "components")))) {
  const text = readFileSync(file, "utf8");
  let m;
  const re1 = /videoId:\s*["']([A-Za-z0-9_-]{11})["']/g;
  while ((m = re1.exec(text))) add(m[1], file);
  const re2 = /:\s*["']([A-Za-z0-9_-]{11})["']/g;
  while ((m = re2.exec(text))) {
    if (text.slice(Math.max(0, m.index - 40), m.index).match(/embed|youtube|video|Video|YOUTUBE|SHOWCASE|CLIP|FEATURED/i)) {
      add(m[1], file);
    }
  }
}

const embedsText = readFileSync(join(ROOT, "lib/data/youtube-embeds.ts"), "utf8");
for (const m of embedsText.matchAll(
  /["'][\w-]+["']:\s*["']([A-Za-z0-9_-]{11})["']/g,
)) {
  add(m[1], "lib/data/youtube-embeds.ts");
}

function add(id, file) {
  const rel = file.replace(ROOT + "\\", "").replace(ROOT + "/", "");
  if (!ids.has(id)) ids.set(id, new Set());
  ids.get(id).add(rel);
}

async function check(id) {
  const url = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${id}&format=json`;
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(10000) });
    return res.ok ? "ok" : `fail:${res.status}`;
  } catch (e) {
    return `error:${e.message}`;
  }
}

const sorted = [...ids.keys()].sort();
const broken = [];
for (const id of sorted) {
  const status = await check(id);
  const files = [...ids.get(id)].slice(0, 2).join(", ");
  if (status !== "ok") {
    broken.push({ id, status, files });
    console.log(`FAIL ${id} ${status} (${files})`);
  } else {
    console.log(`OK   ${id}`);
  }
}
console.log(`\nTotal: ${sorted.length}, broken: ${broken.length}`);
if (broken.length) process.exit(1);
