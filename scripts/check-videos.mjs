/**
 * בדיקת תקינות של כל סרטוני היוטיוב באתר.
 *
 * שולף כל מזהה יוטיוב מהקוד והתוכן (lib, components, app), בודק אותו מול
 * oEmbed של יוטיוב, ומדפיס טבלה של מזהה, קובץ וסטטוס.
 *
 *   200      OK        הסרטון קיים וניתן להטמעה
 *   404      BROKEN    נמחק או פרטי
 *   401      BROKEN    הבעלים חסם הטמעה, הנגן בעמוד ייכשל
 *   אחר      UNKNOWN   429, 5xx, timeout, אין רשת: מוצג, אבל לא מפיל
 *
 * יוצא בקוד 1 אם יש סרטון עם 401 או 404 (או אם לא נמצא אף מזהה, כי אז כנראה
 * הסריקה לא ראתה את התוכן). כל תוצאה אחרת היא קוד 0.
 *
 * הרצה:  node scripts/check-videos.mjs
 * דגלים: --quiet       מדפיס רק שורות שאינן OK
 *        --root <dir>  שורש אחר לסריקה (לבדיקות)
 *
 * preflight-deploy.mjs מייבא מכאן את runVideoCheck.
 */
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative, resolve, sep } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const DEFAULT_ROOT = fileURLToPath(new URL("..", import.meta.url));
const SCAN_DIRS = ["lib", "components", "app"];
const SKIP_DIRS = new Set(["node_modules", ".next", "baselines"]);
const SOURCE_FILE = /\.(ts|tsx|mjs|js)$/;
// פיקסצ'רים של בדיקות הם לא תוכן אתר
const TEST_FILE = /\.test\.(ts|tsx|mjs|js)$/;

