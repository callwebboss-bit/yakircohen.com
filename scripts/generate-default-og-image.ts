/**
 * תמונת השיתוף ברירת המחדל של האתר: app/opengraph-image.png ו-app/twitter-image.png.
 *
 * למה קובץ סטטי ולא next/og: app/opengraph-image.tsx הקודם צייר ב-Satori
 * בלי גופן עברי ובלי bidi (ב-@vercel/og יש bidi רק לערבית), ולכן באתר החי
 * /opengraph-image הציג "תוקפה ןהכ ריקי", במשקל רגיל ומיושר לשמאל. כאן
 * הטקסט עובר דרך sharp, כלומר librsvg ו-pango עם fribidi, כמו
 * scripts/generate-og-images.mjs שכבר מייצר את public/images/og/*.webp
 * בעברית תקינה.
 *
 * מי משתמש בה: עמוד ה-404 הכללי (app/not-found.tsx), שכל כתובת לא קיימת
 * מחזירה. שאר העמודים מגדירים openGraph.images בעצמם, ו-Next מדלג על קובץ
 * התמונה בכל רמה שבה images כבר מוגדר
 * (node_modules/next/dist/lib/metadata/resolve-metadata.js, mergeStaticMetadata).
 *
 * הרצה: npm run generate:default-og
 * אחרי שינוי של SITE_NAME צריך להריץ שוב ולעשות commit לקבצים.
 */
import { writeFileSync } from "node:fs";
import { resolve } from "node:path";
import sharp from "sharp";
import { SITE_NAME } from "../lib/constants";
import { logoPng } from "./lib/brand-logo.mjs";

const WIDTH = 1200;
const HEIGHT = 630;
/* שוליים מימין, כמו ה-padding של 80 בקובץ ה-tsx הקודם */
const RIGHT_X = WIDTH - 80;

const SUBLINE = "אולפן הקלטות - פודקאסט - DJ ואטרקציות - מודיעין והמרכז";
const ALT = `${SITE_NAME} - אולפן, פודקאסט ואירועים במודיעין`;

const appDir = resolve(import.meta.dirname, "../app");

function escapeXml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/* direction="rtl" עם text-anchor="start" מצמיד את תחילת השורה העברית
   ל-x, כלומר יישור לימין. "Arial Hebrew" מגיע עם macOS ויש לו משקל 700. */
function cardSvg(): Buffer {
  const font = "Arial Hebrew, Arial, sans-serif";
  return Buffer.from(`<svg width="${WIDTH}" height="${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${WIDTH}" height="${HEIGHT}" fill="#FAFAF8"/>
  <rect x="${RIGHT_X - 140}" y="200" width="140" height="10" rx="5" fill="#D42B2B"/>
  <text x="${RIGHT_X}" y="330" direction="rtl" text-anchor="start" font-family="${font}" font-size="88" font-weight="700" fill="#1A1A1A">${escapeXml(SITE_NAME)}</text>
  <text x="${RIGHT_X}" y="420" direction="rtl" text-anchor="start" font-family="${font}" font-size="36" font-weight="400" fill="#525252">${escapeXml(SUBLINE)}</text>
</svg>`);
}

async function main() {
  /* הלוגו בפינה השמאלית העליונה, מעל קו השם (בדיקת הלוגו 7.10.2026) */
  const logo = await logoPng({ width: 260, color: "#1A1A1A" });
  const png = await sharp(cardSvg())
    .composite([{ input: logo, top: 72, left: 80 }])
    .png({ compressionLevel: 9, palette: true, quality: 90 })
    .toBuffer();

  /* שני קבצים זהים: Next לא מאפשר להפנות את twitter-image לקובץ של
     opengraph-image, ובלי twitter-image עמוד ה-404 היה מקבל תמונת og אחת
     ותמונת twitter אחרת */
  for (const name of ["opengraph-image", "twitter-image"]) {
    writeFileSync(resolve(appDir, `${name}.png`), png);
    writeFileSync(resolve(appDir, `${name}.alt.txt`), ALT);
  }

  const meta = await sharp(png).metadata();
  console.log(
    `ok app/opengraph-image.png + app/twitter-image.png (${meta.width}x${meta.height}, ${Math.round(png.length / 1024)}KB)`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
