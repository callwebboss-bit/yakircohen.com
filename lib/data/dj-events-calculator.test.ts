import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  DJ_CALC_ADDONS,
  DJ_CALC_DJ_OPTIONS,
  DJ_CALC_FESTIVAL,
  DJ_CALC_SHOW_STAR_MOMENT,
  DJ_TEAM_NOTE,
  getDjCalculatorCatalogIds,
} from "@/lib/data/dj-events-calculator";
import { getExVat, getPriceById } from "@/lib/data/pricing-catalog";
import { BOOK_AUDIENCE_ROUTES } from "@/lib/data/book-audience-routes";
import { HOME_QUICK_PATHS } from "@/lib/data/home-quick-paths";
import { getEventsService } from "@/lib/data/services";

/* WP2 (PJ-05, PI-24, LF-14, FIT-01, OE-01) */
describe("DJ calculator is bound to the catalog", () => {
  it("every option resolves to a catalog id and carries its price", () => {
    for (const id of getDjCalculatorCatalogIds()) {
      assert.ok(getPriceById(id), id);
    }
    for (const o of [DJ_CALC_FESTIVAL, ...DJ_CALC_DJ_OPTIONS, ...DJ_CALC_ADDONS]) {
      assert.equal(o.priceExVat, getExVat(o.catalogId), o.id);
    }
  });

  it("Yakir in person is the ex-VAT catalog price, not the VAT-inclusive 9,800", () => {
    const yakir = DJ_CALC_DJ_OPTIONS.find((o) => o.id === "dj_yakir");
    assert.equal(yakir?.priceExVat, getExVat("dj_yakir_personal"));
    assert.notEqual(yakir?.priceExVat, 9800);
  });

  it("no 'special price' claim and the star moment stays hidden until priced", () => {
    for (const o of DJ_CALC_ADDONS) assert.doesNotMatch(`${o.name} ${o.sub}`, /מחיר מיוחד/);
    assert.equal(DJ_CALC_SHOW_STAR_MOMENT, false);
  });
});

describe("DJ price anchors", () => {
  it("no DJ-labelled /book route borrows an attraction price", () => {
    const dj = BOOK_AUDIENCE_ROUTES.find((r) => r.id === "dj-vip");
    assert.ok(dj);
    assert.equal(dj.priceExVat, getExVat("dj_premium"));
    assert.equal(dj.priceNote, DJ_TEAM_NOTE);
    assert.doesNotMatch(dj.startingPriceDual, /סופי/);
    for (const r of BOOK_AUDIENCE_ROUTES) {
      if (r.categoryId !== "dj") continue;
      for (let n = 1; n <= 4; n++) {
        assert.notEqual(r.priceExVat, getExVat(`event_attraction_${n}` as "event_attraction_1"), r.id);
      }
    }
  });

  it("the homepage events card anchors on the team DJ", () => {
    const events = HOME_QUICK_PATHS.find((p) => p.id === "events");
    assert.equal(events?.priceId, "dj_premium");
    const podcast = HOME_QUICK_PATHS.find((p) => p.id === "podcast");
    assert.equal(podcast?.priceId, "podcast_audio");
  });

  it("the DJ page cards use dj_premium (4 h) and dj_yakir_personal (5 h)", () => {
    const service = getEventsService("events-dj");
    const ids = (service?.pricing ?? []).map((t) => t.catalogId).filter(Boolean);
    assert.ok(ids.includes("dj_premium"));
    assert.ok(ids.includes("dj_yakir_personal"));
    for (const t of service?.pricing ?? []) {
      assert.doesNotMatch(`${t.priceNote ?? ""}`, /7 שעות|150 אורחים/);
    }
  });
});
