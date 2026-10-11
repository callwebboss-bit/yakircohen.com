import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { LeadRecord } from "@/lib/leads/types";
import {
  addDays,
  countWeeklyFormLeads,
  parseWeeklyCount,
  weekStartIsrael,
} from "@/lib/leads/weekly-count";

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

describe("weekStartIsrael", () => {
  it("Sunday is the first day of the week, in Israel time", () => {
    /* 11.10.2026 is a Sunday */
    assert.equal(weekStartIsrael(new Date("2026-10-11T09:00:00Z")), "2026-10-11");
    assert.equal(weekStartIsrael(new Date("2026-10-17T20:00:00Z")), "2026-10-11");
    /* Saturday 23:30 UTC is already Sunday 02:30 in Israel */
    assert.equal(weekStartIsrael(new Date("2026-10-17T23:30:00Z")), "2026-10-18");
  });

  it("addDays", () => {
    assert.equal(addDays("2026-10-11", 7), "2026-10-18");
  });
});

describe("countWeeklyFormLeads", () => {
  it("counts only new form leads inside the week", () => {
    const leads = [
      lead("2026-10-11T08:00:00Z"),
      lead("2026-10-12T08:00:00Z", { serviceType: "podcast" }),
      lead("2026-10-13T08:00:00Z", { status: "spam" }),
      lead("2026-10-13T09:00:00Z", { duplicateOf: "a" }),
      lead("2026-10-14T08:00:00Z", { subject: "טיוטה נטושה - pricing_inquiry" }),
      lead("2026-10-10T08:00:00Z"),
      lead("2026-10-18T08:00:00Z"),
    ];
    const c = countWeeklyFormLeads(leads, "2026-10-11");
    assert.equal(c.total, 2);
    assert.deepEqual(c.byService, { studio: 1, podcast: 1 });
  });
});

describe("parseWeeklyCount", () => {
  it("accepts 0-999, empty is undefined, anything else is rejected", () => {
    assert.equal(parseWeeklyCount("3"), 3);
    assert.equal(parseWeeklyCount(" 0 "), 0);
    assert.equal(parseWeeklyCount(""), undefined);
    assert.equal(parseWeeklyCount("-1"), null);
    assert.equal(parseWeeklyCount("1000"), null);
    assert.equal(parseWeeklyCount("2.5"), null);
    assert.equal(parseWeeklyCount("abc"), null);
  });
});
