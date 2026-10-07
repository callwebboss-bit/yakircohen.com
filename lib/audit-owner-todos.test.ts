/**
 * בדיקות לשער scripts/audit-owner-todos.mjs. כל בדיקה בונה עץ זמני קטן,
 * ולא נוגעת בקבצי הפרויקט. הסימון מורכב ממחרוזות: הקובץ הזה בתוך lib, ולכן
 * נסרק על ידי השער עצמו, ורצף אחד היה מכשיל אותו.
 */
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { after, describe, it } from "node:test";
import { findOwnerTodos } from "../scripts/audit-owner-todos.mjs";

const MARKER = "[[" + "TODO-OWNER: מחיר]]";
const SCRIPT = path.resolve(import.meta.dirname, "../scripts/audit-owner-todos.mjs");

const made: string[] = [];

/** יוצר עץ זמני מ"נתיב -> תוכן" */
function tree(files: Record<string, string | Buffer>): string {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "owner-todos-"));
  made.push(root);
  for (const [rel, content] of Object.entries(files)) {
    const full = path.join(root, rel);
    fs.mkdirSync(path.dirname(full), { recursive: true });
    fs.writeFileSync(full, content);
  }
  return root;
}

function runGate(cwd: string) {
  return spawnSync(process.execPath, [SCRIPT], { cwd, encoding: "utf8" });
}

after(() => {
  for (const dir of made) fs.rmSync(dir, { recursive: true, force: true });
});

describe("audit-owner-todos", () => {
  it("עץ נקי: אין מופעים ויוצא 0", () => {
    const root = tree({
      "app/page.tsx": "export default function P() { return null; }\n",
      "lib/data/x.ts": 'export const X = "ערך";\n',
    });
    assert.equal(findOwnerTodos(root).hits.length, 0);
    const run = runGate(root);
    assert.equal(run.status, 0, run.stderr);
  });

  it("מדפיס כל מופע עם קובץ ושורה ויוצא 1", () => {
    const root = tree({
      "lib/data/kids.ts": `const a = 1;\nconst b = 2;\nconst price = "${MARKER}";\n`,
      "components/Foo.tsx": `<p>${MARKER}</p>\n`,
    });
    const { hits } = findOwnerTodos(root);
    assert.equal(hits.length, 2);
    assert.deepEqual(
      hits.map((h) => `${h.file}:${h.line}`).sort(),
      ["components/Foo.tsx:1", "lib/data/kids.ts:3"],
    );
    const run = runGate(root);
    assert.equal(run.status, 1);
    assert.match(run.stderr, /lib\/data\/kids\.ts:3/);
    assert.match(run.stderr, /components\/Foo\.tsx:1/);
  });

  it("תופס גם כמה סימונים באותו קובץ, ובקבצי txt ו-json", () => {
    const root = tree({
      "public/llms.txt": `שורה\n- ${MARKER}\n- ${MARKER}\n`,
      "lib/seo/schema.json": `{"answer": "${MARKER}"}\n`,
    });
    const { hits } = findOwnerTodos(root);
    assert.equal(hits.length, 3);
  });

  it("סימון שנחתך אחרי הרישא עדיין נתפס", () => {
    const root = tree({ "app/a.tsx": `<p>${"[[" + "TODO-OWNER"}</p>\n` });
    assert.equal(findOwnerTodos(root).hits.length, 1);
  });

  it("לא סורק scripts, docs, node_modules ו-.next", () => {
    const root = tree({
      "app/ok.tsx": "export {};\n",
      "scripts/note.mjs": `// ${MARKER}\n`,
      "docs/plan.md": `${MARKER}\n`,
      "lib/node_modules/pkg/index.js": `${MARKER}\n`,
      "app/.next/cache.txt": `${MARKER}\n`,
    });
    assert.equal(findOwnerTodos(root).hits.length, 0);
  });

  it("מדלג על קובץ בינארי", () => {
    const binary = Buffer.concat([
      Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x00, 0x00]),
      Buffer.from(MARKER, "utf8"),
    ]);
    const root = tree({ "public/image.png": binary, "app/ok.tsx": "export {};\n" });
    const result = findOwnerTodos(root);
    assert.equal(result.hits.length, 0);
    assert.equal(result.scannedFiles, 1);
  });

  it("הרצה מתיקייה בלי app/components/lib/public נכשלת עם 2 ולא עוברת בשקט", () => {
    const root = tree({ "unrelated/file.txt": "x\n" });
    const run = runGate(root);
    assert.equal(run.status, 2);
    assert.match(run.stderr, /לא נמצאה/);
  });

  it("ייבוא של הסקריפט לא מפעיל סריקה ולא יוצא מהתהליך", () => {
    /* הגענו לכאן, כלומר ה-import בראש הקובץ לא קרא ל-process.exit */
    assert.equal(typeof findOwnerTodos, "function");
  });
});
