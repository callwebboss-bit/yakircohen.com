/**
 * יוצר את public/images/logo-email.png, הלוגו שבראש שני המיילים האוטומטיים
 * ללקוח (lib/leads/templates/email-shell.ts).
 *
 * למה: בדיקת הלוגו 7.10.2026 מצאה שהמענה האוטומטי והמדריך לפני השיחה יוצאים
 * בלי לוגו. הבעלים אישר להוסיף את הלוגו בכל מקום שחסר.
 *
 * למה PNG אטום על רקע לבן ולא SVG או PNG שקוף: Gmail ו-Outlook לא מציגים SVG
 * במייל, ובמצב כהה לקוחות מייל משנים רקע אבל לא תמונה, כך שלוגו כהה על רקע
 * שקוף נעלם על רקע כהה. 480px רוחב מוצג ב-160px, פי 3 למסכי רטינה.
 *
 * הרצה: node scripts/generate-email-logo.mjs
 * אחרי הרצה מחדש: אם הגובה שהודפס השתנה, לעדכן את EMAIL_LOGO_HEIGHT
 * ב-email-shell.ts. הטסט email-shell.test.ts נכשל כשהם לא תואמים.
 * אם הלוגו עצמו משתנה, לשמור בשם קובץ חדש ולעדכן את EMAIL_LOGO_SRC:
 * vercel.json מגיש את /images/ עם max-age=31536000, immutable, ופרוקסי
 * התמונות של Gmail ימשיך להציג את הגרסה הישנה מאותה כתובת.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import { logoPng } from "./lib/brand-logo.mjs";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const out = path.join(root, "public", "images", "logo-email.png");

const WIDTH = 480;
/** כמעט שחור, כמו color:#111 של גוף המייל */
const COLOR = "#111111";

const transparent = await logoPng({ width: WIDTH, color: COLOR });
/* palette: הלוגו הוא רק גווני אפור, 256 צבעים מכסים אותו בלי אובדן ומקטינים את הקובץ */
const png = await sharp(transparent)
  .flatten({ background: "#ffffff" })
  .png({ palette: true, colours: 256, compressionLevel: 9 })
  .toBuffer();
fs.writeFileSync(out, png);

const meta = await sharp(png).metadata();
const displayHeight = Math.round((meta.height * 160) / meta.width);
console.log(
  `logo-email.png: ${meta.width}x${meta.height}, ${png.length} bytes, alpha=${meta.hasAlpha}, ` +
    `display 160x${displayHeight}`,
);
