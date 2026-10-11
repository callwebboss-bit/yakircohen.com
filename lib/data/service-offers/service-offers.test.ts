import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, it } from "node:test";
import { withVat } from "@/lib/data/pricing";
import { getExVat } from "@/lib/data/pricing-catalog";
import { SERVICE_OFFER_PAGES } from "@/lib/data/service-offers";
import { resolvePriceRows, schemaOffers } from "@/lib/data/service-offers/types";

/* em-dash, en-dash, אליפסיס בתו אחד, מירכאות מסולסלות, סימן קריאה (docs/HUMAN-COPY-GUIDELINES.md) */
const BANNED = /[—–…“”‘’!]/;

function allStrings(value: unknown): string[] {
  if (typeof value === "string") return [value];
  if (Array.isArray(value)) return value.flatMap(allStrings);
  if (value && typeof value === "object") return Object.values(value).flatMap(allStrings);
  return [];
}

const SITEMAP = readFileSync(join(process.cwd(), "app/sitemap.ts"), "utf8");

describe("service offer pages", () => {
  for (const page of SERVICE_OFFER_PAGES) {
    describe(page.path, () => {
      it("has a route file", () => {
        assert.ok(existsSync(join(process.cwd(), "app/(services)", page.path, "page.tsx")));
      });

      it("takes every price from the catalog", () => {
        for (const row of resolvePriceRows(page.prices)) {
          assert.equal(row.exVat, getExVat(row.id));
        }
        assert.ok(getExVat(page.whatsapp.priceId) > 0);
      });

      it("puts only base rows in the schema offers", () => {
        const bases = page.prices.filter((row) => !row.addon).length;
        assert.equal(schemaOffers(page).length, bases);
        assert.ok(bases >= 1, "at least one base price");
      });

      it("has no banned glyphs in copy", () => {
        for (const text of allStrings(page)) {
          assert.ok(!BANNED.test(text), `banned glyph in: ${text}`);
        }
      });

      it("has at least 3 FAQs with unique ids", () => {
        assert.ok(page.faqs.length >= 3);
        assert.equal(new Set(page.faqs.map((f) => f.id)).size, page.faqs.length);
      });

      it("is in the sitemap only when published", () => {
        const listed = SITEMAP.includes(`url("${page.path.replace(/^\//, "")}")`);
        assert.equal(listed, !page.draft);
      });
    });
  }
});

describe("hospitality upgrade", () => {
  it("costs exactly 149 with VAT (owner, 11.10.2026)", () => {
    assert.equal(withVat(getExVat("studio_hospitality_upgrade")), 149);
  });
});

describe("publish state", () => {
  it("every page has a label in status.ts and every label has a page", async () => {
    const { SERVICE_OFFER_LABELS } = await import("@/lib/data/service-offers/status");
    const pagePaths = SERVICE_OFFER_PAGES.map((p) => p.path).sort();
    assert.deepEqual(Object.keys(SERVICE_OFFER_LABELS).sort(), pagePaths);
  });

  it("existing pages link only to published pages", async () => {
    const { publishedServiceLinks, SERVICE_OFFER_LABELS, isServiceOfferPublished } = await import(
      "@/lib/data/service-offers/status"
    );
    const all = Object.keys(SERVICE_OFFER_LABELS) as (keyof typeof SERVICE_OFFER_LABELS)[];
    const links = publishedServiceLinks(all);
    assert.deepEqual(
      links.map((l) => l.href),
      all.filter((p) => isServiceOfferPublished(p)),
    );
  });

  it("alternatives and related links point to real routes", () => {
    for (const page of SERVICE_OFFER_PAGES) {
      for (const link of [...page.related, ...(page.alternatives?.items ?? [])]) {
        const path = link.href.replace(/^\//, "");
        const candidates = [join("app", path, "page.tsx"), join("app/(services)", path, "page.tsx")];
        assert.ok(candidates.some((c) => existsSync(join(process.cwd(), c))), `${page.path} -> ${link.href}`);
      }
    }
  });
});
