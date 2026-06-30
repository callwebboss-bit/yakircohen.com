import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  ensureHoldDeadline,
  extendHoldDeadlineSoft,
  STEP3_SOFT_HOLD_MS,
} from "@/lib/book-wizard-cro/urgency";

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

describe("category urgency", () => {
  it("ensureHoldDeadline creates deadline", () => {
    const storage = new Map<string, string>();
    mockSession(storage);
    const now = 1_000_000;
    const deadline = ensureHoldDeadline("studio", now);
    assert.equal(deadline, now + STEP3_SOFT_HOLD_MS);
  });

  it("extendHoldDeadlineSoft resets window", () => {
    const storage = new Map<string, string>();
    mockSession(storage);
    const now = 5_000_000;
    const extended = extendHoldDeadlineSoft("events", now);
    assert.equal(extended, now + STEP3_SOFT_HOLD_MS);
    const again = ensureHoldDeadline("events", now + 1000);
    assert.equal(again, extended);
  });
});
