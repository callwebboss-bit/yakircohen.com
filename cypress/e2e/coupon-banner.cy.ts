/**
 * הערה: בדיקות "Coupon seasonal banner" הוסרו - CouponPopup כבר לא מורכב ב-layout
 * (הוחלף ב-GiftFinderPopup), ולכן data-testid="coupon-seasonal-banner" לא מרונדר יותר.
 * קוד הקופון עצמו עדיין פעיל באשף ההזמנה, וזה מה שנבדק כאן.
 *
 * הבדיקה לא נועלת קוד קופון מסוים. הגרסה הקודמת קיבעה את YAKIRSUMMER, שפג
 * ב-31.8.2026, ולכן היא הייתה נכשלת ב-CI מסיבת תאריך ולא בגלל באג. כאן בודקים
 * את ההתנהגות שלא מתיישנת: קופון שפג אינו מוחל, והאשף ממשיך לעבוד.
 */
const EXPIRED_COUPON = "YAKIRSUMMER";

describe("Coupon on /book wizard", () => {
  it("renders the wizard with a coupon param present", () => {
    cy.visit(`/book?catalog=podcast_pilot&coupon=${EXPIRED_COUPON}#podcast`, {
      onBeforeLoad(win) {
        win.sessionStorage.removeItem("yc_coupon_invalid_attempts");
      },
    });
    cy.get("#book-wizard-panel", { timeout: 15000 }).should("be.visible");
  });

  it("does not apply an expired coupon", () => {
    cy.visit(`/book?catalog=podcast_pilot&coupon=${EXPIRED_COUPON}#podcast`, {
      onBeforeLoad(win) {
        win.sessionStorage.removeItem("yc_coupon_invalid_attempts");
      },
    });
    cy.get("#book-wizard-panel", { timeout: 15000 }).should("be.visible");
    /* הטקסט שמופיע רק כשההנחה הוחלה בפועל */
    cy.contains(`קוד ${EXPIRED_COUPON} הוחל`).should("not.exist");
  });

  it("ignores a coupon code that does not exist", () => {
    cy.visit("/book?catalog=podcast_pilot&coupon=NOTAREALCODE123#podcast", {
      onBeforeLoad(win) {
        win.sessionStorage.removeItem("yc_coupon_invalid_attempts");
      },
    });
    cy.get("#book-wizard-panel", { timeout: 15000 }).should("be.visible");
    cy.contains("הוחל").should("not.exist");
  });
});
