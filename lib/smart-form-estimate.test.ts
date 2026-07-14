import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { calculateSmartFormEstimate } from "@/lib/smart-form-estimate";
import { getExVat } from "@/lib/data/pricing-catalog";
import {
  buildSmartFormBookHref,
  buildSmartFormCloserPlainText,
  parseSmartFormFromSearch,
  serializeSmartFormToParams,
  smartFormStateToJson,
  type SmartFormState,
} from "@/lib/smart-form-url";

describe("smart-form-estimate", () => {
  it("uses fixed package for family and never studio_hour", () => {
    const est = calculateSmartFormEstimate("family", []);
    assert.equal(est.baseCatalogId, "blessing_recording");
    assert.equal(est.baseExVat, getExVat("blessing_recording"));
    assert.ok(!est.lines.some((l) => l.catalogId === "studio_hour"));
  });

  it("sums upsells from catalog", () => {
    const est = calculateSmartFormEstimate("family", ["cover", "express"]);
    assert.equal(est.baseCatalogId, "cover_song");
    assert.equal(
      est.totalExVat,
      getExVat("cover_song") + getExVat("express_delivery"),
    );
  });

  it("returns empty for anti-lead category", () => {
    const est = calculateSmartFormEstimate("unsupported_rehearsal", []);
    assert.equal(est.totalExVat, 0);
    assert.equal(est.baseCatalogId, null);
  });
});

describe("smart-form-url", () => {
  it("serializes smart=1 and round-trips via parse", () => {
    const state: SmartFormState = {
      categoryId: "podcast",
      selectedChipIds: ["audio"],
      name: "דני",
      contactMethod: "0501234567",
      socialOrId: "@dani",
      termsAccepted: true,
      baseCatalogId: "podcast_audio",
      estimateExVat: 950,
      upsellCatalogIds: [],
      bookCategory: "podcast",
    };
    const params = serializeSmartFormToParams(state);
    assert.equal(params.get("smart"), "1");
    assert.equal(params.get("koalendar"), "1");
    assert.equal(params.get("catalog"), "podcast_audio");

    const parsed = parseSmartFormFromSearch(params);
    assert.equal(parsed.smart, true);
    assert.equal(parsed.name, "דני");
    assert.equal(parsed.baseCatalogId, "podcast_audio");

    const href = buildSmartFormBookHref(state);
    assert.ok(href.startsWith("/book?"));
    assert.ok(href.includes("smart=1"));
    assert.ok(href.includes("#podcast"));
  });

  it("builds closer-safe plain text with exVat and vatRate", () => {
    const state: SmartFormState = {
      categoryId: "family",
      selectedChipIds: ["cover"],
      name: "נועה",
      contactMethod: "0501234567",
      socialOrId: "",
      termsAccepted: true,
      baseCatalogId: "cover_song",
      estimateExVat: 1200,
      upsellCatalogIds: [],
      bookCategory: "studio",
    };
    const plain = buildSmartFormCloserPlainText(state);
    assert.ok(plain.includes("estimateExVat=1200"));
    assert.ok(plain.includes("vatRate=0.18"));
    assert.ok(plain.includes("catalog=cover_song"));
    assert.ok(plain.includes("returnPotential=event_based"));
    assert.ok(plain.includes("prepHref=/blog/studio-session-prep-checklist"));
    const json = smartFormStateToJson(state);
    assert.ok(json.includes('"estimateExVat":1200'));
    assert.ok(json.includes('"vatRate":0.18'));
    assert.ok(json.includes('"returnPotential":"event_based"'));
  });
});
