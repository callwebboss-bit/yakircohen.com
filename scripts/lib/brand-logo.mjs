/**
 * הלוגו של האתר (public/images/logo.svg) בתוך תמונות שנוצרות בסקריפטים:
 * תמונות שיתוף, שוברים בחנות, הלוגו למיילים ואייקונים.
 *
 * למה זה קיים: בדיקת הלוגו של 7.10.2026 מצאה שאף תמונת שיתוף לא נושאת את
 * הלוגו, ושתמונת החנות והשובר מציגות מותג של די-ג'יי אחר (ALMOG COHEN על
 * מסך ה-LED). הבעלים אישר להוסיף את הלוגו בכל מקום שחסר.
 *
 * הקובץ המקורי שחור (fill="#000000") עם viewBox ‏400x200, והציור עצמו
 * תופס רק x 29.5-359 ו-y 39-183.5 (נמדד ברינדור). INK_VIEWBOX חותך
 * לציור עם שוליים קטנים, כדי שהלוגו לא יקטן בגלל רווח ריק.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "..");
export const LOGO_PATH = path.join(root, "public", "images", "logo.svg");

const INK_VIEWBOX = "26 36 336 151";
/** יחס רוחב לגובה של הציור אחרי החיתוך */
export const LOGO_ASPECT = 336 / 151;

/** ה-SVG של הלוגו בצבע אחר, חתוך לציור ובלי גודל קבוע */
export function logoSvg(color = "#ffffff") {
  const raw = fs.readFileSync(LOGO_PATH, "utf8");
  const out = raw
    .replace('fill="#000000"', `fill="${color}"`)
    .replace(/viewBox="[^"]*"/, `viewBox="${INK_VIEWBOX}"`)
    .replace(/\swidth="[^"]*"/, "")
    .replace(/\sheight="[^"]*"/, "");
  if (!out.includes(`fill="${color}"`)) throw new Error("brand-logo: fill not replaced, logo.svg changed?");
  return out;
}

/** PNG שקוף של הלוגו ברוחב נתון */
export async function logoPng({ width, color = "#ffffff" }) {
  return sharp(Buffer.from(logoSvg(color)), { density: 600 })
    .resize({ width: Math.round(width) })
    .png()
    .toBuffer();
}

/**
 * שכבת composite של הלוגו לבן על לוחית כהה שקופה למחצה, בפינה העליונה הימנית
 * (תחילת השורה בעברית). הלוחית שומרת על הלוגו קריא גם על תמונה בהירה.
 */
export async function logoBadge({ canvasWidth, logoWidth = 230, margin = 40, padX = 22, padY = 16 }) {
  const logoHeight = Math.round(logoWidth / LOGO_ASPECT);
  const plateW = Math.round(logoWidth + padX * 2);
  const plateH = Math.round(logoHeight + padY * 2);
  const logo = await logoPng({ width: logoWidth });
  const plate = Buffer.from(
    `<svg width="${plateW}" height="${plateH}" xmlns="http://www.w3.org/2000/svg"><rect width="${plateW}" height="${plateH}" rx="14" fill="rgba(0,0,0,0.5)"/></svg>`,
  );
  const badge = await sharp(plate)
    .composite([{ input: logo, top: padY, left: padX }])
    .png()
    .toBuffer();
  return { input: badge, top: margin, left: canvasWidth - margin - plateW };
}
