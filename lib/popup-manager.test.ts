import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  POPUP_DISMISS_MS,
  POPUP_MIN_DWELL_MS,
  POPUP_MIN_SCROLL_RATIO,
  isGateOpen,
  pickCandidate,
  popupKey,
  readDismissedUntil,
  writeDismissed,
  type GateInput,
  type PopupCandidate,
} from "@/lib/popup-manager";

function makeStorage(initial: Record<string, string> = {}) {
  const map = new Map(Object.entries(initial));
  return {
    getItem: (key: string) => map.get(key) ?? null,
    setItem: (key: string, value: string) => {
      map.set(key, value);
    },
  };
}

const OPEN: GateInput = {
  dwellMs: POPUP_MIN_DWELL_MS,
  scrollRatio: 0,
  shownThisVisit: false,
  mobileFormBusy: false,
};

function candidate(
  id: PopupCandidate["id"],
  priority: number,
  order: number,
): PopupCandidate {
  return { key: id, id, priority, order, mode: "eligible" };
}

describe("isGateOpen", () => {
  it("נעול לפני 25 שניות וקודם ל-40 אחוז גלילה", () => {
    assert.equal(isGateOpen({ ...OPEN, dwellMs: POPUP_MIN_DWELL_MS - 1 }), false);
  });

  it("נפתח ב-25 שניות בדיוק, גם בלי גלילה", () => {
    assert.equal(isGateOpen({ ...OPEN, dwellMs: POPUP_MIN_DWELL_MS }), true);
  });

  it("נפתח ב-40 אחוז גלילה, גם בלי 25 שניות", () => {
    assert.equal(
      isGateOpen({ ...OPEN, dwellMs: 1_000, scrollRatio: POPUP_MIN_SCROLL_RATIO }),
      true,
    );
    assert.equal(
      isGateOpen({ ...OPEN, dwellMs: 1_000, scrollRatio: POPUP_MIN_SCROLL_RATIO - 0.01 }),
      false,
    );
  });

  it("אחד לביקור: אחרי שהוצג פופאפ השער נשאר סגור", () => {
    assert.equal(isGateOpen({ ...OPEN, shownThisVisit: true }), false);
  });

  it("מובייל בזמן מילוי טופס: סגור גם כשהזמן והגלילה מספיקים", () => {
    assert.equal(
      isGateOpen({ ...OPEN, scrollRatio: 0.9, mobileFormBusy: true }),
      false,
    );
  });
});

describe("pickCandidate", () => {
  it("בוחר את העדיפות הגבוהה ביותר", () => {
    const picked = pickCandidate(
      [candidate("pwa", 10, 0), candidate("gift", 20, 1)],
      () => false,
    );
    assert.equal(picked?.id, "gift");
  });

  it("בשוויון בוחר את מי שנרשם ראשון", () => {
    const picked = pickCandidate(
      [candidate("gift", 20, 5), candidate("rescuer", 20, 2)],
      () => false,
    );
    assert.equal(picked?.id, "rescuer");
  });

  it("מדלג על פופאפ שנסגר ובוחר את הבא", () => {
    const picked = pickCandidate(
      [candidate("gift", 20, 0), candidate("pwa", 10, 1)],
      (c) => c.id === "gift",
    );
    assert.equal(picked?.id, "pwa");
  });

  it("בלי מועמדים או כשכולם סגורים מחזיר null", () => {
    assert.equal(pickCandidate([], () => false), null);
    assert.equal(pickCandidate([candidate("pwa", 10, 0)], () => true), null);
  });
});

describe("סגירה ל-30 יום", () => {
  it("שומרת עד now + 30 יום", () => {
    const storage = makeStorage();
    writeDismissed("gift", undefined, 1_000, storage);
    assert.equal(readDismissedUntil("gift", undefined, storage), 1_000 + POPUP_DISMISS_MS);
    assert.equal(POPUP_DISMISS_MS, 30 * 86_400_000);
  });

  it("ללא סגירה מחזירה 0", () => {
    assert.equal(readDismissedUntil("pwa", undefined, makeStorage()), 0);
  });

  it("scope נפרד: סגירת טיוטה אחת לא סוגרת טיוטה אחרת", () => {
    const storage = makeStorage();
    writeDismissed("rescuer", "studio:2026-10-01", 1_000, storage);
    assert.ok(readDismissedUntil("rescuer", "studio:2026-10-01", storage) > 0);
    assert.equal(readDismissedUntil("rescuer", "studio:2026-10-07", storage), 0);
    assert.equal(readDismissedUntil("rescuer", undefined, storage), 0);
  });

  it("מכבדת את המפתחות הישנים של ההתקנה והמתנות", () => {
    const storage = makeStorage({
      "pwa-install-dismissed-until": "5000",
      yc_gift_finder_snooze: "7000",
    });
    assert.equal(readDismissedUntil("pwa", undefined, storage), 5000);
    assert.equal(readDismissedUntil("gift", undefined, storage), 7000);
  });

  it("לוקחת את המאוחר מבין המפתח החדש לישן", () => {
    const storage = makeStorage({ yc_gift_finder_snooze: "9999999999999" });
    writeDismissed("gift", undefined, 1_000, storage);
    assert.equal(readDismissedUntil("gift", undefined, storage), 9999999999999);
  });

  it("ערך פגום במפתח נקרא כ-0 ולא זורק", () => {
    const storage = makeStorage({ "yc_popup_dismissed:pwa": "not-a-number" });
    assert.equal(readDismissedUntil("pwa", undefined, storage), 0);
  });
});

describe("popupKey", () => {
  it("מחבר id ו-scope", () => {
    assert.equal(popupKey("gift"), "gift");
    assert.equal(popupKey("rescuer", "studio:x"), "rescuer:studio:x");
  });
});
