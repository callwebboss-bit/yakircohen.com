/**
 * מפיק את public/downloads/legacy-interview-questions.pdf מרשימת השאלות ב-
 * lib/data/legacy-recording.ts. הרשימה בעמוד והרשימה בקובץ יוצאות מאותו מקור,
 * ולכן אי אפשר שהן יתפצלו. מריצים אחרי כל שינוי בשאלות:
 *
 *   npx tsx scripts/generate-legacy-questions-pdf.ts
 *
 * ההפקה: HTML בעברית מימין לשמאל, שמודפס ל-PDF דרך Playwright (כבר תלות
 * פיתוח בריפו, בשימוש audit-a11y ו-audit-lighthouse). גופן: Arial Hebrew של
 * macOS, שנכלל בקובץ כתת-קבוצה. אין הורדת גופנים מהרשת.
 * Chrome headless ישיר נוסה קודם ונתקע בלי לצאת אחרי שכתב את הקובץ.
 *
 * הסקריפט גם מעדכן את sizeBytes ו-pages ב-LEGACY_QUESTIONS_PDF, כי העמוד
 * מציג אותם ליד קישור ההורדה, ו-legacy-recording.test.ts משווה אותם לקובץ.
 */
import { mkdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { chromium } from "playwright";
import {
  LEGACY_QUESTION_TOPICS,
  LEGACY_QUESTIONS_COUNT,
  LEGACY_QUESTIONS_NOTE,
  LEGACY_QUESTIONS_PDF,
  LEGACY_RECORDING_PATH,
} from "../lib/data/legacy-recording";

const root = resolve(import.meta.dirname, "..");
const outFile = join(root, "public", LEGACY_QUESTIONS_PDF.path);
const dataFile = join(root, "lib", "data", "legacy-recording.ts");

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/* שבירת עמוד לפני נושא זה, כדי ששני העמודים יהיו מאוזנים (9 שאלות ו-6) */
const PAGE_BREAK_BEFORE_TOPIC = "places-times";
const OWN_QUESTION_LINES = 4;

function buildHtml(): string {
  let n = 0;
  const topics = LEGACY_QUESTION_TOPICS.map((topic) => {
    const items = topic.questions
      .map((question) => {
        n += 1;
        return `<li><span class="num">${n}</span><span class="q">${escapeHtml(question)}</span></li>`;
      })
      .join("\n");
    const breakClass = topic.id === PAGE_BREAK_BEFORE_TOPIC ? " page-break" : "";
    return `<section class="topic${breakClass}"><h2>${escapeHtml(topic.title)}</h2><ol>${items}</ol></section>`;
  }).join("\n");

  const ownLines = Array.from({ length: OWN_QUESTION_LINES }, () => '<div class="line"></div>').join("");

  const title = `${LEGACY_QUESTIONS_COUNT} שאלות מוצעות לראיון עם בן משפחה מבוגר`;

  return `<!doctype html>
<html lang="he" dir="rtl">
<head>
<meta charset="utf-8">
<title>${escapeHtml(title)}</title>
<style>
  @page { size: A4; margin: 18mm 18mm 20mm; }
  * { box-sizing: border-box; }
  html { direction: rtl; }
  body {
    margin: 0;
    font-family: "Arial Hebrew", Arial, sans-serif;
    font-size: 13.5pt;
    line-height: 1.55;
    color: #1f1f1f;
  }
  header { padding-bottom: 6mm; margin-bottom: 7mm; border-bottom: 1.4pt solid #8a1c1c; }
  .brand { margin: 0; font-size: 10.5pt; font-weight: 700; color: #8a1c1c; }
  h1 { margin: 2.5mm 0 3mm; font-size: 23pt; line-height: 1.25; font-weight: 700; }
  .note { margin: 0; font-size: 12pt; color: #424242; }
  .topic { margin: 0 0 6.5mm; break-inside: avoid; }
  .page-break { break-before: page; }
  .own { margin: 0 0 6.5mm; break-inside: avoid; }
  .line { height: 12mm; border-bottom: 0.75pt dotted #8a8a8a; }
  h2 { margin: 0 0 2.5mm; font-size: 14pt; font-weight: 700; color: #8a1c1c; }
  ol { margin: 0; padding: 0; list-style: none; }
  li { display: flex; gap: 4mm; margin: 0 0 3mm; align-items: flex-start; }
  .num {
    flex: 0 0 8mm; width: 8mm; height: 8mm; margin-top: 0.6mm;
    border: 1.1pt solid #8a1c1c; border-radius: 50%;
    text-align: center; line-height: 7.2mm;
    font-size: 10.5pt; font-weight: 700; color: #8a1c1c;
  }
  .q { flex: 1; }
  footer {
    margin-top: 4mm; padding-top: 3.5mm; border-top: 0.75pt solid #b8b8b8;
    font-size: 10pt; color: #555;
  }
  footer bdi { direction: ltr; unicode-bidi: isolate; }
</style>
</head>
<body>
<header>
  <p class="brand">יקיר כהן הפקות</p>
  <h1>${escapeHtml(title)}</h1>
  <p class="note">${escapeHtml(LEGACY_QUESTIONS_NOTE)}</p>
</header>
${topics}
<section class="own"><h2>שאלות משלכם</h2>${ownLines}</section>
<footer>הרשימה מופיעה גם בעמוד <bdi>yakircohen.com${LEGACY_RECORDING_PATH}</bdi></footer>
</body>
</html>
`;
}

function pageCount(pdf: Buffer): number {
  /* צמתי עמוד, לא צומת Pages. נבדק ידנית על הפלט של Chrome */
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
