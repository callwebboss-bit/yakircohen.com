import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { buildYcLeadTag, parseYcLeadTag } from "@/lib/yc-lead-tag";

describe("yc-lead-tag v2", () => {
  it("builds and parses wizardDepth and deferred fields", () => {
    const tag = buildYcLeadTag({
      service: "recording",
      source: "/book",
      step: 3,
      wizardDepth: "quick",
      deferred: "song,time,atmosphere",
      recipientHint: "mom",
      scenarioHint: "unsure",
    });
    assert.match(tag, /wizardDepth=quick/);
    assert.match(tag, /deferred=song,time,atmosphere/);
    assert.match(tag, /configVersion=2/);

    const parsed = parseYcLeadTag(`שלום\n${tag}`);
    assert.ok(parsed);
    assert.equal(parsed!.wizardDepth, "quick");
    assert.equal(parsed!.deferred, "song,time,atmosphere");
    assert.equal(parsed!.recipientHint, "mom");
    assert.equal(parsed!.scenarioHint, "unsure");
    assert.equal(parsed!.configVersion, 2);
  });

  it("parses scenarioChosen flag", () => {
    const tag = buildYcLeadTag({
      service: "recording",
      source: "/book",
      scenarioChosen: true,
      wizardDepth: "standard",
    });
    const parsed = parseYcLeadTag(tag);
    assert.ok(parsed);
    assert.equal(parsed!.scenarioChosen, true);
  });

  it("encodes celebrant with URI encoding", () => {
    const tag = buildYcLeadTag({
      service: "recording",
      source: "/book",
      celebrant: "יונתן כהן",
    });
    assert.match(tag, /celebrant=/);
    const parsed = parseYcLeadTag(tag);
    assert.equal(parsed!.celebrant, "יונתן כהן");
  });
});
