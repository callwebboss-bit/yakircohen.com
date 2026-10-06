/**
 * מושך מ-YouTube את תאריך ההעלאה האמיתי של כל סרטון שהאתר מציג, ושומר אותו
 * ב-lib/data/youtube-upload-dates.generated.json.
 *
 * למה: VideoObject בלי uploadDate הוא "פריט לא תקף" אצל Google (בדיקת כתובת
 * ב-Search Console, 6.10.2026: 16 פריטים לא תקפים ב-/studio/recording-song-modiin,
 * "חסר שדה uploadDate"). buildVideoObjectSchema משמיט את השדה כשהוא לא ידוע,
 * כי תאריך מומצא הוא טענה לא נכונה. כאן התאריך מגיע מהמקור עצמו: התגית
 * <meta itemprop="uploadDate"> בעמוד הצפייה של הסרטון.
 *
 * הרצה: npm run sync:youtube-dates
 * סרטון שלא החזיר תאריך לא נכתב, והוא ממשיך בלי uploadDate.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT = path.join(root, "lib/data/youtube-upload-dates.generated.json");
const ID = /^[A-Za-z0-9_-]{11}$/;

function collectIds() {
  const ids = new Set();
  const catalog = fs.readFileSync(path.join(root, "lib/data/video-catalog.generated.ts"), "utf8");
  for (const m of catalog.matchAll(/"videoId":\s*"([A-Za-z0-9_-]{11})"/g)) ids.add(m[1]);
  /* מזהים שכתובים ישירות בקוד, מחוץ לקטלוג */
  const walk = (dir) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const p = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(p);
      else if (/\.(ts|tsx)$/.test(entry.name) && !entry.name.includes(".test.")) {
        const text = fs.readFileSync(p, "utf8");
        for (const m of text.matchAll(/videoId:\s*["']([A-Za-z0-9_-]{11})["']/g)) ids.add(m[1]);
      }
    }
  };
  for (const dir of ["lib", "components", "app"]) walk(path.join(root, dir));
  return [...ids].filter((id) => ID.test(id)).sort();
}

async function fetchUploadDate(id) {
  const res = await fetch(`https://www.youtube.com/watch?v=${id}`, {
    headers: { "User-Agent": "Mozilla/5.0", "Accept-Language": "en" },
  });
  if (!res.ok) return null;
  const html = await res.text();
  const m = html.match(/<meta itemprop="uploadDate" content="([^"]+)"/);
  return m ? m[1] : null;
}

const existing = fs.existsSync(OUT) ? JSON.parse(fs.readFileSync(OUT, "utf8")) : {};
const ids = collectIds();
const out = {};
let missing = 0;
for (const id of ids) {
  if (existing[id]) {
    out[id] = existing[id];
    continue;
  }
  const date = await fetchUploadDate(id).catch(() => null);
  if (date) out[id] = date;
  else missing += 1;
  await new Promise((r) => setTimeout(r, 150));
}
fs.writeFileSync(OUT, `${JSON.stringify(out, null, 2)}\n`);
console.log(`youtube-upload-dates: ${Object.keys(out).length} of ${ids.length} videos have a date, ${missing} without`);
