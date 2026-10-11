import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  hasMobileActionBar,
  isQuietRoute,
  matchesRoutePrefix,
} from "@/lib/action-bar-routes";

describe("action-bar-routes", () => {
  it("הפס מוצג בעמודי שירות רגילים", () => {
    assert.equal(hasMobileActionBar("/"), true);
    assert.equal(hasMobileActionBar("/studio"), true);
    assert.equal(hasMobileActionBar("/events/dj-events"), true);
  });

  it("הפס לא מוצג בעמודים עם סרגל משלהם או כלי פנימי", () => {
    for (const p of ["/contact", "/book", "/book/podcast", "/pricing", "/admin/sales"]) {
      assert.equal(hasMobileActionBar(p), false, p);
    }
  });

  it("עמוד רגיש: בלי פס ובלי אלמנטים מכירתיים", () => {
    assert.equal(isQuietRoute("/studio/legacy-recording"), true);
    assert.equal(isQuietRoute("/studio/legacy-recording/"), true, "/ סופי");
    assert.equal(isQuietRoute("/studio/legacy-recording/questions"), true, "תת-נתיב");
    assert.equal(hasMobileActionBar("/studio/legacy-recording"), false);
  });

  it("עמוד רגיש לא תופס עמודים דומים", () => {
    assert.equal(isQuietRoute("/studio"), false);
    assert.equal(isQuietRoute("/studio/legacy-recordings"), false);
    assert.equal(matchesRoutePrefix("/booking", ["/book"]), false);
  });
});
