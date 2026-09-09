/**
 * קול מותגי: בלי סימני קריאה בקופי בעברית.
 *
 * הגרסה הקודמת סרקה קובץ אחד בלבד (DjJerusalemPageContent.tsx) ולכן לא יכלה
 * להיכשל. כאן סורקים את כל הקופי, אבל רק בתוך מחרוזות שמכילות עברית, כדי
 * שאופרטורים של JS (!x, !==, a!.b) לא ייספרו.
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const SCAN_DIRS = ["lib/data", "components", "app"].map((d) => path.join(ROOT, d));

/* קבצים שבהם סימן קריאה הוא נתון ולא קופי */
const SKIP_FILE = /\.(test|spec)\.tsx?$|\.generated\.|mashup-copy-humanize/;

const HEBREW = /[֐-׿]/;
/* מחרוזות בגרשיים כפולים, בודדים, ובבקטיק */
const STRING_RE = /"([^"\\\n]*(?:\\.[^"\\\n]*)*)"|'([^'\\\n]*(?:\\.[^'\\\n]*)*)'|`([^`\\]*(?:\\.[^`\\]*)*)`/g;

function walk(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (e.name === "node_modules" || e.name === ".next") continue;
      walk(full, out);
    } else if (/\.(tsx?|mjs)$/.test(e.name) && !SKIP_FILE.test(e.name)) {
      out.push(full);
    }
  }
  return out;
}

const hits = [];

for (const file of walk(SCAN_DIRS[0]).concat(walk(SCAN_DIRS[1]), walk(SCAN_DIRS[2]))) {
  const text = fs.readFileSync(file, "utf8");
  if (!HEBREW.test(text) || !text.includes("!")) continue;

  const lines = text.split("\n");
  for (let i = 0; i < lines.length; i++) {
    STRING_RE.lastIndex = 0;
    let m;
    while ((m = STRING_RE.exec(lines[i])) !== null) {
      /* בתוך בקטיק, ${...} הוא קוד ולא קופי: `${n !== 1 ? ...}` אינו סימן קריאה. */
      const value = (m[1] ?? m[2] ?? m[3] ?? "").replace(/\$\{[^}]*\}/g, "");
      if (!HEBREW.test(value) || !value.includes("!")) continue;
      hits.push({
        file: path.relative(ROOT, file),
        line: i + 1,
        text: value.trim().slice(0, 100),
      });
    }
  }
}

if (hits.length > 0) {
  console.error(`audit:exclamation -- ${hits.length} סימני קריאה בקופי עברי:`);
  for (const h of hits) console.error(`  ${h.file}:${h.line}  ${h.text}`);
  process.exit(1);
}

console.log("audit:exclamation OK -- אין סימני קריאה בקופי עברי");
