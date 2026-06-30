import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { buildBookingWhatsAppBody } from "@/lib/booking-messages";
import {
  STUDIO_WA_PART_SEPARATOR,
  buildStudioCloserCheatSheet,
  buildStudioGuestConfirmBlock,
} from "@/lib/studio-booking-message";
import { parseYcLeadTag } from "@/lib/yc-lead-tag";

describe("studio split WA message", () => {
  it("builds guest Part A with core fields only", () => {
    const partA = buildStudioGuestConfirmBlock({
      contact: { name: "יקיר", phone: "054-123-4567" },
      packageLabel: "Classic",
      scheduleLabel: "ימי חול (א'-ה')",
    });
    assert.match(partA, /\*שם:\* יקיר/);
    assert.match(partA, /\*טלפון:\* 054-123-4567/);
    assert.match(partA, /\*חבילה:\* Classic/);
    assert.match(partA, /\*מועד:\* ימי חול/);
    assert.doesNotMatch(partA, /חרדה/);
  });

  it("builds closer cheat sheet tags for CRO fields", () => {
    const sheet = buildStudioCloserCheatSheet({
      sessionPriority: "vocal_fix",
      welcomePerk: "coffee",
      travelMode: "car",
      splitCostEnabled: true,
      splitCostCount: 4,
      location: "modiin",
      projectMode: "personal",
    });
    assert.match(sheet, /\[חרדה: זיופים\]/);
    assert.match(sheet, /\[צ'ופר: קפה משודרג\]/);
    assert.match(sheet, /\[הגעה: רכב פרטי \+ חניה\]/);
    assert.match(sheet, /\[תקציב: מתחלקים 4 אנשים\]/);
  });

  it("splits guest and closer sections with --- in full body", () => {
    const body = buildBookingWhatsAppBody({
      intent: "continue_chat",
      serviceLabel: "הקלטה באולפן",
      packageLabel: "Classic",
      summaryLines: [{ label: "מועד מועדף", value: "ימי חול" }],
      contact: { name: "יקיר", phone: "054-123-4567" },
      priceExVat: 990,
      bookCategory: "studio",
      ycForm: "studio_recording_booking",
      scheduleDisplayLabel: "ימי חול (א'-ה')",
      studioCro: {
        sessionPriority: "vocal_fix",
        welcomePerk: "coffee",
        travelMode: "car",
        splitCostEnabled: true,
        splitCostCount: 4,
        location: "modiin",
      },
    });

    assert.match(body, /\*חבילה:\* Classic/);
    assert.match(body, new RegExp(`\\n${STUDIO_WA_PART_SEPARATOR}\\n`));
    assert.match(body, /\[חרדה: זיופים\]/);
    assert.match(body, /\[YC:/);

    const parsed = parseYcLeadTag(body);
    assert.equal(parsed?.sessionPriority, "vocal_fix");
    assert.equal(parsed?.welcomePerk, "coffee");
    assert.equal(parsed?.travelMode, "car");
    assert.equal(parsed?.splitCount, 4);
  });
});
