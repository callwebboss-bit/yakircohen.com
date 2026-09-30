/**
 * audit-audio-weight.mjs - קבצי הדגמה שאינם עומדים בתקן של התיקייה עצמה.
 *
 * התקן כתוב ב-public/audio/README.md ונקבע על ידי הבעלים: "כל קובץ: MP3,
 * 20-60 שניות, מומלץ עד 2MB". נמדד 30.9.2026 שחמישה קבצים חורגים, והכבד
 * שבהם 7.2MB באורך 3:10. גולש שמשווה לפני ואחרי אינו מאזין לשלוש דקות,
 * והקובץ נטען בכל פתיחה של העמוד שמכיל אותו.
 *
 * השומר קורא את כותרת ה-MP3 ישירות, בלי ffmpeg: מדלג על תג ID3, מוצא את
 * הפריים הראשון, ומפענח קצב סיביות, תדר דגימה ומספר ערוצים. האורך נגזר
 * מגודל הקובץ חלקי קצב הסיביות, והוא מדויק לקובץ בקצב קבוע.
 *
 * החריגות הקיימות רשומות ב-KNOWN למטה עם הסיבה. קובץ חדש שחורג נכשל,
 * ורשומה ב-KNOWN שאינה תואמת אף קובץ נכשלת גם היא: רשומה מתה משתיקה
 * בדיקה, בדיוק כמו ב-audit:seo-diff וב-audit:prose-prices.
 */

import { existsSync, readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const AUDIO_DIR = join(ROOT, "public", "audio");

const MAX_BYTES = 2 * 1024 * 1024;
const MAX_SECONDS = 60;

/**
 * חריגות מוכרות, ממתינות לייצוא מחדש על ידי הבעלים.
 * להסיר רשומה ברגע שהקובץ מיוצא מחדש. ייצוא מחדש הוא החלטה שלו, כי אלה
 * הדוגמאות שמוכרות את השירות ורק הוא יודע איזה קטע בהן הכי משכנע.
 */
const KNOWN = [
  { file: "After-Pitch-Present.mp3", why: "דוגמת אחרי, 3:10 ב-320kbps. ממתינה לחיתוך לקטע של עד דקה" },
  { file: "Befor-pitch-yakir.mp3", why: "דוגמת לפני המקבילה, 3:04. לחתוך את אותו קטע בדיוק" },
  { file: "dry-vocal-raw.mp3", why: "קול יבש, 3:48. לחתוך לאותו קטע כמו full-production" },
  { file: "bride-blessing-tuned.mp3", why: "ברכת כלה אחרי, 1:35. קרוב לתקן, לחתוך ל-60 שניות" },
  { file: "bride-blessing-raw.mp3", why: "ברכת כלה לפני, 1:16. לחתוך לאותו קטע כמו הגרסה שאחרי" },
  { file: "full-production.mp3", why: "הפקה מלאה, 2:32. לחתוך לאותו קטע כמו dry-vocal-raw" },
];

const MPEG1_LAYER3_BITRATES = [
  0, 32, 40, 48, 56, 64, 80, 96, 112, 128, 160, 192, 224, 256, 320, 0,
];
const SAMPLE_RATES = { 0: 44100, 1: 48000, 2: 32000 };

/** קצב סיביות ואורך משוער מכותרת הפריים הראשון. null כשאין פריים תקין. */
function probeMp3(path) {
  const buf = readFileSync(path);
  let i = 0;
  if (buf.toString("ascii", 0, 3) === "ID3") {
    const size =
      ((buf[6] & 0x7f) << 21) | ((buf[7] & 0x7f) << 14) | ((buf[8] & 0x7f) << 7) | (buf[9] & 0x7f);
    i = 10 + size;
  }
  for (; i < buf.length - 4; i += 1) {
    if (buf[i] !== 0xff || (buf[i + 1] & 0xe0) !== 0xe0) continue;
    const version = (buf[i + 1] >> 3) & 3;
    const layer = (buf[i + 1] >> 1) & 3;
    if (version !== 3 || layer !== 1) continue;
    const kbps = MPEG1_LAYER3_BITRATES[(buf[i + 2] >> 4) & 0xf];
    const sampleRate = SAMPLE_RATES[(buf[i + 2] >> 2) & 3];
    if (!kbps || !sampleRate) continue;
    return {
      bytes: buf.length,
      kbps,
      channels: ((buf[i + 3] >> 6) & 3) === 3 ? 1 : 2,
      seconds: Math.round(((buf.length - i) * 8) / (kbps * 1000)),
    };
  }
  return null;
}

if (!existsSync(AUDIO_DIR)) {
  console.log("\n=== audit:audio-weight ===\n\nאין תיקיית public/audio. אין מה לבדוק.\n");
  process.exit(0);
}

const files = readdirSync(AUDIO_DIR).filter((f) => f.toLowerCase().endsWith(".mp3"));
const known = new Map(KNOWN.map((k) => [k.file, k]));
const used = new Set();
const problems = [];
const tracked = [];

for (const file of files.sort()) {
  const info = probeMp3(join(AUDIO_DIR, file));
  if (!info) {
    problems.push(`${file}\n      לא נמצא פריים MP3 תקין. האם זה באמת MP3?`);
    continue;
  }
  const tooBig = info.bytes > MAX_BYTES;
  const tooLong = info.seconds > MAX_SECONDS;
  if (!tooBig && !tooLong) continue;

  const detail =
    `${(info.bytes / 1048576).toFixed(1)}MB · ${info.kbps}kbps · ` +
    `${info.channels === 1 ? "מונו" : "סטריאו"} · ${Math.floor(info.seconds / 60)}:${String(info.seconds % 60).padStart(2, "0")}`;

  const entry = known.get(file);
  if (entry) {
    used.add(file);
    tracked.push(`${file} (${detail})\n      ${entry.why}`);
  } else {
    problems.push(
      `${file} (${detail})\n      חורג מהתקן של התיקייה: עד ${MAX_BYTES / 1048576}MB ועד ${MAX_SECONDS} שניות`,
    );
  }
}

for (const entry of KNOWN) {
  if (!used.has(entry.file)) {
    problems.push(`${entry.file}\n      רשומה ב-KNOWN שאינה תואמת קובץ חורג. להסיר אותה`);
  }
}

console.log("\n=== audit:audio-weight ===\n");

if (problems.length > 0) {
  console.error(`  ✗ ${problems.length} בעיות:\n`);
  for (const p of problems) console.error("    " + p);
  console.error("\n    התקן כתוב ב-public/audio/README.md: MP3, 20-60 שניות, עד 2MB.");
  console.error("    קובץ חדש שחורג: לחתוך אותו לקטע שבאמת מדגים, ולייצא מחדש.\n");
  process.exit(1);
}

console.log(`תקין. ${files.length} קבצי אודיו, אין חריגה חדשה.`);
if (tracked.length > 0) {
  console.log(`\n  ${tracked.length} חריגות מוכרות, ממתינות לייצוא מחדש:`);
  for (const t of tracked) console.log("    " + t);
  console.log(
    `\n  יחד הן ${(
      files
        .filter((f) => known.has(f))
        .reduce((sum, f) => sum + (probeMp3(join(AUDIO_DIR, f))?.bytes ?? 0), 0) / 1048576
    ).toFixed(1)}MB שנטענים מהאתר.`,
  );
}
console.log("");
