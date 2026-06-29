import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { parseBookCatalogFromSearch } from "@/lib/data/pricing-book-map";

describe("parseBookCatalogFromSearch", () => {
  it("maps cover_song to studio classic + cover preset", () => {
    const target = parseBookCatalogFromSearch("cover_song");
    assert.ok(target);
    assert.equal(target!.category, "studio");
    assert.equal(target!.studioPackageId, "classic");
    assert.equal(target!.recordingTypeId, "cover");
    assert.equal(target!.catalogId, "cover_song");
  });

  it("returns null for unknown catalog id", () => {
    assert.equal(parseBookCatalogFromSearch("not_in_catalog"), null);
    assert.equal(parseBookCatalogFromSearch(""), null);
    assert.equal(parseBookCatalogFromSearch(null), null);
  });
});
