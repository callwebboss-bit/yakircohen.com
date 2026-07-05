/**
 * One-off: replace em dash (—) in user-facing copy with comma or short hyphen.
 * Skips node_modules, .next, cypress, and internal tooling paths.
 */
import { readFileSync, writeFileSync, readdirSync, statSync } from "fs";
import { join } from "path";

const ROOT = new URL("..", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1");
const SKIP =
  /node_modules|\.next[/\\]|cypress[/\\]|scripts[/\\]fix-em-dash|book-wizard-cro[/\\]|hooks[/\\]useBookingWizard/;

function walk(dir, files = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (SKIP.test(p.replace(/\\/g, "/"))) continue;
    if (statSync(p).isDirectory()) {
      walk(p, files);
    } else if (/\.(tsx?|mdx)$/.test(name)) {
      files.push(p);
    }
  }
  return files;
}

let changed = 0;
for (const file of walk(ROOT)) {
  let content = readFileSync(file, "utf8");
  const original = content;
  content = content.replace(/ — /g, ", ");
  content = content.replace(/—/g, " - ");
  if (content !== original) {
    writeFileSync(file, content, "utf8");
    changed++;
    console.log(file.replace(ROOT, ""));
  }
}
console.log(`fix-em-dash: ${changed} files updated`);
