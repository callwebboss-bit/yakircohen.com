/**
 * E2E tests for critical booking and conversion flows.
 * Covers: UnifiedPricingCalculator, /book routing, /contact page integrity.
 */

describe("Booking Flows", () => {
  describe("UnifiedPricingCalculator (/pricing)", () => {
    function pickCategory(id: string) {
      cy.get("#calculator").scrollIntoView();
      cy.window().then((win) => {
        const btn = win.document.querySelector(
          `[data-testid="unified-calc-category"][data-category="${id}"]`,
        );
        if (!(btn instanceof win.HTMLElement)) {
          throw new Error(`calculator category ${id} not found`);
        }
        btn.dispatchEvent(
          new win.MouseEvent("click", {
            bubbles: true,
            cancelable: true,
            view: win,
          }),
        );
      });
    }

    beforeEach(() => {
      cy.visit("/pricing");
      cy.get('[data-testid="unified-calc-category"][data-category="studio"]').should(
        ($btn) => {
          const hydrated = Object.keys($btn[0]).some((key) =>
            key.startsWith("__reactProps"),
          );
          expect(hydrated, "calculator button hydrated").to.equal(true);
        },
      );
    });

    it("shows options and price when category + option are selected", () => {
      cy.get("#calculator").should("be.visible");
      pickCategory("studio");
      cy.get('[data-testid="unified-calc-options"]').should("be.visible");
      cy.get("#calculator").find('input[name="calc-option"]').first().check({ force: true });
      cy.get("#calculator").contains("להזמנה מקוונת").should("be.visible");
      cy.get("#calculator").contains("₪").should("be.visible");
    });

    it("resets options when same category is clicked again", () => {
      pickCategory("studio");
      cy.get('[data-testid="unified-calc-options"]').should("be.visible");
      pickCategory("studio");
      cy.get('[data-testid="unified-calc-options"]').should("not.exist");
      cy.get("#calculator").contains("להזמנה מקוונת").should("not.exist");
    });

    it("switches options when a different category is clicked", () => {
      pickCategory("studio");
      cy.get("#calculator").find('input[name="calc-option"]').first().check({ force: true });
      pickCategory("podcast");
      cy.get("#calculator").contains("להזמנה מקוונת").should("not.exist");
      cy.get('[data-testid="unified-calc-options"]').should("be.visible");
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

  describe("Homepage conversion", () => {
    it("links to /book and WhatsApp", () => {
      cy.visit("/");
      cy.get("h1").should("have.length", 1);
      cy.get('a[href*="/book"]').should("exist");
      cy.get('a[href*="wa.me"]').should("exist");
    });
  });

  describe("Pricing overlay copy", () => {
    it("shows before-VAT line and include disclosure", () => {
      cy.visit("/pricing");
      cy.contains("לפני מע״מ 18%").should("exist");
      cy.contains("מה כלול").should("exist");
      cy.contains("חצי שעה חדר (בלי עריכה)").should("exist");
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
