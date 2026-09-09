import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  readStudioPriceHold,
  saveStudioPriceHold,
  STUDIO_PRICE_HOLD_MS,
} from "@/lib/book-wizard-urgency";

function mockSession(storage: Map<string, string>) {
  const g = globalThis as typeof globalThis & { sessionStorage?: Storage };
  g.sessionStorage = {
    getItem: (k) => storage.get(k) ?? null,
    setItem: (k, v) => storage.set(k, v),
    removeItem: (k) => storage.delete(k),
    clear: () => storage.clear(),
    key: () => null,
    length: storage.size,
  };
}

describe("studio price hold", () => {
  it("round-trips a saved hold while it is still valid", () => {
    mockSession(new Map());
    saveStudioPriceHold({ packageLabel: "חבילת שיר", totalExVat: 990 });
    const hold = readStudioPriceHold(Date.now());
    assert.ok(hold);
    assert.equal(hold.packageLabel, "חבילת שיר");
    assert.equal(hold.totalExVat, 990);
  });

  it("expires after the 48 hour window", () => {
    mockSession(new Map());
    saveStudioPriceHold({ packageLabel: "חבילת שיר", totalExVat: 990 });
    const later = Date.now() + STUDIO_PRICE_HOLD_MS + 1000;
    assert.equal(readStudioPriceHold(later), null);
  });
});
