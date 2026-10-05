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
import {
  DJ_PER_EVENT_NOTE,
  DJ_PREMIUM_INCLUDED,
  DJ_PREMIUM_TAGLINE,
  DJ_YAKIR_NOTE,
  getExVat,
  getPriceById,
  getPriceTransparencyById,
  mobileStudioEventExVat,
} from "@/lib/data/pricing-catalog";
import { djTravelFeesLine, getDjTravelFeeRows } from "@/lib/data/dj-travel-fees";
import { PACKAGE_DJ_THREE_ATTRACTIONS, PACKAGE_FESTIVAL } from "@/lib/data/wedding-packages-page";
import { buildDjWeddingPriceAnswer } from "@/lib/data/faq-aeo";
import { withVat } from "@/lib/data/pricing";
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
      const extras = ("extraCatalogIds" in o ? o.extraCatalogIds : []) ?? [];
      const expected = getExVat(o.catalogId) + extras.reduce((sum, id) => sum + getExVat(id), 0);
      assert.equal(o.priceExVat, expected, o.id);
    }
  });

  it("Yakir in person is 9,800 before VAT (owner decision 3.10.2026, second round)", () => {
    const yakir = DJ_CALC_DJ_OPTIONS.find((o) => o.id === "dj_yakir");
    assert.equal(yakir?.priceExVat, getExVat("dj_yakir_personal"));
    assert.equal(yakir?.priceExVat, 9800);
    assert.equal(withVat(yakir!.priceExVat), 11564);
  });

  it("mobile studio at an event = podcast filming or audio recording + the 2,500 arrival", () => {
    const video = DJ_CALC_ADDONS.find((o) => o.id === "studio_mobile_video");
    const audio = DJ_CALC_ADDONS.find((o) => o.id === "studio_mobile_audio");
    assert.equal(getExVat("mobile_podcast_at_home"), 2500);
    assert.equal(video?.priceExVat, getExVat("podcast_video") + 2500);
    assert.equal(audio?.priceExVat, getExVat("podcast_audio") + 2500);
    assert.equal(video?.priceExVat, mobileStudioEventExVat("video"));
    assert.equal(audio?.priceExVat, mobileStudioEventExVat("audio"));
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

  it("the DJ page cards use dj_premium and dj_yakir_personal", () => {
    const service = getEventsService("events-dj");
    const ids = (service?.pricing ?? []).map((t) => t.catalogId).filter(Boolean);
    assert.ok(ids.includes("dj_premium"));
    assert.ok(ids.includes("dj_yakir_personal"));
    for (const t of service?.pricing ?? []) {
      assert.doesNotMatch(`${t.priceNote ?? ""}`, /7 שעות|150 אורחים/);
    }
  });
});

/* החלטות 5.10.2026 (DJ) */
const HOURS_LIMIT = /\d+\s*שעות|כ-\d+ שעות|שעה נוספת|שעות חריגות/;

describe("DJ is priced per event, not per hour (owner decisions 5.10.2026)", () => {
  it("no DJ offer text carries an hour limit", () => {
    const texts: string[] = [DJ_TEAM_NOTE, DJ_YAKIR_NOTE, DJ_CALC_FESTIVAL.features.join(" ")];
    for (const id of ["dj_premium", "dj_yakir_personal", "festival_all_in"] as const) {
      const item = getPriceById(id);
      texts.push(`${item.context ?? ""} ${item.scope?.duration ?? ""}`);
    }
    for (const id of ["dj_premium", "dj_yakir_personal"] as const) {
      const t = getPriceTransparencyById(id);
      texts.push([...t.included, ...t.excluded].join(" "));
      assert.equal(t.scopeNote, DJ_PER_EVENT_NOTE, id);
    }
    for (const o of DJ_CALC_DJ_OPTIONS) texts.push(`${o.sub} ${(o.features ?? []).join(" ")}`);
    for (const slug of ["events-dj", "events-bar-mitzvah", "events-wedding-packages"] as const) {
      const service = getEventsService(slug);
      for (const t of service?.pricing ?? []) {
        texts.push(`${t.priceNote ?? ""} ${t.description} ${t.scope?.duration ?? ""}`);
      }
      for (const f of service?.features ?? []) texts.push(f);
    }
    texts.push(PACKAGE_DJ_THREE_ATTRACTIONS.djNote, PACKAGE_FESTIVAL.includes.join(" "));
    texts.push(buildDjWeddingPriceAnswer());
    for (const route of BOOK_AUDIENCE_ROUTES.filter((r) => r.categoryId === "dj")) {
      texts.push(`${route.priceNote ?? ""} ${route.scope?.duration ?? ""}`);
    }
    for (const text of texts) assert.doesNotMatch(text, HOURS_LIMIT, text);
  });

  it("the team DJ keeps the 300-guest cap (ED-04) as guests only", () => {
    assert.match(DJ_TEAM_NOTE, /עד 300 מוזמנים/);
    assert.equal(getPriceById("dj_premium").suitedFor, "אירוע עד 300 מוזמנים");
  });

  it("the DJ FAQ says there is no overtime charge", () => {
    const faq = getEventsService("events-dj")?.faqs.find((f) => f.id === "dj-hours");
    assert.match(faq?.answer ?? "", /בלי חיוב על שעות נוספות/);
  });

  it("the Premium card stays a personal quote and lists everything the owner named", () => {
    const premium = (getEventsService("events-dj")?.pricing ?? []).find((t) => t.name === "חבילת פרימיום");
    assert.ok(premium);
    assert.equal(premium.price, "הצעה אישית");
    assert.equal(premium.priceExVat, undefined);
    assert.match(premium.priceNote ?? "", new RegExp(DJ_PREMIUM_TAGLINE));
    for (const item of DJ_PREMIUM_INCLUDED) assert.ok(premium.description.includes(item), item);
    for (const word of ["מנחה", "צוות גיבוי", "צוות בנייה והקמה", "רמיקסים בלעדיים", "עזרה בהקלטות"]) {
      assert.ok(DJ_PREMIUM_INCLUDED.some((i) => i.includes(word)), word);
    }
  });
});

describe("DJ travel fees are visible and come from the catalog", () => {
  it("north/south and Eilat/Golan, VAT-inclusive first", () => {
    const rows = getDjTravelFeeRows();
    assert.deepEqual(rows.map((r) => r.id), ["travel_north_south", "travel_eilat_golan"]);
    for (const r of rows) {
      const ex = getExVat(r.id);
      assert.equal(r.headline, `${withVat(ex).toLocaleString("he-IL")} ₪ כולל מע״מ`);
      assert.equal(r.vatNote, `${ex.toLocaleString("he-IL")} ₪ + מע״מ`);
    }
    assert.equal(getExVat("travel_north_south"), 800);
    assert.equal(getExVat("travel_eilat_golan"), 1800);
    assert.match(djTravelFeesLine(), /אזור המרכז: בלי תוספת הגעה/);
  });

  it("the bar mitzvah area FAQ quotes the travel fees", () => {
    const faq = getEventsService("events-bar-mitzvah")?.faqs.find((f) => f.id === "bm-area");
    assert.ok(faq?.answer.includes(djTravelFeesLine()));
  });
});
