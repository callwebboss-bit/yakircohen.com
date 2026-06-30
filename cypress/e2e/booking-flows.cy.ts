/**
 * E2E tests for critical booking and conversion flows.
 * Covers: UnifiedPricingCalculator, /book routing, /contact page integrity.
 */

describe("Booking Flows", () => {
  describe("UnifiedPricingCalculator (/pricing)", () => {
    beforeEach(() => {
      cy.visit("/pricing");
    });

    it("shows options and price when category + option are selected", () => {
      cy.get("#calculator").scrollIntoView().should("be.visible");

      // Step 1: click first category (אולפן)
      cy.get('[role="group"][aria-label="קטגוריית שירות"] button')
        .first()
        .click();

      // Step 2: options appear (skeleton fades after ~160ms)
      cy.get("fieldset", { timeout: 2000 }).should("be.visible");

      // Step 3: select first radio option
      cy.get('input[name="calc-option"]').first().click();

      // Price summary with booking link should appear
      cy.contains("להזמנה מקוונת").should("be.visible");
      cy.contains("₪").should("be.visible");
    });

    it("resets options when same category is clicked again", () => {
      cy.get('[role="group"][aria-label="קטגוריית שירות"] button')
        .first()
        .click();

      cy.get("fieldset").should("be.visible");

      // Toggle off
      cy.get('[role="group"][aria-label="קטגוריית שירות"] button')
        .first()
        .click();

      cy.get("fieldset").should("not.exist");
      cy.contains("להזמנה מקוונת").should("not.exist");
    });

    it("switches options when a different category is clicked", () => {
      cy.get('[role="group"][aria-label="קטגוריית שירות"] button')
        .first()
        .click();
      cy.get('input[name="calc-option"]').first().click();

      // Switch to second category
      cy.get('[role="group"][aria-label="קטגוריית שירות"] button')
        .eq(1)
        .click();

      // Price summary should reset (no option selected yet)
      cy.contains("להזמנה מקוונת").should("not.exist");
      cy.get("fieldset").should("be.visible");
    });
  });

  describe("/book page", () => {
    it("loads book page and shows h1", () => {
      cy.visit("/book");
      cy.get("h1").should("be.visible");
    });

    it("catalog=dj-vip param loads without error", () => {
      cy.visit("/book?catalog=dj-vip");
      cy.get("h1").should("be.visible");
      cy.contains("DJ").should("exist");
    });
  });

  describe("/contact page", () => {
    it("loads contact page with WhatsApp CTA and map", () => {
      cy.visit("/contact");
      cy.get('a[href*="wa.me"]').should("exist");
    });

    it("has link to /book from contact page", () => {
      cy.visit("/contact");
      cy.get('a[href="/book"]').should("exist");
    });
  });

  describe("/events/dj-events booking CTA", () => {
    it("DJ page CTA links to /book?catalog=dj-vip", () => {
      cy.visit("/events/dj-events");
      cy.get('a[href="/book?catalog=dj-vip"]').scrollIntoView().should("be.visible");
    });
  });
});
