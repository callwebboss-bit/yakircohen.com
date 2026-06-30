function clearCouponStorage(win: Window) {
  win.localStorage.removeItem("yc_coupon_claimed");
  win.localStorage.removeItem("yc_coupon_snooze");
  win.sessionStorage.removeItem("yc_coupon_dismissed");
  win.sessionStorage.setItem("yc_coupon_e2e", "1");
}

describe("Coupon seasonal banner", () => {
  it("does not show on /pricing before engagement", () => {
    cy.visit("/pricing", {
      onBeforeLoad: clearCouponStorage,
    });
    cy.get('[data-testid="coupon-seasonal-banner"]').should("not.exist");
  });

  it("shows on /pricing after scroll and active time", () => {
    cy.visit("/pricing", {
      onBeforeLoad: clearCouponStorage,
    });
    cy.scrollTo("bottom", { duration: 400 });
    cy.wait(1000);
    cy.get('[data-testid="coupon-seasonal-banner"]', { timeout: 10000 })
      .should("be.visible")
      .and("contain.text", "₪ הנחה")
      .and("contain.text", "YAKIRSUMMER");
  });

  it("does not show on blog paths", () => {
    cy.visit("/blog", {
      onBeforeLoad: clearCouponStorage,
      failOnStatusCode: false,
    });
    cy.scrollTo(0, 800);
    cy.wait(1500);
    cy.get('[data-testid="coupon-seasonal-banner"]').should("not.exist");
  });

  it("links CTA to /book with catalog and coupon", () => {
    cy.visit("/pricing", {
      onBeforeLoad: clearCouponStorage,
    });
    cy.scrollTo("bottom", { duration: 400 });
    cy.wait(1000);
    cy.get('[data-testid="coupon-seasonal-banner"]', { timeout: 10000 })
      .find('a[rel="nofollow"]')
      .should("have.attr", "href")
      .and("match", /\/book\?.*catalog=.*coupon=YAKIRSUMMER/);
  });
});

describe("Coupon on /book wizard", () => {
  it("shows applied discount when coupon param is valid", () => {
    cy.visit("/book?catalog=podcast_pilot&coupon=YAKIRSUMMER#podcast", {
      onBeforeLoad(win) {
        win.sessionStorage.removeItem("yc_coupon_invalid_attempts");
      },
    });
    cy.get("#book-wizard-panel", { timeout: 15000 }).should("be.visible");
    cy.contains("קוד YAKIRSUMMER הוחל", { timeout: 15000 }).should("be.visible");
    cy.contains("-60").should("be.visible");
  });
});
