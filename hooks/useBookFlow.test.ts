import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { bookFlowReducer, initialBookFlowState } from "@/hooks/useBookFlow";

describe("bookFlowReducer", () => {
  it("OPEN_FULL_PATH sets category, route, preset, and emotional label", () => {
    const next = bookFlowReducer(initialBookFlowState, {
      type: "OPEN_FULL_PATH",
      selection: {
        categoryId: "studio",
        routeId: "route-1",
        emotionalLabel: "חתונה",
        filterPreset: { timeline: "this_week", purpose: "professional" },
      },
    });

    assert.equal(next.activeCategory, "studio");
    assert.equal(next.activeRouteId, "route-1");
    assert.equal(next.emotionalLabel, "חתונה");
    assert.deepEqual(next.filterPreset, { timeline: "this_week", purpose: "professional" });
  });

  it("BACK resets to initial state", () => {
    const opened = bookFlowReducer(initialBookFlowState, {
      type: "OPEN_FULL_PATH",
      selection: {
        categoryId: "podcast",
        routeId: "r-back",
        emotionalLabel: null,
      },
    });

    assert.deepEqual(bookFlowReducer(opened, { type: "BACK" }), initialBookFlowState);
  });

  it("SYNC_HASH updates category and clears route", () => {
    const opened = bookFlowReducer(initialBookFlowState, {
      type: "OPEN_FULL_PATH",
      selection: {
        categoryId: "events",
        routeId: "r1",
        emotionalLabel: null,
      },
    });

    const synced = bookFlowReducer(opened, {
      type: "SYNC_HASH",
      category: "dj",
    });

    assert.equal(synced.activeCategory, "dj");
    assert.equal(synced.activeRouteId, null);
  });
});
