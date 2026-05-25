import fs from "node:fs";
import path from "node:path";

const servicesTs = fs.readFileSync("lib/data/services.ts", "utf8");
const folders = [...servicesTs.matchAll(/assetsFolder:\s*"([^"]+)"/g)].map((m) => m[1]);
const unique = [...new Set(folders)];

const base = path.join("public", "images", "services");
const IMG = /\.(webp|jpe?g|png|svg|avif|gif)$/i;

for (const folder of unique.sort()) {
  const dir = path.join(base, ...folder.split("/"));
  const exists = fs.existsSync(dir);
  let count = 0;
  if (exists) {
    count = fs.readdirSync(dir).filter((n) => IMG.test(n)).length;
  }
  const status = !exists ? "MISSING_DIR" : count === 0 ? "EMPTY" : `OK(${count})`;
  console.log(`${status}\t${folder}`);
}
