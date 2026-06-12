import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  buildContinueChatReply,
  buildPlaybackReply,
  buildReplyText,
  detectPlaybackScenario,
  getRecommendedPathId,
  suggestReplyPaths,
} from "./reply-copy-builders.ts";

const reutCtx = {
  leadName: "רעות גלוטסיק",
  recorderName: "יונתן",
  song: "מה אהבתי תורתך",
  leadDate: "2026-06-17",
  leadTime: "18:00",
  scheduleWindow: "weekdays",
  recorderCount: 1,
  childrenCount: 1,
  adultsCount: 0,
  intent: "continue_chat" as const,
};

describe("reply-copy-builders", () => {
  it("detects parent_child for solo child lead", () => {
    assert.equal(detectPlaybackScenario(reutCtx), "parent_child");
  });

  it("recommends playback for child studio lead", () => {
    assert.equal(getRecommendedPathId(reutCtx), "playback_parent_child");
  });

  it("short parent playback includes song and date", () => {
    const msg = buildPlaybackReply(reutCtx, { length: "short", scenario: "parent_child" });
    assert.match(msg, /יונתן/);
    assert.match(msg, /מה אהבתי תורתך/);
    assert.match(msg, /17\.06/);
    assert.ok(msg.split("\n").length <= 6);
  });

  it("continue chat short is concise", () => {
    const msg = buildContinueChatReply(reutCtx, "short");
    assert.match(msg, /רעות/);
    assert.ok(msg.length < 400);
  });

  it("suggestReplyPaths marks recommended", () => {
    const paths = suggestReplyPaths(reutCtx);
    assert.ok(paths.some((p) => p.id === "playback_parent_child" && p.recommended));
  });

  it("buildReplyText for recommended path", () => {
    const id = getRecommendedPathId(reutCtx);
    const text = buildReplyText(id, reutCtx, { length: "short" });
    assert.ok(text.length > 20);
  });
});
