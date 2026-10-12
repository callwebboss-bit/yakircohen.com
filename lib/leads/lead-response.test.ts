import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { LeadRecord } from "@/lib/leads/types";
import {
  isCallbackLead,
  leadTelUrl,
  leadWaitingLabel,
  leadWhatsAppUrl,
  minutesSince,
  summarizeWaitingLeads,
  waitingLabel,
} from "@/lib/leads/lead-response";

const NOW = Date.parse("2026-10-12T12:00:00Z");

function minutesAgo(minutes: number): string {
  return new Date(NOW - minutes * 60 * 1000).toISOString();
}

function lead(createdAt: string, extra: Partial<LeadRecord> = {}): LeadRecord {
  return {
    id: createdAt,
    createdAt,
    formId: "callback",
    serviceType: "studio",
    subject: "פנייה",
    body: "",
    score: 50,
    status: "new",
    enrichment: { ipHash: "x", device: "mobile" },
    ...extra,
  };
}

describe("leadWhatsAppUrl", () => {
  it("Israeli mobile in any common form becomes wa.me/972...", () => {
    assert.equal(leadWhatsAppUrl("054-123-4567"), "https://wa.me/972541234567");
    assert.equal(leadWhatsAppUrl("+972 54 123 4567"), "https://wa.me/972541234567");
    assert.equal(leadWhatsAppUrl("00972541234567"), "https://wa.me/972541234567");
  });

  it("no link for a missing, landline or broken number", () => {
    assert.equal(leadWhatsAppUrl(undefined), null);
    assert.equal(leadWhatsAppUrl(""), null);
    assert.equal(leadWhatsAppUrl("08-9123456"), null);
    assert.equal(leadWhatsAppUrl("12345"), null);
  });
});

describe("leadTelUrl", () => {
  it("mobile in international form, landline as typed digits", () => {
    assert.equal(leadTelUrl("054-123-4567"), "tel:+972541234567");
    assert.equal(leadTelUrl("08-9123456"), "tel:089123456");
  });

  it("no link for a missing or broken number", () => {
    assert.equal(leadTelUrl(undefined), null);
    assert.equal(leadTelUrl("12345"), null);
  });
});

describe("minutesSince / waitingLabel", () => {
  it("counts whole minutes, never negative, null for a bad date", () => {
    assert.equal(minutesSince(minutesAgo(25), NOW), 25);
    assert.equal(minutesSince(new Date(NOW + 60_000).toISOString(), NOW), 0);
    assert.equal(minutesSince("not a date", NOW), null);
  });

  it("short Hebrew labels", () => {
    assert.equal(waitingLabel(0), "עכשיו");
    assert.equal(waitingLabel(25), "לפני 25 דק׳");
    assert.equal(waitingLabel(60), "לפני שעה");
    assert.equal(waitingLabel(185), "לפני 3 שע׳");
    assert.equal(waitingLabel(24 * 60), "לפני יום");
    assert.equal(waitingLabel(2 * 24 * 60), "לפני יומיים");
    assert.equal(waitingLabel(5 * 24 * 60), "לפני 5 ימים");
  });
});

describe("summarizeWaitingLeads", () => {
  it("counts new leads inside 72 hours, and which are past the one-hour promise", () => {
    const leads = [
      lead(minutesAgo(10)),
      lead(minutesAgo(90)),
      lead(minutesAgo(30), { status: "contacted" }),
      lead(minutesAgo(20), { status: "spam" }),
      lead(minutesAgo(15), { duplicateOf: "a" }),
      lead(minutesAgo(5), { subject: "טיוטה נטושה - pricing_inquiry" }),
      lead(minutesAgo(73 * 60)),
    ];
    assert.deepEqual(summarizeWaitingLeads(leads, NOW), { count: 2, overdue: 1, oldestMinutes: 90 });
  });

  it("exactly one hour is still on time", () => {
    assert.equal(summarizeWaitingLeads([lead(minutesAgo(60))], NOW).overdue, 0);
    assert.equal(summarizeWaitingLeads([lead(minutesAgo(61))], NOW).overdue, 1);
  });

  it("nothing waiting", () => {
    assert.deepEqual(summarizeWaitingLeads([], NOW), { count: 0, overdue: 0, oldestMinutes: null });
  });
});

describe("leadWaitingLabel", () => {
  it("only for a lead that waits, flagged when past the promise", () => {
    assert.deepEqual(leadWaitingLabel(lead(minutesAgo(25)), NOW), { text: "לפני 25 דק׳", overdue: false });
    assert.deepEqual(leadWaitingLabel(lead(minutesAgo(185)), NOW), { text: "לפני 3 שע׳", overdue: true });
    assert.equal(leadWaitingLabel(lead(minutesAgo(25), { status: "won" }), NOW), null);
  });
});

describe("isCallbackLead", () => {
  it("only a lead that asked for a call", () => {
    assert.equal(isCallbackLead(lead(minutesAgo(5), { contactChannel: "callback" })), true);
    assert.equal(isCallbackLead(lead(minutesAgo(5), { contactChannel: "whatsapp" })), false);
    /* רשומה מלפני 12.10.2026, בלי השדה */
    assert.equal(isCallbackLead(lead(minutesAgo(5))), false);
  });
});
