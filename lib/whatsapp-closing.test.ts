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

  /* D94, 11.10.2026: כתובת, שעות והבטחת מסירה לא נשלחים מהטלפון של הלקוח */
  it("the closing message never carries the trust footer, even when asked", () => {
    const text = buildClosingMessage({
      serviceLabel: "הקלטה באולפן",
      contact: { name: "נועה", phone: "054-123-4567" },
      bookCategory: "studio",
      ycPackage: "song",
      includeTrustFooter: true,
    });
    assert.doesNotMatch(text, /עמק איילון/);
    assert.doesNotMatch(text, /השיר אצלכם בסוף הסשן/);
    assert.doesNotMatch(text, /🕐/);
  });
});

describe("progressive narrative in the customer's voice (D94)", () => {
  const base = {
    serviceLabel: "הקלטה באולפן",
    contact: { name: "נועה", phone: "054-123-4567" },
    summaryLines: [{ label: "מסלול", value: "שיר" }],
    progressiveNarrative: true,
  } as const;

  it("a song opens with the song form sentence and lists 'מה בחרתי'", () => {
    const text = buildClosingMessage({ ...base, bookCategory: "studio", ycPackage: "song" });
    assert.ok(text.startsWith("שלום, אשמח להקליט שיר באולפן."), text);
    assert.match(text, /\*מה בחרתי:\*/);
    assert.doesNotMatch(text, /תודה שפניתם|מה הבנו/);
  });

  it("a podcast opens with the podcast sentence", () => {
    const text = buildClosingMessage({ ...base, bookCategory: "podcast" });
    assert.ok(text.startsWith("שלום, אשמח להקליט פודקאסט."), text);
  });

  it("any other service opens with the general quote sentence", () => {
    const text = buildClosingMessage({ ...base, bookCategory: "events" });
    assert.ok(text.startsWith("שלום, אשמח להצעת מחיר."), text);
  });
});
