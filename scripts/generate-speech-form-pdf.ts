/**
 * מפיק את public/downloads/bar-mitzvah-speech-form.pdf, טופס העזר של מדריך
 * הדרשה, מהשדות ב-lib/data/bar-mitzvah-speech.ts. השדות בעמוד ובקובץ יוצאים
 * מאותו מקור. מריצים אחרי כל שינוי בהם:
 *
 *   npx tsx scripts/generate-speech-form-pdf.ts
 *
 * אותה שיטה כמו scripts/generate-legacy-questions-pdf.ts: HTML בעברית מימין
 * לשמאל, שמודפס ל-PDF דרך Playwright, בגופן Arial Hebrew של macOS שנכלל
 * בקובץ כתת-קבוצה. אין הורדת גופנים מהרשת.
 *
 * הסקריפט מעדכן גם את sizeBytes ו-pages ב-SPEECH_FORM_PDF, כי העמוד מציג
 * אותם ליד הקישור, ו-bar-mitzvah-speech.test.ts משווה אותם לקובץ.
 */
import { mkdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { chromium } from "playwright";
import {
  SPEECH_FORM_FIELDS,
  SPEECH_FORM_INTRO,
  SPEECH_FORM_PDF,
} from "../lib/data/bar-mitzvah-speech";

const root = resolve(import.meta.dirname, "..");
const outFile = join(root, "public", SPEECH_FORM_PDF.path);
const dataFile = join(root, "lib", "data", "bar-mitzvah-speech.ts");
const GUIDE_PATH = "/blog/bar-mitzvah-speech";

/* שורות כתיבה לכל שדה. הסיפור האישי מקבל יותר מקום */
const LINES_PER_FIELD = [2, 3, 4, 2, 2];

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function buildHtml(): string {
  const fields = SPEECH_FORM_FIELDS.map(({ label, hint }, index) => {
    const lines = Array.from({ length: LINES_PER_FIELD[index] ?? 2 }, () => '<div class="line"></div>').join("");
    const hintHtml = hint ? ` <span class="hint">${escapeHtml(hint)}</span>` : "";
    return `<li><span class="num">${index + 1}</span><div class="body"><p class="q"><strong>${escapeHtml(label)}</strong>${hintHtml}</p>${lines}</div></li>`;
  }).join("\n");

  const title = "טופס עזר לכתיבת דרשה לבר מצווה";

  return `<!doctype html>
<html lang="he" dir="rtl">
<head>
<meta charset="utf-8">
<title>${escapeHtml(title)}</title>
<style>
  @page { size: A4; margin: 16mm 18mm 18mm; }
  * { box-sizing: border-box; }
  html { direction: rtl; }
  body {
    margin: 0;
    font-family: "Arial Hebrew", Arial, sans-serif;
    font-size: 13.5pt;
    line-height: 1.5;
    color: #1f1f1f;
  }
  header { padding-bottom: 5mm; margin-bottom: 6mm; border-bottom: 1.4pt solid #8a1c1c; }
  .brand { margin: 0; font-size: 10.5pt; font-weight: 700; color: #8a1c1c; }
  h1 { margin: 2.5mm 0 3mm; font-size: 22pt; line-height: 1.25; font-weight: 700; }
  .note { margin: 0; font-size: 12pt; color: #424242; }
  ol { margin: 0; padding: 0; list-style: none; }
  li { display: flex; gap: 4mm; margin: 0 0 5mm; align-items: flex-start; break-inside: avoid; }
  .num {
    flex: 0 0 8mm; width: 8mm; height: 8mm; margin-top: 0.6mm;
    border: 1.1pt solid #8a1c1c; border-radius: 50%;
    text-align: center; line-height: 7.2mm;
    font-size: 10.5pt; font-weight: 700; color: #8a1c1c;
  }
  .body { flex: 1; }
  .q { margin: 0; }
  .hint { color: #424242; }
  .line { height: 10mm; border-bottom: 0.75pt dotted #8a8a8a; }
  footer {
    margin-top: 3mm; padding-top: 3mm; border-top: 0.75pt solid #b8b8b8;
    font-size: 10pt; color: #555;
  }
  footer bdi { direction: ltr; unicode-bidi: isolate; }
</style>
</head>
<body>
<header>
  <p class="brand">יקיר כהן הפקות</p>
  <h1>${escapeHtml(title)}</h1>
  <p class="note">${escapeHtml(SPEECH_FORM_INTRO)}</p>
</header>
<ol>
${fields}
</ol>
<footer>המדריך המלא והנוסח המוכן בעמוד <bdi>yakircohen.com${GUIDE_PATH}</bdi></footer>
</body>
</html>
`;
}

function pageCount(pdf: Buffer): number {
  /* צמתי עמוד, לא צומת Pages. אותו ביטוי כמו בסקריפט של קובץ השאלות */
  const matches = pdf.toString("latin1").match(/\/Type\s*\/Page(?![s\w])/g);
  return matches?.length ?? 0;
}

function updateDataFile(sizeBytes: number, pages: number) {
  const source = readFileSync(dataFile, "utf8");
  const next = source
    .replace(/sizeBytes: \d+/, `sizeBytes: ${sizeBytes}`)
    .replace(/pages: \d+/, `pages: ${pages}`);
  if (next !== source) writeFileSync(dataFile, next, "utf8");
}

async function main() {
  mkdirSync(join(root, "public", "downloads"), { recursive: true });

  const browser = await chromium.launch();
  try {
    const page = await browser.newPage();
    await page.setContent(buildHtml(), { waitUntil: "load" });
    await page.pdf({
      path: outFile,
      format: "A4",
      printBackground: true,
      preferCSSPageSize: true,
    });
  } finally {
    await browser.close();
  }

  const sizeBytes = statSync(outFile).size;
  const pages = pageCount(readFileSync(outFile));
  updateDataFile(sizeBytes, pages);
  console.log(`נכתב ${outFile}: ${sizeBytes} בתים, ${pages} עמודים`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
