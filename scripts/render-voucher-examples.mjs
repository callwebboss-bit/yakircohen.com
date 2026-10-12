#!/usr/bin/env node
/**
 * מצייר את שוברי הדוגמה של /matanot (lib/data/gift-voucher-examples.ts)
 * בקוד הציור של השובר עצמו (lib/gift-voucher-canvas.ts), ושומר WebP ב-public/images/matanot/.
 *
 * הציור רץ בתוך דף בונה השובר, כדי לקבל את אותם גופנים כמו באתר.
 * ברירת מחדל: האתר החי. אפשר גם שרת מקומי:
 *   node scripts/render-voucher-examples.mjs --base http://localhost:3000
 */
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";
import sharp from "sharp";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const baseArg = process.argv.indexOf("--base");
const base = baseArg > -1 ? process.argv[baseArg + 1] : "https://yakircohen.com";

const { GIFT_VOUCHER_EXAMPLES, GIFT_VOUCHER_EXAMPLE_CODE } = await import(
  path.join(root, "lib/data/gift-voucher-examples.ts")
);

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "voucher-examples-"));
const entry = path.join(root, ".tmp-voucher-examples-entry.ts");
const bundle = path.join(tmp, "bundle.js");
fs.writeFileSync(
  entry,
  [
    'import { drawVoucherImage } from "@/lib/gift-voucher-canvas";',
    'import { GIFT_VOUCHER_VALIDITY_LABEL } from "@/lib/data/gift-voucher";',
    "Object.assign(window, { __drawVoucher: drawVoucherImage, __validity: GIFT_VOUCHER_VALIDITY_LABEL });",
  ].join("\n"),
);
try {
  execFileSync(
    path.join(root, "node_modules/.bin/esbuild"),
    [entry, "--bundle", "--format=iife", `--tsconfig=${path.join(root, "tsconfig.json")}`, `--outfile=${bundle}`, "--log-level=warning"],
    { stdio: "inherit" },
  );
} finally {
  fs.rmSync(entry, { force: true });
}

const browser = await chromium.launch();
try {
  const page = await browser.newPage();
  await page.goto(`${base}/matanot/gift-voucher`, { waitUntil: "networkidle" });
  await page.addScriptTag({ path: bundle });

  for (const example of GIFT_VOUCHER_EXAMPLES) {
    const dataUrl = await page.evaluate(
      async ({ example, code }) => {
        const canvas = document.createElement("canvas");
        await window.__drawVoucher(canvas, {
          from: example.from,
          to: example.to,
          message: example.message,
          valueLabel: example.packageLabel,
          validityLabel: window.__validity,
          code,
        });
        /* תווית "דוגמה" באלכסון (בקשת הבעלים 12.10.2026), כדי שאף אחד לא יחשוב שזה שובר אמיתי */
        const ctx = canvas.getContext("2d");
        const font = getComputedStyle(document.body).getPropertyValue("--font-heebo").trim() || "Arial";
        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate(-Math.atan2(canvas.height, canvas.width));
        ctx.direction = "rtl";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.font = `800 220px ${font}, Arial, sans-serif`;
        ctx.globalAlpha = 0.16;
        ctx.fillStyle = "#d42b2b";
        ctx.fillText("דוגמה", 0, 0);
        ctx.globalAlpha = 0.35;
        ctx.lineWidth = 3;
        ctx.strokeStyle = "#d42b2b";
        ctx.strokeText("דוגמה", 0, 0);
        ctx.restore();
        return canvas.toDataURL("image/png");
      },
      { example, code: GIFT_VOUCHER_EXAMPLE_CODE },
    );
    const out = path.join(root, "public", example.imageSrc);
    fs.mkdirSync(path.dirname(out), { recursive: true });
    const info = await sharp(Buffer.from(dataUrl.split(",")[1], "base64"))
      .flatten({ background: "#ffffff" })
      .webp({ quality: 86 })
      .toFile(out);
    console.log(`${example.imageSrc}  ${info.width}x${info.height}  ${Math.round(info.size / 1024)}KB`);
  }
} finally {
  await browser.close();
  fs.rmSync(tmp, { recursive: true, force: true });
}
