import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { batMitzvahSongListHtml } from "./bat-mitzvah-songs";
import { CHUPPAH_EXCLUDED_TITLES, CHUPPAH_SONG_LISTS } from "./chuppah-songs";

const all = CHUPPAH_SONG_LISTS.flatMap((list) => list.songs);

describe("chuppah entrance songs", () => {
  it("every song has a public source for its title and artist", () => {
    for (const song of all) assert.match(song.source, /^https:\/\//, song.title);
  });

  it("no song appears twice across the lists", () => {
    const keys = all.map((s) => `${s.title}|${s.artist}`);
    assert.equal(new Set(keys).size, keys.length);
  });

  it("an overplayed song is never also recommended", () => {
    const overplayed = CHUPPAH_SONG_LISTS[CHUPPAH_SONG_LISTS.length - 1];
    assert.equal(overplayed.id, "overplayed");
    const tired = new Set(overplayed.songs.map((s) => s.title));
    for (const list of CHUPPAH_SONG_LISTS.slice(0, -1)) {
      for (const song of list.songs) assert.ok(!tired.has(song.title), song.title);
    }
  });

  it("songs the owner removed stay out", () => {
    const titles = new Set(all.map((s) => s.title));
    for (const title of CHUPPAH_EXCLUDED_TITLES) assert.ok(!titles.has(title), title);
  });

  it("renders every list", () => {
    for (const list of CHUPPAH_SONG_LISTS) {
      assert.match(batMitzvahSongListHtml(list), /^<ul>[\s\S]*<\/ul>$/, list.id);
    }
  });
});
