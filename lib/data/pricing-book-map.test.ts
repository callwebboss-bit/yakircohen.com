import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  parseBookCatalogFromSearch,
  resolvePricingBookHref,
} from "@/lib/data/pricing-book-map";

describe("parseBookCatalogFromSearch", () => {
  it("maps song_recording to the studio song package with an empty song preset", () => {
    const target = parseBookCatalogFromSearch("song_recording");
    assert.ok(target);
    assert.equal(target!.category, "studio");
    assert.equal(target!.catalogId, "song_recording");
    assert.equal(target!.studioPackageId, "song");
    assert.deepEqual(target!.songOffer?.addonIds, []);
  });

  it("maps each song add-on link to the base with that add-on selected", () => {
    assert.deepEqual(parseBookCatalogFromSearch("song_pitch_coaching")?.songOffer?.addonIds, [
      "song_pitch_coaching",
    ]);
    assert.deepEqual(
      parseBookCatalogFromSearch("studio_session_clip_edited")?.songOffer?.addonIds,
      ["studio_session_clip_edited"],
    );
    /* הראיון משולב בקליפ, ולכן הקישור שלו מסמן את שניהם */
    assert.deepEqual(
      parseBookCatalogFromSearch("song_pre_session_interview")?.songOffer?.addonIds,
      ["studio_session_clip_edited", "song_pre_session_interview"],
    );
  });

  it("keeps old ?catalog= links for the removed song packages working", () => {
    const cases: Array<[string, string[], string]> = [
      ["cover_song", ["song_pitch_coaching"], "cover"],
      ["song_package", ["song_pitch_coaching"], "event_song"],
      ["studio_viral", ["song_pitch_coaching", "studio_session_clip_edited"], "event_song"],
      ["studio_all_in", ["song_pitch_coaching"], "event_song"],
    ];
    for (const [oldId, addons, recordingType] of cases) {
      const target = parseBookCatalogFromSearch(oldId);
      assert.ok(target, oldId);
      assert.equal(target!.catalogId, "song_recording", oldId);
      assert.equal(target!.studioPackageId, "song", oldId);
      assert.equal(target!.recordingTypeId, recordingType, oldId);
      assert.deepEqual(target!.songOffer?.addonIds, addons, oldId);
    }
  });

  it("does not map blessing_recording onto the remote song package", () => {
    const target = parseBookCatalogFromSearch("blessing_recording");
    assert.ok(target);
    assert.equal(target!.catalogId, "blessing_recording");
    assert.equal(target!.recordingTypeId, "general_blessing");
    assert.equal(target!.studioPackageId, undefined);
  });

  it("does not map studio_hour onto the song package", () => {
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

  it("the 4,500 production no longer points at a removed wizard package", () => {
    const target = parseBookCatalogFromSearch("full_production_clip");
    assert.ok(target);
    assert.equal(target!.studioPackageId, undefined);
  });

  it("builds a /book link for the song base", () => {
    assert.equal(resolvePricingBookHref("song_recording"), "/book?catalog=song_recording#studio");
  });

  it("returns null for unknown catalog id", () => {
    assert.equal(parseBookCatalogFromSearch("not_in_catalog"), null);
    assert.equal(parseBookCatalogFromSearch(""), null);
    assert.equal(parseBookCatalogFromSearch(null), null);
  });
});
