/**
 * Generate shop card images (1200×900 WebP) from existing service photos.
 * Prefer user uploads already in public/images/shop/; otherwise crop from services/.
 * Run: npm run generate:shop-images
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const outDir = path.join(root, "public", "images", "shop");
const servicesDir = path.join(root, "public", "images", "services");

/** @type {Array<{ name: string; sources: string[] }>} */
const TARGETS = [
  {
    name: "voucher-basic.webp",
    sources: [
      "studio/blessings/bride-groom-blessing/הקלטה באולפן.webp",
      "studio/hub/אולפן-הקלטות-מקצועי-מודיעין.webp",
    ],
  },
  {
    name: "voucher-premium.webp",
    sources: [
      "events/wedding-packages/חבילת סלואו יקיר כהן הפקות.webp",
      "events/dj-events/עמדת די גיי ותאורה.webp",
    ],
  },
  {
    name: "voucher-custom.webp",
    sources: [
      "studio/recording-song-modiin/מתחם יקיר כהן הפקות.webp",
      "studio/recording-song-modiin/אולפן ההקלטה יקיר כהן.webp",
      "studio/hub/אולפן פודקאסט - יקיר כהן 1.webp",
    ],
  },
  {
    name: "gear-rcf745.webp",
    sources: [
      "events/equipment/singer-amplification/מיקרופון שור לזמרים.webp",
      "events/equipment/singer-amplification/מיקרופון להגברות מיוחדות.webp",
    ],
  },
  {
    name: "gear-traktor-s4.webp",
    sources: [
      "events/dj-events/עמדת די גיי ותאורה.webp",
      "events/dj-events/עמדה ותאורה יקירכהן באירוע.webp",
    ],
  },
  {
    name: "gear-krk.webp",
    sources: [
      "voiceover/מיקרופון קריינות.webp",
      "voiceover/אבזור אולפן.webp",
      "studio/hub/אולפן-הקלטות-מקצועי-מודיעין.webp",
    ],
  },
  {
    name: "gear-effects.webp",
    sources: [
      "events/wedding-packages/עשן כבד יקיר כהן.webp",
      "events/attractions/bubble-machine/בועות סבון לאירועים.webp",
      "events/wedding-packages/Colorful Confetti.webp",
    ],
  },
  {
    name: "gear-led.webp",
    sources: [
      "events/attractions/led-booth/יקיר כהן באירוע.webp",
      "events/attractions/led-booth/עמדת לד באירועים.webp",
      "events/attractions/led-booth/לד עמדה.webp",
    ],
  },
  {
    name: "gear-accessories.webp",
    sources: [
      "events/equipment/singer-amplification/מיקרופון להגברות מיוחדות.webp",
      "events/equipment/singer-amplification/מיקרופון שור לזמרים.webp",
      "voiceover/אבזור אולפן.webp",
    ],
  },
];

function resolveExisting(targetName) {
  const webp = path.join(outDir, targetName);
  if (fs.existsSync(webp) && fs.statSync(webp).size > 10_000) return webp;

  const stem = targetName.replace(/\.webp$/i, "");
  for (const ext of [".jfif", ".jpg", ".jpeg", ".png", ".webp"]) {
    const candidate = path.join(outDir, stem + ext);
    if (fs.existsSync(candidate) && fs.statSync(candidate).size > 10_000) {
      return candidate;
    }
  }
  return null;
}

function resolveSource(sources) {
  for (const rel of sources) {
    const p = path.join(servicesDir, rel);
    if (fs.existsSync(p)) return p;
  }
  return null;
}

async function renderCard(src, dest) {
  await sharp(src)
    .rotate()
    .resize(1200, 900, { fit: "cover", position: "centre" })
    .webp({ quality: 82 })
    .toFile(dest);
}

async function main() {
  fs.mkdirSync(outDir, { recursive: true });

  for (const target of TARGETS) {
    const dest = path.join(outDir, target.name);
    const local = resolveExisting(target.name);

    if (local && path.resolve(local) === path.resolve(dest)) {
      console.log(`keep ${target.name} (already present)`);
      continue;
    }

    const src = local ?? resolveSource(target.sources);
    if (!src) {
      console.warn(`skip ${target.name}: no source`);
      continue;
    }

    await renderCard(src, dest);
    const kb = Math.round(fs.statSync(dest).size / 1024);
    console.log(`ok ${target.name} (${kb}KB) ← ${path.relative(root, src)}`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
