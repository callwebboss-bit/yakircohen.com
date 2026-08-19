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

  it("maps studio_viral and studio_all_in to matching wizard packages", () => {
    const viral = parseBookCatalogFromSearch("studio_viral");
    const allIn = parseBookCatalogFromSearch("studio_all_in");
    assert.equal(viral?.studioPackageId, "viral");
    assert.equal(allIn?.studioPackageId, "all_in");
  });

  it("does not map blessing_recording onto the remote song package", () => {
    const target = parseBookCatalogFromSearch("blessing_recording");
    assert.ok(target);
    assert.equal(target!.catalogId, "blessing_recording");
    assert.equal(target!.recordingTypeId, "general_blessing");
    assert.equal(target!.studioPackageId, undefined);
  });

  it("does not map studio_hour onto classic song package", () => {
    const target = parseBookCatalogFromSearch("studio_hour");
    assert.ok(target);
    assert.equal(target!.catalogId, "studio_hour");
    assert.equal(target!.recordingTypeId, "voiceover");
    assert.equal(target!.studioPackageId, undefined);
  });

  it("maps studio_remote to the remote package without assuming a blessing type", () => {
    const target = parseBookCatalogFromSearch("studio_remote");
    assert.equal(target?.studioPackageId, "remote");
    assert.equal(target?.recordingTypeId, undefined);
  });

  it("returns null for unknown catalog id", () => {
    assert.equal(parseBookCatalogFromSearch("not_in_catalog"), null);
    assert.equal(parseBookCatalogFromSearch(""), null);
    assert.equal(parseBookCatalogFromSearch(null), null);
  });
});
