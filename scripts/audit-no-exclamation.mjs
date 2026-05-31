import fs from "node:fs";
import path from "node:path";

const TARGET = path.join(
  process.cwd(),
  "components",
  "seo",
  "DjJerusalemPageContent.tsx",
);

if (!fs.existsSync(TARGET)) {
  console.error(`Missing file: ${TARGET}`);
  process.exit(1);
}

const content = fs.readFileSync(TARGET, "utf8");
const lines = content.split("\n");
const hits = [];

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  if (!line.includes("!")) continue;

  const trimmed = line.trim();
  if (trimmed.startsWith("//") || trimmed.startsWith("*")) continue;
  if (line.includes("!==") || line.includes("!=")) continue;

  hits.push({ line: i + 1, text: trimmed });
}

if (hits.length > 0) {
  console.error("Found exclamation marks in DjJerusalemPageContent.tsx:");
  for (const hit of hits) {
    console.error(`  L${hit.line}: ${hit.text}`);
  }
  process.exit(1);
}

console.log("OK: no exclamation marks in DjJerusalemPageContent.tsx");
