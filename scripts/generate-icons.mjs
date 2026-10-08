/**
 * אייקוני האתר מהלוגו: favicon.ico, app/icon.png, app/apple-icon.png,
 * public/icon-192.png ו-public/icon-512.png.
 *
 * למה: בדיקת הלוגו 7.10.2026 מצאה ש-favicon.ico היה המשולש של Vercel מאז
 * הקומיט הראשון, ו-/icon ו-/apple-icon ציירו את האות "י" בגופן, שנראתה כמו 1.
 * הבעלים בחר ב-8.10 באפשרות ב': העין מתוך COHEN בלוגו, לבן על אדום.
 *
 * הרצה: node scripts/generate-icons.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import { logoPng } from "./lib/brand-logo.mjs";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const RED = "#d42b2b";

/* ה-O עם העין מתוך COHEN, בלוגו שמרונדר ברוחב 2000 (נמדד ב-7.10.2026 לפי עמודות
   הדיו בשורת COHEN). אם logo.svg משתנה, צריך למדוד מחדש. */
const RENDER_WIDTH = 2000;
const EYE = { left: 451, top: 405, width: 367, height: 301 };

async function eyeMask() {
  const logo = await logoPng({ width: RENDER_WIDTH, color: "#ffffff" });
  return sharp(logo).extract(EYE).png().toBuffer();
}

/** העין בלבן על אדום. rounded: פינות שקופות. בלי rounded: ריבוע מלא (iOS, maskable) */
async function renderIcon(eye, size, frac, rounded) {
  const markWidth = Math.round(size * frac);
  const mark = await sharp(eye).resize({ width: markWidth }).png().toBuffer();
  const meta = await sharp(mark).metadata();
  const radius = rounded ? Math.round(size * 0.22) : 0;
  const bg = Buffer.from(
    `<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg"><rect width="${size}" height="${size}" rx="${radius}" fill="${RED}"/></svg>`,
  );
  const out = sharp(bg).composite([
    { input: mark, left: Math.round((size - meta.width) / 2), top: Math.round((size - meta.height) / 2) },
  ]);
  return rounded ? out.png().toBuffer() : out.flatten({ background: RED }).png().toBuffer();
}

/** קובץ ICO עם תמונות PNG בפנים (נתמך מ-Windows Vista ובכל הדפדפנים) */
function buildIco(entries) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(entries.length, 4);
  let offset = 6 + entries.length * 16;
  const dir = [];
  for (const { size, png } of entries) {
    const d = Buffer.alloc(16);
    d.writeUInt8(size >= 256 ? 0 : size, 0);
    d.writeUInt8(size >= 256 ? 0 : size, 1);
    d.writeUInt8(0, 2);
    d.writeUInt8(0, 3);
    d.writeUInt16LE(1, 4);
    d.writeUInt16LE(32, 6);
    d.writeUInt32LE(png.length, 8);
    d.writeUInt32LE(offset, 12);
    offset += png.length;
    dir.push(d);
  }
  return Buffer.concat([header, ...dir, ...entries.map((e) => e.png)]);
}

async function main() {
  const eye = await eyeMask();
  /* בגודל 16-48 העין קצת גדולה יותר, כדי שתיקרא בלשונית */
  const icoEntries = [];
  for (const size of [16, 32, 48]) icoEntries.push({ size, png: await renderIcon(eye, size, 0.74, true) });
  const files = {
    "app/favicon.ico": buildIco(icoEntries),
    "app/icon.png": await renderIcon(eye, 192, 0.66, true),
    "app/apple-icon.png": await renderIcon(eye, 180, 0.58, false),
    /* ריבוע מלא: הסימן בתוך 55% מהרוחב, בתוך אזור הבטיחות של maskable (80%) */
    "public/icon-192.png": await renderIcon(eye, 192, 0.55, false),
    "public/icon-512.png": await renderIcon(eye, 512, 0.55, false),
  };
  for (const [rel, buf] of Object.entries(files)) {
    fs.writeFileSync(path.join(root, rel), buf);
    console.log(`ok ${rel} (${buf.length} bytes)`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
