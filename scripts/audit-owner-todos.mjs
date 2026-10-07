/**
 * audit:owner-todos - שער נגד דליפת סימוני "חסר מידע מהבעלים" לפרודקשן.
 *
 * למה זה קיים: עמוד חדש (למשל /studio/kids-birthday) נבנה לפני שהבעלים נתן את
 * כל העובדות שלו: גיל, כמות ילדים, מחיר, מה מקבלים הביתה. עובדה שחסרה לא
 * מנחשים. היא נכתבת בקוד כסימון, והעמוד מציג אותו עד שהבעלים ממלא. סימון כזה
 * שמגיע לאתר החי הוא עמוד שמציג לגולש "TODO". השער הזה מבטיח שזה לא יקרה.
 *
 * הסימון: שתי סוגריים מרובעות פותחות, ואחריהן TODO-OWNER ונקודותיים
 * (דוגמה בקובץ lib/data/kids-birthday.ts). הסריקה מחפשת את הרישא של הסימון,
 * ולכן גם סימון שנחתך אחרי הרישא נתפס. מכאן שהקובץ הזה ובדיקותיו לא כותבים
 * אותו כרצף אחד: הם מרכיבים אותו ממחרוזות, אחרת השער היה נכשל על עצמו.
 *
 * מה נסרק: app, components, lib, public. כל קובץ טקסט, בכל סיומת. קובץ בינארי
 * (בייט NUL בשמונת הקילובייטים הראשונים) מדולג. node_modules, .next ו-.git
 * לא נסרקים.
 *
 * מה הוא לא סורק, במפורש: scripts, docs ו-cypress. הם לא נשלחים לגולש. אם
 * סימון נמצא שם הוא לא דליפה.
 *
 * התנהגות רצויה: השער נכשל כל עוד יש סימון אחד לפחות. ענף שנכשל כאן רק בגלל
 * סימונים אינו שבור, הוא פשוט עוד לא מוכן ל-main. הפלט מדפיס כל מופע עם קובץ
 * ושורה, כדי שמי שממלא ידע בדיוק איפה.
 *
 * קודי יציאה: 0 נקי. 1 נמצאו סימונים. 2 הרצה מתיקייה שאינה שורש הפרויקט
 * (אף אחת מארבע התיקיות לא קיימת), כדי שסריקה על כלום לא תעבור בשקט.
 *
 * הרצה:  node scripts/audit-owner-todos.mjs   (או npm run audit:owner-todos)
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

/** התיקיות שנשלחות לגולש או משפיעות על מה שנשלח */
export const SCAN_DIRS = ["app", "components", "lib", "public"];

const SKIP_DIRS = new Set(["node_modules", ".next", ".git"]);

/* הרישא של הסימון, מורכבת כדי שהקובץ הזה לא יכיל אותה כרצף */
const MARKER_HEAD = "[[" + "TODO-OWNER";

const BINARY_SNIFF_BYTES = 8192;

function looksBinary(buffer) {
  const end = Math.min(buffer.length, BINARY_SNIFF_BYTES);
  for (let i = 0; i < end; i++) {
    if (buffer[i] === 0) return true;
  }
  return false;
}

function* walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (SKIP_DIRS.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(full);
    else if (entry.isFile()) yield full;
  }
}

/**
 * סורק את root ומחזיר את כל המופעים.
 * @param {string} root שורש הפרויקט
 * @returns {{ hits: { file: string; line: number; text: string }[]; scannedFiles: number; scannedDirs: string[] }}
 */
export function findOwnerTodos(root) {
  const hits = [];
  const scannedDirs = [];
  let scannedFiles = 0;

  for (const dirName of SCAN_DIRS) {
    const dir = path.join(root, dirName);
    if (!fs.existsSync(dir)) continue;
    scannedDirs.push(dirName);

    for (const file of walk(dir)) {
      const buffer = fs.readFileSync(file);
      if (looksBinary(buffer)) continue;
      scannedFiles += 1;

      const text = buffer.toString("utf8");
      if (!text.includes(MARKER_HEAD)) continue;

      const lines = text.split("\n");
      for (let i = 0; i < lines.length; i++) {
        if (lines[i].includes(MARKER_HEAD)) {
          hits.push({
            file: path.relative(root, file).split(path.sep).join("/"),
            line: i + 1,
            text: lines[i].trim().slice(0, 140),
          });
        }
      }
    }
  }

  return { hits, scannedFiles, scannedDirs };
}

function main() {
  const root = process.cwd();
  const { hits, scannedFiles, scannedDirs } = findOwnerTodos(root);

  console.log("=== audit:owner-todos ===\n");

  if (scannedDirs.length === 0) {
    console.error(
      `  ✗ אף אחת מהתיקיות ${SCAN_DIRS.join(", ")} לא נמצאה ב-${root}.`,
    );
    console.error("    סריקה על כלום עוברת תמיד, ולכן היא נכשלת כאן.");
    console.error("    להריץ משורש הפרויקט.\n");
    process.exit(2);
  }

  if (hits.length > 0) {
    console.error(`  ✗ נמצאו ${hits.length} סימוני חסר-מידע-מהבעלים בקוד:\n`);
    for (const hit of hits) {
      console.error(`    ${hit.file}:${hit.line}`);
      console.error(`      ${hit.text}`);
    }
    console.error(
      "\n  הענף הזה לא מוכן ל-main. למלא כל שדה (ערך במקום null) ולרוקן את הסימון שלצידו.",
    );
    console.error(
      "  הכישלון כאן הוא התנהגות רצויה: עמוד עם סימון כזה היה מציג לגולש TODO.\n",
    );
    process.exit(1);
  }

  console.log(
    `  נקי. נסרקו ${scannedFiles} קבצים ב-${scannedDirs.join(", ")}. אין סימוני חסר-מידע.`,
  );
}

/* מריצים רק כשהקובץ נקרא ישירות. ייבוא (בבדיקות) לא מפעיל סריקה ולא יוצא. */
const invokedDirectly =
  process.argv[1] !== undefined &&
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (invokedDirectly) main();
