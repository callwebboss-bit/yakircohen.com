import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { nextTabIndex } from "@/hooks/useTabs";

describe("nextTabIndex (RTL)", () => {
  it("ArrowLeft goes to the next tab in DOM order, ArrowRight to the previous", () => {
    assert.equal(nextTabIndex("ArrowLeft", 0, 4, "rtl"), 1);
    assert.equal(nextTabIndex("ArrowLeft", 2, 4, "rtl"), 3);
    assert.equal(nextTabIndex("ArrowRight", 2, 4, "rtl"), 1);
    assert.equal(nextTabIndex("ArrowRight", 1, 4, "rtl"), 0);
  });

  it("wraps around at both ends", () => {
    assert.equal(nextTabIndex("ArrowLeft", 3, 4, "rtl"), 0);
    assert.equal(nextTabIndex("ArrowRight", 0, 4, "rtl"), 3);
  });
});

describe("nextTabIndex (LTR)", () => {
  it("ArrowRight goes to the next tab, ArrowLeft to the previous", () => {
    assert.equal(nextTabIndex("ArrowRight", 0, 3, "ltr"), 1);
    assert.equal(nextTabIndex("ArrowLeft", 2, 3, "ltr"), 1);
  });

  it("wraps around at both ends", () => {
    assert.equal(nextTabIndex("ArrowRight", 2, 3, "ltr"), 0);
    assert.equal(nextTabIndex("ArrowLeft", 0, 3, "ltr"), 2);
  });
});

describe("nextTabIndex (Home, End and other keys)", () => {
  it("Home and End jump to the ends in either direction", () => {
    for (const dir of ["rtl", "ltr"] as const) {
      assert.equal(nextTabIndex("Home", 2, 4, dir), 0);
      assert.equal(nextTabIndex("End", 1, 4, dir), 3);
    }
  });

  it("returns null for keys that are not tab navigation", () => {
    for (const key of ["Enter", " ", "Tab", "Escape", "ArrowUp", "ArrowDown", "a"]) {
      assert.equal(nextTabIndex(key, 1, 4, "rtl"), null, key);
    }
  });

  it("a single tab stays where it is", () => {
    assert.equal(nextTabIndex("ArrowLeft", 0, 1, "rtl"), 0);
    assert.equal(nextTabIndex("ArrowRight", 0, 1, "ltr"), 0);
    assert.equal(nextTabIndex("End", 0, 1, "rtl"), 0);
  });

  it("returns null with no tabs or a non-integer index", () => {
    assert.equal(nextTabIndex("ArrowLeft", 0, 0, "rtl"), null);
    assert.equal(nextTabIndex("Home", 0, 0, "ltr"), null);
    assert.equal(nextTabIndex("ArrowLeft", Number.NaN, 3, "rtl"), null);
  });
});
