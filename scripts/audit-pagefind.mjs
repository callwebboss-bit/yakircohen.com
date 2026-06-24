#!/usr/bin/env node
/**
 * בודק ש-build:full ייצר HTML לעמודים חדשים וש-Pagefind אינדקס אותם.
 * הרצה: npm run build:full && npm run audit:pagefind
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const APP_HTML = path.join(ROOT, ".next", "server", "app");
const PAGEFIND_ENTRY = path.join(ROOT, "public", "pagefind", "pagefind-entry.json");

const PAGES = [
  { file: "pricing.html", term: "מחירון מרכזי", path: "/pricing" },
  { file: "book.html", term: "מערכת הזמנות", path: "/book" },
  { file: "blog/podcast-booking-guide.html", term: "הזמנת פודקאסט", path: "/blog" },
  { file: "about/faq.html", term: "שאלות נפוצות", path: "/about/faq" },
];

let failed = 0;

if (!fs.existsSync(APP_HTML)) {
  console.error("❌ הרץ קודם: npm run build:full");
  process.exit(1);
}

for (const { file, term, path: urlPath } of PAGES) {
  const full = path.join(APP_HTML, file);
  if (!fs.existsSync(full)) {
    console.log(`✗ חסר קובץ HTML: ${file}`);
    failed++;
    continue;
  }
  const html = fs.readFileSync(full, "utf8");
  if (!html.includes("data-pagefind-body") && !html.includes('id="main-content"')) {
    console.log(`⚠ ${file} -- אין data-pagefind-body (יורש מ-layout?)`);
  }
  if (html.includes(term) || html.includes(urlPath)) {
    console.log(`✓ ${file} -- "${term}"`);
  } else {
    console.log(`✗ ${file} -- לא נמצא "${term}"`);
    failed++;
  }
}

if (fs.existsSync(PAGEFIND_ENTRY)) {
  const entry = JSON.parse(fs.readFileSync(PAGEFIND_ENTRY, "utf8"));
  const count = entry.languages?.he?.page_count ?? 0;
  console.log(`\nPagefind: ${count} עמודים באינדקס (he)`);
  if (count < 85) {
    console.log("⚠ מעט מדי עמודים -- בדוק build:full");
    failed++;
  }
} else {
  console.log("\n⚠ public/pagefind/pagefind-entry.json חסר");
  failed++;
}

if (failed > 0) process.exit(1);
console.log("\nבדיקת Pagefind/HTML עברה.");
