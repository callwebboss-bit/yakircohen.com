import { readFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { isAllowedEmbedUrl } from "../lib/embed-url";
import { safeJsonLdStringify } from "../lib/safe-json-ld";
import { sanitizeBlogHtml } from "../lib/sanitize-html";

const jsonLd = safeJsonLdStringify({ x: "</script>" });
if (jsonLd.includes("</script>")) {
  throw new Error("JSON-LD still contains </script>");
}

const html = sanitizeBlogHtml('<p>ok</p><script>alert(1)</script><a href="javascript:alert(1)">x</a>');
if (/<script|javascript:/i.test(html)) {
  throw new Error("Blog HTML sanitizer allowed dangerous content");
}

if (!isAllowedEmbedUrl("https://www.youtube.com/embed/abc")) {
  throw new Error("YouTube embed URL should be allowed");
}
if (isAllowedEmbedUrl("https://evil.example/embed")) {
  throw new Error("Unknown embed host should be blocked");
}

console.log("security smoke ok");

/**
 * אסימונים בצורת אסימון אמיתי בקבצים שנכנסים ל-git.
 *
 * ב-16.9.2026 נמצא ב-env.resend.example מפתח Resend מלא (re_ ועוד 32 תווים),
 * שנכנס ב-e777749 והגיע גם ל-origin/main. בדיקה מול ה-API הראתה שהוא כבר
 * מבוטל, ולכן לא הייתה דליפה חיה, אבל שום שומר לא עצר אותו בדרך. הדפוסים
 * כאן מכסים את הספקים שהריפו באמת משתמש בהם. מציין מקום עם xxxx עובר.
 */
const TOKEN_PATTERNS: [RegExp, string][] = [
  [/re_[A-Za-z0-9]{8,}_[A-Za-z0-9]{20,}/, "Resend API key"],
  [/sk-[A-Za-z0-9]{20,}/, "OpenAI-style secret key"],
  [/ghp_[A-Za-z0-9]{30,}/, "GitHub personal token"],
  [/AIza[0-9A-Za-z_-]{30,}/, "Google API key"],
  [/-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/, "private key"],
];

const trackedFiles = execFileSync("git", ["ls-files"], { encoding: "utf8" })
  .split("\n")
  .filter(Boolean)
  .filter((f) => !f.startsWith("package-lock.json") && !/\.(png|jpe?g|webp|mp3|mp4|ico|woff2?)$/i.test(f));

let tokenHits = 0;
for (const file of trackedFiles) {
  let text: string;
  try {
    text = readFileSync(file, "utf8");
  } catch {
    continue;
  }
  for (const [pattern, label] of TOKEN_PATTERNS) {
    const match = text.match(pattern);
    /* מציין מקום עובר: xxxx או YOUR_ בתוך ההתאמה. בלי זה השומר נכשל על
       הקובץ לדוגמה שהוא עצמו דורש. */
    if (match && !/xxxx|YOUR_/i.test(match[0])) {
      tokenHits += 1;
      const line = text.slice(0, match.index).split("\n").length;
      console.error(`  ✗ ${label} ב-${file}:${line}`);
    }
  }
}

if (tokenHits > 0) {
  console.error(`\nsecurity:smoke נכשל: ${tokenHits} אסימונים בקבצים מנוהלים. להחליף במציין מקום ולבטל את האסימון אצל הספק.`);
  process.exit(1);
}
console.log("security:smoke — אפס אסימונים בצורת אסימון אמיתי ב-" + trackedFiles.length + " קבצים מנוהלים.");
