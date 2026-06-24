#!/usr/bin/env node
/**
 * מעלה RESEND_API_KEY (ומשתנים קשורים) ל-Vercel פרויקט yakircohen-site.
 *
 * 1. העתק env.resend.example → .env.resend.local
 * 2. מלא RESEND_API_KEY מ-https://resend.com/api-keys
 * 3. npm run env:resend
 */
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const ROOT = resolve(import.meta.dirname, "..");
const ENV_FILE = resolve(ROOT, ".env.resend.local");

function parseEnvFile(text) {
  const out = {};
  for (const line of text.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    out[key] = value;
  }
  return out;
}

function pushVar(name, value, environments) {
  for (const env of environments) {
    execFileSync(
      "npx",
      [
        "vercel",
        "env",
        "add",
        name,
        env,
        "--value",
        value,
        "--yes",
        "--force",
        "--sensitive",
      ],
      { cwd: ROOT, stdio: "inherit", shell: true },
    );
    console.log(`✓ ${name} → ${env}`);
  }
}

if (!existsSync(ENV_FILE)) {
  console.error(
    "חסר .env.resend.local -- העתק מ-env.resend.example ומלא RESEND_API_KEY.",
  );
  process.exit(1);
}

const vars = parseEnvFile(readFileSync(ENV_FILE, "utf8"));
const apiKey = vars.RESEND_API_KEY?.trim();

if (!apiKey || !apiKey.startsWith("re_")) {
  console.error(
    "RESEND_API_KEY חסר או לא תקין ב-.env.resend.local (צריך להתחיל ב-re_).",
  );
  process.exit(1);
}

const notifyEmail =
  vars.LEAD_NOTIFY_EMAIL?.trim() || "callwebboss@gmail.com";
const environments = ["production", "preview"];

pushVar("RESEND_API_KEY", apiKey, environments);
pushVar("LEAD_NOTIFY_EMAIL", notifyEmail, environments);

const fromEmail = vars.RESEND_FROM_EMAIL?.trim();
if (fromEmail) {
  pushVar("RESEND_FROM_EMAIL", fromEmail, environments);
}

console.log("\nהושלם. הרץ: npx vercel --prod");
