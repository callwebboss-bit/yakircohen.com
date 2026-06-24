import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { parseEventsFormDraft, type EventsFormDraft } from "@/lib/events-form-draft";

const INITIAL: EventsFormDraft = {
  selected: [],
  quantities: {},
  name: "",
  phone: "",
  date: "",
  time: "",
  location: "",
  customerNeed: "",
  notes: "",
  selectedUpsells: [],
  termsAccepted: false,
};

describe("parseEventsFormDraft", () => {
  it("returns null for invalid envelope", () => {
    assert.equal(parseEventsFormDraft(undefined, INITIAL), null);
  });

  it("parses selected items and upsells", () => {
    const result = parseEventsFormDraft(
      {
        selected: ["dj", "photo"],
        selectedUpsells: ["extra_hour"],
        name: "Test",
        termsAccepted: true,
      },
      INITIAL,
    );
    assert.ok(result);
    assert.deepEqual(result!.selected, ["dj", "photo"]);
    assert.deepEqual(result!.selectedUpsells, ["extra_hour"]);
    assert.equal(result!.name, "Test");
    assert.equal(result!.termsAccepted, true);
  });
});
