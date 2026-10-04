import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  BAT_MITZVAH_SONG_LISTS,
  batMitzvahSongListHtml,
} from "./bat-mitzvah-songs";

const all = BAT_MITZVAH_SONG_LISTS.flatMap((list) => list.songs);

describe("bat mitzvah songs", () => {
  it("every song has a public source for its title and artist", () => {
    for (const song of all) {
      assert.match(song.source, /^https:\/\//, song.title);
    }
  });

  it("no song appears twice across the lists", () => {
    const keys = all.map((s) => `${s.title}|${s.artist}`);
    assert.equal(new Set(keys).size, keys.length);
  });

  it("an overplayed song is never also recommended", () => {
    const overplayed = BAT_MITZVAH_SONG_LISTS[BAT_MITZVAH_SONG_LISTS.length - 1];
    assert.equal(overplayed.id, "overplayed");
    const tired = new Set(overplayed.songs.map((s) => s.title));
    for (const list of BAT_MITZVAH_SONG_LISTS.slice(0, -1)) {
      for (const song of list.songs) assert.ok(!tired.has(song.title), song.title);
    }
  });

  it("renders a list, and nothing at all for an empty list", () => {
    assert.match(batMitzvahSongListHtml(BAT_MITZVAH_SONG_LISTS[0]), /^<ul>[\s\S]*<\/ul>$/);
    assert.equal(batMitzvahSongListHtml({ id: "empty", songs: [] }), "");
  });

  it("escapes HTML in titles", () => {
    const html = batMitzvahSongListHtml({
      id: "x",
      songs: [{ title: "a<b", artist: "c&d", source: "https://example.com" }],
    });
    assert.ok(html.includes("a&lt;b") && html.includes("c&amp;d"));
  });
});
