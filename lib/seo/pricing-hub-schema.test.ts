import assert from "node:assert/strict";
import { test } from "node:test";
import { withVat } from "@/lib/data/pricing";
import { getExVat } from "@/lib/data/pricing-catalog";
import { PRICES_VALID_UNTIL, PRICING_HUB_SECTIONS } from "@/lib/data/pricing-hub";
import { buildPricingOffersSchema, buildPricingSectionsSchema } from "./page-schema";

/*
 * סכמת ה-JSON-LD של /pricing: טווח מחירים לכל קבוצה (AggregateOffer) ותוקף
 * מחיר (priceValidUntil). אף שער אחר לא קורא את הסכמה ברמת העמוד:
 * audit:schema-prices קורא רק את site-schema.json.
 */

const PAGE_URL = "https://example.test/pricing";

type Aggregate = {
  "@type": string;
  priceCurrency: string;
  lowPrice: string;
  highPrice: string;
  offerCount: number;
  priceValidUntil: string;
};
type ServiceNode = { "@type": string; "@id": string; offers: Aggregate };

const sectionsSchema = buildPricingSectionsSchema(
  PAGE_URL,
  PRICING_HUB_SECTIONS,
  PRICES_VALID_UNTIL,
);
const services = sectionsSchema["@graph"] as ServiceNode[];

test("לכל קבוצה במחירון יש Service אחד עם AggregateOffer", () => {
  assert.equal(services.length, PRICING_HUB_SECTIONS.length);
  for (const node of services) {
    assert.equal(node["@type"], "Service");
    assert.equal(node.offers["@type"], "AggregateOffer");
  }
});

test("lowPrice ו-highPrice נגזרים מהקטלוג ולא מהשורות", () => {
  PRICING_HUB_SECTIONS.forEach((section, i) => {
    const fromCatalog = section.rows.map((row) => {
      assert.ok(row.catalogId, `השורה "${row.label}" ב-${section.id} בלי catalogId`);
      return withVat(getExVat(row.catalogId));
    });
    const { offers } = services[i];
    assert.equal(offers.lowPrice, String(Math.min(...fromCatalog)), `${section.id} low`);
    assert.equal(offers.highPrice, String(Math.max(...fromCatalog)), `${section.id} high`);
  });
});

test("offerCount הוא מספר השורות, והטווח תקין, במטבע שקל", () => {
  PRICING_HUB_SECTIONS.forEach((section, i) => {
    const { offers } = services[i];
    assert.equal(offers.offerCount, section.rows.length, section.id);
    assert.equal(offers.priceCurrency, "ILS", section.id);
    assert.match(offers.lowPrice, /^\d+$/, `${section.id}: lowPrice אינו מספר נקי`);
    assert.match(offers.highPrice, /^\d+$/, `${section.id}: highPrice אינו מספר נקי`);
    assert.ok(Number(offers.lowPrice) > 0, `${section.id}: lowPrice לא חיובי`);
    assert.ok(Number(offers.lowPrice) <= Number(offers.highPrice), `${section.id}: low > high`);
  });
});

test("מזהי ה-Service ייחודיים ולא מתנגשים עם מזהי ה-Offer", () => {
  const ids = services.map((node) => node["@id"]);
  assert.equal(new Set(ids).size, ids.length);
  for (const id of ids) {
    assert.ok(id.startsWith(`${PAGE_URL}#service-`), id);
    assert.ok(!id.includes("#offer-"), id);
  }
});

test("קבוצה בלי שורות מושמטת ולא נפלט לה טווח שבור", () => {
  const schema = buildPricingSectionsSchema(
    PAGE_URL,
    [
      { id: "empty", title: "ריק", description: "בלי שורות", href: "/x", rows: [] },
      { id: "one", title: "אחד", description: "שורה אחת", href: "/y", rows: [{ exVat: 100 }] },
    ],
    PRICES_VALID_UNTIL,
  );
  const graph = schema["@graph"] as ServiceNode[];
  assert.equal(graph.length, 1);
  assert.equal(graph[0].offers.lowPrice, graph[0].offers.highPrice);
});

test("priceValidUntil: כל AggregateOffer וכל Offer עם מחיר נושאים אותו", () => {
  const offersSchema = buildPricingOffersSchema(
    PAGE_URL,
    PRICING_HUB_SECTIONS.flatMap((section) =>
      section.rows.map((row) => ({
        id: `${section.id}-${row.label.replace(/\s+/g, "-")}`,
        name: row.label,
        priceExVat: row.exVat,
      })),
    ),
    { priceValidUntil: PRICES_VALID_UNTIL },
  );
  const offers = offersSchema.offers as Record<string, unknown>[];
  assert.equal(
    offers.length,
    PRICING_HUB_SECTIONS.reduce((sum, section) => sum + section.rows.length, 0),
  );
  for (const offer of offers) {
    assert.equal(offer.priceValidUntil, PRICES_VALID_UNTIL, String(offer.name));
    assert.equal(offer.priceCurrency, "ILS", String(offer.name));
  }
  for (const node of services) {
    assert.equal(node.offers.priceValidUntil, PRICES_VALID_UNTIL, node["@id"]);
  }
});

test("בלי options הפלט של buildPricingOffersSchema לא משתנה (4 עמודים אחרים תלויים בו)", () => {
  const input = [
    { id: "a", name: "א", priceExVat: 100 },
    { id: "b", name: "ב", priceExVat: null },
  ];
  const text = JSON.stringify(buildPricingOffersSchema(PAGE_URL, input));
  assert.ok(!text.includes("priceValidUntil"));
});

test("הצעה בלי מחיר לא מקבלת priceValidUntil", () => {
  const schema = buildPricingOffersSchema(
    PAGE_URL,
    [{ id: "b", name: "ב", priceExVat: null }],
    { priceValidUntil: PRICES_VALID_UNTIL },
  );
  assert.ok(!JSON.stringify(schema).includes("priceValidUntil"));
});

test("PRICES_VALID_UNTIL הוא תאריך תקין שעוד לא פג, עם שולי 14 יום", () => {
  assert.match(PRICES_VALID_UNTIL, /^\d{4}-\d{2}-\d{2}$/);
  const date = new Date(`${PRICES_VALID_UNTIL}T00:00:00Z`);
  assert.ok(!Number.isNaN(date.getTime()), "תאריך לא קיים");
  assert.equal(date.toISOString().slice(0, 10), PRICES_VALID_UNTIL, "תאריך לא קיים בלוח");
  const margin = 14 * 24 * 60 * 60 * 1000;
  assert.ok(
    date.getTime() - Date.now() >= margin,
    `תוקף המחירים (${PRICES_VALID_UNTIL}) פג או קרוב לפקוע. לעדכן את PRICES_VALID_UNTIL ב-lib/data/pricing-hub.ts עם הבעלים.`,
  );
});

test("הסכמה עוברת סריאליזציה ל-JSON בלי אובדן", () => {
  const round = JSON.parse(JSON.stringify(sectionsSchema));
  assert.deepEqual(round, sectionsSchema);
});
