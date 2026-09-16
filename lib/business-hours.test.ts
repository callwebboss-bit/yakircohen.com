import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { BUSINESS_HOURS, getBusinessOpenStatus, getNextOpening } from "@/lib/business-hours";

/* ימי השבוע ב-2026: 13.9 ראשון, 18.9 שישי, 19.9 שבת. */
const at = (day: number, time: string) => new Date(`2026-09-${13 + day}T${time}:00`);

describe("business-hours נגזר מ-BUSINESS_HOURS", () => {
  it("הלוח שמוצג בפוטר הוא זה שנבדק", () => {
    assert.deepEqual(
      BUSINESS_HOURS.map((r) => r.days),
      ["ראשון - חמישי", "שישי", "מוצאי שבת"],
    );
  });

  it("ראשון עד חמישי: פתוח עד 22:00, לא עד 20:00", () => {
    assert.equal(getBusinessOpenStatus(at(0, "09:00")).isOpen, true);
    assert.equal(getBusinessOpenStatus(at(0, "21:30")).isOpen, true);
    assert.equal(getBusinessOpenStatus(at(4, "21:59")).isOpen, true);
    assert.deepEqual(getBusinessOpenStatus(at(0, "22:00")), {
      isOpen: false,
      label: "סגור להיום. חוזרים מחר ב-09:00",
    });
    assert.deepEqual(getBusinessOpenStatus(at(1, "08:30")), {
      isOpen: false,
      label: "סגור. נפתח היום ב-09:00",
    });
  });

  it("שישי: פתוח עד 14:00, אחר כך חוזרים במוצאי שבת", () => {
    assert.equal(getBusinessOpenStatus(at(5, "13:59")).isOpen, true);
    assert.deepEqual(getBusinessOpenStatus(at(5, "15:00")), {
      isOpen: false,
      label: "סגור לשבת. חוזרים במוצאי שבת ב-21:00",
    });
  });

  it("שבת: סגור ביום, פתוח 21:00-22:30, ואחר כך מחר ב-09:00", () => {
    assert.deepEqual(getBusinessOpenStatus(at(6, "12:00")), {
      isOpen: false,
      label: "סגור בשבת. חוזרים במוצאי שבת ב-21:00",
    });
    assert.equal(getBusinessOpenStatus(at(6, "21:30")).isOpen, true);
    assert.deepEqual(getBusinessOpenStatus(at(6, "22:45")), {
      isOpen: false,
      label: "סגור להיום. חוזרים מחר ב-09:00",
    });
  });

  it("getNextOpening מצביע על מוצאי שבת בשישי אחר הצהריים", () => {
    assert.deepEqual(getNextOpening(at(5, "16:00")), { day: 6, daysAhead: 1, open: 21 });
    assert.deepEqual(getNextOpening(at(6, "23:00")), { day: 0, daysAhead: 1, open: 9 });
  });
});
