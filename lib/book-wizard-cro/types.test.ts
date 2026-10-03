import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { CRO_REGISTRY } from "@/lib/data/cro";
import type { CroLastMinuteUpsell, TierACategoryId } from "@/lib/book-wizard-cro/types";
import { getExVat } from "@/lib/data/pricing-catalog";

/* שלב 5 (FIT-05, OE-29): בלי פיתיון, בלי טיימר ובלי "בודק זמינות" */
const BANNED_COPY = /בודק זמינות|רשימת המתנה|שמור(?:ים)? עבורך|שמרנו את המחיר|\d+\s*שעות|אפס תקלות/;

describe("CRO_REGISTRY", () => {
  const required: TierACategoryId[] = ["studio", "events", "podcast", "singer"];

  for (const id of required) {
    it(`has config for ${id}`, () => {
      const cfg = CRO_REGISTRY[id];
      assert.equal(cfg.category, id);
      assert.ok(cfg.anxieties.length >= 3);
      assert.ok(cfg.perks.length >= 3);
      assert.ok(cfg.transitionMessages.length >= 1);
      assert.ok(cfg.formId.length > 0);
    });

    it(`${id}: no decoy, no hold, no fake availability copy`, () => {
      const cfg = CRO_REGISTRY[id] as Record<string, unknown>;
      assert.equal("decoy" in cfg, false);
      assert.equal("urgency" in cfg, false);
      const text = JSON.stringify(cfg);
      assert.doesNotMatch(text, BANNED_COPY);
    });

    it(`${id}: last-minute label carries no price, reference only from the catalog`, () => {
      const up: CroLastMinuteUpsell | undefined = CRO_REGISTRY[id].lastMinuteUpsell;
      if (!up) return;
      assert.doesNotMatch(up.label, /₪|במקום|\d{3}/);
      if (up.referenceCatalogId) {
        assert.equal(up.listPrice, getExVat(up.referenceCatalogId));
      }
      if (up.promoPrice != null && up.listPrice != null) {
        assert.ok(up.promoPrice < up.listPrice);
      }
    });
  }
});
