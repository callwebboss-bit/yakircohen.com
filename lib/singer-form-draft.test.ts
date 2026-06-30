import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { parseSingerFormDraft, type SingerFormDraft } from "@/lib/singer-form-draft";

const INITIAL: SingerFormDraft = {
  packageId: "",
  name: "",
  phone: "",
  date: "",
  time: "",
  location: "",
  notes: "",
  selectedAddons: [],
  sessionPriority: "",
  welcomePerk: "",
  lastMinuteUpsell: false,
  termsAccepted: false,
};

describe("parseSingerFormDraft", () => {
  it("uses fallback package when raw packageId is invalid", () => {
    const result = parseSingerFormDraft(
      { packageId: "unknown", name: "A" },
      INITIAL,
      "premium",
    );
    assert.ok(result);
    assert.equal(result!.packageId, "premium");
    assert.equal(result!.name, "A");
  });

  it("accepts valid package id", () => {
    const result = parseSingerFormDraft({ packageId: "vip" }, INITIAL);
    assert.ok(result);
    assert.equal(result!.packageId, "vip");
  });

  it("parses CRO fields", () => {
    const result = parseSingerFormDraft(
      {
        sessionPriority: "cant_hear_self",
        welcomePerk: "monitor_mix",
        lastMinuteUpsell: true,
      },
      INITIAL,
    );
    assert.ok(result);
    assert.equal(result!.sessionPriority, "cant_hear_self");
    assert.equal(result!.welcomePerk, "monitor_mix");
    assert.equal(result!.lastMinuteUpsell, true);
  });

  it("ignores invalid CRO enum values", () => {
    const result = parseSingerFormDraft(
      { sessionPriority: "invalid", welcomePerk: "nope" },
      INITIAL,
    );
    assert.ok(result);
    assert.equal(result!.sessionPriority, "");
    assert.equal(result!.welcomePerk, "");
  });
});
