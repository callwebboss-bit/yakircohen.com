import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { buildClosingMessage, buildDeliveryLine, buildTrustFooter } from "@/lib/whatsapp-closing";

describe("buildDeliveryLine (service-dependent, owner decisions 2026-10-02/03)", () => {
  it("podcast: the episode is in hand the same second the recording ends", () => {
    assert.equal(buildDeliveryLine("podcast"), "⚡ הפרק אצלכם באותה שנייה שמסיימים להקליט");
  });

  it("a song package in the studio wizard: the song is in hand at the end of the session", () => {
    assert.equal(buildDeliveryLine("studio", "song"), "⚡ השיר אצלכם בסוף הסשן");
  });

  it("blessing, remote recording and file-based services keep 24-48 hours", () => {
    for (const [cat, pkg] of [
      ["studio", "remote"],
      ["studio", null],
      ["online", null],
      ["clips", null],
    ] as const) {
      assert.equal(buildDeliveryLine(cat, pkg), "⚡ מסירה: 24-48 שעות לפי חבילה", `${cat}/${pkg}`);
    }
  });

  it("on-site services and the academy have no delivery line", () => {
    for (const cat of ["events", "dj", "photography", "singer", "academy"] as const) {
      assert.equal(buildDeliveryLine(cat), null, cat);
    }
  });
});

describe("buildTrustFooter", () => {
  it("never promises 24-48 hours for a podcast", () => {
    const footer = buildTrustFooter("podcast");
    assert.doesNotMatch(footer, /24-48/);
    assert.match(footer, /באותה שנייה/);
    assert.match(footer, /מודיעין/);
  });

  it("the closing message passes the package through to the footer", () => {
    const text = buildClosingMessage({
      serviceLabel: "הקלטה באולפן",
      contact: { name: "נועה", phone: "054-123-4567" },
      bookCategory: "studio",
      ycPackage: "song",
      includeTrustFooter: true,
    });
    assert.match(text, /השיר אצלכם בסוף הסשן/);
    assert.doesNotMatch(text, /24-48/);
  });
});
