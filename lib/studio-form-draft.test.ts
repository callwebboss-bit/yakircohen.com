import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  buildStudioDeferredFields,
  parseStudioFormDraft,
  type StudioFormDraft,
} from "@/lib/studio-form-draft";

const INITIAL: StudioFormDraft = {
  wizardDepth: "standard",
  scenarioChoice: "",
  projectMode: "",
  companyName: "",
  needsInvoice: false,
  splitCostEnabled: false,
  splitCostCount: 4,
  recordingType: "",
  songName: "",
  celebrantName: "",
  referrer: "",
  atmosphere: "",
  packageId: "",
  location: "modiin",
  mobileGeo: "",
  selectedUpgrades: [],
  surpriseGift: false,
  giftRecipientName: "",
  name: "",
  phone: "",
  scheduleWindow: "",
  date: "",
  time: "",
  notes: "",
  adultsCount: 0,
  childrenCount: 0,
  customerNeed: "",
  sessionPriority: "",
  welcomePerk: "",
  travelMode: "",
  lastMinuteBtsDeal: false,
  termsAccepted: false,
};

describe("parseStudioFormDraft", () => {
  it("returns null for non-object input", () => {
    assert.equal(parseStudioFormDraft(null, INITIAL), null);
    assert.equal(parseStudioFormDraft("x", INITIAL), null);
  });

  it("parses valid recording type and atmosphere enums", () => {
    const result = parseStudioFormDraft(
      {
        recordingType: "event_song",
        atmosphere: "intimate",
        packageId: "classic",
        scheduleWindow: "weekdays",
        name: "Yakir",
        phone: "0541234567",
        termsAccepted: true,
      },
      INITIAL,
    );
    assert.ok(result);
    assert.equal(result!.recordingType, "event_song");
    assert.equal(result!.atmosphere, "intimate");
    assert.equal(result!.packageId, "classic");
    assert.equal(result!.scheduleWindow, "weekdays");
    assert.equal(result!.name, "Yakir");
    assert.equal(result!.termsAccepted, true);
  });

  it("rejects invalid enum values and keeps initial", () => {
    const result = parseStudioFormDraft(
      { recordingType: "not_a_type", atmosphere: "energetic", scheduleWindow: "flexible" },
      INITIAL,
    );
    assert.ok(result);
    assert.equal(result!.recordingType, "");
    assert.equal(result!.atmosphere, "");
    assert.equal(result!.scheduleWindow, "");
  });

  it("parses celebrantName", () => {
    const result = parseStudioFormDraft(
      { recordingType: "bar_mitzvah_speech", celebrantName: "יונתן" },
      INITIAL,
    );
    assert.ok(result);
    assert.equal(result!.celebrantName, "יונתן");
  });

  it("filters selectedUpgrades to string array only", () => {
    const result = parseStudioFormDraft(
      { selectedUpgrades: ["bts", 1, "express"] },
      INITIAL,
    );
    assert.ok(result);
    assert.deepEqual(result!.selectedUpgrades, []);
  });

  it("parses wizardDepth and scenarioChoice", () => {
    const result = parseStudioFormDraft(
      { wizardDepth: "quick", scenarioChoice: "unsure" },
      INITIAL,
    );
    assert.ok(result);
    assert.equal(result!.wizardDepth, "quick");
    assert.equal(result!.scenarioChoice, "unsure");
  });

  it("buildStudioDeferredFields lists missing quick-path fields", () => {
    const deferred = buildStudioDeferredFields(
      { songName: "", time: "", atmosphere: "", celebrantName: "" },
      "quick",
      true,
    );
    assert.equal(deferred, "song,time,atmosphere,celebrant");
  });
});
