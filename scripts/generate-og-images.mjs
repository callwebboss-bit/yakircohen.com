/**
 * Generate 1200×630 OG images under public/images/og/ from service hub photos.
 * Run: node scripts/generate-og-images.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const outDir = path.join(root, "public", "images", "og");
const servicesDir = path.join(root, "public", "images", "services");

const TARGETS = [
  { name: "studio.webp", source: "studio/hub/1.webp" },
  { name: "podcast.webp", sourceDir: "podcast" },
  { name: "events.webp", sourceDir: "events/dj-events" },
  { name: "video.webp", sourceDir: "video" },
  { name: "photography.webp", sourceDir: "photography" },
  { name: "voiceover.webp", sourceDir: "voiceover" },
  { name: "academy.webp", sourceDir: "academy" },
  { name: "online.webp", source: "studio/hub/2.webp" },
  { name: "pricing.webp", source: "studio/hub/3.webp" },
  { name: "blog.webp", source: "studio/hub/1.webp" },
  { name: "shop.webp", source: "studio/hub/2.webp" },
  { name: "voucher.webp", source: "studio/hub/3.webp" },
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

async function main() {
  fs.mkdirSync(outDir, { recursive: true });

  for (const target of TARGETS) {
    const src = resolveSource(target);
    const dest = path.join(outDir, target.name);

    if (!src || !fs.existsSync(src)) {
      console.warn(`skip ${target.name}: no source`);
      continue;
    }

    await sharp(src)
      .resize(1200, 630, { fit: "cover", position: "centre" })
      .webp({ quality: 82 })
      .toFile(dest);

    const stat = fs.statSync(dest);
    console.log(`ok ${target.name} (${Math.round(stat.size / 1024)}KB) ← ${path.relative(root, src)}`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
