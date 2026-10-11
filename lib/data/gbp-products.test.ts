import assert from "node:assert/strict";
import { existsSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";
import { CATALOG_VAT_RATE, getExVat, getPriceById } from "@/lib/data/pricing-catalog";
import { GBP_PRODUCTS } from "@/lib/data/gbp-products";
import { buildGbpSheet } from "@/lib/data/gbp-products-sheet";

/** כל המסלולים של app/, בלי קבוצות (services) */
function appRoutes(dir = "app", prefix = ""): Set<string> {
  const out = new Set<string>();
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (!statSync(full).isDirectory()) continue;
    const segment = entry.startsWith("(") ? "" : `/${entry}`;
    const route = `${prefix}${segment}`;
    if (existsSync(join(full, "page.tsx"))) out.add(route || "/");
    for (const r of appRoutes(full, route)) out.add(r);
  }
  return out;
}

test("כל מזהה קטלוג במיפוי של כרטיס גוגל קיים בקטלוג", () => {
  for (const p of GBP_PRODUCTS) {
    if (p.catalogId) assert.doesNotThrow(() => getPriceById(p.catalogId!), p.name);
  }
});

test("כל קישור במיפוי הוא עמוד קיים באתר", () => {
  const routes = appRoutes();
  for (const p of GBP_PRODUCTS) {
    if (p.path) assert.ok(routes.has(p.path), `${p.name}: ${p.path}`);
  }
});

test("המחיר להזנה בכרטיס הוא כולל מע״מ ונגזר מהקטלוג", () => {
  for (const row of buildGbpSheet()) {
    if (!row.catalogId) continue;
    assert.equal(row.priceToEnter, Math.round(getExVat(row.catalogId) * (1 + CATALOG_VAT_RATE)), row.name);
  }
});

/* שירותים בעורך השירותים: מ-12.10.2026 עם מחיר מהקטלוג (הבעלים, במקום "בלי מחיר"
   מ-11.10). המחיר בשדה המחיר בלבד: מדיניות הכרטיס (support 7400114) אוסרת מחיר
   וקריאה לפעולה בטקסט, ושם שירות מותאם לא יכול לכלול מחיר או טלפון (support 9455399). */
test("שירות בכרטיס: מחיר מהקטלוג, ובטקסט אין מחיר, טלפון או קריאה לפעולה", () => {
  const services = buildGbpSheet().filter((row) => row.listing === "service");
  assert.ok(services.length > 0);
  for (const row of services) {
    assert.ok(row.catalogId, row.name);
    assert.equal(row.priceToEnter, Math.round(getExVat(row.catalogId!) * (1 + CATALOG_VAT_RATE)), row.name);
    for (const text of [row.name, row.description ?? ""]) {
      assert.ok(!/₪|ש"ח|ש״ח|\d{2,3}-?\d{7}|כתבו לנו|התקשרו|וואטסאפ/.test(text), `${row.name}: ${text}`);
    }
    assert.ok((row.description ?? "").length > 0 && (row.description ?? "").length <= 250, row.name);
  }
});
