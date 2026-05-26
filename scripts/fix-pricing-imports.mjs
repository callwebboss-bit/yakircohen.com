import fs from "node:fs";
import path from "node:path";

const dir = path.join(import.meta.dirname, "..", "components", "seo");
const imp =
  'import ServicePagePricingSection from "@/components/services/ServicePagePricingSection";\n';

for (const f of fs.readdirSync(dir).filter((x) => x.endsWith(".tsx"))) {
  const file = path.join(dir, f);
  let s = fs.readFileSync(file, "utf8");
  if (!s.includes("<ServicePagePricingSection")) continue;
  if (s.includes("ServicePagePricingSection from")) continue;
  s = s.replace(/(import ServicePageLayout[^\n]+\n)/, `$1${imp}`);
  fs.writeFileSync(file, s);
  console.log("import added:", f);
}
