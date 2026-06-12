/**
 * Generate 1200×630 OG images under public/images/og/ from service hub photos.
 * Hub targets with `headline` get a Hebrew title overlay (distinct from studio fallback).
 * Run: npm run generate:og-images
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const outDir = path.join(root, "public", "images", "og");
const servicesDir = path.join(root, "public", "images", "services");

/** @type {Array<{ name: string; source?: string; sourceDir?: string; headline?: string; subline?: string }>} */
const TARGETS = [
  { name: "studio.webp", source: "studio/hub/1.webp", headline: "אולפן הקלטות במודיעין" },
  { name: "podcast.webp", sourceDir: "podcast", headline: "אולפן פודקאסט במודיעין" },
  { name: "events.webp", sourceDir: "events/dj-events", headline: "DJ ואטרקציות לאירועים" },
  { name: "video.webp", sourceDir: "video", headline: "הפקת וידאו וצילום", subline: "יקיר כהן הפקות" },
  { name: "photography.webp", sourceDir: "photography", headline: "צילום אירועים", subline: "יקיר כהן הפקות" },
  { name: "voiceover.webp", sourceDir: "voiceover", headline: "קריינות מקצועית" },
  { name: "academy.webp", sourceDir: "academy", headline: "אקדמיה למוזיקה", subline: "קורסים והכשרות" },
  { name: "online.webp", source: "studio/hub/2.webp", headline: "שירותים מקוונים" },
  { name: "pricing.webp", source: "studio/hub/3.webp", headline: "מחירון שקוף" },
  { name: "blog.webp", source: "studio/hub/1.webp", headline: "בלוג ומדריכים", subline: "טיפים מהאולפן" },
  { name: "shop.webp", source: "studio/hub/2.webp", headline: "חנות דיגיטלית" },
  { name: "voucher.webp", source: "studio/hub/3.webp", headline: "שובר מתנה" },
  { name: "book.webp", source: "studio/hub/1.webp", headline: "הזמנה מקוונת", subline: "מחיר שקוף" },
];

function firstWebp(dir) {
  if (!fs.existsSync(dir)) return null;
  const files = fs
    .readdirSync(dir)
    .filter((f) => f.toLowerCase().endsWith(".webp"))
    .sort();
  return files[0] ? path.join(dir, files[0]) : null;
}

function resolveSource(target) {
  if (target.source) {
    const p = path.join(servicesDir, target.source);
    if (fs.existsSync(p)) return p;
  }
  if (target.sourceDir) {
    const found = firstWebp(path.join(servicesDir, target.sourceDir));
    if (found) return found;
  }
  return path.join(servicesDir, "studio/hub/1.webp");
}

function escapeXml(text) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function headlineOverlaySvg(headline, subline) {
  const title = escapeXml(headline);
  const sub = subline ? escapeXml(subline) : "";
  const subY = sub ? 108 : 0;
  const subBlock = sub
    ? `<text x="600" y="${subY}" text-anchor="middle" font-family="Arial, sans-serif" font-size="36" font-weight="600" fill="rgba(255,255,255,0.92)">${sub}</text>`
    : "";

  return Buffer.from(`<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="rgba(0,0,0,0.15)"/>
      <stop offset="55%" stop-color="rgba(0,0,0,0.55)"/>
      <stop offset="100%" stop-color="rgba(0,0,0,0.82)"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#g)"/>
  <text x="600" y="520" text-anchor="middle" font-family="Arial, sans-serif" font-size="56" font-weight="700" fill="#ffffff">${title}</text>
  ${subBlock}
</svg>`);
}

async function renderOg({ src, dest, headline, subline }) {
  const base = sharp(src).resize(1200, 630, { fit: "cover", position: "centre" });

  if (!headline) {
    await base.webp({ quality: 82 }).toFile(dest);
    return;
  }

  const overlay = headlineOverlaySvg(headline, subline);
  await base
    .composite([{ input: overlay, top: 0, left: 0 }])
    .webp({ quality: 82 })
    .toFile(dest);
}

async function main() {
  fs.mkdirSync(outDir, { recursive: true });

  for (const target of TARGETS) {
    const src = resolveSource(target);
    const dest = path.join(outDir, target.name);

    if (!src || !fs.existsSync(src)) {
      console.warn(`skip ${target.name}: no source`);
      continue;
    }

    await renderOg({
      src,
      dest,
      headline: target.headline,
      subline: target.subline,
    });

    const stat = fs.statSync(dest);
    console.log(`ok ${target.name} (${Math.round(stat.size / 1024)}KB) ← ${path.relative(root, src)}`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
