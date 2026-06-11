import { writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { buildSiteSchema } from "../lib/seo/build-site-schema";

const outPath = resolve(import.meta.dirname, "../lib/seo/site-schema.json");
writeFileSync(outPath, `${JSON.stringify(buildSiteSchema(), null, 2)}\n`, "utf8");
console.log(`Wrote ${outPath}`);