// ערך של 11 תווים נחשב מזהה סרטון רק כשהמפתח שלו עצמו מדבר על סרטון
// (videoId, youtubeId, video). חלון של 40 תווים לפני הנקודתיים תפס מילים
// משורות סמוכות והפך ל-FAIL את "VideoObject", "bat-mitzvah" ו-"bat_mitzvah".
const VIDEO_KEY = /video|youtube|embed/i;
const KEY_VALUE = /["']?([\w$@-]+)["']?\s*:\s*["']([A-Za-z0-9_-]{11})["']/g;

// כל ערך במפות של youtube-embeds.ts הוא מזהה, גם כשהמפתח לא מצוטט (batMitzvahClips)
const EMBEDS_FILE = "lib/data/youtube-embeds.ts";
const EMBED_MAP_VALUE = /["']?[\w-]+["']?:\s*["']([A-Za-z0-9_-]{11})["']/g;

// מזהה בתוך קישור מלא. רוב התוכן (שירי חתונה, קבלת פנים, בת מצווה) שמור כך
// ולא תחת מפתח של וידאו. ההסתכלות קדימה מונעת לקחת 11 תווים מתוך מחרוזת ארוכה.
const URL_FORM =
  /(?:youtube(?:-nocookie)?\.com\/(?:watch\?(?:[^"'`\s]*?&(?:amp;)?)?v=|embed\/|shorts\/|live\/)|youtu\.be\/|i\.ytimg\.com\/vi\/)([A-Za-z0-9_-]{11})(?![A-Za-z0-9_-])/g;

// שני נתיבי embed שאורכם במקרה 11 תווים, ואינם מזהה סרטון
const NOT_AN_ID = new Set(["videoseries", "live_stream"]);

function walk(dir, files = []) {
  if (!existsSync(dir)) return files;
  for (const name of readdirSync(dir)) {
    if (SKIP_DIRS.has(name)) continue;
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, files);
    else if (SOURCE_FILE.test(name) && !TEST_FILE.test(name)) files.push(p);
  }
  return files;
}

function lineAt(text, index) {
  let line = 1;
  for (let i = text.indexOf("\n"); i !== -1 && i < index; i = text.indexOf("\n", i + 1)) line++;
  return line;
}

/** מחזיר Map של מזהה -> [{file, line}] כשהנתיב יחסי לשורש. */
export function collectVideoIds(root = DEFAULT_ROOT) {
  const ids = new Map();
  const add = (id, file, line) => {
    if (NOT_AN_ID.has(id)) return;
    if (!ids.has(id)) ids.set(id, []);
    ids.get(id).push({ file, line });
  };
  const rel = (file) => relative(root, file).split(sep).join("/");

  for (const dir of SCAN_DIRS) {
    for (const file of walk(join(root, dir))) {
      const text = readFileSync(file, "utf8");
      const name = rel(file);
      for (const m of text.matchAll(KEY_VALUE)) {
        if (VIDEO_KEY.test(m[1])) add(m[2], name, lineAt(text, m.index));
      }
      for (const m of text.matchAll(URL_FORM)) {
        add(m[1], name, lineAt(text, m.index));
      }
    }
  }

  const embeds = join(root, EMBEDS_FILE);
  if (existsSync(embeds)) {
    const text = readFileSync(embeds, "utf8");
    for (const m of text.matchAll(EMBED_MAP_VALUE)) {
      add(m[1], EMBEDS_FILE, lineAt(text, m.index));
    }
  }

  for (const locs of ids.values()) {
    locs.sort((a, b) => (a.file === b.file ? a.line - b.line : a.file < b.file ? -1 : 1));
  }
  return ids;
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/** בודק מזהה אחד. state הוא ok, broken או unknown. */
export async function checkVideo(id, { timeoutMs = 10000, retries = 1 } = {}) {
  const url = new URL("https://www.youtube.com/oembed");
  url.searchParams.set("url", `https://www.youtube.com/watch?v=${id}`);
  url.searchParams.set("format", "json");

  let status = "UNKNOWN";
  let networkError = false;
  for (let attempt = 0; attempt <= retries; attempt++) {
    networkError = false;
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(timeoutMs) });
      // קוראים את הגוף כדי שהחיבור יחזור למאגר גם ב-500 בקשות רצופות
      try {
        await res.arrayBuffer();
      } catch {}
      if (res.ok) return { id, state: "ok", status: "OK" };
      if (res.status === 401 || res.status === 404) {
        return { id, state: "broken", status: `BROKEN ${res.status}` };
      }
      status = `UNKNOWN ${res.status}`;
    } catch (e) {
      networkError = true;
      status = `UNKNOWN ${e?.name === "TimeoutError" ? "timeout" : (e?.cause?.code ?? e?.message ?? "error")}`;
    }
    if (attempt < retries) await sleep(1000);
  }
  return { id, state: "unknown", status, networkError };
}

/**
 * בודק רשימת מזהים עם כמה בקשות במקביל. התוצאות באותו סדר כמו הקלט.
 * אם סבב שלם של בקשות רצופות נכשל ברמת הרשת (לא תשובת HTTP), אין רשת ליוטיוב:
 * המזהים שנשארו לא נבדקים, כדי שהרצה בלי חיבור לא תיתקע על ניסיונות חוזרים.
 */
export async function checkVideos(ids, { concurrency = 8, ...options } = {}) {
  const results = new Array(ids.length);
  let next = 0;
  let consecutiveNetworkFailures = 0;
  let offline = false;
  async function worker() {
    while (next < ids.length) {
      const i = next++;
      if (offline) {
        results[i] = { id: ids[i], state: "unknown", status: "UNKNOWN no-network" };
        continue;
      }
      results[i] = await checkVideo(ids[i], options);
      if (results[i].networkError) {
        if (++consecutiveNetworkFailures >= concurrency) offline = true;
      } else {
        consecutiveNetworkFailures = 0;
      }
    }
  }
  await Promise.all(Array.from({ length: Math.min(concurrency, ids.length) }, worker));
  return results;
}

/** הקובץ הראשון של מזהה, ואם יש עוד מופעים: +N. */
export function describeLocations(locs) {
  const first = `${locs[0].file}:${locs[0].line}`;
  return locs.length > 1 ? `${first} (+${locs.length - 1})` : first;
}

/** אוסף, בודק, ומחזיר שורות מוכנות להדפסה. */
export async function runVideoCheck(root = DEFAULT_ROOT, options = {}) {
  const found = collectVideoIds(root);
  const ids = [...found.keys()].sort();
  const results = await checkVideos(ids, options);
  const rows = results.map((r) => ({
    id: r.id,
    file: describeLocations(found.get(r.id)),
    status: r.status,
    state: r.state,
  }));
  return {
    rows,
    broken: rows.filter((r) => r.state === "broken"),
    unknown: rows.filter((r) => r.state === "unknown"),
  };
}

export function formatTable(rows) {
  const idWidth = 11;
  const fileWidth = Math.max("FILE".length, ...rows.map((r) => r.file.length));
  const line = (r) => `${r.id.padEnd(idWidth)}  ${r.file.padEnd(fileWidth)}  ${r.status}`;
  return [
    line({ id: "ID", file: "FILE", status: "STATUS" }),
    line({ id: "-".repeat(idWidth), file: "-".repeat(fileWidth), status: "------" }),
    ...rows.map(line),
  ].join("\n");
}

async function main() {
  const args = process.argv.slice(2);
  const rootFlag = args.indexOf("--root");
  const root = rootFlag !== -1 ? resolve(args[rootFlag + 1] ?? "") : DEFAULT_ROOT;
  const quiet = args.includes("--quiet");

  const { rows, broken, unknown } = await runVideoCheck(root);
  if (!rows.length) {
    console.error(`לא נמצא אף מזהה יוטיוב תחת ${root}. כנראה השורש שגוי, ולכן אין מה לבדוק.`);
    process.exitCode = 1;
    return;
  }

  const shown = quiet ? rows.filter((r) => r.state !== "ok") : rows;
  if (shown.length) console.log(formatTable(shown));

  const ok = rows.length - broken.length - unknown.length;
  console.log(
    `\nסך הכל ${rows.length} מזהים: ${ok} תקינים, ${broken.length} שבורים, ${unknown.length} לא נבדקו`,
  );
  if (unknown.length) {
    console.log("מזהים שלא נבדקו (429, שגיאת שרת או רשת) לא מפילים את הבדיקה. כדאי להריץ שוב.");
  }
  if (broken.length) {
    console.log("\nשבורים (404 = נמחק או פרטי, 401 = ההטמעה חסומה אצל הבעלים):\n");
    console.log(formatTable(broken));
    process.exitCode = 1;
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  await main();
}
