import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { buildSmartFormLeadEmailBody } from "@/lib/smart-form-lead-email";
import type { SmartFormState } from "@/lib/smart-form-url";

describe("smart-form-lead-email", () => {
  it("splits client / budget / social into readable blocks", () => {
    const state: SmartFormState = {
      categoryId: "family",
      selectedChipIds: ["cover", "express"],
      name: "נועה כהן",
      contactMethod: "0501234567",
      socialOrId: "@noea_test",
      termsAccepted: true,
      baseCatalogId: "cover_song",
      estimateExVat: 1500,
      upsellCatalogIds: ["express_delivery"],
      bookCategory: "studio",
    };
    const body = buildSmartFormLeadEmailBody(state);
    assert.ok(body.includes("--- פרטי לקוח ---"));
    assert.ok(body.includes("--- הערכת תקציב (לפני מע״מ) ---"));
    assert.ok(body.includes("--- הקשר אישי / זהות ---"));
    assert.ok(body.includes("Social / ID: @noea_test"));
    assert.ok(body.includes("בסיס:"));
    assert.ok(body.includes("תוספות:"));
    assert.ok(body.includes("סה״כ משוער:"));
    assert.ok(body.includes("--- CLOSER (הדבקה) ---"));
    assert.ok(body.includes("YC_SMART_FORM"));
    assert.ok(body.includes("--- הכנה / CLV ---"));
    assert.ok(body.includes("פוטנציאל חזרה: Event-Based"));
    assert.ok(body.includes("הכנה לאולפן:"));
  });
});
