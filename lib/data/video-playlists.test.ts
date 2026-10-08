import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { getPlaylistVideos } from "./video-portfolio";
import { PORTFOLIO_HUB_PLAYLIST_ORDER, VIDEO_PLAYLISTS, type PlaylistId } from "./video-playlists";

/* 8.10.2026: שבעה סרטונים חדשים בתיק העבודות. שלושה של יקב פאסק (קריינות) עולים בראש
   /voiceover ו-/voiceover/services, וארבעה של עריכת וידאו יושבים בפלייליסט משלהם. */
const PASEK = ["-nU3anctSJY", "5JPLiE7IbpU", "vLxPpfoDWqc"];
const EDITING = ["8lfWwn0uJMg", "0--BIes-66Y", "APKGwP3CO50", "--_pBWzA5Hk"];

const ids = (playlist: PlaylistId) => getPlaylistVideos(playlist).map((v) => v.videoId);

describe("portfolio playlists: winery work", () => {
  it("the three Pasek voiceovers lead both voiceover playlists", () => {
    assert.deepEqual(ids("voiceover-hub").slice(0, 3), PASEK);
    assert.deepEqual(ids("voiceover-services").slice(0, 3), PASEK);
  });

  it("the existing DJ voiceover examples are still there, right after them", () => {
    assert.ok(ids("voiceover-hub").includes("7DEp-gnDTs4"));
    assert.equal(ids("voiceover-services")[3], "7DEp-gnDTs4");
  });

  it("video-editing holds exactly the four editing samples, green screen first and the Short last", () => {
    assert.deepEqual(ids("video-editing"), EDITING);
  });

  it("editing samples never leak into another playlist", () => {
    for (const id of Object.keys(VIDEO_PLAYLISTS) as PlaylistId[]) {
      if (id === "video-editing") continue;
      const leaked = ids(id).filter((v) => EDITING.includes(v));
      assert.deepEqual(leaked, [], `${id} shows an editing sample`);
    }
  });

  it("the portfolio hub shows video-editing right after the voiceover section", () => {
    const order = [...PORTFOLIO_HUB_PLAYLIST_ORDER];
    assert.equal(order.indexOf("video-editing"), order.indexOf("voiceover-hub") + 1);
  });
});
