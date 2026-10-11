import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  DOOR_BY_INTENT_ID,
  INTENT_NAV_ITEMS,
  doorForIntent,
} from "@/lib/data/intent-nav";
import { HOME_QUICK_PATHS } from "@/lib/data/home-quick-paths";

/* תוכנית הבהירות, שלב 0 (11.10.2026): data-door הוא קו הבסיס של door_select.
   כפתור בלי דלת מפורשת היה נופל בשקט ל-"more" ומעוות את ההשוואה לפני ואחרי. */
describe("דלתות (D84) על הכפתורים הקיימים", () => {
  it("לכל פריט ברצועת הכוונה יש דלת מפורשת", () => {
    for (const item of INTENT_NAV_ITEMS) {
      assert.ok(
        item.id in DOOR_BY_INTENT_ID,
        `ל-${item.id} אין דלת ב-DOOR_BY_INTENT_ID`,
      );
    }
  });

  it("כל ארבע הדלתות מיוצגות ברצועה", () => {
    const doors = new Set(INTENT_NAV_ITEMS.map((item) => doorForIntent(item.id)));
    for (const door of ["event", "song-gift", "podcast", "business"] as const) {
      assert.ok(doors.has(door), `אין ברצועה אף פריט לדלת ${door}`);
    }
  });

  it("מזהה לא מוכר נופל ל-more ולא זורק", () => {
    assert.equal(doorForIntent("no-such-intent"), "more");
  });

  it("לכל כרטיס מסלול מהיר בדף הבית יש דלת", () => {
    for (const path of HOME_QUICK_PATHS) {
      assert.ok(path.door, `לכרטיס ${path.id} אין דלת`);
    }
  });
});
