import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  blessingFamilyExampleLine,
  blessingSpeakersBreakdown,
  blessingSpeakersPriceLine,
  blessingTextRewriteLine,
  blessingTotalExVat,
  buildBlessingPriceAnswer,
  BLESSING_DURATION_ANSWER,
  clampBlessingSpeakers,
} from "@/lib/data/blessing-offer";
import { getExVat, getPriceById, getPriceTransparencyById } from "@/lib/data/pricing-catalog";
import { withVat } from "@/lib/data/pricing";
import { calcStudioScenarios } from "@/lib/studio-participant-pricing";
import { getStudioService } from "@/lib/data/services";
import { STUDIO_RECORDING_UPGRADES } from "@/lib/data/studio-recording-booking";

/* החלטות 5.10.2026 (ברכות) */
describe("blessings and derashot: same price, no time limit", () => {
  it("blessing and remote are both 500 before VAT", () => {
    assert.equal(getExVat("blessing_recording"), 500);
    assert.equal(getExVat("studio_remote"), 500);
  });

  it("no 30/60-minute limit and no 'music is extra' on the blessing offer", () => {
    const item = getPriceById("blessing_recording");
    const t = getPriceTransparencyById("blessing_recording");
    const text = [item.context, item.scope?.duration, item.scope?.includes, ...t.included, ...t.excluded].join(" ");
    assert.doesNotMatch(text, /חצי שעה|30 דקות|60 דקות|עד שעה/);
    assert.doesNotMatch(t.excluded.join(" "), /מוזיק/);
    assert.match(BLESSING_DURATION_ANSWER, /אין הגבלת זמן/);
  });

  it("the blessing pages' FAQs carry no time limit and no music surcharge", () => {
    for (const id of ["blessings-hub", "blessings-bar-mitzvah", "blessings-bride-groom"] as const) {
      const service = getStudioService(id);
      const text = [service.subtitle, ...service.features, ...service.faqs.map((f) => f.answer)].join(" ");
      assert.doesNotMatch(text, /עד חצי שעה|30 עד 60|שעה עד שעתיים|30 דקות|מוזיקת רקע (ב)?תוספת|מוזיקת רקע ותיקון זיופים בתוספת/, id);
    }
  });
});

describe("blessing speakers: one included, every extra 99, up to 12", () => {
  it("a family of 4 is 500 + 3 × 99 = 797 before VAT, 940 with VAT", () => {
    assert.equal(blessingTotalExVat(4), 797);
    assert.equal(withVat(blessingTotalExVat(4)), 940);
    assert.equal(blessingFamilyExampleLine(), "משפחה של 4: 940 ₪ כולל מע״מ (797 ₪ + מע״מ)");
    assert.equal(
      blessingSpeakersBreakdown(4).line,
      "4 דוברים: 590 + 117 + 117 + 117 ₪ כולל מע״מ (500 + 99 + 99 + 99 ₪ + מע״מ)",
    );
  });

  it("the studio wizard charges the same for the remote/blessing package", () => {
    const r = calcStudioScenarios({ baseExVat: 500, recorderCount: 4, packageId: "remote", serviceId: "recording" });
    assert.equal(r.scenarios.length, 1);
    assert.equal(r.recommended?.subtotalExVat, 797);
    assert.equal(r.recommended?.withVat, 940);
    assert.ok(!r.scenarios.some((s) => s.id === "solo" || s.id === "group"));
  });

  it("caps at 12 and the line says so", () => {
    assert.equal(clampBlessingSpeakers(20), 12);
    assert.equal(blessingTotalExVat(12), 500 + 11 * 99);
    assert.equal(blessingSpeakersPriceLine(), "כל דובר נוסף +117 ₪ כולל מע״מ (99 ₪ + מע״מ) · עד 12 בהקלטה");
  });

  it("the family-duet upgrade costs the same 99, not 190", () => {
    const duet = STUDIO_RECORDING_UPGRADES.find((u) => u.id === "family_duet");
    assert.equal(duet?.price, getExVat("blessing_extra_participant"));
  });
});

describe("blessing text", () => {
  it("light polishing is included and a full rewrite is 150 + VAT", () => {
    assert.equal(getExVat("blessing_text_rewrite"), 150);
    assert.equal(blessingTextRewriteLine(), "כתיבה מחדש של הטקסט: +177 ₪ כולל מע״מ (150 ₪ + מע״מ)");
    assert.match(buildBlessingPriceAnswer(), /במסגרת השירות, באהבה/);
    assert.ok(getPriceTransparencyById("blessing_recording").included.some((l) => l.includes("באהבה")));
  });
});
