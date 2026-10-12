import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { CONTACT_PHONE_DISPLAY } from "@/lib/constants";
import { buildFollowUpIcs, buildFollowUpTitle } from "@/lib/sales/ics";

const NOW = new Date(Date.UTC(2026, 9, 6, 9, 15, 30));

function unfold(ics: string): string[] {
  return ics.replace(/\r\n /g, "").split("\r\n").filter(Boolean);
}

function field(ics: string, name: string): string | undefined {
  return unfold(ics)
    .find((l) => l.startsWith(`${name}:`) || l.startsWith(`${name};`))
    ?.replace(/^[^:]+:/, "");
}

describe("follow-up reminder (.ics)", () => {
  it("a calendar with one event and an alarm, CRLF only", () => {
    const ics = buildFollowUpIcs({ title: "מעקב הצעה · שיר", now: NOW, hoursFromNow: 24 });
    assert.ok(ics.startsWith("BEGIN:VCALENDAR\r\n"));
    assert.ok(ics.endsWith("END:VCALENDAR\r\n"));
    assert.doesNotMatch(ics.replace(/\r\n/g, ""), /[\r\n]/);
    const lines = unfold(ics);
    for (const required of ["VERSION:2.0", "BEGIN:VEVENT", "END:VEVENT", "BEGIN:VALARM", "ACTION:DISPLAY", "END:VALARM"]) {
      assert.ok(lines.includes(required), required);
    }
    assert.ok(lines.indexOf("BEGIN:VALARM") > lines.indexOf("BEGIN:VEVENT"));
    assert.ok(lines.indexOf("END:VALARM") < lines.indexOf("END:VEVENT"));
    assert.equal(field(ics, "TRIGGER"), "PT0S");
    assert.ok(field(ics, "PRODID"));
  });

  it("starts 24 or 48 hours from now, in UTC", () => {
    const day = buildFollowUpIcs({ title: "x", now: NOW, hoursFromNow: 24 });
    const twoDays = buildFollowUpIcs({ title: "x", now: NOW, hoursFromNow: 48 });
    assert.equal(field(day, "DTSTAMP"), "20261006T091530Z");
    assert.equal(field(day, "DTSTART"), "20261007T091530Z");
    assert.equal(field(twoDays, "DTSTART"), "20261008T091530Z");
    assert.ok((field(day, "DTEND") ?? "") > (field(day, "DTSTART") ?? ""));
  });

  it("a different UID for a different time or delay", () => {
    const a = field(buildFollowUpIcs({ title: "x", now: NOW, hoursFromNow: 24 }), "UID");
    const b = field(buildFollowUpIcs({ title: "x", now: NOW, hoursFromNow: 48 }), "UID");
    const c = field(buildFollowUpIcs({ title: "x", now: new Date(NOW.getTime() + 1000), hoursFromNow: 24 }), "UID");
    assert.ok(a && b && c);
    assert.equal(new Set([a, b, c]).size, 3);
    assert.match(a, /@yakircohen\.com$/);
  });

  it("escapes the summary (RFC 5545 TEXT), on one line", () => {
    const ics = buildFollowUpIcs({ title: "מעקב, שיר; קליפ\\ניסיון\nשורה", now: NOW, hoursFromNow: 24 });
    assert.equal(field(ics, "SUMMARY"), "מעקב\\, שיר\\; קליפ\\\\ניסיון שורה");
    assert.equal(field(ics, "DESCRIPTION"), field(ics, "SUMMARY"));
  });

  it("folds long Hebrew lines at 75 bytes, and unfolding restores them", () => {
    const title = "מעקב הצעה · הקלטת שיר באולפן עם קליפ ערוך מהסשן ותיקון זיופים לארבעה משתתפים";
    const ics = buildFollowUpIcs({ title, now: NOW, hoursFromNow: 48 });
    for (const physical of ics.split("\r\n")) {
      assert.ok(new TextEncoder().encode(physical).length <= 75, physical);
    }
    assert.equal(field(ics, "SUMMARY"), title);
  });

  it("no personal data: a phone number or email pasted into the title is removed", () => {
    const ics = buildFollowUpIcs({
      title: `מעקב הצעה · שיר · 590 · ${CONTACT_PHONE_DISPLAY} · +972 50 123 4567 · dana@example.com`,
      now: NOW,
      hoursFromNow: 24,
    });
    const summary = field(ics, "SUMMARY") ?? "";
    assert.ok(!summary.includes(CONTACT_PHONE_DISPLAY));
    assert.ok(!summary.includes("123 4567"));
    assert.ok(!summary.includes("@"));
    assert.ok(summary.includes("590"));
  });

  /* החלטת הבעלים 12.10.2026: קוד הפנייה בסוף כותרת התזכורת */
  it("the lead code goes at the end of the title, and survives the cleaning", () => {
    const title = buildFollowUpTitle({ service: "שיר", price: "2,063", code: "YC-A7K2" });
    assert.equal(title, "מעקב הצעה · שיר · 2,063 · YC-A7K2");
    const summary = field(buildFollowUpIcs({ title, now: NOW, hoursFromNow: 24 }), "SUMMARY") ?? "";
    assert.ok(summary.endsWith("YC-A7K2"), summary);
    assert.ok(summary.includes("2\\,063"));
  });

  it("no code, or an invalid one: the title stays service and price", () => {
    assert.equal(buildFollowUpTitle({ service: "שיר", price: "590" }), "מעקב הצעה · שיר · 590");
    assert.equal(buildFollowUpTitle({ service: "שיר", price: "590", code: null }), "מעקב הצעה · שיר · 590");
    assert.equal(buildFollowUpTitle({ service: "שיר", price: "590", code: "0501234567" }), "מעקב הצעה · שיר · 590");
    assert.equal(buildFollowUpTitle({ service: "שיר", price: "590", code: " yc-a7k2 " }), "מעקב הצעה · שיר · 590 · YC-A7K2");
  });
});
