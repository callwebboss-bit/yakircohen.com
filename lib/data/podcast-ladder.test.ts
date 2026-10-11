import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { getPodcastLadder } from "@/lib/data/podcast-ladder";
import { PODCAST_RECORDING_PACKAGES } from "@/lib/data/podcast-recording-page";
import { getExVat } from "@/lib/data/pricing-catalog";

/* סולם החבילות ב-/podcast (D103-D104, 11.10.2026) */
describe("podcast ladder", () => {
  const ladder = getPodcastLadder();

  it("shows the same packages, in the same order, as the recording page", () => {
    assert.deepEqual(
      ladder.packages.map((p) => p.id),
      PODCAST_RECORDING_PACKAGES.map((p) => p.id),
    );
    for (const pkg of ladder.packages) {
      assert.equal(pkg.exVat, getExVat(pkg.catalogId), pkg.id);
    }
  });

  it("every row has one cell per package", () => {
    for (const row of ladder.rows) {
      assert.equal(row.cells.length, ladder.packages.length, row.id);
    }
  });

  it("a row that is the same in every package is listed once, not as a row", () => {
    for (const row of ladder.rows) {
      const first = JSON.stringify(row.cells[0]);
      assert.ok(row.cells.some((c) => JSON.stringify(c) !== first), `${row.id} is identical in all packages`);
    }
  });

  it("does not promise a raw-file backup period (D104, /whats-included)", () => {
    const text = JSON.stringify(ladder);
    assert.ok(!/גיבוי|למשך שנה/.test(text), text);
  });
});
