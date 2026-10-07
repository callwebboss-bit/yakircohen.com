import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  ADMIN_HOME_PATH,
  ADMIN_LOGIN_PATH,
  adminLoginUrl,
  resolveAdminNextPath,
  safeAdminNextPath,
} from "@/lib/admin-next-path";

describe("next אחרי כניסה: רק נתיב בניהול באותו אתר", () => {
  it("נתיבים בניהול עוברים כמו שהם, כולל פרמטרים", () => {
    for (const ok of ["/admin/sales", "/admin/leads", "/admin/sales?card=song", "/admin/sales#voucher"]) {
      assert.equal(safeAdminNextPath(ok), ok);
    }
  });

  it("כתובת חיצונית, פרוטוקול-יחסי או סכמה נפסלים", () => {
    for (const bad of [
      "https://evil.example/admin/sales",
      "//evil.example/admin/sales",
      "/\\evil.example",
      "javascript:alert(1)",
      "http:/admin/sales",
      "admin/sales",
    ]) {
      assert.equal(safeAdminNextPath(bad), null, bad);
    }
  });

  it("כל \"//\" או \"\\\" בתוך הנתיב נפסל", () => {
    for (const bad of ["/admin//evil.example", "/admin/sales//x", "/admin/\\evil.example", "/admin/sales\\x"]) {
      assert.equal(safeAdminNextPath(bad), null, bad);
    }
  });

  it("נתיב מחוץ לניהול נפסל, גם כשהוא באותו אתר", () => {
    for (const bad of ["/", "/admin", "/administrator", "/pricing", "/api/admin/leads/export"]) {
      assert.equal(safeAdminNextPath(bad), null, bad);
    }
  });

  it("יציאה מ-/admin/ בעזרת נקודות נתפסת אחרי פענוח", () => {
    for (const bad of ["/admin/../pricing", "/admin/%2e%2e/pricing", "/admin/./../api/x"]) {
      assert.equal(safeAdminNextPath(bad), null, bad);
    }
  });

  it("טאב, שורה חדשה ורווחים נפסלים (דפדפן מוחק אותם ויוצר \"//\")", () => {
    for (const bad of ["/admin/\t/evil.example", "/admin/\n/evil.example", "/admin/sales x", "/admin/\u0000x"]) {
      assert.equal(safeAdminNextPath(bad), null, JSON.stringify(bad));
    }
  });

  it("עמוד הכניסה עצמו נפסל, אחרת חוזרים ללולאה", () => {
    assert.equal(safeAdminNextPath(ADMIN_LOGIN_PATH), null);
    assert.equal(safeAdminNextPath(`${ADMIN_LOGIN_PATH}?next=/admin/sales`), null);
    assert.equal(safeAdminNextPath(`${ADMIN_LOGIN_PATH}/x`), null);
  });

  it("ערך שאינו מחרוזת, ריק או ארוך מדי נפסל", () => {
    for (const bad of [null, undefined, "", 42, ["/admin/sales"], { path: "/admin/sales" }]) {
      assert.equal(safeAdminNextPath(bad), null);
    }
    assert.equal(safeAdminNextPath(`/admin/${"a".repeat(600)}`), null);
  });

  it("בלי next בטוח חוזרים לדף הבית של הניהול", () => {
    assert.equal(resolveAdminNextPath("/admin/sales"), "/admin/sales");
    assert.equal(resolveAdminNextPath("//evil.example"), ADMIN_HOME_PATH);
    assert.equal(resolveAdminNextPath(null), ADMIN_HOME_PATH);
  });
});

describe("adminLoginUrl", () => {
  it("בלי next ובלי שגיאה: עמוד הכניסה נקי", () => {
    assert.equal(adminLoginUrl(), ADMIN_LOGIN_PATH);
  });

  it("next בטוח נשמר בכתובת ונקרא חזרה זהה", () => {
    const url = adminLoginUrl("/admin/sales?card=song");
    assert.ok(url.startsWith(`${ADMIN_LOGIN_PATH}?`));
    const params = new URL(url, "https://example.test").searchParams;
    assert.equal(params.get("next"), "/admin/sales?card=song");
    assert.equal(params.get("error"), null);
  });

  it("next לא בטוח לא נכנס לכתובת", () => {
    assert.equal(adminLoginUrl("//evil.example"), ADMIN_LOGIN_PATH);
  });

  it("שגיאה ו-next יחד, כדי שניסיון שני עדיין יחזור לעמוד שביקשו", () => {
    const params = new URL(adminLoginUrl("/admin/sales", "1"), "https://example.test").searchParams;
    assert.equal(params.get("error"), "1");
    assert.equal(params.get("next"), "/admin/sales");
    const rate = new URL(adminLoginUrl(undefined, "rate"), "https://example.test").searchParams;
    assert.equal(rate.get("error"), "rate");
    assert.equal(rate.get("next"), null);
  });
});
