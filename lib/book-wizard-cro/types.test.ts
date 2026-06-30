import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { CRO_REGISTRY } from "@/lib/data/cro";
import type { TierACategoryId } from "@/lib/book-wizard-cro/types";

describe("CRO_REGISTRY", () => {
  const required: TierACategoryId[] = ["studio", "events", "podcast", "singer"];

  for (const id of required) {
    it(`has config for ${id}`, () => {
      const cfg = CRO_REGISTRY[id];
      assert.equal(cfg.category, id);
      assert.ok(cfg.anxieties.length >= 3);
      assert.ok(cfg.perks.length >= 3);
      assert.ok(cfg.transitionMessages.length >= 2);
      assert.ok(cfg.formId.length > 0);
    });
  }
});
