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
});
