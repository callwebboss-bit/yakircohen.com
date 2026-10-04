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

// ערך של 11 תווים נחשב מזהה סרטון רק כשהמפתח שלו עצמו מדבר על סרטון
// (videoId, youtubeId, video). חלון של 40 תווים לפני הנקודתיים תפס מילים
// משורות סמוכות והפך ל-FAIL את "VideoObject", "bat-mitzvah" ו-"bat_mitzvah".
const VIDEO_KEY = /video|youtube|embed/i;

const ids = new Map();
for (const file of walk(join(ROOT, "lib")).concat(walk(join(ROOT, "components")))) {
  const text = readFileSync(file, "utf8");
  for (const m of text.matchAll(/["']?([\w$@-]+)["']?\s*:\s*["']([A-Za-z0-9_-]{11})["']/g)) {
    if (VIDEO_KEY.test(m[1])) add(m[2], file);
  }
}

// כל ערך במפות של youtube-embeds.ts הוא מזהה, גם כשהמפתח לא מצוטט (batMitzvahClips)
const embedsText = readFileSync(join(ROOT, "lib/data/youtube-embeds.ts"), "utf8");
for (const m of embedsText.matchAll(
  /["']?[\w-]+["']?:\s*["']([A-Za-z0-9_-]{11})["']/g,
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
