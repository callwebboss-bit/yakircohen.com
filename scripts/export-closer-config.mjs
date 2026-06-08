/**
 * Exports pricing-catalog + book route presets for yakir-closer sync.
 * Output: local-tools/closer-config.json
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const CATALOG_FILE = path.join(ROOT, "lib", "data", "pricing-catalog.ts");
const ROUTES_FILE = path.join(ROOT, "lib", "data", "book-audience-routes.ts");
const OUT_FILE = path.join(ROOT, "..", "local-tools", "closer-config.json");

const VAT_RATE = 0.18;

function withVat(exVat) {
  return Math.round(exVat * (1 + VAT_RATE));
}

function parseCatalog(text) {
  const items = [];
  const re = /\{\s*id:\s*"([^"]+)"\s*,\s*label:\s*"([^"]+)"\s*,\s*exVat:\s*(\d+)\s*,\s*category:\s*"([^"]+)"/g;
  let m;
  while ((m = re.exec(text)) !== null) {
    items.push({
      id: m[1],
      label: m[2],
      exVat: Number(m[3]),
      withVat: withVat(Number(m[3])),
      category: m[4],
    });
  }
  return items;
}

function parseBookRoutes(text) {
  const routes = [];
  const blockRe = /\{\s*id:\s*"([^"]+)"[\s\S]*?closerServiceId:\s*"([^"]+)"[\s\S]*?priceExVat:\s*(\w+)/g;
  let m;
  while ((m = blockRe.exec(text)) !== null) {
    routes.push({
      id: m[1],
      closerServiceId: m[2],
      priceExVatRef: m[3],
    });
  }
  return routes;
}

const catalogText = fs.readFileSync(CATALOG_FILE, "utf8");
const routesText = fs.readFileSync(ROUTES_FILE, "utf8");

const catalog = parseCatalog(catalogText);
const routes = parseBookRoutes(routesText);

const payload = {
  generatedAt: new Date().toISOString(),
  vatRate: VAT_RATE,
  catalog,
  bookRoutePresets: routes,
};

fs.mkdirSync(path.dirname(OUT_FILE), { recursive: true });
fs.writeFileSync(OUT_FILE, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
console.log(`Wrote ${OUT_FILE} (${catalog.length} prices, ${routes.length} routes)`);
