/**
 * audit:ai-tells - נכשל אם נמצאים "סימני מים רובוטיים" / כתיבה לא-אנושית בקופי.
 *
 * סורק את מקורות הקופי (lib, components, app) ומאתר תווים טיפוגרפיים שנחשבים
 * לחתימה של כתיבת AI ולא נהוגים בעברית אנושית. ראו docs/HUMAN-COPY-GUIDELINES.md.
 *
 * מוחרג: קבצים שנוצרים אוטומטית (*.generated.*), טסטים, ו-lib/mashup-copy-humanize.ts
 * (מנרמל מקפים בזמן ריצה - מכיל אותם בכוונה בתוך regex).
 */
import fs from "node:fs";
import path from "node:path";

const ROOTS = ["lib", "components", "app"];
const EXTS = new Set([".ts", ".tsx"]);
const SKIP = /node_modules|\.next|\.git|\.generated\.|[/\\]generated[/\\]|\.test\.|mashup-copy-humanize/;

/** תו/ישות אסורים -> ההחלפה האנושית המומלצת (לתיעוד בלבד) */
const BANNED = [
  { re: /—/g, name: "em-dash — (U+2014)", fix: 'מקף רגיל עם רווחים " - "' },
  { re: /–/g, name: "en-dash – (U+2013)", fix: 'מקף רגיל "-"' },
  { re: /…/g, name: "ellipsis … (U+2026)", fix: 'שלוש נקודות "..."' },
  { re: /[“”]/g, name: "curly double-quote “ ” (U+201C/D)", fix: 'מרכאות ישרות " או גרשיים ״' },
  { re: /[‘’]/g, name: "curly single-quote ‘ ’ (U+2018/9)", fix: "גרש ' או ׳" },
  { re: /&mdash;/g, name: "entity &mdash;", fix: '" - "' },
  { re: /&ndash;/g, name: "entity &ndash;", fix: '"-"' },
  { re: /&ldquo;|&rdquo;/g, name: "entity &ldquo;/&rdquo;", fix: "&quot;" },
  { re: /&lsquo;|&rsquo;/g, name: "entity &lsquo;/&rsquo;", fix: "&#39;" },
  { re: /&hellip;/g, name: "entity &hellip;", fix: '"..."' },
];

const files = [];
function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (SKIP.test(p)) continue;
    if (entry.isDirectory()) walk(p);
    else if (EXTS.has(path.extname(entry.name))) files.push(p);
  }
}
for (const root of ROOTS) {
  if (fs.existsSync(root)) walk(root);
}

const hits = [];
for (const file of files) {
  const lines = fs.readFileSync(file, "utf8").split("\n");
  for (let i = 0; i < lines.length; i++) {
    for (const { re, name, fix } of BANNED) {
      re.lastIndex = 0;
      if (re.test(lines[i])) {
        hits.push({ file, line: i + 1, name, fix, text: lines[i].trim().slice(0, 100) });
      }
    }
  }
}

if (hits.length > 0) {
  console.error(`\naudit:ai-tells FAILED - ${hits.length} robotic/AI typographic marks found:\n`);
  for (const h of hits) {
    console.error(`  ${h.file}:${h.line}  [${h.name} -> ${h.fix}]`);
    console.error(`     ${h.text}`);
  }
  console.error(`\nSee docs/HUMAN-COPY-GUIDELINES.md. Fix the marks above so the copy reads human.\n`);
  process.exit(1);
}

console.log(`OK: no robotic/AI typographic marks in ${files.length} source files.`);
