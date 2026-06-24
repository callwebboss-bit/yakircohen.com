import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const AUDIO_DIR = path.join(ROOT, "public", "audio");
const MP3 = /\.mp3$/i;

/** Scan source for /audio/... references (string literals). */
function collectAudioRefs(dir, refs = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.name === "node_modules" || entry.name === ".next" || entry.name === "public/pagefind") {
      continue;
    }
    if (entry.isDirectory()) {
      collectAudioRefs(full, refs);
      continue;
    }
    if (!/\.(tsx?|jsx?|mjs|md|json)$/.test(entry.name)) continue;
    const text = fs.readFileSync(full, "utf8");
    const re = /\/audio\/[^\s"'`<>]+?\.mp3/gi;
    let m;
    while ((m = re.exec(text)) !== null) {
      refs.push({ file: path.relative(ROOT, full), ref: m[0] });
    }
  }
  return refs;
}

function basenameRef(ref) {
  return ref.split("/").pop() ?? ref;
}

const diskFiles = fs.existsSync(AUDIO_DIR)
  ? fs
      .readdirSync(AUDIO_DIR)
      .filter((n) => MP3.test(n))
      .sort()
  : [];

const diskLower = new Map(diskFiles.map((f) => [f.toLowerCase(), f]));
const refs = collectAudioRefs(ROOT);

const refPaths = [...new Set(refs.map((r) => r.ref))];
const refBasenames = refPaths.map(basenameRef);

const orphans = diskFiles.filter(
  (f) => !refBasenames.some((b) => b.toLowerCase() === f.toLowerCase()),
);

const broken = [];
const caseMismatch = [];

for (const ref of refPaths) {
  const base = basenameRef(ref);
  const onDisk = diskLower.get(base.toLowerCase());
  if (!onDisk) {
    broken.push(ref);
    continue;
  }
  if (onDisk !== base) {
    caseMismatch.push({ ref, onDisk });
  }
}

let exitCode = 0;

console.log("=== Audio demo audit ===\n");
console.log(`Files on disk (${diskFiles.length}): ${diskFiles.join(", ") || "(none)"}\n`);

if (orphans.length) {
  exitCode = 1;
  console.log("Orphan files (on disk, no code reference):");
  for (const f of orphans) console.log(`  - ${f}`);
  console.log();
}

if (broken.length) {
  exitCode = 1;
  console.log("Broken refs (in code, missing on disk):");
  for (const r of broken) {
    const sources = refs.filter((x) => x.ref === r).map((x) => x.file);
    console.log(`  - ${r}  ← ${sources.join(", ")}`);
  }
  console.log();
}

if (caseMismatch.length) {
  exitCode = 1;
  console.log("Case mismatch (breaks on Linux):");
  for (const { ref, onDisk } of caseMismatch) {
    console.log(`  - code: ${ref}  disk: /audio/${onDisk}`);
  }
  console.log();
}

if (!exitCode) {
  console.log("OK -- no orphan files, broken refs, or case mismatches.");
} else {
  console.log("Fix the issues above (warnings only in CI unless you wire a hard fail).");
}

process.exit(exitCode);
