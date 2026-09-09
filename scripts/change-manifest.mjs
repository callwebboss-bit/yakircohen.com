/**
 * חותם עבודה: תופס תמונת מצב של כל מה ששונה בעץ העבודה מול HEAD, ומאפשר
 * לאמת אחר כך ששום דבר לא אבד.
 *
 * למה: העבודה מועברת בין מכונות דרך Dropbox ונפרסת ממכונה אחרת, לפעמים בידי
 * סוכן שלא יצר אותה. סוכן שנתקע על בנייה נכשלת עלול "לתקן" אותה במחיקה,
 * ואין דרך לדעת. החותם הופך את זה לניתן לבדיקה במקום לניחוש.
 *
 *   node scripts/change-manifest.mjs --write    יוצר את החותם
 *   node scripts/change-manifest.mjs --verify   בודק שכלום לא אבד
 */
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const JSON_OUT = path.join(ROOT, "docs", "CHANGE-MANIFEST.json");
const MD_OUT = path.join(ROOT, "docs", "CHANGE-MANIFEST.md");
const mode = process.argv.includes("--verify") ? "verify" : "write";

function git(args) {
  return execFileSync("git", args, {
    cwd: ROOT,
    encoding: "utf8",
    maxBuffer: 128 * 1024 * 1024,
  });
}

function sha(file) {
  return createHash("sha256").update(fs.readFileSync(file)).digest("hex").slice(0, 16);
}

/** כל מה ששונה מול HEAD: שונה, חדש, נמחק */
function collect() {
  const entries = [];
  for (const line of git(["status", "--porcelain=v1", "-z"]).split("\0")) {
    if (!line.trim()) continue;
    const status = line.slice(0, 2);
    const file = line.slice(3);
    if (!file) continue;
    if (file.startsWith(".lighthouse/") || file === ".mcp.json") continue;
    /* החותם עצמו משתנה בכל כתיבה, ולכן אינו יכול להיות חלק ממה שהוא מאמת */
    if (file.startsWith("docs/CHANGE-MANIFEST.")) continue;

    const abs = path.join(ROOT, file);
    const exists = fs.existsSync(abs) && fs.statSync(abs).isFile();
    const kind =
      status.includes("D") ? "deleted" : status.includes("?") ? "added" : "modified";

    if (kind !== "deleted" && !exists) continue;

    entries.push({
      file,
      kind,
      hash: kind === "deleted" ? null : sha(abs),
      bytes: kind === "deleted" ? null : fs.statSync(abs).size,
    });
  }
  return entries.sort((a, b) => a.file.localeCompare(b.file));
}

/** תיקיות שלמות שלא עוקבים אחריהן מופיעות ב-status כשורה אחת */
function expandDirs(entries) {
  const out = [];
  for (const e of entries) {
    if (e.kind === "added" && e.file.endsWith("/")) {
      const walk = (dir) => {
        for (const d of fs.readdirSync(path.join(ROOT, dir), { withFileTypes: true })) {
          const rel = `${dir}${d.name}${d.isDirectory() ? "/" : ""}`;
          if (d.isDirectory()) walk(rel);
          else
            out.push({
              file: rel,
              kind: "added",
              hash: sha(path.join(ROOT, rel)),
              bytes: fs.statSync(path.join(ROOT, rel)).size,
            });
        }
      };
      walk(e.file);
    } else {
      out.push(e);
    }
  }
  return out.sort((a, b) => a.file.localeCompare(b.file));
}

if (mode === "write") {
  const entries = expandDirs(collect());
  const head = git(["rev-parse", "HEAD"]).trim();
  const branch = git(["rev-parse", "--abbrev-ref", "HEAD"]).trim();
  const counts = entries.reduce((acc, e) => ({ ...acc, [e.kind]: (acc[e.kind] ?? 0) + 1 }), {});

  fs.writeFileSync(
    JSON_OUT,
    JSON.stringify({ head, branch, counts, entries }, null, 2) + "\n",
    "utf8",
  );

  const byKind = (k) => entries.filter((e) => e.kind === k);
  const md = [
    "# חותם עבודה",
    "",
    "נוצר על ידי `node scripts/change-manifest.mjs --write`.",
    "לאימות אחרי העברה בין מכונות: `node scripts/change-manifest.mjs --verify`.",
    "",
    `בסיס: \`${branch}\` @ \`${head.slice(0, 12)}\``,
    "",
    `סה״כ: **${entries.length}** קבצים. חדשים ${counts.added ?? 0}, ` +
      `שונו ${counts.modified ?? 0}, נמחקו ${counts.deleted ?? 0}.`,
    "",
    "> האימות משווה תוכן, לא רק קיום. אם קובץ נמחק, שוחזר לגרסה הישנה,",
    "> או שונה אחרי יצירת החותם, האימות ייכשל ויגיד בדיוק על מה.",
    "",
    "## קבצים חדשים",
    "",
    ...byKind("added").map((e) => `- \`${e.file}\``),
    "",
    "## קבצים שנמחקו בכוונה",
    "",
    ...byKind("deleted").map((e) => `- \`${e.file}\``),
    "",
    "## קבצים ששונו",
    "",
    ...byKind("modified").map((e) => `- \`${e.file}\``),
    "",
  ].join("\n");
  fs.writeFileSync(MD_OUT, md, "utf8");

  console.log(
    `change-manifest -- נכתב חותם ל-${entries.length} קבצים ` +
      `(חדשים ${counts.added ?? 0}, שונו ${counts.modified ?? 0}, נמחקו ${counts.deleted ?? 0})`,
  );
  process.exit(0);
}

/* ── verify ─────────────────────────────────────────────────────────────── */
if (!fs.existsSync(JSON_OUT)) {
  console.error("change-manifest --verify: אין חותם. הריצו --write קודם.");
  process.exit(1);
}

const manifest = JSON.parse(fs.readFileSync(JSON_OUT, "utf8"));
const problems = [];

for (const e of manifest.entries) {
  const abs = path.join(ROOT, e.file);
  const exists = fs.existsSync(abs) && fs.statSync(abs).isFile();

  if (e.kind === "deleted") {
    if (exists) {
      problems.push({
        file: e.file,
        what: "היה אמור להימחק, אבל קיים שוב",
        why: "מישהו שחזר אותו, או ש-git checkout החזיר אותו.",
      });
    }
    continue;
  }

  if (!exists) {
    problems.push({
      file: e.file,
      what: e.kind === "added" ? "קובץ חדש נעלם" : "קובץ ששונה נעלם",
      why: "נמחק אחרי יצירת החותם. אם זה קובץ חדש, כל העבודה בו אבדה.",
    });
    continue;
  }

  if (sha(abs) !== e.hash) {
    problems.push({
      file: e.file,
      what: "התוכן שונה מאז החותם",
      why: "או שמישהו ערך אותו, או ששוחזר לגרסה הישנה. אם לא ערכתם אותו במכוון, זו אבידה.",
    });
  }
}

console.log("=== change-manifest --verify ===\n");
console.log(`חותם: ${manifest.entries.length} קבצים, בסיס ${manifest.branch} @ ${manifest.head.slice(0, 12)}\n`);

if (problems.length === 0) {
  console.log("תקין. כל הקבצים בחותם קיימים ותוכנם זהה. שום דבר לא אבד.");
  process.exit(0);
}

console.error(`נמצאו ${problems.length} פערים:\n`);
for (const p of problems) {
  console.error(`  ✗ ${p.file}`);
  console.error(`     ${p.what}`);
  console.error(`     ${p.why}\n`);
}
console.error("שחזור: git stash list, או Dropbox version history על הקובץ.");
process.exit(1);
