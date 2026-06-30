import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { getWeeklyStudioSlotsRemaining } from "@/lib/book-wizard-urgency";

describe("getWeeklyStudioSlotsRemaining", () => {
  it("returns a number between 2 and 5", () => {
    const slots = getWeeklyStudioSlotsRemaining(new Date("2026-06-29"));
    assert.ok(slots >= 2 && slots <= 5);
  });

  it("is stable within the same week", () => {
    const a = getWeeklyStudioSlotsRemaining(new Date("2026-06-29"));
    const b = getWeeklyStudioSlotsRemaining(new Date("2026-07-01"));
    assert.equal(a, b);
  });
});
