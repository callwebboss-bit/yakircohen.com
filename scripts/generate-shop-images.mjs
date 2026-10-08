/**
 * Generate shop card images (1200×900 WebP) from existing service photos.
 * Prefer user uploads already in public/images/shop/; otherwise crop from services/.
 * Run: npm run generate:shop-images
 *
 * שוברי המתנה (badge: true) נוצרים מחדש בכל הרצה ונושאים את הלוגו של האתר.
 * בדיקת הלוגו 7.10.2026: לשוברים לא היה לוגו, ושובר הפרימיום (המסומן
 * "פופולרי") הציג מסך LED ומחשבים עם ALMOG COHEN, מותג של די-ג'יי אחר.
 * המקור של שובר נקרא תמיד מקובץ מקור ולא מקובץ ה-webp שהסקריפט כותב,
 * אחרת הרצה שנייה הייתה מדביקה לוגו על לוגו.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import { logoBadge } from "./lib/brand-logo.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const outDir = path.join(root, "public", "images", "shop");
const servicesDir = path.join(root, "public", "images", "services");

const CARD_WIDTH = 1200;
const CARD_HEIGHT = 900;
/* איכות 78: השוברים מוצגים עם unoptimized (ShopVouchersSection.tsx, מכסת
   התמונות של Hobby), כלומר הקובץ עצמו יורד לדפדפן בלי דחיסה של Vercel,
   ולכן הוא צריך להיות קטן. */
const WEBP_QUALITY = 78;
/* הלוגו בפינה השמאלית התחתונה ולא בברירת המחדל של logoBadge (ימין למעלה):
   בכרטיס הפרימיום תגית "פופולרי" יושבת בימין למעלה מעל התמונה, ובשובר
   המותאם שלט YAKIR COHEN על הקיר תופס את השמאל העליון. נבדק ויזואלית
   בשלוש הפינות, 7.10.2026. */
const BADGE_LOGO_WIDTH = 260;
const BADGE_MARGIN = 32;
/** העלאות של הבעלים לשובר: כל סיומת חוץ מ-webp, כי ה-webp הוא הפלט */
const UPLOAD_EXTS = [".jfif", ".jpg", ".jpeg", ".png"];

/** @type {Array<{ name: string; sources: string[]; badge?: boolean }>} */
const TARGETS = [
  {
    name: "voucher-basic.webp",
    badge: true,
    sources: [
      "studio/blessings/bride-groom-blessing/הקלטה באולפן.webp",
      "studio/hub/אולפן-הקלטות-מקצועי-מודיעין.webp",
    ],
  },
  {
    name: "voucher-premium.webp",
    badge: true,
    /* היה events/wedding-packages/חבילת סלואו יקיר כהן הפקות.webp, ובו מסך
       LED ומחשבים עם ALMOG COHEN (בדיקת הלוגו 7.10.2026). במקומו העמדה של
       יקיר באירוע באוהל: YAKIR COHEN על חזית העמדה, ראשים נעים ולייזרים,
       בלי שם של אף אחד אחר. נבדק בהגדלה של העמדה והמחשבים. מקור יחיד בכוונה:
       הגיבוי הקודם (עמדת די גיי ותאורה.webp) ברוחב 384 פיקסלים ויוצא מטושטש. */
    sources: ["events/dj-events/עמדה ותאורה יקירכהן באירוע.webp"],
  },
  {
    name: "voucher-custom.webp",
    badge: true,
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

/** העלאה של הבעלים לשובר (voucher-basic.jfif וכו'), לעולם לא ה-webp שנכתב */
function resolveUpload(targetName) {
  const stem = targetName.replace(/\.webp$/i, "");
  for (const ext of UPLOAD_EXTS) {
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

/** שכבת הלוגו לשוברים, פעם אחת לכל ההרצה, ממוקמת בשמאל התחתון */
let badgeLayer;
async function voucherBadge() {
  if (!badgeLayer) {
    const { input } = await logoBadge({
      canvasWidth: CARD_WIDTH,
      logoWidth: BADGE_LOGO_WIDTH,
      margin: BADGE_MARGIN,
    });
    const { height } = await sharp(input).metadata();
    badgeLayer = { input, top: CARD_HEIGHT - BADGE_MARGIN - height, left: BADGE_MARGIN };
  }
  return badgeLayer;
}

async function renderCard(src, dest, { badge = false } = {}) {
  let img = sharp(src)
    .rotate()
    .resize(CARD_WIDTH, CARD_HEIGHT, { fit: "cover", position: "centre" });
  if (badge) img = img.composite([await voucherBadge()]);
  await img.webp({ quality: WEBP_QUALITY }).toFile(dest);
}

async function main() {
  fs.mkdirSync(outDir, { recursive: true });

  for (const target of TARGETS) {
    const dest = path.join(outDir, target.name);

    if (target.badge) {
      const src = resolveUpload(target.name) ?? resolveSource(target.sources);
      if (!src) {
        console.warn(`skip ${target.name}: no source`);
        continue;
      }
      await renderCard(src, dest, { badge: true });
      const kb = Math.round(fs.statSync(dest).size / 1024);
      console.log(`ok ${target.name} (${kb}KB, logo) ← ${path.relative(root, src)}`);
      continue;
    }

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
